import React, { useState, useEffect } from 'react';
import { app, db } from '../config/config';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Login from '../components/auth/Login';
import bcrypt from 'bcryptjs';

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const LoginPage: React.FC = () => {
  const [loginError, setLoginError] = useState<string>('');
  const [showRoleSelection, setShowRoleSelection] = useState<boolean>(false);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          finalizeLogin(userData);
        } else {
          setPendingUser(user);
          setShowRoleSelection(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google login failed:', error);
      toast.error('Google login failed. Please try again.', { position: 'top-right', autoClose: 5000 });
    }
  };

  const saveUserRole = async (role: string) => {
    try {
      if (!pendingUser) throw new Error('No pending user');
      
      const userRef = doc(db, 'users', pendingUser.uid);
      await setDoc(userRef, {
        uid: pendingUser.uid,
        displayName: pendingUser.displayName,
        email: pendingUser.email,
        photoURL: pendingUser.photoURL,
        role,
      });

      finalizeLogin({ role });
      setShowRoleSelection(false);
      setPendingUser(null);
    } catch (error) {
      console.error('Error saving user role:', error);
      toast.error('Failed to save role. Try again.', { position: 'top-right', autoClose: 5000 });
    }
  };

  const finalizeLogin = (userData: any) => {
    if (!pendingUser) return;

    const userState = {
      uid: pendingUser.uid,
      displayName: pendingUser.displayName,
      email: pendingUser.email,
      photoURL: pendingUser.photoURL,
      role: userData.role || 'student'
    };

    localStorage.setItem('user', JSON.stringify(userState));
    const redirectPath = userData.role === 'instructor' ? '/my-account/instructor' : '/my-account/student';
    navigate(redirectPath);
  };

  const handleCloseRoleSelection = async () => {
    setShowRoleSelection(false);
    if (pendingUser) {
      await signOut(auth);
      setPendingUser(null);
    }
  };

  const signInWithUsernameAndPassword = async (email: string, password: string): Promise<boolean> => {
    try {
      const normalizedEmail = email.toLowerCase();
  
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', normalizedEmail));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        toast.error('Account not found', { position: 'top-right', autoClose: 5000 });
        return false;
      }
  
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
  
      if (!userData.password) {
        toast.error('Account configuration error', { position: 'top-right', autoClose: 5000 });
        return false;
      }
  
  
      const isPasswordCorrect = await bcrypt.compare(password, userData.password);
      if (!isPasswordCorrect) {
        toast.error('Incorrect password', { position: 'top-right', autoClose: 5000 });
        return false;
      }
  
      localStorage.setItem('user', JSON.stringify(userData));
  
      const redirectPath = userData.role === 'instructor'
        ? '/my-account/instructor'
        : '/my-account/student';
  
      navigate(redirectPath);
      window.location.reload();
  
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.', { position: 'top-right', autoClose: 5000 });
      return false;
    }
  };
  
  return (
    <>
      {showRoleSelection && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h2>Select Your Role</h2>
            <div style={{ marginTop: '1rem' }}>
              <button 
                style={{ margin: '0.5rem', padding: '0.5rem 2rem' }}
                onClick={() => saveUserRole('student')}
              >
                Student
              </button>
              <button 
                style={{ margin: '0.5rem', padding: '0.5rem 2rem' }}
                onClick={() => saveUserRole('instructor')}
              >
                Instructor
              </button>
            </div>
            <button 
              style={{ marginTop: '1rem', padding: '0.25rem 1rem' }}
              onClick={handleCloseRoleSelection}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <Login
        signInWithGoogle={signInWithGoogle}
        signInWithUsernameAndPassword={signInWithUsernameAndPassword} 
        loginError={loginError}
      />
    </>
  );
};

export default LoginPage;