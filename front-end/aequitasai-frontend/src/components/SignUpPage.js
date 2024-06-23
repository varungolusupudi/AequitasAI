import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import illustration from '../assets/signing.png'; // Adjust the path if necessary

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
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
      const redirectPriceId = localStorage.getItem('redirectPriceId');
      if (redirectPriceId) {
        navigate(`/subscribe/${redirectPriceId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setError('Failed to sign in with Google.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user);

      // Update the user's profile
      await updateProfile(user, { displayName: fullName });
      console.log('User profile updated with display name:', fullName);

      const redirectPriceId = localStorage.getItem('redirectPriceId');
      if (redirectPriceId) {
        navigate(`/subscribe/${redirectPriceId}`);
      } else {
        navigate('/dashboard'); // Redirect to dashboard after successful sign-up
      }
    } catch (error) {
      console.error('Create Account Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else {
        setError('Failed to create an account.');
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
            <h2 className="text-3xl font-bold">Create Account</h2>
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
            <div className="mb-6 relative">
              <div className="flex items-center border-b-2 border-gray-300 focus-within:border-blue-500">
                <input
                  type="text"
                  id="full-name"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 focus:outline-none focus:ring-0"
                />
                <img src="https://img.icons8.com/material-outlined/24/000000/user.png" alt="User Icon" className="w-5 h-5 text-gray-400 mr-2" />
              </div>
            </div>
            <div className="mb-6 relative">
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
            <div className="mb-6 relative">
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
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6 font-bold">Create Account</button>
          </form>
          <p className="text-center text-gray-500 mt-4">Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
