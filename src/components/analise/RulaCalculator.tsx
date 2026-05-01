/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { calculateRula } from '../../lib/rula';
import { RulaInput } from '../../types';

import { ActionPlan5W2H } from './ActionPlan5W2H';

export const RulaCalculator = ({ onSave }: { onSave?: (res: any) => void }) => {
  const [inventoryDetails, setInventoryDetails] = React.useState({ sector: '', task: '' });
  const [input, setInput] = React.useState<RulaInput>({
    upperArm: 1,
    forearm: 1,
    wrist: 1,
    wristTwist: 1,
    neck: 1,
    trunk: 1,
    legs: 1,
    muscleUse: 0,
    forceLoad: 0
  });

  const score = calculateRula(input);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-700';
      case 2: return 'bg-amber-100 text-amber-700';
      case 3: return 'bg-orange-100 text-orange-700';
      case 4: return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-7 space-y-6">
        <section className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Grupo A: Braço e Punho</label>
            <div className="grid grid-cols-2 gap-2">
              <select 
                value={input.upperArm}
                onChange={(e) => setInput({...input, upperArm: Number(e.target.value)})}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value={1}>Braço: 20° ext - 20° flex (1)</option>
                <option value={2}>Braço: &gt;20° ext ou 20-45° flex (2)</option>
                <option value={3}>Braço: 45-90° flex (3)</option>
                <option value={4}>Braço: &gt;90° flex (4)</option>
              </select>
              <select 
                value={input.forearm}
                onChange={(e) => setInput({...input, forearm: Number(e.target.value)})}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value={1}>Antebraço: 60-100° (1)</option>
                <option value={2}>Antebraço: &lt;60° ou &gt;100° (2)</option>
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Grupo B: Pescoço, Tronco e Pernas</label>
            <div className="grid grid-cols-2 gap-2">
              <select 
                value={input.neck}
                onChange={(e) => setInput({...input, neck: Number(e.target.value)})}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value={1}>Pescoço: 0-10° flex (1)</option>
                <option value={2}>Pescoço: 10-20° flex (2)</option>
                <option value={3}>Pescoço: &gt;20° flex (3)</option>
                <option value={4}>Pescoço: Extensão (4)</option>
              </select>
              <select 
                value={input.trunk}
                onChange={(e) => setInput({...input, trunk: Number(e.target.value)})}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value={1}>Tronco: Ereto (1)</option>
                <option value={2}>Tronco: 0-20° flex (2)</option>
                <option value={3}>Tronco: 20-60° flex (3)</option>
                <option value={4}>Tronco: &gt;60° flex (4)</option>
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Uso Muscular</p>
                <p className="text-[9px] text-slate-400">Repetitivo/Estático</p>
              </div>
              <input 
                type="checkbox" 
                checked={input.muscleUse === 1}
                onChange={(e) => setInput({...input, muscleUse: e.target.checked ? 1 : 0})}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-center">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Força / Carga</label>
              <select 
                value={input.forceLoad}
                onChange={(e) => setInput({...input, forceLoad: Number(e.target.value)})}
                className="bg-transparent border-0 text-xs font-bold text-slate-700 focus:ring-0 p-0 cursor-pointer"
              >
                <option value={0}>Nula (0)</option>
                <option value={1}>2-10kg Intermit. (1)</option>
                <option value={2}>2-10kg Estática (2)</option>
                <option value={3}>&gt;10kg (3)</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      <div className="md:col-span-5 flex flex-col items-center justify-center border-l border-slate-100 px-8 py-4">
        <div className={`w-32 h-32 rounded-full border-[10px] flex flex-col items-center justify-center shadow-inner transition-colors duration-500 ${
          score.actionLevel >= 3 ? 'border-orange-400 bg-orange-50' : 
          score.actionLevel === 2 ? 'border-amber-300 bg-amber-50' : 'border-green-400 bg-green-50'
        }`}>
          <span className={`text-[10px] font-bold uppercase tracking-tighter ${
            score.actionLevel >= 3 ? 'text-orange-600' : 
            score.actionLevel === 2 ? 'text-amber-600' : 'text-green-600'
          }`}>Score RULA</span>
          <span className={`text-5xl font-black tabular-nums ${
            score.actionLevel >= 3 ? 'text-orange-600' : 
            score.actionLevel === 2 ? 'text-amber-600' : 'text-green-600'
          }`}>{score.score}</span>
        </div>
        
        <div className="mt-6 text-center">
          <p className={`text-xs font-bold uppercase ${
            score.actionLevel >= 3 ? 'text-orange-700' : 
            score.actionLevel === 2 ? 'text-amber-700' : 'text-green-700'
          }`}>Nível de Ação {score.actionLevel}</p>
          <p className="text-[10px] text-slate-500 mt-2 max-w-[200px] leading-relaxed mx-auto font-medium">
            {score.recommendation}
          </p>
        </div>

        <div className="mt-10 w-full space-y-2">
          <button 
            onClick={() => onSave?.({
              sector: inventoryDetails.sector || 'Geral',
              task: inventoryDetails.task || 'Análise Postural',
              score: score.score,
              priority: score.actionLevel >= 3 ? 'Crítica' : score.actionLevel === 2 ? 'Média' : 'Baixa',
              risk: 'Postura Estática / Membros Superiores'
            })}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 active:scale-95"
          >
            Salvar no Inventário
          </button>
          <div className="w-full space-y-3 pt-4 border-t border-slate-100">
             <div className="text-left space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Setor / Local</label>
                <input 
                  type="text" 
                  value={inventoryDetails.sector}
                  onChange={(e) => setInventoryDetails({...inventoryDetails, sector: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-[10px] font-bold"
                  placeholder="Ex: Montagem"
                />
             </div>
             <div className="text-left space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Atividade Analisada</label>
                <input 
                  type="text" 
                  value={inventoryDetails.task}
                  onChange={(e) => setInventoryDetails({...inventoryDetails, task: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-[10px] font-bold"
                  placeholder="Ex: Operação de Parafusadeira"
                />
             </div>
          </div>
          <button className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors">
            Salvar Avaliação
          </button>
        </div>
      </div>

      {score.actionLevel >= 3 && (
        <div className="md:col-span-12 mt-8 animate-in slide-in-from-top-4 duration-500">
           <ActionPlan5W2H riskType="RULA" intensity={`Nível ${score.actionLevel}`} />
        </div>
      )}
    </div>
  );
};
