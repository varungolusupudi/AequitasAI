import React from 'react';
import ChatInterface from './ChatInterface';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Welcome to AequitasAI Dashboard</h1>
      {/* Other dashboard content */}
      <ChatInterface />
    </div>
  );
};

export default Dashboard;
