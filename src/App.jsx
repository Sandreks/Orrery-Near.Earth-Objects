import React from 'react';
import Navbar from './components/NavBar';
import Orrery from './components/Orrery';
import Controls from './components/Controls';

function App() {
  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col">
      {/* Barra de navegación superior */}
      <Navbar />

      {/* Visor del Orrery */}
      <div className="flex-1 flex justify-center items-center pt-16">
        <Orrery />
      </div>

      {/* Controles interactivos */}
      <Controls />
    </div>
  );
}

export default App;
