// src/components/LandingPage.js
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';
import Footer from './Footer';
import illustration from '../assets/hero-section.png';
import MissionSection from './MissionPage';
import CTASection from './CTASection';

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        navigate('/dashboard');
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLawyerSignIn = () => {
    navigate('/lawyer-signin');
  };

  return (
    <>
      <div className="hero-section bg-white py-20">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center px-4 sm:px-6 lg:px-8">
          <div className="hero-content text-center md:text-left md:w-1/2">
            <h1 className="text-4xl font-extrabold text-dark-blue mb-4">Transform Legal Document Drafting with AI</h1>
            <p className="text-gray-600 mb-8">Efficient, accurate, and user-friendly AI-powered document creation for legal professionals and businesses.</p>
            <div className="cta-buttons flex justify-center md:justify-start space-x-4">
              <button onClick={handleGetStarted} className="btn-gett-started py-2 px-4 rounded-lg">Get Started</button>
              <button onClick={handleLawyerSignIn} className="btn-watch-video py-2 px-4 rounded-lg">Lawyer Sign In</button>
            </div>
          </div>
          <div className="hero-illustration md:w-1/2 mt-10 md:mt-0">
            <img src={illustration} alt="Illustration" className="w-full h-auto" />
          </div>
        </div>
      </div>
      <MissionSection/>
      <FeaturesSection />
      <CTASection />
      <Footer />
    </>
  );
};

export default LandingPage;


// // src/components/LandingPage.js
// import React, { useState, useEffect } from 'react';
// import { auth } from '../firebase';
// import { onAuthStateChanged } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
// import Navbar from './Navbar';
// import FeaturesSection from './FeaturesSection';
// import TestimonialsSection from './TestimonialsSection';
// import Footer from './Footer';
// import illustration from '../assets/hero-section.png';
// import MissionSection from './MissionPage';
// import CTASection from './CTASection';

// const LandingPage = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setIsLoggedIn(true);
//         navigate('/dashboard');
//       } else {
//         setIsLoggedIn(false);
//       }
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   const handleGetStarted = () => {
//     navigate('/pricing');
//   };

//   return (
//     <>
//       <div className="hero-section bg-white py-20">
//         <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center px-4 sm:px-6 lg:px-8">
//           <div className="hero-content text-center md:text-left md:w-1/2">
//             <h1 className="text-4xl font-extrabold text-dark-blue mb-4">Transform Legal Document Drafting with AI</h1>
//             <p className="text-gray-600 mb-8">Efficient, accurate, and user-friendly AI-powered document creation for legal professionals and businesses.</p>
//             <div className="cta-buttons flex justify-center md:justify-start space-x-4">
//               <button onClick={handleGetStarted} className="btn-gett-started py-2 px-4 rounded-lg">Get Started</button>
//               <button className="btn-watch-video py-2 px-4 rounded-lg">Watch Video</button>
//             </div>
//           </div>
//           <div className="hero-illustration md:w-1/2 mt-10 md:mt-0">
//             <img src={illustration} alt="Illustration" className="w-full h-auto" />
//           </div>
//         </div>
//       </div>
//       <MissionSection/>
//       <FeaturesSection />
//       <CTASection />
//       <Footer />
//     </>
//   );
// };

// export default LandingPage;