// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Import Tailwind CSS
import './styles.css'; // Import custom CSS for hover effect
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
