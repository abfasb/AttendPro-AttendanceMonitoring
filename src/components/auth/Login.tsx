import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  signInWithGoogle: () => void;
  signInWithUsernameAndPassword: (username: string, password: string) => Promise<boolean>;
  loginError: string | null;
}

const Login: React.FC<LoginProps> = ({ signInWithGoogle, signInWithUsernameAndPassword, loginError }) => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(true); // Open the role modal by default
  const [userRole, setUserRole] = useState<'student' | 'instructor' | null>(null);
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

  const handleRoleSelect = (role: 'student' | 'instructor') => {
    setUserRole(role);
    setIsRoleModalOpen(false); // Close the role modal
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = formData;
    const signInWithUserAndPass = await signInWithUsernameAndPassword(username, password);

    if (signInWithUserAndPass) {
      // Show a success toast
      toast.success('Login successful!', { position: "top-right", autoClose: 5000 });
    } else {
      // Show an error toast if login failed
      toast.error('Invalid credentials, please try again.', { position: "top-right", autoClose: 5000 });
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-2xl p-10 max-w-lg w-full shadow-xl transform transition-all scale-90 hover:scale-100 duration-300 ease-out">
            <h3 className="text-3xl font-semibold mb-8 text-center text-gray-900 tracking-wide">Choose Your Role</h3>
            <div className="flex justify-center gap-8">
              <button
                onClick={() => handleRoleSelect('student')}
                className="w-40 py-4 text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-xl hover:shadow-2xl focus:outline-none transition duration-300 transform hover:scale-105 ease-in-out"
              >
                Student
              </button>
              <button
                onClick={() => handleRoleSelect('instructor')}
                className="w-40 py-4 text-xl font-semibold bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-xl shadow-xl hover:shadow-2xl focus:outline-none transition duration-300 transform hover:scale-105 ease-in-out"
              >
                Instructor
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Main Login Form */}
      {!isRoleModalOpen && (
        <div className="container flex flex-col mx-auto rounded-lg pt-12 my-4">
          <div className="flex justify-center w-full h-full my-auto xl:gap-10 lg:justify-normal md:gap-4 draggable">
            <div className="flex items-center justify-center w-full lg:p-8">
              <div className="flex shadow-lg p-8 bg-white rounded-md items-center xl:p-8">
                <form className="flex flex-col w-full h-full pb-4 text-center bg-white rounded-3xl" onSubmit={handleSubmit}>
                  <h3 className="mb-2 text-3xl font-extrabold text-dark-grey-900">Sign In</h3>
                  <p className="mb-3 text-grey-700">Enter your username and password</p>
                  <button onClick={signInWithGoogle} className="flex items-center justify-center w-full py-3 mb-5 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-grey-300 hover:bg-grey-400 focus:ring-4 focus:ring-grey-300">
                    <img className="h-4 mr-2" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png" alt="" />
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
                  <button className="w-full px-4 py-4 mb-4 text-sm font-bold leading-none text-white bg-blue-500 transition duration-300 md:w-80 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500">Sign In</button>
                  <p>Don't have an account? <a className=' text-blue-500' href="/register">Register here.</a></p>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
