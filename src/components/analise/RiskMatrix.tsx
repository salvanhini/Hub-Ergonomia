/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

type Level = 1 | 2 | 3 | 4 | 5;

interface RiskMatrixProps {
  onCalculate?: (score: number, level: string) => void;
}

const matrix = [
  // Probabilidade -> Severidade
  // S1, S2, S3, S4, S5
  [1, 2, 3, 4, 5], // P1
  [2, 4, 6, 8, 10], // P2
  [3, 6, 9, 12, 15], // P3
  [4, 8, 12, 16, 20], // P4
  [5, 10, 15, 20, 25], // P5
];

const getLevelInfo = (score: number) => {
  if (score <= 5) return { label: 'Trivial', color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' };
  if (score <= 10) return { label: 'Moderado', color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50' };
  if (score <= 15) return { label: 'Sério', color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' };
  return { label: 'Crítico', color: 'bg-red-600', text: 'text-red-700', bg: 'bg-red-50' };
};

export const RiskMatrix = ({ onSave, onCalculate }: { onSave?: (res: any) => void, onCalculate?: (score: number, level: string) => void }) => {
  const [inventoryDetails, setInventoryDetails] = React.useState({ sector: '', task: '' });
  const [prob, setProb] = React.useState<Level>(1);
  const [sev, setSev] = React.useState<Level>(1);

  const score = matrix[prob - 1][sev - 1];
  const info = getLevelInfo(score);

  React.useEffect(() => {
    onCalculate?.(score, info.label);
  }, [score, info.label, onCalculate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Probabilidade (P)</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setProb(val as Level)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    prob === val 
                      ? 'bg-slate-900 text-white shadow-lg scale-105' 
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-slate-400 mt-2 italic">
              {prob === 1 && 'Raramente ocorre'}
              {prob === 2 && 'Pouco provável'}
              {prob === 3 && 'Provável'}
              {prob === 4 && 'Muito provável'}
              {prob === 5 && 'Ocorrência quase certa'}
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Severidade (S)</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setSev(val as Level)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    sev === val 
                      ? 'bg-slate-900 text-white shadow-lg scale-105' 
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-slate-400 mt-2 italic">
              {sev === 1 && 'Sem lesão / Danos mínimos'}
              {sev === 2 && 'Lesão leve / Reversível'}
              {sev === 3 && 'Lesão moderada / Afastamento'}
              {sev === 4 && 'Lesão grave / Incapacidade parcial'}
              {sev === 5 && 'Fatalidade / Incapacidade total'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50" />
          
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Matrix Score (P x S)</span>
          <div className={`text-7xl font-black mb-4 tabular-nums ${info.text}`}>{score}</div>
          
          <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${info.bg} ${info.text} border border-current/10 shadow-sm`}>
            Nível: {info.label}
          </div>

          <div className="w-full space-y-3 mt-6 pt-6 border-t border-slate-100 text-left px-4">
             <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Setor / Local</label>
                <input 
                  type="text" 
                  value={inventoryDetails.sector}
                  onChange={(e) => setInventoryDetails({...inventoryDetails, sector: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-[10px] font-bold"
                  placeholder="Ex: Logística"
                />
             </div>
             <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Atividade</label>
                <input 
                  type="text" 
                  value={inventoryDetails.task}
                  onChange={(e) => setInventoryDetails({...inventoryDetails, task: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-[10px] font-bold"
                  placeholder="Ex: Movimentação de Cargas"
                />
             </div>
          </div>

          <button 
             onClick={() => onSave?.({
               sector: inventoryDetails.sector || 'Geral',
               task: inventoryDetails.task || 'Matriz de Risco',
               score: score,
               priority: info.label === 'Crítico' ? 'Crítica' : info.label === 'Sério' ? 'Alta' : 'Média',
               risk: 'Risco Ocupacional (Ergonômico)'
             })}
             className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95 mx-4"
          >
             Salvar no Inventário
          </button>

          <div className="mt-8 grid grid-cols-5 gap-1 w-full max-w-[200px]">
            {matrix.map((row, rIdx) => (
              row.map((cell, cIdx) => {
                const cellInfo = getLevelInfo(cell);
                const isActive = prob === rIdx + 1 && sev === cIdx + 1;
                return (
                  <div 
                    key={`${rIdx}-${cIdx}`}
                    className={`h-4 rounded-[2px] transition-all ${cellInfo.color} ${
                      isActive ? 'ring-2 ring-slate-900 ring-offset-1 scale-110' : 'opacity-20'
                    }`}
                  />
                );
              })
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
