import React from 'react';
import { FaInfoCircle, FaLayerGroup, FaPlus, FaMinus, FaMoon, FaExpandArrowsAlt, FaEllipsisV } from 'react-icons/fa';

function Controls() {
  return (
    <div className="fixed top-1/4 right-4 flex flex-col space-y-2 p-2 bg-gray-800 bg-opacity-80 rounded-lg shadow-md">
      {/* Botón de Información */}
      <button className="bg-gray-900 hover:bg-gray-700 p-2 rounded-full text-white">
        <FaInfoCircle size={18} />
      </button>

      {/* Botón de Capas */}
      <button className="bg-gray-900 hover:bg-gray-700 p-2 rounded-full text-white">
        <FaLayerGroup size={18} />
      </button>

      {/* Botón de Zoom In */}
      <button className="bg-gray-900 hover:bg-gray-700 p-2 rounded-full text-white">
        <FaPlus size={18} />
      </button>

      {/* Botón de Zoom Out */}
      <button className="bg-gray-900 hover:bg-gray-700 p-2 rounded-full text-white">
        <FaMinus size={18} />
      </button>

      {/* Botón de Modo Noche */}
      <button className="bg-gray-900 hover:bg-gray-700 p-2 rounded-full text-white">
        <FaMoon size={18} />
      </button>

      {/* Botón de Pantalla Completa */}
      <button className="bg-gray-900 hover:bg-gray-700 p-2 rounded-full text-white">
        <FaExpandArrowsAlt size={18} />
      </button>

      {/* Botón de Más Opciones */}
      <button className="bg-gray-900 hover:bg-gray-700 p-2 rounded-full text-white">
        <FaEllipsisV size={18} />
      </button>
    </div>
  );
}

export default Controls;
