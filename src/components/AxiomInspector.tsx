import React, { useState } from 'react';
import { ThesisItem, EPISTEMOLOGICAL_TAGS, THESIS_DATA } from '../data/thesisData';
import { VisualizerMode } from './ManifoldVisualizer';
import { X, Copy, Check, ExternalLink, BookOpen, Sigma, Compass, Layers } from 'lucide-react';

interface AxiomInspectorProps {
  item: ThesisItem | null;
  onClose: () => void;
  onSelectItem: (id: string) => void;
  onSimulate?: (mode: VisualizerMode) => void;
}

export const AxiomInspector: React.FC<AxiomInspectorProps> = ({
  item,
  onClose,
  onSelectItem,
  onSimulate
}) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const statusInfo = item.status ? EPISTEMOLOGICAL_TAGS[item.status] : null;

  const handleCopyCitation = () => {
    const text = `${item.id}: "${item.title}". ${item.statement || item.content} [${item.chapter}]. Fuente: ${item.primarySource || 'Tesis Flujo de Ricci y Metapsicología, 2026'}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const determineSimulationMode = (): VisualizerMode => {
    if (['A11', 'D13', 'P4'].includes(item.id)) return 'partial_drives';
    if (['A12', 'A13', 'D16', 'D17', 'D18', 'P5'].includes(item.id)) return 'invocant_horn';
    if (['D11', 'D12', 'P1', 'P2', 'P3'].includes(item.id)) return 'ricci_surgery';
    return 'horn_torus_structure';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#0d111a] border border-slate-700/80 rounded-2xl shadow-2xl overflow-y-auto p-6 md:p-8 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Cerrar inspector"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Metadata Header */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pb-3 border-b border-slate-800">
          <span className="font-mono text-cyan-400 font-bold text-sm">{item.id}</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">
            {item.type === 'axiom' && '⚙️ Axioma Formal'}
            {item.type === 'definition' && '📖 Definición Teórica'}
            {item.type === 'proposition' && '🎯 Proposición Topológica'}
          </span>
          <span aria-hidden="true">·</span>
          <span>{item.chapter}</span>

          {item.status && statusInfo && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-mono" title={statusInfo.desc}>
                [{item.status}] {statusInfo.label}
              </span>
            </>
          )}
        </div>

        {/* Main Title */}
        <h2 className="text-xl md:text-2xl font-display font-bold text-slate-100 mt-3">
          {item.title}
        </h2>

        {/* Core Statement */}
        <div className="mt-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed text-sm md:text-base text-slate-200">
          <strong className="text-cyan-400 font-semibold block mb-1">
            {item.type === 'definition' ? 'Contenido Formal:' : 'Enunciado Axiomático:'}
          </strong>
          {item.statement || item.content}
        </div>

        {/* German Primacy Terms */}
        {item.germanTerms && item.germanTerms.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Términos en alemán freudiano:</span>
            {item.germanTerms.map((term, i) => (
              <span
                key={i}
                className="font-mono text-amber-300 italic bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/40"
              >
                {term}
              </span>
            ))}
          </div>
        )}

        {/* Mathematical Expression */}
        {item.mathFormula && (
          <div className="mt-5 p-4 bg-[#080b11] border border-cyan-900/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <Sigma className="w-4 h-4 text-cyan-400" />
              <span>Formulación Matemática</span>
            </div>
            <div className="font-mono text-sm md:text-base text-cyan-200 overflow-x-auto py-1">
              {item.mathFormula}
            </div>
            {item.mathematicalMeaning && (
              <p className="text-xs text-slate-400 leading-relaxed pt-1 border-t border-slate-800">
                {item.mathematicalMeaning}
              </p>
            )}
          </div>
        )}

        {/* Metapsychological Interpretation */}
        {item.metapsychologicalMeaning && (
          <div className="mt-5 p-4 bg-[#0a0f18] border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Lectura Metapsicológica Freudiana</span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {item.metapsychologicalMeaning}
            </p>
          </div>
        )}

        {/* Primary Source Citation */}
        {item.primarySource && (
          <div className="mt-4 p-3 bg-slate-900/50 border border-slate-800/80 rounded-lg flex items-start gap-2.5 text-xs text-slate-400">
            <BookOpen className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300">Fuente textual de referencia: </strong>
              <span>{item.primarySource}</span>
            </div>
          </div>
        )}

        {/* Cross-References & Related Items */}
        {item.relatedIds && item.relatedIds.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Elementos Formalmente Conectados:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.relatedIds.map((relId) => {
                const rel = THESIS_DATA[relId];
                if (!rel) return null;
                return (
                  <button
                    key={relId}
                    onClick={() => onSelectItem(relId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 rounded-lg text-xs text-slate-300 transition-colors"
                  >
                    <span className="font-mono text-cyan-400 font-bold">{relId}:</span>
                    <span className="truncate max-w-[200px]">{rel.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyCitation}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Cita Copiada al Portapapeles' : 'Copiar Cita Académica'}</span>
          </button>

          {onSimulate && (
            <button
              onClick={() => {
                onSimulate(determineSimulationMode());
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-lg shadow-cyan-900/30 transition-colors"
            >
              <span>Ver en Simulador 3D</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
