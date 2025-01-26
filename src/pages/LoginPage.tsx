import React, { useState } from 'react';
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

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }, { merge: true });

      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }));

      toast.success('Login successful with Google!', { position: "top-right", autoClose: 5000 });
      navigate('/my-account/student', { state: { user: { uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL } } });
    } catch (error) {
      console.log('Something went wrong', error);
      toast.error('Google login failed. Please try again.', { position: "top-right", autoClose: 5000 });
    }
  };

  const signInWithUsernameAndPassword = async (email: string, password: string): Promise<boolean> => {
    try {
      const adminRef = doc(db, 'admin', email);
      const adminDoc = await getDoc(adminRef);

      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        const storedHashedPassword = adminData.password;

        const isPasswordCorrect = await bcrypt.compare(password, storedHashedPassword);
        if (isPasswordCorrect) {
          sessionStorage.setItem('isAdminAuthenticated', 'true');
          localStorage.setItem('adminCredentials', JSON.stringify({
            name: adminData.name,
            adminId: adminData.adminId,
            email: email,
          }));
          toast.success('Admin login successful!', { position: "top-right", autoClose: 5000 });
          navigate('/admin');
          return true;
        } else {
          setLoginError('Incorrect password');
          toast.error('Incorrect password for admin.', { position: "top-right", autoClose: 5000 });
          return false;
        }
      }

      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setLoginError('User not found');
        toast.error('User not found.', { position: "top-right", autoClose: 5000 });
        return false;
      }

      const userData = querySnapshot.docs[0].data();
      const hashedPassword = userData.password;
      const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

      if (isPasswordCorrect) {
        localStorage.setItem('user', JSON.stringify({
          uid: querySnapshot.docs[0].id,
          email: userData.email,
          displayName: `${userData.FirstName} ${userData.LastName}`,
          photoURL: 'https://humanrightsrilanka.org/wp-content/uploads/2019/04/iStock-476085198.jpg',
        }));
        toast.success('Login successful!', { position: "top-right", autoClose: 5000 });
        navigate('/my-account/student', { state: { user: userData } });
        return true;
      } else {
        setLoginError('Incorrect password');
        toast.error('Incorrect password. Please try again.', { position: "top-right", autoClose: 5000 });
        return false;
      }
    } catch (error) {
      console.error('Error logging in: ', error);
      setLoginError('Something went wrong, please try again.');
      toast.error('Login failed. Please try again later.', { position: "top-right", autoClose: 5000 });
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
