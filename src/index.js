import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/*
  This file is the ENTRY POINT — React starts here.
  
  It does 3 things:
  1. Finds the <div id="root"> in index.html
  2. Creates a React "root" attached to that div
  3. Renders your <App /> component inside it
  
  You almost never need to edit this file.
*/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
