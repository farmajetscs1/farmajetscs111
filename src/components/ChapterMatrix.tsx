import React, { useState } from 'react';
import { THESIS_CHAPTERS, THESIS_DATA, ThesisItem } from '../data/thesisData';
import { BookMarked, ChevronRight, Hash } from 'lucide-react';

interface ChapterMatrixProps {
  onSelectItem: (id: string) => void;
}

export const ChapterMatrix: React.FC<ChapterMatrixProps> = ({ onSelectItem }) => {
  const [selectedChapterNum, setSelectedChapterNum] = useState<number>(1);

  const activeChapter = THESIS_CHAPTERS.find((c) => c.num === selectedChapterNum) || THESIS_CHAPTERS[0];

  // Get items belonging to selected chapter
  const itemsInActiveChapter: ThesisItem[] = [];
  activeChapter.axioms?.forEach(id => { if (THESIS_DATA[id]) itemsInActiveChapter.push(THESIS_DATA[id]); });
  activeChapter.defs?.forEach(id => { if (THESIS_DATA[id]) itemsInActiveChapter.push(THESIS_DATA[id]); });
  activeChapter.props?.forEach(id => { if (THESIS_DATA[id]) itemsInActiveChapter.push(THESIS_DATA[id]); });

  return (
    <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Estructura Capitular de la Tesis (26 Capítulos + Extensión E)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Distribución formal del aparato matemático y metapsicológico a través de la obra.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Chapter Selector List (Scrollable) */}
        <div className="lg:col-span-5 max-h-[460px] overflow-y-auto pr-2 space-y-1.5 scrollbar-thin">
          {THESIS_CHAPTERS.map((ch) => {
            const hasFormalItems = (ch.axioms?.length || 0) + (ch.defs?.length || 0) + (ch.props?.length || 0) > 0;
            const isSelected = selectedChapterNum === ch.num;

            return (
              <button
                key={ch.num}
                onClick={() => setSelectedChapterNum(ch.num)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'bg-slate-800/90 border border-cyan-500/50 text-slate-100'
                    : 'bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-start gap-2.5 truncate">
                  <span className="font-mono text-xs font-bold text-cyan-400 mt-0.5 shrink-0">
                    {ch.num === 27 ? 'Ext. E' : `Cap. ${ch.num}`}
                  </span>
                  <span className="text-xs font-medium truncate">{ch.title}</span>
                </div>

                {hasFormalItems && (
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0 ml-2">
                    {(ch.axioms?.length || 0) + (ch.defs?.length || 0) + (ch.props?.length || 0)} ítems
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Active Chapter Detail & Construct Cards */}
        <div className="lg:col-span-7 bg-[#080b11] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <Hash className="w-3.5 h-3.5" />
              <span>{activeChapter.num === 27 ? 'Extensión E' : `Capítulo ${activeChapter.num}`}</span>
            </div>
            <h4 className="text-lg font-display font-bold text-slate-100 mt-1">
              {activeChapter.title}
            </h4>

            {/* Elements in this chapter */}
            <div className="mt-5 space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Aparato Formal Presente en este Capítulo ({itemsInActiveChapter.length})
              </div>

              {itemsInActiveChapter.length === 0 ? (
                <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-lg text-xs text-slate-500 italic">
                  Este capítulo desarrolla el marco discursivo, análisis de fuentes clínicas o transiciones conceptuales intermedias que sostienen los axiomas centrales de los Capítulos 1, 5 y Extensión E.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {itemsInActiveChapter.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectItem(item.id)}
                      className="p-3 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-lg cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-400">{item.id}</span>
                          <span className="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono capitalize">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.statement || item.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Metapsicología Freudiana & Flujo de Ricci</span>
            <span className="font-mono">Tesis 2.0 (2026)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
