import React, { useState } from 'react';
import { db } from '../firebase';
import { ref, set, push } from 'firebase/database';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';


const ContactPage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneChange = (value) => {
    setForm({
      ...form,
      phoneNumber: value,
    });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!form.firstName) tempErrors.firstName = 'First Name is required';
    if (!form.lastName) tempErrors.lastName = 'Last Name is required';
    if (!form.companyName) tempErrors.companyName = 'Company Name is required';
    if (!form.email) {
      tempErrors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      tempErrors.email = 'Email is invalid';
    }
    if (!form.phoneNumber) {
      tempErrors.phoneNumber = 'Phone Number is required';
    } else if (form.phoneNumber.length < 10) {
      tempErrors.phoneNumber = 'Phone Number is invalid';
    }
    if (!form.message) tempErrors.message = 'Message is required';
    return tempErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tempErrors = validateForm();

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setErrors({});
    try {
      const messagesRef = ref(db, 'messages');
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, form);
      setSuccess('Message sent successfully!');
      setForm({
        firstName: '',
        lastName: '',
        companyName: '',
        email: '',
        phoneNumber: '',
        message: '',
      });
    } catch (error) {
      setErrors({ submit: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Contact Us</h1>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
          <div className="bg-green-500 rounded-lg shadow-lg p-8 text-white h-full flex flex-col">
            <h2 className="text-4xl font-bold mb-8">Get in touch</h2>
            <div className="space-y-8 flex-grow">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-2xl mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">Visit us</h3>
                  <p>
                    Come say hello at our office HQ.<br />
                    123 Market Street, San Francisco, CA 94103
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FaEnvelope className="text-2xl mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">Chat to us</h3>
                  <p>
                    Our friendly team is here to help.<br />
                    <a href="mailto:contact@aequitasai.com" className="underline">contact@aequitasai.com</a>
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FaPhone className="text-2xl mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">Call us</h3>
                  <p>
                    Mon-Fri from 8am to 5pm<br />
                    (+1) 123-456-7890
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4">Follow us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-green-200 transition-colors duration-300">
                  <FaFacebookF className="text-2xl" />
                </a>
                <a href="#" className="text-white hover:text-green-200 transition-colors duration-300">
                  <FaLinkedinIn className="text-2xl" />
                </a>
                <a href="#" className="text-white hover:text-green-200 transition-colors duration-300">
                  <FaInstagram className="text-2xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
          <div className="w-full lg:w-1/2 px-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6 flex flex-wrap -mx-3">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first-name">
                    First Name
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`}
                    id="first-name"
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName}</p>}
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last-name">
                    Last Name
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white ${errors.lastName ? 'border-red-500' : 'border-gray-200'}`}
                    id="last-name"
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName}</p>}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company-name">
                  Company Name
                </label>
                <input
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white ${errors.companyName ? 'border-red-500' : 'border-gray-200'}`}
                  id="company-name"
                  type="text"
                  placeholder="Company Name"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                />
                {errors.companyName && <p className="text-red-500 text-xs italic">{errors.companyName}</p>}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                  id="email"
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone-number">
                  Phone Number
                </label>
                <PhoneInput
                  country={'us'}
                  value={form.phoneNumber}
                  onChange={handlePhoneChange}
                  inputStyle={{
                    width: '100%',
                    height: '42px',
                    fontSize: '16px',
                    backgroundColor: '#edf2f7',
                    border: errors.phoneNumber ? '1px solid #f56565' : '1px solid #edf2f7',
                    borderRadius: '0.25rem',
                  }}
                  containerStyle={{
                    marginBottom: '0.75rem',
                  }}
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs italic">{errors.phoneNumber}</p>}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white ${errors.message ? 'border-red-500' : 'border-gray-200'}`}
                  id="message"
                  placeholder="Tell us what we can help you with"
                  rows="4"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs italic">{errors.message}</p>}
              </div>
              <div className="mb-6">
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox text-green-500" name="newsletter" />
                  <span className="ml-2 text-sm text-gray-700">I'd like to receive more information about the company. I understand and agree to the <a href="#" className="text-green-500 underline">Privacy Policy</a>.</span>
                </label>
              </div>
              {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
              {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
              <div className="flex items-center justify-between">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300" type="submit">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;