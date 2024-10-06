import React from 'react';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import nasaLogo from '../assets/images/nasa-logo.png'; // Asegúrate de tener el logotipo de la NASA

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-3 bg-transparent z-50">
      {/* Logotipo de la NASA */}
      <div className="flex items-center space-x-4">
        <img src={nasaLogo} alt="NASA Logo" className="h-8" style={{ width: '75px', height: '75px' }} />
        <h3 className="text-white text-lg font-semibold">Orrery Near-Earth Objects</h3>
      </div>
    </nav>
  );
}

export default Navbar;
