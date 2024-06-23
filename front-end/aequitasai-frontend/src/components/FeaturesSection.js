import React from 'react';
import { FaPencilAlt, FaUsers, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl"
  >
    <div className="bg-blue-100 p-3 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering legal professionals with cutting-edge AI technology
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<FaPencilAlt className="w-8 h-8 text-blue-500" />}
            title="AI-Powered Legal Drafting"
            description="Leverage advanced AI to draft legal documents quickly and accurately, saving time and improving precision."
          />
          <FeatureCard 
            icon={<FaUsers className="w-8 h-8 text-green-500" />}
            title="Real-time Collaboration"
            description="Seamlessly collaborate with your team in real-time on document drafting, enhancing productivity and teamwork."
          />
          <FeatureCard 
            icon={<FaSearch className="w-8 h-8 text-purple-500" />}
            title="Automated Legal Research"
            description="Utilize AI to conduct comprehensive legal research automatically, providing in-depth insights and saving hours of manual work."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;