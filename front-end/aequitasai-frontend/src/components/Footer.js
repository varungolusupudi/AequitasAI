import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4 text-[#588157]">AequitasAI</h3>
            <p className="text-gray-600">
              Making justice accessible to everyone through AI-powered legal solutions.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#588157]">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-[#588157] transition duration-300">Home</Link></li>
              <li><Link to="/features" className="text-gray-600 hover:text-[#588157] transition duration-300">Features</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-[#588157] transition duration-300">About</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-[#588157] transition duration-300">Pricing</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-[#588157] transition duration-300">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#588157]">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-gray-600 hover:text-[#588157] transition duration-300">Login</Link></li>
              <li><Link to="/signup" className="text-gray-600 hover:text-[#588157] transition duration-300">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#588157]">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-[#588157] transition duration-300">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#588157] transition duration-300">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#588157] transition duration-300">
                <FaFacebook size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">© 2024 AequitasAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;