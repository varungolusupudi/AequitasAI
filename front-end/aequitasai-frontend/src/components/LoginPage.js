// src/components/LoginPage.js
import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import illustration from '../assets/signing.png'; // Adjust the path if necessary

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setError('Failed to sign in with Google.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirect to dashboard after successful sign-in
    } catch (error) {
      console.error('Login Error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError('Failed to sign in.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-indigo-300 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-5xl flex">
        <div className="hidden md:block w-1/2">
          <img src={illustration} alt="Illustration" className="h-full w-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">Login</h2>
          </div>
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
          <div className="flex justify-center mb-4">
            <button onClick={handleGoogleSignIn} className="bg-white text-gray-800 rounded-lg flex items-center justify-center py-2 px-4 w-40 border">
              <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" className="mr-2" />
              <span>Google</span>
            </button>
          </div>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-8 relative">
              <div className="flex items-center border-b-2 border-gray-300 focus-within:border-blue-500">
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 focus:outline-none focus:ring-0"
                />
                <img src="https://img.icons8.com/?size=100&id=12580&format=png&color=000000" alt="Email Icon" className="w-5 h-5 text-gray-400 mr-2" />
              </div>
            </div>
            <div className="mb-8 relative">
              <div className="flex items-center border-b-2 border-gray-300 focus-within:border-blue-500">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="focus:outline-none ml-2"
                  style={{ marginRight: '0.50rem' }}
                >
                  <img
                    src={showPassword ? "https://img.icons8.com/material-outlined/24/000000/visible.png" : "https://img.icons8.com/material-outlined/24/000000/invisible.png"}
                    alt="Toggle Password Visibility"
                    className="w-6 h-5 text-gray-400"
                  />
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6 font-bold">Login</button>
          </form>
          <p className="text-center text-gray-500 mt-4">Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Create an Account</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
