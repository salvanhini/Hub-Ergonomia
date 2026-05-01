/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, ShieldAlert } from 'lucide-react';

const REGIONS = [
  { id: 'neck', name: 'Pescoço' },
  { id: 'shoulders', name: 'Ombros' },
  { id: 'upper_back', name: 'Coluna Dorsal' },
  { id: 'middle_back', name: 'Coluna Lombar' },
  { id: 'arms', name: 'Braços / Antebraços' },
  { id: 'wrists', name: 'Punhos / Mãos' },
  { id: 'hips', name: 'Quadril / Coxas' },
  { id: 'knees', name: 'Joelhos' },
  { id: 'ankles', name: 'Tornozelos / Pés' },
];

const INTENSITY_COLORS = [
  'bg-slate-100 text-slate-400', // 0
  'bg-green-100 text-green-700', // 1
  'bg-yellow-100 text-yellow-700', // 2
  'bg-orange-100 text-orange-700', // 3
  'bg-red-100 text-red-700', // 4
  'bg-red-600 text-white', // 5
];

export const CorlettDiagram = () => {
  const [data, setData] = React.useState<Record<string, number>>({});

  const setIntensity = (id: string, val: number) => {
    setData(prev => ({ ...prev, [id]: val }));
  };

  const totalDiscomfort = Object.values(data).reduce((acc: number, curr) => acc + (curr as number), 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center">
        <h4 className="text-lg font-black text-slate-800 mb-2">Diagrama de Corlett & Bishop</h4>
        <p className="text-xs text-slate-500 font-medium">Auto-análise de percepção de desconforto/dor corporal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-4">
           {REGIONS.map((region) => (
             <div key={region.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 transition-all shadow-sm">
                <span className="text-xs font-bold text-slate-700">{region.name}</span>
                <div className="flex items-center space-x-1">
                   {[0, 1, 2, 3, 4, 5].map((val) => (
                     <button
                       key={val}
                       onClick={() => setIntensity(region.id, val)}
                       className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                         data[region.id] === val 
                           ? INTENSITY_COLORS[val] + ' shadow-md scale-110' 
                           : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                       }`}
                     >
                       {val}
                     </button>
                   ))}
                </div>
             </div>
           ))}
        </div>

        <div className="md:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
              <User className="text-blue-500/20 absolute -bottom-10 -left-10" size={160} />
              <ShieldAlert className="text-blue-500 mb-6" size={48} />
              
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Índice Global de Desconforto</p>
              <h5 className="text-5xl font-black text-white mb-6 tabular-nums">{totalDiscomfort}</h5>
              
              <div className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Focos Críticos:</p>
                 <div className="space-y-2">
                    {Object.entries(data)
                      .filter(([_, val]) => (val as number) >= 4)
                      .map(([id, _]) => (
                        <div key={id} className="flex items-center space-x-2">
                           <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                           <span className="text-[10px] font-bold text-slate-200">{REGIONS.find(r => r.id === id)?.name}</span>
                        </div>
                      ))}
                    {Object.entries(data).filter(([_, val]) => (val as number) >= 4).length === 0 && (
                      <p className="text-[10px] text-slate-500 italic">Nenhum ponto crítico identificado.</p>
                    )}
                 </div>
              </div>

              <button className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-blue-600/30">
                Finalizar Diagrama
              </button>
           </div>

           <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
              <p className="text-[10px] font-medium text-amber-800 leading-relaxed italic">
                * Escala de 0 (Nenhum desconforto) a 5 (Desconforto insuportável).
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
