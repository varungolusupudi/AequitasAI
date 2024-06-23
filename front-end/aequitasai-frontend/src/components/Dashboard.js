import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import Sidebar from './Sidebar';
import Header from './Header';
import './Dashboard.css';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('caseLaws');

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="main-content">
          <ChatInterface activeSection={activeSection} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;