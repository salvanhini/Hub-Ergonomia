/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, Info, Settings } from 'lucide-react';
import { ActionPlan5W2H } from './ActionPlan5W2H';

export const MooreGargCalculator = ({ onSave }: { onSave?: (res: any) => void }) => {
  const [isExpertMode, setIsExpertMode] = React.useState(false);
  const [inventoryDetails, setInventoryDetails] = React.useState({ sector: '', task: '' });
  const [input, setInput] = React.useState({
    intensity: 1,
    duration: 1,
    frequency: 1,
    posture: 1,
    speed: 1,
    perDay: 1,
  });

  // Multiplicadores Moore & Garg (Editáveis no Modo Técnico)
  const [multipliers, setMultipliers] = React.useState({
    intensity: [0, 1, 3, 6, 9, 13], 
    duration: [0, 0.5, 1.0, 1.5, 2.0, 3.0],
    frequency: [0, 0.5, 1.0, 1.5, 2.0, 3.0],
    posture: [0, 1.0, 1.0, 1.5, 2.0, 3.0],
    speed: [0, 1.0, 1.0, 1.0, 1.5, 2.0],
    perDay: [0, 0.25, 0.5, 0.75, 1.0, 1.5]
  });

  const calculateStrainIndex = () => {
    const si = multipliers.intensity[input.intensity] * 
               multipliers.duration[input.duration] * 
               multipliers.frequency[input.frequency] * 
               multipliers.posture[input.posture] * 
               multipliers.speed[input.speed] * 
               multipliers.perDay[input.perDay];
    
    let risk = "Indeterminado";
    let color = "text-slate-400";
    let bg = "bg-slate-100";

    if (si <= 3) { risk = "Trabalho Seguro"; color = "text-green-600"; bg = "bg-green-50"; }
    else if (si <= 5) { risk = "Risco Incerto"; color = "text-amber-600"; bg = "bg-amber-50"; }
    else if (si <= 7) { risk = "Trabalho de Risco"; color = "text-orange-600"; bg = "bg-orange-50"; }
    else { risk = "Trabalho de Alto Risco"; color = "text-red-600"; bg = "bg-red-50"; }

    return { si: parseFloat(si.toFixed(2)), risk, color, bg };
  };

  const result = calculateStrainIndex();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-1">
             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Variáveis de Entrada</h5>
             <button 
               onClick={() => setIsExpertMode(!isExpertMode)}
               className={`flex items-center space-x-1 px-2 py-1 rounded text-[9px] font-bold transition-all ${
                 isExpertMode ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
               }`}
             >
               <Settings size={12} />
               <span>{isExpertMode ? 'Expert Mode: On' : 'Modo Técnico'}</span>
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
               <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Intensidade do Esforço (Borg)</label>
               <select 
                 value={input.intensity} 
                 onChange={(e) => setInput({...input, intensity: Number(e.target.value)})}
                 className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
               >
                 <option value={1}>Leve (Mult: {multipliers.intensity[1]})</option>
                 <option value={2}>Um pouco pesado (Mult: {multipliers.intensity[2]})</option>
                 <option value={3}>Pesado (Mult: {multipliers.intensity[3]})</option>
                 <option value={4}>Muito pesado (Mult: {multipliers.intensity[4]})</option>
                 <option value={5}>Próximo ao máximo (Mult: {multipliers.intensity[5]})</option>
               </select>
               {isExpertMode && (
                 <input 
                   type="number" 
                   value={multipliers.intensity[input.intensity]} 
                   onChange={(e) => {
                     const newMults = [...multipliers.intensity];
                     newMults[input.intensity] = Number(e.target.value);
                     setMultipliers({...multipliers, intensity: newMults});
                   }}
                   className="mt-2 w-full bg-blue-50 border border-blue-200 rounded p-1.5 text-[10px] font-black text-blue-700"
                 />
               )}
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
               <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Duração (% ciclo)</label>
               <select 
                 value={input.duration} 
                 onChange={(e) => setInput({...input, duration: Number(e.target.value)})}
                 className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
               >
                 <option value={1}>&lt; 10% (Mult: {multipliers.duration[1]})</option>
                 <option value={2}>10% - 29% (Mult: {multipliers.duration[2]})</option>
                 <option value={3}>30% - 49% (Mult: {multipliers.duration[3]})</option>
                 <option value={4}>50% - 79% (Mult: {multipliers.duration[4]})</option>
                 <option value={5}>&gt; 80% (Mult: {multipliers.duration[5]})</option>
               </select>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
               <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Frequência (esforços/min)</label>
               <select 
                 value={input.frequency} 
                 onChange={(e) => setInput({...input, frequency: Number(e.target.value)})}
                 className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
               >
                 <option value={1}>&lt; 4 (Mult: {multipliers.frequency[1]})</option>
                 <option value={2}>4 - 8 (Mult: {multipliers.frequency[2]})</option>
                 <option value={3}>9 - 14 (Mult: {multipliers.frequency[3]})</option>
                 <option value={4}>15 - 19 (Mult: {multipliers.frequency[4]})</option>
                 <option value={5}>&gt; 20 (Mult: {multipliers.frequency[5]})</option>
               </select>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
               <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Postura Mão/Punho</label>
               <select 
                 value={input.posture} 
                 onChange={(e) => setInput({...input, posture: Number(e.target.value)})}
                 className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
               >
                 <option value={1}>Muito boa (Mult: {multipliers.posture[1]})</option>
                 <option value={2}>Boa (Mult: {multipliers.posture[2]})</option>
                 <option value={3}>Razoável (Mult: {multipliers.posture[3]})</option>
                 <option value={4}>Ruim (Mult: {multipliers.posture[4]})</option>
                 <option value={5}>Muito Ruim (Mult: {multipliers.posture[5]})</option>
               </select>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Strain Index (SI)</span>
          <div className={`text-6xl font-black mb-4 tabular-nums ${result.color}`}>{result.si}</div>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-4 ${result.bg} ${result.color}`}>
            {result.risk}
          </div>

          <div className="w-full space-y-3 mb-4 text-left border-t border-slate-100 pt-4">
             <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Setor / Local</label>
                <input 
                  type="text" 
                  value={inventoryDetails.sector}
                  onChange={(e) => setInventoryDetails({...inventoryDetails, sector: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-[10px] font-bold"
                  placeholder="Ex: Montagem"
                />
             </div>
             <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Atividade</label>
                <input 
                  type="text" 
                  value={inventoryDetails.task}
                  onChange={(e) => setInventoryDetails({...inventoryDetails, task: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-[10px] font-bold"
                  placeholder="Ex: Parafusamento repetitivo"
                />
             </div>
          </div>

          <button 
             onClick={() => onSave?.({
               sector: inventoryDetails.sector || 'Geral',
               task: inventoryDetails.task || 'Análise de Mão/Punho',
               score: result.si,
               priority: result.si > 7 ? 'Crítica' : 'Média',
               risk: 'Repetitividade / Esforço Mão e Punho'
             })}
             className="w-full bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mb-4"
          >
             Gravar no Inventário
          </button>

          <div className="flex items-start space-x-2 p-3 bg-slate-50 rounded-lg text-left">
             <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
               Valores de SI &gt; 7.0 indicam risco biomecânico significativo.
             </p>
          </div>
        </div>
      </div>

      {result.si > 7 && (
         <div className="animate-in slide-in-from-top-4 duration-500">
            <ActionPlan5W2H riskType="Moore & Garg" intensity="Alto Risco" />
         </div>
      )}
    </div>
  );
};
