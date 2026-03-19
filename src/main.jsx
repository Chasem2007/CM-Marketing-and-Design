import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

/*
  ENTRY POINT — React starts here.
  Finds <div id="root"> in index.html and renders your app inside it.
*/

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
