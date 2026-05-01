/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Weight, Info, AlertCircle, Settings } from 'lucide-react';
import { ActionPlan5W2H } from './ActionPlan5W2H';

export const NioshCalculator = ({ onSave }: { onSave?: (res: any) => void }) => {
  const [isExpertMode, setIsExpertMode] = React.useState(false);
  const [inventoryDetails, setInventoryDetails] = React.useState({ sector: '', task: '' });
  const [input, setInput] = React.useState({
    lc: 23, // Constante de carga (23kg padrão)
    h: 30,  // Distância horizontal
    v: 75,  // Distância vertical
    d: 50,  // Distância de percurso
    a: 0,   // Ângulo de assimetria
    f: 2,   // Frequência (levantamentos/min)
    dur: 1, // Duração (1: <1h, 2: 1-2h, 3: 2-8h)
    c: 1    // Acoplamento (1: Bom, 2: Razoável, 3: Pobre)
  });

  const calculateNiosh = () => {
    // Multiplicadores (Simplificado conforme NHO 11 / NIOSH 91)
    const hm = 25 / input.h;
    const vm = 1 - 0.003 * Math.abs(input.v - 75);
    const dm = 0.82 + (4.5 / input.d);
    const am = 1 - 0.0032 * input.a;
    
    // FM e CM (Simplificados)
    const fm = input.f > 10 ? 0.2 : 1 - (0.05 * input.f);
    const cm = input.c === 1 ? 1.0 : input.c === 2 ? 0.95 : 0.90;

    const lpr = input.lc * hm * vm * dm * am * fm * cm;
    const actualLoad = 15; // Exemplo de carga real sendo manipulada
    const il = actualLoad / lpr;

    return { 
      lpr: lpr.toFixed(2), 
      il: parseFloat(il.toFixed(2)),
      status: il > 1.0 ? 'Risco' : 'Seguro',
      color: il > 1.0 ? 'text-red-600' : 'text-green-600',
      bg: il > 1.0 ? 'bg-red-50' : 'bg-green-50'
    };
  };

  const result = calculateNiosh();

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
            {isExpertMode && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl md:col-span-2">
                 <label className="block text-[10px] font-bold text-blue-600 uppercase mb-2 tracking-widest">Constante de Carga (LC - kg)</label>
                 <input 
                   type="number" 
                   value={input.lc} 
                   onChange={(e) => setInput({...input, lc: Number(e.target.value)})}
                   className="w-full bg-white border border-blue-200 rounded-lg p-2 text-xs font-black text-blue-900"
                 />
                 <p className="text-[9px] text-blue-400 mt-2">Valor padrão internacional: 23kg. Altere apenas caso a norma regional ou política da empresa exija.</p>
              </div>
            )}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
               <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Distância Horizontal (H) cm</label>
               <input 
                 type="number" 
                 value={input.h} 
                 onChange={(e) => setInput({...input, h: Number(e.target.value)})}
                 className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
               />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
               <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Altura Vertical (V) cm</label>
               <input 
                 type="number" 
                 value={input.v} 
                 onChange={(e) => setInput({...input, v: Number(e.target.value)})}
                 className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
               />
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
          <Weight className="text-slate-100 absolute -bottom-4 -right-4" size={100} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Índice de Levantamento (IL)</span>
          <div className={`text-6xl font-black mb-4 tabular-nums ${result.color}`}>{result.il}</div>
          
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-6 ${result.bg} ${result.color}`}>
            {result.status.toUpperCase()}
          </div>

          <div className="w-full space-y-3 mb-6">
             <div className="text-left space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Setor / Local</label>
                <input 
                  type="text" 
                  value={inventoryDetails.sector}
                  onChange={(e) => setInventoryDetails({...inventoryDetails, sector: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-[10px] font-bold"
                  placeholder="Ex: Armazém A"
                />
             </div>
             <div className="text-left space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Atividade Analisada</label>
                <input 
                  type="text" 
                  value={inventoryDetails.task}
                  onChange={(e) => setInventoryDetails({...inventoryDetails, task: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-[10px] font-bold"
                  placeholder="Ex: Abastecimento de Racks"
                />
             </div>
          </div>

          <button 
             onClick={() => onSave?.({
               sector: inventoryDetails.sector || 'Geral',
               task: inventoryDetails.task || 'Levantamento de Carga',
               score: result.il,
               priority: result.il > 1 ? 'Crítica' : 'Média'
             })}
             className="w-full bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
             Salvar no Inventário
          </button>

          <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg text-left border border-blue-100">
             <AlertCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
             <p className="text-[9px] text-blue-700 leading-relaxed font-medium">
               Carga Limite Sugerida (LPR): <span className="font-bold">{result.lpr}kg</span>
             </p>
          </div>
        </div>
      </div>

      {result.il > 1.0 && (
         <div className="animate-in slide-in-from-top-4 duration-500">
            <ActionPlan5W2H riskType="NIOSH" intensity="Crítico" />
         </div>
      )}
    </div>
  );
};

