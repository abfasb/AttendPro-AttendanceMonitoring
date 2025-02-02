import React, { useState, useEffect } from 'react';
import { app, db } from '../config/config';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
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
  const [selectedRole, setSelectedRole] = useState<string>('student');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User signed in:', user);
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google user:', user);
      
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Existing user data:', userData);
        finalizeLogin(userData, user.uid);
      } else {
        setShowRoleSelection(true);
      }
    } catch (error) {
      console.error('Google login failed:', error);
      toast.error('Google login failed. Please try again.', { position: 'top-right', autoClose: 5000 });
    }
  };

  const saveUserRole = async (role: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role,
      }, { merge: true });
      
      finalizeLogin({ role }, user.uid);
    } catch (error) {
      console.error('Error saving user role:', error);
      toast.error('Failed to save role. Try again.', { position: 'top-right', autoClose: 5000 });
    }
  };

  const finalizeLogin = (userData: any, uid: string) => {
    const userState = {
      uid,
      displayName: auth.currentUser?.displayName || '',
      email: auth.currentUser?.email || '',
      photoURL: auth.currentUser?.photoURL || '',
      role: userData.role || 'student'
    };
    
    localStorage.setItem('user', JSON.stringify(userState));
    console.log('Local storage set:', userState);
    
    const redirectPath = userData.role === 'instructor' ? '/my-account/instructor' : '/my-account/student';
    navigate(redirectPath);
    window.location.reload();
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
      {showRoleSelection ? (
        <div className="role-selection-modal">
          <h2>Select Your Role</h2>
          <button onClick={() => saveUserRole('student')}>Student</button>
          <button onClick={() => saveUserRole('instructor')}>Instructor</button>
        </div>
      ) : (
        <Login
        signInWithGoogle={signInWithGoogle}
        signInWithUsernameAndPassword={signInWithUsernameAndPassword} 
        loginError={loginError}
      />
  
      )}
    </>
  );
};

export default LoginPage;
