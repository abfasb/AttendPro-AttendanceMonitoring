import React, { useState, useEffect } from 'react';
import { app, db } from '../config/config';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, query, where, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import Login from '../components/auth/Login';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const LoginPage: React.FC = () => {
  const [loginError, setLoginError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        console.log('Auth state changed:', user);
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
      
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'student'
      }, { merge: true });

      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.error('User document missing after creation');
        toast.error('Account setup incomplete', { position: 'top-right', autoClose: 5000 });
        return;
      }

      const userData = userDoc.data();
      console.log('Firestore user data:', userData);

      const userState = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: userData?.role || 'student'
      };

      localStorage.setItem('user', JSON.stringify(userState));
      console.log('Local storage set:', userState);

      const redirectPath = userData?.role === 'instructor' 
        ? '/my-account/instructor' 
        : '/my-account/student';
      
      console.log('Navigating to:', redirectPath);
      navigate(redirectPath);
      window.location.reload(); 

    } catch (error) {
      console.error('Google login failed:', error);
      toast.error('Google login failed. Check console for details', { position: 'top-right', autoClose: 5000 });
    }
  };

  const signInWithUsernameAndPassword = async (email: string, password: string): Promise<boolean> => {
    try {
      const normalizedEmail = email.toLowerCase();
      console.log('Login attempt with email:', normalizedEmail);

      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', normalizedEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn('No user found for email:', normalizedEmail);
        toast.error('Account not found', { position: 'top-right', autoClose: 5000 });
        return false;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      console.log('User document data:', userData);

      if (!userData.password) {
        console.error('User document missing password field');
        toast.error('Account configuration error', { position: 'top-right', autoClose: 5000 });
        return false;
      }

      const isPasswordCorrect = await bcrypt.compare(password, userData.password);
      console.log('Password match:', isPasswordCorrect);

      if (!isPasswordCorrect) {
        toast.error('Incorrect password', { position: 'top-right', autoClose: 5000 });
        return false;
      }

      const userState = {
        uid: userDoc.id,
        email: userData.email,
        firstName: userData.firstName || userData.FirstName,
        lastName: userData.lastName || userData.LastName,
        displayName: `${userData.FirstName} ${userData.LastName}`,
        photoURL: userData.photoURL || 'https://example.com/default-avatar.jpg',
        role: userData.role || 'student'
      };

      localStorage.setItem('user', JSON.stringify(userState));
      console.log('Local storage set:', userState);

      const redirectPath = userData.role === 'instructor'
        ? '/my-account/instructor'
        : '/my-account/student';
      
      console.log('Navigating to:', redirectPath);
      navigate(redirectPath);
      window.location.reload();
      return true;

    } catch (error) {
      console.error('Login error:', error);
      toast.error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        { position: 'top-right', autoClose: 5000 });
      return false;
    }
  };

  return (
    <Login
      signInWithGoogle={signInWithGoogle}
      signInWithUsernameAndPassword={signInWithUsernameAndPassword}
      loginError={loginError}
    />
  );
};

export default LoginPage;