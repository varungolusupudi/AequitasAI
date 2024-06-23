import React from 'react';
import { FaRobot, FaShieldAlt, FaClock, FaChartLine, FaGlobe, FaUserFriends } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center">
    <div className="text-4xl text-green-600 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

const FeaturesPage = () => {
  const features = [
    {
      icon: <FaRobot />,
      title: "AI-Powered Document Creation",
      description: "Leverage advanced AI to generate accurate legal documents in minutes, saving time and reducing errors."
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure & Confidential",
      description: "Your data is protected with bank-level security. We prioritize confidentiality and data protection."
    },
    {
      icon: <FaClock />,
      title: "24/7 Availability",
      description: "Access our services anytime, anywhere. AequitasAI is always ready to assist you with your legal document needs."
    },
    {
      icon: <FaChartLine />,
      title: "Continuous Learning",
      description: "Our AI models are continuously updated with the latest legal information to ensure accuracy and relevance."
    },
    {
      icon: <FaGlobe />,
      title: "Multi-Jurisdictional Support",
      description: "Create documents compliant with various jurisdictions, expanding your legal reach effortlessly."
    },
    {
      icon: <FaUserFriends />,
      title: "Collaboration Tools",
      description: "Easily share and collaborate on documents with team members or clients, streamlining your workflow."
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Features</h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Discover how AequitasAI is revolutionizing legal document creation with cutting-edge AI technology and user-friendly features.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to experience the future of legal document creation?</h2>
          <p className="text-xl mb-8">Join AequitasAI today and transform your legal processes.</p>
          <Link to="/pricing">
            <button className="bg-white text-green-600 font-bold py-3 px-8 rounded-full hover:bg-green-100 transition duration-300">
              Get Started Now
            </button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
