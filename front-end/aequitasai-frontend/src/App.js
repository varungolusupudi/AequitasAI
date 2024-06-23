// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FeaturesPage from './components/FeaturesPage';
import AboutPage from './components/AboutPage';
import PricingPage from './components/PricingPage';
import ContactPage from './components/ContactPage';
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import LawyerSignIn from './components/LawyerSignIn';

import Subscribe from './components/Subscribe';
import LawyerSignUp from './components/LawyerSignUp';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lawyer-signin" element={<LawyerSignIn />} />
        <Route path="/lawyer-signup" element={<LawyerSignUp/>} />
        <Route path="/subscribe/:priceId" element={<Subscribe />} />
      </Routes>
    </Router>
  );
}

export default App;
