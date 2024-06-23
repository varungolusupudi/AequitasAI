// src/components/AboutPage.js
import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import Footer from './Footer';

const TeamMember = ({ name, role, linkedIn, github, description }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105">
    <img
      className="w-32 h-32 rounded-full mb-4 object-cover"
      src={`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=0D8ABC&color=fff`}
      alt={name}
    />
    <h3 className="text-xl font-semibold mb-2">{name}</h3>
    <p className="text-gray-600 mb-4">{role}</p>
    <p className="text-center mb-4">{description}</p>
    <div className="flex space-x-4">
      <a href={linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
        <FaLinkedin size={24} />
      </a>
      <a href={github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600">
        <FaGithub size={24} />
      </a>
    </div>
  </div>
);

const InfoBox = ({ title, content }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:scale-105">
    <h3 className="text-xl font-semibold mb-4 text-green-600">{title}</h3>
    <p className="text-gray-700">{content}</p>
  </div>
);

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Jeffrey Jacob",
      role: "Co-founder & Backend Developer",
      linkedIn: "#",
      github: "#",
      description: "Responsible for setting up Claude API and AWS Bedrock integration."
    },
    {
      name: "Joyce Kim",
      role: "Co-founder & API Developer",
      linkedIn: "#",
      github: "#",
      description: "Focusing on API development and assisting with integrations."
    },
    {
      name: "Sahil Patil",
      role: "Co-founder & Business Strategist",
      linkedIn: "#",
      github: "#",
      description: "Leading entrepreneurial efforts and business development."
    },
    {
      name: "Varun Golusupudi",
      role: "Co-founder & Frontend Developer",
      linkedIn: "#",
      github: "#",
      description: "Spearheading the frontend development of AequitasAI."
    }
  ];

  const futureFeatures = [
    {
      title: "Advanced AI Models",
      content: "Integration of more sophisticated AI models to handle complex legal scenarios and provide more nuanced advice."
    },
    {
      title: "Global Expansion",
      content: "Extending our services to cover international legal systems and multiple languages."
    },
    {
      title: "Legal Professional Network",
      content: "Building a network of legal professionals for human oversight and complex case referrals."
    }
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-16 flex-grow">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">About AequitasAI</h1>
        
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-green-600 text-center">Our Product</h2>
          <div className="bg-white rounded-lg shadow-lg p-8 transition-transform duration-300 hover:scale-105">
            <p className="text-lg text-gray-700 mb-4">
              AequitasAI is an innovative AI-powered legal assistant designed to democratize access to legal services. 
              Our platform leverages advanced natural language processing and machine learning algorithms to provide 
              accurate, affordable, and accessible legal document generation and analysis.
            </p>
            <p className="text-lg text-gray-700">
              From creating non-disclosure agreements to analyzing complex contracts, AequitasAI is your reliable 
              partner in navigating the intricate world of legal documentation.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-green-600 text-center">Our Vision</h2>
          <div className="bg-white rounded-lg shadow-lg p-8 transition-transform duration-300 hover:scale-105">
            <p className="text-lg text-gray-700">
              At AequitasAI, we envision a world where quality legal services are accessible to everyone, regardless 
              of their financial means or legal expertise. We believe that by harnessing the power of AI, we can bridge 
              the gap between complex legal processes and the everyday individual or small business owner.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-green-600 text-center">The Future</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {futureFeatures.map((feature, index) => (
              <InfoBox key={index} {...feature} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-8 text-green-600 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;