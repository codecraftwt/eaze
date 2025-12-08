// src/App.jsx
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <div className="App">
      <AppRoutes />
      {/* GLOBAL TOASTER */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
