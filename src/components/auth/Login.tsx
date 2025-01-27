import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../config/config';
import { doc, getDoc } from 'firebase/firestore';

interface LoginProps {
  signInWithGoogle: () => void;
  signInWithUsernameAndPassword: (username: string, password: string) => Promise<boolean>;
  loginError: string | null;
}

const Login: React.FC<LoginProps> = ({ signInWithGoogle, signInWithUsernameAndPassword, loginError }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });


  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = formData;
    const signInSuccess = await signInWithUsernameAndPassword(username, password);

    if (signInSuccess) {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData?.role || 'student';
            
            // Redirect based on user role
            navigate(`/my-account/${role}`);
            toast.success('Login successful!', { position: "top-right", autoClose: 5000 });
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        toast.error('Error during login.', { position: "top-right", autoClose: 5000 });
      }
    } else {
      toast.error('Invalid credentials, please try again.', { position: "top-right", autoClose: 5000 });
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="container flex flex-col mx-auto rounded-lg pt-12 my-4">
        <div className="flex justify-center w-full h-full my-auto xl:gap-10 lg:justify-normal md:gap-4 draggable">
          <div className="flex items-center justify-center w-full lg:p-8">
            <div className="flex shadow-lg p-8 bg-white rounded-md items-center xl:p-8">
              <form className="flex flex-col w-full h-full pb-4 text-center bg-white rounded-3xl" onSubmit={handleSubmit}>
                <h3 className="mb-2 text-3xl font-extrabold text-dark-grey-900">Sign In</h3>
                <p className="mb-3 text-grey-700">Enter your username and password</p>
                <button 
                  onClick={signInWithGoogle} 
                  className="flex items-center justify-center w-full py-3 mb-5 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-grey-300 hover:bg-grey-400 focus:ring-4 focus:ring-grey-300"
                >
                  <img 
                    className="h-4 mr-2" 
                    src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png" 
                    alt="Google logo" 
                  />
                  Sign in with Google
                </button>
                <div className="flex items-center mb-2">
                  <hr className="h-0 border-b border-solid border-grey-500 grow" />
                  <p className="mx-2 text-grey-600">or</p>
                  <hr className="h-0 border-b border-solid border-grey-500 grow" />
                </div>
                <label htmlFor="username" className="mb-1 text-sm text-start text-grey-900">Username*</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="username123"
                  className="flex items-center w-full px-4 py-3 mb-4 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="password" className="mb-1 text-sm text-start text-grey-900">Password*</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter a password"
                  className="flex items-center w-full px-4 py-3 mb-4 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {loginError && <p className="text-red-500">{loginError}</p>}
                <button 
                  type="submit"
                  className="w-full px-4 py-4 mb-4 text-sm font-bold leading-none text-white bg-blue-500 transition duration-300 md:w-80 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500"
                >
                  Sign In
                </button>
                <p>
                  Don't have an account?{' '}
                  <a className='text-blue-500' href="/register">
                    Register here.
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;