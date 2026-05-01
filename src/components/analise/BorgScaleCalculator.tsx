/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, Info } from 'lucide-react';

const BORG_CR10 = [
  { value: 0, label: 'Repouso total', color: 'bg-blue-500' },
  { value: 0.5, label: 'Extremamente leve', color: 'bg-blue-400' },
  { value: 1, label: 'Muito leve', color: 'bg-green-400' },
  { value: 2, label: 'Leve', color: 'bg-green-500' },
  { value: 3, label: 'Moderado', color: 'bg-yellow-400' },
  { value: 4, label: 'Um pouco pesado', color: 'bg-yellow-500' },
  { value: 5, label: 'Pesado', color: 'bg-orange-500' },
  { value: 7, label: 'Muito pesado', color: 'bg-red-500' },
  { value: 10, label: 'Exaustivo (Máximo)', color: 'bg-red-700' },
];

export const BorgScaleCalculator = ({ onSave }: { onSave?: (res: any) => void }) => {
  const [inventoryDetails, setInventoryDetails] = React.useState({ sector: '', task: '' });
  const [selected, setSelected] = React.useState<number | null>(null);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h4 className="text-lg font-bold text-slate-800 mb-2">Escala de Borg (CR10)</h4>
        <p className="text-xs text-slate-500 font-medium">Percepção Subjetiva de Esforço Físico e Fadiga.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          {BORG_CR10.map((item) => (
            <button
              key={item.value}
              onClick={() => setSelected(item.value)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                selected === item.value 
                  ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/10' 
                  : 'border-slate-100 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs ${item.color}`}>
                  {item.value}
                </div>
                <span className={`text-xs font-bold ${selected === item.value ? 'text-blue-900' : 'text-slate-600'}`}>
                  {item.label}
                </span>
              </div>
              {selected === item.value && (
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col items-center justify-center text-center sticky top-4 h-fit shadow-2xl">
           <Activity className="text-blue-500 mb-6" size={56} />
           {selected !== null ? (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Esforço Percebido</p>
                  <h5 className="text-4xl font-black text-white">{selected}</h5>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-xs font-medium text-slate-300 leading-relaxed italic">
                     "{BORG_CR10.find(i => i.value === selected)?.label}"
                   </p>
                </div>

                <div className="w-full space-y-3 pt-4 border-t border-white/10 text-left">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Setor / Local</label>
                      <input 
                        type="text" 
                        value={inventoryDetails.sector}
                        onChange={(e) => setInventoryDetails({...inventoryDetails, sector: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] font-bold text-white focus:bg-white/10 outline-none transition-all"
                        placeholder="Ex: Administração"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Atividade</label>
                      <input 
                        type="text" 
                        value={inventoryDetails.task}
                        onChange={(e) => setInventoryDetails({...inventoryDetails, task: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] font-bold text-white focus:bg-white/10 outline-none transition-all"
                        placeholder="Ex: Tela/Teclado"
                      />
                   </div>
                </div>

                <button 
                  onClick={() => onSave?.({
                    sector: inventoryDetails.sector || 'Geral',
                    task: inventoryDetails.task || 'Avaliação Borg',
                    score: selected,
                    priority: selected! >= 5 ? 'Crítica' : selected! >= 3 ? 'Alta' : 'Média',
                    risk: 'Percepção de Esforço / Fadiga'
                  })}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                >
                  Salvar no Inventário
                </button>
             </div>
           ) : (
             <div className="opacity-40 space-y-4">
               <Info size={32} className="mx-auto mb-2" />
               <p className="text-xs font-bold uppercase tracking-widest">Selecione um nível de esforço na escala ao lado</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
