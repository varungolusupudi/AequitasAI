import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: 'caseLaws', name: 'Case Laws' },
    { id: 'legalDocs', name: 'AI Legal Document Creation' },
    { id: 'envDocs', name: 'Environmental Documents' },
  ];

  return (
    <div className="sidebar">
      {sections.map((section) => (
        <button
          key={section.id}
          className={`sidebar-button ${activeSection === section.id ? 'active' : ''}`}
          onClick={() => setActiveSection(section.id)}
        >
          {section.name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;