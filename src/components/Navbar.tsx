import React from 'react';
import { Download } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onExport }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090c12]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('corpus')}
          className="text-base md:text-lg font-display font-bold tracking-tight text-slate-100 hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 text-left"
        >
          Modelo Tesis · Flujo de Ricci & Metapsicología
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs md:text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigate('visualizer')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 ${
              activeSection === 'visualizer' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Horn Torus 3D
          </button>
          <button
            onClick={() => onNavigate('thesis_text')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 ${
              activeSection === 'thesis_text' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Texto de la Tesis
          </button>
          <button
            onClick={() => onNavigate('corpus')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 ${
              activeSection === 'corpus' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Corpus Formal
          </button>
          <button
            onClick={() => onNavigate('gauss_bonnet')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 ${
              activeSection === 'gauss_bonnet' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Gasto Gauss-Bonnet
          </button>
          <button
            onClick={() => onNavigate('epistemology')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 ${
              activeSection === 'epistemology' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Epistemología
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-100 bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Compendio</span>
          </button>
        </div>
      </div>
    </header>
  );
};
