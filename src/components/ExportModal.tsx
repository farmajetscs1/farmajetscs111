import React, { useState } from 'react';
import { THESIS_DATA } from '../data/thesisData';
import { X, Copy, Download, Check, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const generateMarkdownCompendium = () => {
    let md = `# MODELO TESIS: FLUJO DE RICCI Y METAPSICOLOGÍA FREUDIANA\n`;
    md += `Versión 2.0 - 28 de octubre de 2026\n\n`;
    md += `## 1. Axiomas Epistemológicos y Estructurales\n\n`;

    Object.values(THESIS_DATA)
      .filter((i) => i.type === 'axiom')
      .forEach((a) => {
        md += `### ${a.id}: ${a.title}\n`;
        md += `- **Enunciado:** ${a.statement}\n`;
        md += `- **Capítulo:** ${a.chapter}\n`;
        if (a.status) md += `- **Estatuto:** [${a.status}]\n`;
        if (a.mathFormula) md += `- **Fórmula:** ${a.mathFormula}\n`;
        if (a.primarySource) md += `- **Fuente primaria:** ${a.primarySource}\n\n`;
      });

    md += `## 2. Definiciones del Modelo\n\n`;
    Object.values(THESIS_DATA)
      .filter((i) => i.type === 'definition')
      .forEach((d) => {
        md += `### ${d.id}: ${d.title}\n`;
        md += `- **Contenido:** ${d.content || d.statement}\n`;
        md += `- **Capítulo:** ${d.chapter}\n`;
        if (d.mathFormula) md += `- **Fórmula:** ${d.mathFormula}\n\n`;
      });

    md += `## 3. Proposiciones y Teoremas de Cirugía\n\n`;
    Object.values(THESIS_DATA)
      .filter((i) => i.type === 'proposition')
      .forEach((p) => {
        md += `### ${p.id}: ${p.title}\n`;
        md += `- **Enunciado:** ${p.statement}\n`;
        md += `- **Capítulo:** ${p.chapter}\n`;
        if (p.mathFormula) md += `- **Fórmula:** ${p.mathFormula}\n\n`;
      });

    return md;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownCompendium();
    navigator.clipboard.writeText(md);
    setCopiedType('md');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownCompendium();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'modelo_tesis_ricci_metapsicologia_v2.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(THESIS_DATA, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'modelo_tesis_datos_v2.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-[#0d111a] border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg md:text-xl font-display font-bold text-slate-100">
            Exportar Compendio Formal de la Tesis
          </h2>
        </div>

        <p className="text-xs md:text-sm text-slate-400 mt-3 leading-relaxed">
          Descargue el corpus completo de 18 axiomas, 18 definiciones y 5 proposiciones con su aparato formal, estatuto de incertidumbre y fórmulas diferenciales.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
            <div className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              Documento Markdown / LaTeX
            </div>
            <p className="text-xs text-slate-400">
              Ideal para importar en Obsidian, Overleaf, Typst o procesadores de texto académicos.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleCopyMarkdown}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg transition-colors"
              >
                {copiedType === 'md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'md' ? 'Copiado' : 'Copiar'}</span>
              </button>
              <button
                onClick={handleDownloadMarkdown}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar .md</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
            <div className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
              Estructura JSON Estandarizada
            </div>
            <p className="text-xs text-slate-400">
              Datos estructurados completos con IDs, categorías, fórmulas LaTeX y referencias cruzadas.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleDownloadJSON}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-600/40 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar .json</span>
              </button>
            </div>
          </div>
        </div>

        {/* BibTeX Academic Citation Box */}
        <div className="mt-6 p-4 bg-[#080b11] border border-slate-800 rounded-xl">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Cita BibTeX para Publicación
          </div>
          <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg overflow-x-auto text-[11px] leading-relaxed">
{`@phdthesis{tesis_ricci_metapsicologia_2026,
  title     = {Modelo Matemático del Aparato Psíquico: Flujo de Ricci y Metapsicología Freudiana},
  author    = {Investigación Doctoral en Metapsicología y Geometría},
  year      = {2026},
  edition   = {Versión 2.0},
  note      = {18 Axiomas, 18 Definiciones, 5 Proposiciones de Cirugía Topológica}
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};
