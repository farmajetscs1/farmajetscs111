/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  THESIS_DATA,
  ThesisItem,
  ItemType,
  EpistemologicalStatus,
  EPISTEMOLOGICAL_TAGS
} from './data/thesisData';
import { Navbar } from './components/Navbar';
import { ManifoldVisualizer, VisualizerMode } from './components/ManifoldVisualizer';
import { AxiomInspector } from './components/AxiomInspector';
import { GaussBonnetCalculator } from './components/GaussBonnetCalculator';
import { ChapterMatrix } from './components/ChapterMatrix';
import { ExportModal } from './components/ExportModal';
import { ThesisTextReader } from './components/ThesisTextReader';
import {
  Search,
  Filter,
  Layers,
  ChevronRight,
  ShieldCheck,
  Compass,
  Sigma,
  BookOpen,
  ArrowUpRight,
  Cpu
} from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('corpus');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | ItemType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | EpistemologicalStatus>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('ricci_surgery');

  // Stats calculation
  const stats = useMemo(() => {
    const all = Object.values(THESIS_DATA);
    const numAxioms = all.filter((i) => i.type === 'axiom').length;
    const numDefs = all.filter((i) => i.type === 'definition').length;
    const numProps = all.filter((i) => i.type === 'proposition').length;
    return { numAxioms, numDefs, numProps, total: all.length };
  }, []);

  // Filtered Items
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return Object.values(THESIS_DATA).filter((item) => {
      // Type filter
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;

      // Search query
      if (query.length === 0) return true;

      const idMatch = item.id.toLowerCase().includes(query);
      const titleMatch = item.title.toLowerCase().includes(query);
      const statementMatch = (item.statement || item.content || '').toLowerCase().includes(query);
      const chapterMatch = item.chapter.toLowerCase().includes(query);
      const formulaMatch = (item.mathFormula || '').toLowerCase().includes(query);
      const germanMatch = (item.germanTerms || []).some((term) => term.toLowerCase().includes(query));

      return idMatch || titleMatch || statementMatch || chapterMatch || formulaMatch || germanMatch;
    });
  }, [searchQuery, typeFilter, statusFilter]);

  const selectedItem = selectedItemId ? THESIS_DATA[selectedItemId] || null : null;

  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
  };

  const handleSimulateItem = (mode: VisualizerMode) => {
    setVisualizerMode(mode);
    const vizEl = document.getElementById('visualizer-section');
    if (vizEl) {
      vizEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    const el = document.getElementById(`${section}-section`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onExport={() => setIsExportOpen(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Hero Section: Academic Title & Formal Grounding */}
        <section className="space-y-6 pt-2">
          <div className="max-w-4xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span>Investigación Doctoral</span>
              <span aria-hidden="true">·</span>
              <span>Versión 2.0</span>
              <span aria-hidden="true">·</span>
              <span>28 de octubre de 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-slate-100 text-balance leading-tight">
              Modelo Tesis: Flujo de Ricci y Metapsicología Freudiana
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-3xl">
              Formalización geométrica y diferencial del aparato psíquico mediante variedades riemannianas,
              deformación métrica por flujo de Ricci, cirugía analítica de Perelman y dinámica no lineal de pulsiones parciales.
            </p>
          </div>

          {/* Precision Quantitative Statistics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <div
              onClick={() => { setTypeFilter('axiom'); }}
              className="p-4 bg-[#0c1017] border border-slate-800 hover:border-cyan-500/40 rounded-xl cursor-pointer transition-all"
            >
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Axiomas</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400 mt-1 tabular-nums">
                {stats.numAxioms}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">7 Epistemológicos + 11 Estructurales</div>
            </div>

            <div
              onClick={() => { setTypeFilter('definition'); }}
              className="p-4 bg-[#0c1017] border border-slate-800 hover:border-purple-500/40 rounded-xl cursor-pointer transition-all"
            >
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Definiciones</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-purple-400 mt-1 tabular-nums">
                {stats.numDefs}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">D1 a D18 (Red, Flujo y Memoria)</div>
            </div>

            <div
              onClick={() => { setTypeFilter('proposition'); }}
              className="p-4 bg-[#0c1017] border border-slate-800 hover:border-emerald-500/40 rounded-xl cursor-pointer transition-all"
            >
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Proposiciones</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 mt-1 tabular-nums">
                {stats.numProps}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">P1 a P5 (Cirugía y Homotopía)</div>
            </div>

            <div
              onClick={() => handleNavigate('chapters')}
              className="p-4 bg-[#0c1017] border border-slate-800 hover:border-amber-500/40 rounded-xl cursor-pointer transition-all"
            >
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Estructura</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 mt-1 tabular-nums">
                26 + E
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Capítulos + Extensión E</div>
            </div>
          </div>
        </section>

        {/* 3D Simulation Stage: Horn Torus */}
        <section id="visualizer-section" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Superficie Fundamental de la Tesis: Horn Torus S = T₁ (R = r = 1)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-100 mt-1">
                El Horn Torus, la Cúspide c = (0,0,0) y los Dos Cuernos B⁺ / B⁻
              </h2>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Familia T_r con r ≤ 1 · Cierre del orificio en la cúspide · Circuito invocante C_inv y Cirugía
            </div>
          </div>

          <ManifoldVisualizer
            initialMode={visualizerMode}
            onSelectItem={handleSelectItem}
          />
        </section>

        {/* Unified Master Thesis Text Reader */}
        <section id="thesis_text-section" className="space-y-4 pt-2">
          <ThesisTextReader onSimulateHornTorus={() => handleNavigate('visualizer')} />
        </section>

        {/* Corpus Formal Explorer Section */}
        <section id="corpus-section" className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Base Axiomática Rigurosa</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-100 mt-1">
                Corpus Formal: Axiomas, Definiciones y Proposiciones
              </h2>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Mostrando {filteredItems.length} de {stats.total} enunciados
            </div>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por código (AM1, D10, P1), concepto (angustia, cirugía, Ricci, voz) o fórmula..."
                className="w-full pl-11 pr-4 py-3 bg-[#0c1017] border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Filter Bar with Segmented Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Type Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-[#0c1017] border border-slate-800 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    typeFilter === 'all'
                      ? 'bg-slate-800 text-slate-100 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Todos ({stats.total})
                </button>
                <button
                  onClick={() => setTypeFilter('axiom')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    typeFilter === 'axiom'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Axiomas ({stats.numAxioms})
                </button>
                <button
                  onClick={() => setTypeFilter('definition')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    typeFilter === 'definition'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Definiciones ({stats.numDefs})
                </button>
                <button
                  onClick={() => setTypeFilter('proposition')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    typeFilter === 'proposition'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Proposiciones ({stats.numProps})
                </button>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Estatuto epistémico:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | EpistemologicalStatus)}
                  className="bg-[#0c1017] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">Todos los estatutos</option>
                  <option value="VT">[VT] Verificado en texto alemán</option>
                  <option value="VW">[VW] Verificado en web</option>
                  <option value="M">[M] Citado de memoria</option>
                  <option value="P">[P] Propuesta teórica</option>
                  <option value="A">[A] Decisión del autor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards Grid: Clean Design Without Left Accent Bars */}
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-[#0c1017] border border-slate-800 rounded-xl space-y-2">
              <div className="text-slate-400 font-medium">No se encontraron resultados para los filtros seleccionados</div>
              <p className="text-xs text-slate-500">
                Pruebe buscando por términos generales como "pulsión", "núcleo", "cirugía" o limpie los filtros.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setTypeFilter('all'); setStatusFilter('all'); }}
                className="mt-3 px-3 py-1.5 text-xs text-cyan-400 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-850"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const isAxiom = item.type === 'axiom';
                const isDef = item.type === 'definition';
                const isProp = item.type === 'proposition';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item.id)}
                    className="p-5 bg-[#0c1017] hover:bg-[#101520] border border-slate-800/90 hover:border-slate-700 rounded-xl cursor-pointer transition-all duration-150 flex flex-col justify-between group shadow-sm hover:shadow-md"
                  >
                    <div>
                      {/* Top Unboxed Metadata */}
                      <div className="flex items-center justify-between text-xs text-slate-500 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-bold ${
                              isAxiom ? 'text-cyan-400' : isDef ? 'text-purple-400' : 'text-emerald-400'
                            }`}
                          >
                            {item.id}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">{item.type}</span>
                        </div>
                        {item.status && (
                          <span className="font-mono text-amber-400/90 text-[11px]">
                            [{item.status}]
                          </span>
                        )}
                      </div>

                      {/* Card Title */}
                      <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors mt-1">
                        {item.title}
                      </h3>

                      {/* Statement Body */}
                      <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {item.statement || item.content}
                      </p>

                      {/* Math Formula Preview if present */}
                      {item.mathFormula && (
                        <div className="mt-3 px-2.5 py-1.5 bg-[#07090e] border border-slate-800/80 rounded font-mono text-[11px] text-cyan-300 truncate">
                          {item.mathFormula}
                        </div>
                      )}
                    </div>

                    {/* Bottom Card Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                      <span>{item.chapter}</span>
                      <div className="flex items-center gap-1 text-slate-400 group-hover:text-cyan-400 transition-colors">
                        <span>Examinar</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Gauss-Bonnet Calculator Section */}
        <section id="gauss_bonnet-section" className="space-y-4 pt-4">
          <GaussBonnetCalculator onSelectItem={handleSelectItem} />
        </section>

        {/* Chapter Matrix Section */}
        <section id="chapters-section" className="space-y-4 pt-4">
          <ChapterMatrix onSelectItem={handleSelectItem} />
        </section>

        {/* Epistemological Framework Section */}
        <section id="epistemology-section" className="bg-[#0b0f17] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Axioma AM7: Criterio Metodológico de Certeza</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-100">
              Taxonomía Epistemológica y Régimen de Incertidumbre
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              En cumplimiento del Axioma AM1 (Analogía, no identidad) y AM7 (Etiquetado de incertidumbre), cada enunciado del modelo formal explicita su grado de verificación filológica freudiana y su estatus deductivo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(EPISTEMOLOGICAL_TAGS).map(([tag, val]) => (
              <div
                key={tag}
                onClick={() => setStatusFilter(tag as EpistemologicalStatus)}
                className="p-4 bg-[#080b11] border border-slate-800 hover:border-amber-500/40 rounded-xl cursor-pointer transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-400 text-sm">[{tag}]</span>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">Filología</span>
                </div>
                <div className="text-xs font-semibold text-slate-200">{val.label}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200">Axioma AM1 (Analogía, no identidad):</strong> El modelo es una analogía estructurada. Ninguna afirmación de la forma "la psique es una variedad" o "el análisis es una cirugía de Perelman" pertenece al cuerpo de la tesis. La teoría riemanniana provee herramientas formales para clarificar paradojas estructurales que Freud abordó mediante metáforas hidráulicas y termodinámicas.
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-[#090c12] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Modelo Tesis</span>
            <span aria-hidden="true">·</span>
            <span>Flujo de Ricci y Metapsicología Freudiana</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">Versión 2.0 (2026)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsExportOpen(true)} className="hover:text-cyan-400 transition-colors">
              Exportar Markdown / BibTeX
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => handleNavigate('corpus')} className="hover:text-cyan-400 transition-colors">
              Corpus Formal
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Detail Modal / Inspector */}
      <AxiomInspector
        item={selectedItem}
        onClose={() => setSelectedItemId(null)}
        onSelectItem={handleSelectItem}
        onSimulate={handleSimulateItem}
      />

      {/* Export Compendium Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
