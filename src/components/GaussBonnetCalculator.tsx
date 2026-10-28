import React, { useState } from 'react';
import { Calculator, ShieldAlert, ArrowRight, RotateCcw } from 'lucide-react';

interface GaussBonnetCalculatorProps {
  onSelectItem?: (id: string) => void;
}

export const GaussBonnetCalculator: React.FC<GaussBonnetCalculatorProps> = ({ onSelectItem }) => {
  // Domain radius R
  const [domainRadius, setDomainRadius] = useState<number>(2.0);
  // Average Gaussian curvature inside trauma region K
  const [traumaCurvatureK, setTraumaCurvatureK] = useState<number>(0.85);

  // Area of disk approximation: Area = pi * R^2
  const areaD = Math.PI * Math.pow(domainRadius, 2);
  // Perimeter: Perimeter = 2 * pi * R
  const perimeter = 2 * Math.PI * domainRadius;

  // Topological constant for topological disk: 2 * pi * chi(D) = 2 * pi * 1 = 6.28318...
  const targetEulerIntegral = 2 * Math.PI;

  // Integral of Gaussian curvature over D: int_D K dA
  const integralK = traumaCurvatureK * areaD;

  // Required geodesic curvature integral to satisfy Gauss-Bonnet:
  // int_{partial D} k_g ds = 2*pi - int_D K dA
  const requiredBoundaryIntegral = targetEulerIntegral - integralK;

  // Average geodesic curvature on boundary k_g:
  const avgGeodesicCurvature = requiredBoundaryIntegral / perimeter;

  // Defense psychic expense metric (arbitrary energy scale based on Gegenbesetzung):
  // Expense is proportional to deviation from flat Euclidean baseline (K=0, kg = 1/R)
  const psychicExpense = Math.max(0, Math.abs(integralK) * 2.5 + Math.abs(requiredBoundaryIntegral) * 1.5);

  const handleReset = () => {
    setDomainRadius(2.0);
    setTraumaCurvatureK(0.85);
  };

  return (
    <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Calculadora de Gasto de la Defensa (Teorema de Gauss-Bonnet)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Formalización de la contrainvestidura (Definición D10): la curvatura de trauma y la tensión perimetral están acopladas topológicamente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onSelectItem && (
            <button
              onClick={() => onSelectItem('D10')}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline"
            >
              Ver D10
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-md transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Mathematical Theorem Banner */}
      <div className="mt-4 p-3 bg-slate-900/70 border border-slate-800 rounded-lg text-center">
        <span className="font-mono text-xs text-cyan-300 font-semibold tracking-wide">
          ∫_D K dA + ∫_{'\\partial D'} k_g ds = 2π χ(D) = 2π (≈ 6.2832 rad)
        </span>
      </div>

      {/* Parameter Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="text-slate-300 font-medium">Curvatura de Trauma K (Contrainvestidura Yoica):</label>
            <span className="font-mono text-cyan-400 tabular-nums">{traumaCurvatureK.toFixed(3)} rad/m²</span>
          </div>
          <input
            type="range"
            min="-0.5"
            max="1.5"
            step="0.05"
            value={traumaCurvatureK}
            onChange={(e) => setTraumaCurvatureK(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>-0.5 (Hiperbólica)</span>
            <span>0.0 (Euclídea / Neutra)</span>
            <span>+1.5 (Singularidad / Hipertensión)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="text-slate-300 font-medium">Radio del Dominio Psíquico R (Alcance de la Represión):</label>
            <span className="font-mono text-cyan-400 tabular-nums">{domainRadius.toFixed(2)} unidades</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="3.5"
            step="0.1"
            value={domainRadius}
            onChange={(e) => setDomainRadius(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>0.8 (Focalizado)</span>
            <span>2.0 (Estándar)</span>
            <span>3.5 (Extenso / Sistémico)</span>
          </div>
        </div>
      </div>

      {/* Calculated Physical & Metapsychological Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Integral de Curvatura Interior ∫_D K dA
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-1 tabular-nums">
            {integralK.toFixed(3)} <span className="text-xs font-normal text-slate-400">rad</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Gasto interno concentrado en el complejo reprimido
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Curvatura Geodésica de Borde k_g
          </div>
          <div className={`text-2xl font-bold font-mono mt-1 tabular-nums ${avgGeodesicCurvature < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {avgGeodesicCurvature.toFixed(3)} <span className="text-xs font-normal text-slate-400">rad/u</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {avgGeodesicCurvature < 0
              ? 'Tensión perimetral negativa: riesgo de colapso de la barrera de angustia'
              : 'Barrera de contención estable'}
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Gasto Energético Total de la Represión
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {psychicExpense.toFixed(1)} <span className="text-xs font-normal text-slate-400">Q_def</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Energía sustraída a la conciencia (Freud, 1915)
          </div>
        </div>
      </div>

      {/* Metapsychological conclusion note */}
      <div className="mt-5 p-3.5 bg-cyan-950/20 border border-cyan-800/40 rounded-lg flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-cyan-300">Corolario Clínico:</strong> Debido a que el invariante de Euler fija la suma en 2π, cualquier intento del Yo por aumentar la represión local ($K \gg 0$) obliga a la barrera limítrofe $k_g$ a comprimirse o deformarse violentamente. Si la curvatura total interior excede $2\pi$, la frontera experimenta una inflexión patológica (retorno de lo reprimido como síntoma neurótico).
        </div>
      </div>
    </div>
  );
};
