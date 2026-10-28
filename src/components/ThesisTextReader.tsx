import React, { useState } from 'react';
import { BookOpen, Search, ChevronRight, FileText, Compass, ExternalLink } from 'lucide-react';

interface ChapterSection {
  id: string;
  title: string;
  summary: string;
  highlights: string[];
}

const THESIS_CHAPTERS_FULL: ChapterSection[] = [
  {
    id: 'cap1',
    title: 'Capítulo 1. Introducción y axiomas de método',
    summary: 'Planteo del problema, hipótesis central, alcance y límites declarados (analogía formal vs identidad ontológica), por qué Freud, Poincaré y Perelman. Enunciado de los 7 axiomas de método (M1 a M7). Sobre el texto de partida y el Horn Torus.',
    highlights: [
      'M1: Analogía, no identidad. Ninguna afirmación "la psique es una variedad" pertenece a la tesis.',
      'M2: Primacía de las fuentes primarias (GW de Freud, Imago, esquema L de Lacan).',
      'M3: Separación de niveles de dinámica (pulsión en S vs flujo de Ricci en Met(M)).',
      'M4: El Icc no fluye; el parámetro t pertenece a la contrainvestidura en Pcc/Cc.',
      'M5: La fantasía primaria no es operable por cirugía (solo traumas reprimidos recuperables).',
      'M6: Contingencia del análisis como posible no-unicidad del problema inverso borde → interior.',
      'M7: Etiquetado de incertidumbre: [VT], [VW], [M], [P], [A].'
    ]
  },
  {
    id: 'cap2',
    title: 'Capítulo 2. Freud: el Proyecto y el aparato psíquico',
    summary: 'Formalización mínima a partir del Entwurf einer Psychologie (1895), las cartas a Fliess y Zur Auffassung der Aphasien (1891). Reconstrucción de la economía freudiana.',
    highlights: [
      'Principio de inercia neuronal (tendencia a Q = 0) y principio de constancia.',
      'Bahnung (facilitación) y barreras de contacto: la memoria como red ponderada de relaciones.',
      'Das Ding y el Nebenmensch: resto irreductible del prójimo como soporte del Real (superficie S).',
      'Carta 52: transcripciones sucesivas, ligazón del Vb a representaciones de palabra y exclusión conciencia/memoria.',
      'Nachträglichkeit: saltos de carga posteriores con ganancia g(t) ≥ 1.',
      'Seitenbesetzung (investidura lateral) como antecedente del gasto (Aufwand) de la contrainvestidura.'
    ]
  },
  {
    id: 'cap3',
    title: 'Capítulo 3. Poincaré: Analysis Situs, la conjetura y la invención',
    summary: 'El grupo fundamental π₁(M), la conjetura de caracterización de la 3-esfera, los ciclos límite en dinámica cualitativa y el testimonio del trabajo inconsciente en la invención matemática.',
    highlights: [
      'Analysis Situs y grupo fundamental: lenguaje de lazos contráctiles y no contráctiles.',
      'Ciclos límite de Poincaré: órbitas periódicas aisladas estables que modelan el circuito C_θ de la fantasía.',
      'La invención matemática (1908): testimonio de Poincaré sobre el trabajo inconsciente de incubación (Hadamard).',
      'S³ como horizonte ideal simplemente conexo sin resto de lazos.'
    ]
  },
  {
    id: 'cap4',
    title: 'Capítulo 4. Flujo de Ricci y entropía de Perelman',
    summary: 'Ecuación ∂g/∂t = -2 Ric(g), reducción a dimensión 2 (∂g/∂t = -R g, ∂K/∂t = ΔK + 2K²), entropía monótona W de Perelman, cirugía de cuellos, extinción en tiempo finito (Colding-Minicozzi), flujo con borde (Gianniotis) y geometría del Horn Torus.',
    highlights: [
      'Ausencia de órbitas periódicas en el espacio de métricas: obliga a separar el nivel pulsional.',
      'Cirugía de Perelman: excisión de cuellos singulares cilíndricos y tapado con casquetes esféricos.',
      'Extinción en tiempo finito: en 3D (S² × S¹), el flujo sin borde colapsa el espacio; el Icc como borde fijo evita el colapso.',
      'Geometría del Horn Torus: familia T_r con r ≤ 1, cierre en la cúspide c = (0,0,0) con s ≈ z²/2.'
    ]
  },
  {
    id: 'cap5',
    title: 'Capítulo 5. La analogía axiomática (Núcleo formal)',
    summary: 'Decisiones de modelado 1 a 18, diez axiomas canónicos, doce definiciones, tres proposiciones. Diccionario Freud-geometría. Contrainvestidura con borde fijo y gasto de la defensa (Gauss-Bonnet). Extensión E: pulsiones parciales, marcas S-I, circuito invocante y extensión tridimensional S² × S¹.',
    highlights: [
      'Definición 1: Ding/Real = Superficie Horn Torus S = T₁ con cúspide c = (0,0,0).',
      'Definición 5 y 6: Núcleo n como sumidero con ciclo límite C_θ a radio de angustia δ con pared rígida k_g = 1/δ.',
      'Axioma 9: La cúspide c como puerto con dos cuernos: B⁺ (oído, dato Dirichlet u) y B⁻ (voz, flujo normal y).',
      'Proposición 1, 2 y 3: Indestructibilidad de C_θ, conservación de curvatura por Gauss-Bonnet y cirugía que no toca la fantasía.',
      'Extensión 5.7: 4 pulsiones parciales (Oral, Anal, Escópica, Invocante). El circuito invocante C_inv atraviesa el orificio por c generando π₁(S) ≅ ℤ.',
      'Extensión 5.8: M = S² × S¹; disociación espontánea; la 3-esfera S³ como ideal analítico inalcanzable.'
    ]
  },
  {
    id: 'cap6',
    title: 'Capítulo 6. Cirugía, fantasía y las tres fases de «Pegan a un niño»',
    summary: 'Corrección epistemológica de Freud (1919). Las fases 1 y 2 son construcciones teóricas del análisis, nunca recuerdos recuperables. Solo la fase 3 es la forma consciente manifiesta. La cirugía opera solo sobre traumas recuperables V_T.',
    highlights: [
      'Fase 1 ("Mi padre pega al niño"): Construcción de Freud, fija el circuito de repetición.',
      'Fase 2 ("Yo soy azotado por el padre"): Construcción radical nunca consciente = Marca primaria n + C_θ.',
      'Fase 3 ("Pegan a un niño"): Única forma consciente traída por el paciente = Salida observable y(t) en la cúspide.',
      'La construcción analítica como resolución del problema inverso de Calderón (borde → interior).'
    ]
  },
  {
    id: 'cap7',
    title: 'Capítulo 7. Límites y objeciones',
    summary: 'Inventario de 18 tensiones internas del modelo clasificadas con estado: resuelta, parcial, abierta o postulada. Bloques A (geometría), B (tiempo/pulsión), C (cirugía/clínica), D (fuentes/alcance).',
    highlights: [
      'A1: Singularidad del Horn Torus: Resuelta trabajando en T_r o S \\ {c}.',
      'B1 y B2: Atemporalidad vs flujo y repetición vs monotonicidad: Resueltas por separación de niveles.',
      'C1 y C4: Fases 1 y 2 como construcciones e indestructibilidad de C_θ: Resueltas.',
      'A3 y A4: Compatibilidad fina con Gianniotis y existencia global 3D: Declaradas abiertas sin ocultarlas.',
      'D4: No pretende predecir clínica cuantitativa ni sustituir la escucha: Alcance deliberado.'
    ]
  },
  {
    id: 'cap8',
    title: 'Capítulo 8. Conclusiones y balance',
    summary: 'Qué se sostuvo (diccionario consistente, proposiciones demostradas dentro del formalismo, lectura rigurosa de fuentes), qué quedó abierto y qué se excluyó de propósito.',
    highlights: [
      'Lo que permanece al apagar el flujo de la defensa no es S³: es un espacio con resto (con lazo, con núcleo, con marcas).',
      'El modelo no promete la integración total, sino un lenguaje riguroso donde esa imposibilidad se enuncia sin metáforas vagas.',
      'Apéndices de Glosario Alemán-Español y Notación Matemática formal.'
    ]
  }
];

export const ThesisTextReader: React.FC<{ onSimulateHornTorus?: () => void }> = ({ onSimulateHornTorus }) => {
  const [selectedCapId, setSelectedCapId] = useState<string>('cap1');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const currentCap = THESIS_CHAPTERS_FULL.find((c) => c.id === selectedCapId) || THESIS_CHAPTERS_FULL[0];

  return (
    <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg md:text-xl font-display font-bold text-slate-100">
              Tesis Doctoral: Edición Unificada (Octubre 2026)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Lectura capítulo por capítulo del texto maestro oficial: «Flujo de Ricci y metapsicología freudiana: un modelo analógico a partir de Poincaré y Perelman».
          </p>
        </div>

        {onSimulateHornTorus && (
          <button
            onClick={onSimulateHornTorus}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/50 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Ver Horn Torus 3D</span>
          </button>
        )}
      </div>

      {/* Chapter Selection Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {THESIS_CHAPTERS_FULL.map((ch, idx) => {
          const isSelected = ch.id === selectedCapId;
          return (
            <button
              key={ch.id}
              onClick={() => setSelectedCapId(ch.id)}
              className={`p-2.5 rounded-lg text-left transition-all text-xs flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800 border border-cyan-500/50 text-slate-100 shadow-sm'
                  : 'bg-slate-900/50 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="font-mono text-cyan-400 font-bold text-[11px]">Cap. {idx + 1}</span>
              <span className="truncate mt-1 text-[11px] font-medium">{ch.title.split('. ')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Chapter Reader Panel */}
      <div className="p-6 bg-[#080b11] border border-slate-800 rounded-xl space-y-5">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            {currentCap.id.toUpperCase()} // DESARROLLO TEXTUAL
          </span>
          <h3 className="text-xl font-display font-bold text-slate-100 mt-1">
            {currentCap.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2.5">
            {currentCap.summary}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Tesis Principales y Proposiciones del Capítulo
          </div>
          <div className="space-y-2">
            {currentCap.highlights.map((h, i) => (
              <div
                key={i}
                className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-lg text-xs text-slate-300 leading-relaxed flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Horn Torus Special Box if Chapter 1, 4 or 5 is selected */}
        {(currentCap.id === 'cap1' || currentCap.id === 'cap4' || currentCap.id === 'cap5') && (
          <div className="p-4 bg-cyan-950/20 border border-cyan-800/40 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 font-mono text-cyan-300 font-semibold">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>El Horn Torus en este capítulo:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              El <strong>Horn Torus</strong> ($R = r = 1$) es la superficie donde el agujero del toro se cierra completamente en una cúspide singular $c = (0,0,0)$. En este punto se tocan dos cuernos agudos: el cuerno superior $B^+$ (entrada de lo oído / dato Dirichlet) y el cuerno inferior $B^-$ (salida de lo vocalizado / flujo de Neumann). En la variante A adoptada, el núcleo de la fantasía $n$ vive fuera de la cúspide ($n \neq c$) y está rodeado por la pared rígida de angustia $k_g = 1/\delta$.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
