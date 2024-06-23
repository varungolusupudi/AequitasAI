import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/pricing');
  };

  return (
    <section className="bg-[#588157] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
          Ready to Transform Your Legal Processes?
        </h2>
        <p className="text-xl text-green-100 mb-8">
          Join AequitasAI today and experience the future of legal services.
        </p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={handleGetStarted}
            className="bg-white text-[#588157] font-bold py-3 px-8 rounded-full hover:bg-green-50 transition duration-300"
          >
            Get Started
          </button>
          <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-[#4a6d4a] transition duration-300">
            Watch Video
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;