import React from 'react';
import { FaBalanceScale, FaLightbulb, FaHandshake } from 'react-icons/fa';

const MissionSection = () => {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AequitasAI aims to make the justice system more equal and accessible to everyone—regardless of socioeconomic status.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <MissionCard 
            icon={<FaBalanceScale className="w-12 h-12 text-blue-600" />}
            title="The Problem"
            description="Access to legal resources is often restricted by socioeconomic barriers, leading to inequalities in the justice system."
          />
          <MissionCard 
            icon={<FaLightbulb className="w-12 h-12 text-yellow-500" />}
            title="Our Solution"
            description="AequitasAI provides an AI-powered platform that generates accurate and user-friendly legal documents, democratizing access to justice."
          />
          <MissionCard 
            icon={<FaHandshake className="w-12 h-12 text-green-500" />}
            title="Why It Matters"
            description="We help reduce legal costs, ensuring everyone has the opportunity to receive the legal support they need, promoting a fairer justice system."
          />
        </div>
      </div>
    </section>
  );
};

const MissionCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default MissionSection;