import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import illustration from '../assets/LawyerIntegration.jpg'; 

const LawyerSignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user is a lawyer and approved
      const lawyerDoc = await getDoc(doc(db, 'lawyers', user.uid));
      if (lawyerDoc.exists() && lawyerDoc.data().approved) {
        navigate('/lawyer-dashboard');
      } else if (lawyerDoc.exists() && !lawyerDoc.data().approved) {
        setError('Your account is pending approval. Please check back later.');
        await auth.signOut();
      } else {
        setError('Invalid lawyer credentials.');
        await auth.signOut();
      }
    } catch (error) {
      console.error('Lawyer Sign-In Error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('No lawyer account found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-indigo-300 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-5xl flex">
        <div className="hidden md:block w-1/2">
          <img src={illustration} alt="Lawyer Illustration" className="h-full w-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">Lawyer Login</h2>
          </div>
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
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
          <p className="text-center text-gray-500 mt-4">Don't have an account? <Link to="/lawyer-signup" className="text-blue-600 hover:underline">Sign Up as a Lawyer</Link></p>
          <p className="text-center text-gray-500 mt-2">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LawyerSignIn;