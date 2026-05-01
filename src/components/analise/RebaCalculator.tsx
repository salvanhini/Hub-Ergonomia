import React from 'react';
import { Activity } from 'lucide-react';
import { ActionPlan5W2H } from './ActionPlan5W2H';

export const RebaCalculator = ({ onSave }: { onSave?: (res: any) => void }) => {
  const [inventoryDetails, setInventoryDetails] = React.useState({ sector: '', task: '' });
  const [input, setInput] = React.useState({
    trunk: 1,
    neck: 1,
    legs: 1,
    upperArm: 1,
    forearm: 1,
    wrist: 1,
    load: 1,
    coupling: 0,
    activity: 0
  });

  // Simplified REBA logic for demonstration (Real REBA involves complex lookup tables)
  const calculateReba = () => {
    const raw = (input.trunk + input.neck + input.legs) + (input.upperArm + input.forearm + input.wrist) + input.load + input.coupling + input.activity;
    const score = Math.min(15, Math.ceil(raw / 1.5));
    
    let level = 1;
    let rec = "";
    if (score <= 1) { level = 0; rec = "Risco desprezível, nenhuma ação necessária."; }
    else if (score <= 3) { level = 1; rec = "Risco baixo, pode ser necessária ação."; }
    else if (score <= 7) { level = 2; rec = "Risco médio, necessária ação em breve."; }
    else if (score <= 10) { level = 3; rec = "Risco alto, necessária ação logo."; }
    else { level = 4; rec = "Risco muito alto, necessária ação imediata."; }

    return { score, level, rec };
  };

  const result = calculateReba();

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h5 className="text-[10px] font-black text-slate-400 uppercase mb-3 px-1">Tronco & Pescoço</h5>
            <div className="space-y-3">
              <select 
                value={input.trunk} 
                onChange={(e) => setInput({...input, trunk: Number(e.target.value)})}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
              >
                <option value={1}>Tronco: Ereto (1)</option>
                <option value={2}>Tronco: 0-20° flex/ext (2)</option>
                <option value={3}>Tronco: 20-60° flex (3)</option>
                <option value={4}>Tronco: &gt;60° flex (4)</option>
              </select>
              <select 
                value={input.neck} 
                onChange={(e) => setInput({...input, neck: Number(e.target.value)})}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
              >
                <option value={1}>Pescoço: 0-20° flex (1)</option>
                <option value={2}>Pescoço: &gt;20° flex ou ext (2)</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h5 className="text-[10px] font-black text-slate-400 uppercase mb-3 px-1">Membros Superiores</h5>
            <div className="space-y-3">
              <select 
                value={input.upperArm} 
                onChange={(e) => setInput({...input, upperArm: Number(e.target.value)})}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
              >
                <option value={1}>Braço: 20° ext a 20° flex (1)</option>
                <option value={2}>Braço: &gt;20° ext ou 20-45° flex (2)</option>
                <option value={3}>Braço: 45-90° flex (3)</option>
                <option value={4}>Braço: &gt;90° flex (4)</option>
              </select>
              <select 
                value={input.forearm} 
                onChange={(e) => setInput({...input, forearm: Number(e.target.value)})}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
              >
                <option value={1}>Antebraço: 60-100° (1)</option>
                <option value={2}>Antebraço: &lt;60° ou &gt;100° (2)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
           <h5 className="text-[10px] font-black text-blue-500 uppercase mb-3">Atividade Muscular & Carga</h5>
           <div className="grid grid-cols-2 gap-4">
              <select 
                value={input.load} 
                onChange={(e) => setInput({...input, load: Number(e.target.value)})}
                className="bg-white border border-blue-200 rounded-lg p-2 text-xs"
              >
                <option value={0}>Carga &lt; 5kg (0)</option>
                <option value={1}>Carga 5-10kg (1)</option>
                <option value={2}>Carga &gt; 10kg (2)</option>
              </select>
              <div className="flex items-center space-x-3 bg-white p-2 border border-blue-200 rounded-lg">
                <input 
                  type="checkbox" 
                  checked={input.activity === 1} 
                  onChange={(e) => setInput({...input, activity: e.target.checked ? 1 : 0})}
                  className="rounded text-blue-600"
                />
                <span className="text-[10px] font-bold text-slate-600 uppercase">Postura Estática/Repetitiva</span>
              </div>
           </div>
        </div>
      </div>

      <div className="md:col-span-4 bg-slate-900 rounded-2xl p-6 text-white flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
        <Activity className="absolute -right-4 -top-4 text-white/5" size={120} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Score Final REBA</span>
        <div className="text-6xl font-black mb-4 tabular-nums">{result.score}</div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-6 ${
          result.level >= 3 ? 'bg-red-500 text-white' : 
          result.level >= 2 ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
        }`}>
          Nível de Risco {result.level}
        </div>
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-[200px]">
          {result.rec}
        </p>

        <div className="w-full space-y-3 my-6 pt-6 border-t border-slate-100">
           <div className="text-left space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Setor / Local</label>
              <input 
                type="text" 
                value={inventoryDetails.sector}
                onChange={(e) => setInventoryDetails({...inventoryDetails, sector: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-[10px] font-bold"
                placeholder="Ex: Almoxarifado"
              />
           </div>
           <div className="text-left space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Atividade</label>
              <input 
                type="text" 
                value={inventoryDetails.task}
                onChange={(e) => setInventoryDetails({...inventoryDetails, task: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-[10px] font-bold"
                placeholder="Ex: Carga Manual"
              />
           </div>
        </div>

        <button 
          onClick={() => onSave?.({
            sector: inventoryDetails.sector || 'Geral',
            task: inventoryDetails.task || 'Postura Dinâmica',
            score: result.score,
            priority: result.level >= 4 ? 'Crítica' : result.level >= 2 ? 'Alta' : 'Média',
            risk: 'Sobrecarga Biomecânica / Corpo Inteiro'
          })}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          Gravar no Inventário
        </button>
      </div>

      {result.level >= 2 && (
        <div className="md:col-span-12 mt-8 animate-in slide-in-from-top-4 duration-500">
           <ActionPlan5W2H riskType="REBA" intensity={`Nível ${result.level}`} />
        </div>
      )}
    </div>
  );
};
