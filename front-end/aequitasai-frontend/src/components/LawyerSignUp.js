import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import illustration from '../assets/LawyerIntegration.jpg'; // Replace with an appropriate lawyer-themed illustration

const LawyerSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    barNumber: '',
    lawFirm: '',
    specialization: '',
    yearsOfExperience: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.fullName });

      // Create a new entry in the 'lawyers' node of the Realtime Database
      await set(ref(db, `lawyers/${user.uid}`), {
        fullName: formData.fullName,
        email: formData.email,
        barNumber: formData.barNumber,
        lawFirm: formData.lawFirm,
        specialization: formData.specialization,
        yearsOfExperience: formData.yearsOfExperience,
        approved: false,
      });

      alert('Sign up successful! Please wait for admin approval.');
      navigate('/lawyer-dashboard');
    } catch (error) {
      console.error('Lawyer Sign-Up Error:', error);
      setError(error.message);
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
            <h2 className="text-3xl font-bold">Lawyer Sign Up</h2>
          </div>
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="flex items-center border-b-2 border-gray-300 focus-within:border-blue-500">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 focus:outline-none focus:ring-0"
                  required
                />
                <img src="https://img.icons8.com/material-outlined/24/000000/user.png" alt="User Icon" className="w-5 h-5 text-gray-400 mr-2" />
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center border-b-2 border-gray-300 focus-within:border-blue-500">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 focus:outline-none focus:ring-0"
                  required
                />
                <img src="https://img.icons8.com/?size=100&id=12580&format=png&color=000000" alt="Email Icon" className="w-5 h-5 text-gray-400 mr-2" />
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center border-b-2 border-gray-300 focus-within:border-blue-500">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 focus:outline-none focus:ring-0"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="focus:outline-none ml-2"
                >
                  <img
                    src={showPassword ? "https://img.icons8.com/material-outlined/24/000000/visible.png" : "https://img.icons8.com/material-outlined/24/000000/invisible.png"}
                    alt="Toggle Password Visibility"
                    className="w-6 h-5 text-gray-400"
                  />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center border-b-2 border-gray-300 focus-within:border-blue-500">
                <input
                  type="text"
                  name="barNumber"
                  placeholder="Bar Number"
                  value={formData.barNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 focus:outline-none focus:ring-0"
                  required
                />
                <img src="https://img.icons8.com/material-outlined/24/000000/diploma.png" alt="Bar Number Icon" className="w-5 h-5 text-gray-400 mr-2" />
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center border-b-2 border-gray-300 focus-within:border-blue-500">
                <input
                  type="text"
                  name="lawFirm"
                  placeholder="Law Firm"
                  value={formData.lawFirm}
                  onChange={handleChange}
                  className="w-full px-3 py-2 focus:outline-none focus:ring-0"
                />
                <img src="https://img.icons8.com/material-outlined/24/000000/company.png" alt="Law Firm Icon" className="w-5 h-5 text-gray-400 mr-2" />
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center border-b-2 border-gray-300 focus-within:border-blue-500">
                <input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-3 py-2 focus:outline-none focus:ring-0"
                />
                <img src="https://img.icons8.com/material-outlined/24/000000/briefcase.png" alt="Specialization Icon" className="w-5 h-5 text-gray-400 mr-2" />
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center border-b-2 border-gray-300 focus-within:border-blue-500">
                <input
                  type="number"
                  name="yearsOfExperience"
                  placeholder="Years of Experience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 focus:outline-none focus:ring-0"
                  required
                />
                <img src="https://img.icons8.com/material-outlined/24/000000/calendar.png" alt="Experience Icon" className="w-5 h-5 text-gray-400 mr-2" />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6 font-bold">
              Create Lawyer Account
            </button>
          </form>
          <p className="text-center text-gray-500 mt-4">
            Already have an account? <Link to="/lawyer-signin" className="text-blue-600 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LawyerSignUp;