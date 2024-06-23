import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Switch from 'react-switch';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Footer from './Footer';
import './pricingStyles.css';

const stripePromise = loadStripe('pk_test_51PUb85FB4K1yJcTiPZDsRF1a39E2hNh6U4RXcDNzltGwmZf9mnnWrYfdriIuriBdyoQIXWm0Ushlescq2azWTlvJ00P49HPdIB');

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        const redirectPriceId = localStorage.getItem('redirectPriceId');
        if (redirectPriceId) {
          handleCheckout(redirectPriceId);
          localStorage.removeItem('redirectPriceId');
        }
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleBillingChange = () => {
    setIsAnnual(!isAnnual);
  };

  const handleCheckout = async (priceId) => {
    const stripe = await stripePromise;

    const response = await fetch('http://localhost:4242/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  const handleSubscribe = (priceId) => {
    if (isLoggedIn) {
      handleCheckout(priceId);
    } else {
      localStorage.setItem('redirectPriceId', priceId);
      navigate('/signup');
    }
  };

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const Feature = ({ children }) => (
    <li className="flex items-start space-x-3 mb-3">
      <i className="fas fa-check text-green-500 mt-1 flex-shrink-0"></i>
      <span className="text-gray-700">{children}</span>
    </li>
  );

  const PriceFeature = ({ label, price }) => (
    <li className="flex items-start justify-between space-x-3 mb-3">
      <div className="flex items-start space-x-3">
        <i className="fas fa-check text-green-500 mt-1 flex-shrink-0"></i>
        <span className="text-gray-700">{label}</span>
      </div>
      <span className="font-semibold text-gray-900">${price}</span>
    </li>
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Pricing Plans</h1>

        <div className="flex justify-center items-center space-x-4 mb-12">
          <span className={`text-lg ${!isAnnual ? 'font-semibold text-green-600' : 'text-gray-600'}`}>Billed Monthly</span>
          <Switch
            onChange={handleBillingChange}
            checked={isAnnual}
            offColor="#ccc"
            onColor="#10B981"
            uncheckedIcon={false}
            checkedIcon={false}
            height={24}
            width={48}
            handleDiameter={20}
          />
          <span className={`text-lg ${isAnnual ? 'font-semibold text-green-600' : 'text-gray-600'}`}>Billed Annually</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pay-Per-Document Pricing */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 p-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Pay-Per-Document</h2>
            <ul className="text-base mb-6 space-y-2">
              <PriceFeature label="Non-Disclosure Agreement (NDA)" price="100" />
              <PriceFeature label="Articles of Incorporation" price="500" />
              <PriceFeature label="Employment Agreement" price="250" />
              <PriceFeature label="Operating Agreement (for LLCs)" price="300" />
              <PriceFeature label="Will Document" price="200" />
            </ul>
            <button className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300" onClick={handleGetStarted}>Get Started</button>
          </div>

          {/* Basic Subscription */}
          <div className={`bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 p-6 ${!isAnnual ? 'ring-4 ring-green-500' : ''}`}>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Basic Subscription</h2>
            <p className="text-center text-4xl font-bold mb-6 text-green-600">${isAnnual ? '120' : '150'}<span className="text-lg font-normal text-gray-600">/month</span></p>
            <ul className="text-base mb-6 space-y-2">
              <Feature>Includes 3 Basic Documents per month</Feature>
              <Feature>Additional Basic Documents: <span className="font-semibold">${isAnnual ? '60' : '75'} each</span></Feature>
              <Feature>Articles of Incorporation: <span className="font-semibold">${isAnnual ? '360' : '450'} each</span></Feature>
              <Feature>Operating Agreements: <span className="font-semibold">${isAnnual ? '200' : '250'} each</span></Feature>
            </ul>
            <button className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300" onClick={() => handleSubscribe(isAnnual ? 'price_1PUbQmFB4K1yJcTiw6oJqSJn' : 'price_1PUbPYFB4K1yJcTi0B4GV2kR')}>Subscribe Now</button>
          </div>

          {/* Pro Subscription */}
          <div className={`bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 p-6 ${isAnnual ? 'ring-4 ring-green-500' : ''}`}>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Pro Subscription</h2>
            <p className="text-center text-4xl font-bold mb-6 text-green-600">${isAnnual ? '240' : '300'}<span className="text-lg font-normal text-gray-600">/month</span></p>
            <ul className="text-base mb-6 space-y-2">
              <Feature>Includes 5 Basic Documents and 2 Intermediate Documents per month</Feature>
              <Feature>Additional Basic Documents: <span className="font-semibold">${isAnnual ? '40' : '50'} each</span></Feature>
              <Feature>Articles of Incorporation: <span className="font-semibold">${isAnnual ? '320' : '400'} each</span></Feature>
              <Feature>Operating Agreements: <span className="font-semibold">${isAnnual ? '160' : '200'} each</span></Feature>
            </ul>
            <button className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300" onClick={() => handleSubscribe(isAnnual ? 'price_1PUbR7FB4K1yJcTiLcpgOHvv' : 'price_1PUbQHFB4K1yJcTi5QKJQ1zD')}>Subscribe Now</button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default PricingPage;