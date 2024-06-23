import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Make sure this path is correct
import { UserCircleIcon } from '@heroicons/react/24/solid';
import './Header.css';


const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <header className="header">
      <h1>AequitasAI</h1>
      <div className="profile-menu">
        <button 
          onClick={() => setShowDropdown(!showDropdown)} 
          className="profile-button"
        >
          <UserCircleIcon className="h-10 w-10 text-white" />
        </button>
        {showDropdown && (
          <div className="dropdown-menu">
            <button onClick={() => navigate('/subscription')} className="dropdown-item">
              Subscription
            </button>
            <button onClick={() => navigate('/settings')} className="dropdown-item">
              Settings
            </button>
            <button onClick={handleLogout} className="dropdown-item">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;