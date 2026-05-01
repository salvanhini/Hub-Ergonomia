/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ClipboardCheck } from 'lucide-react';

const COUTO_QUESTIONS = [
  { id: 'q1', text: 'Há esforço físico pesado com as mãos ou punhos?' },
  { id: 'q2', text: 'A frequência de movimentos é superior a 30 por minuto?' },
  { id: 'q3', text: 'O ciclo de trabalho é inferior a 30 segundos?' },
  { id: 'q4', text: 'Há posturas críticas de punho (extensão ou flexão extrema)?' },
  { id: 'q5', text: 'O trabalhador utiliza ferramentas vibratórias?' },
  { id: 'q6', text: 'O ambiente é frio ou excessivamente úmido?' },
  { id: 'q7', text: 'Há compressão mecânica de tecidos (ex: apoio em quinas)?' },
  { id: 'q8', text: 'Há ausência de pausas ou tempo de recuperação?' },
];

import { ActionPlan5W2H } from './ActionPlan5W2H';

export const CoutoCalculator = ({ onSave }: { onSave?: (res: any) => void }) => {
  const [inventoryDetails, setInventoryDetails] = React.useState({ sector: '', task: '' });
  const [answers, setAnswers] = React.useState<Record<string, boolean>>({});

  const toggleAnswer = (id: string) => {
    setAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const countYes = Object.values(answers).filter(Boolean).length;
  
  const getVerdict = () => {
    if (countYes <= 2) return { text: "Sem risco biomecânico significativo", color: "text-green-600", bg: "bg-green-50" };
    if (countYes <= 4) return { text: "Risco baixo - Monitorar", color: "text-amber-600", bg: "bg-amber-50" };
    if (countYes <= 6) return { text: "Risco moderado - Necessárias melhorias", color: "text-orange-600", bg: "bg-orange-50" };
    return { text: "Risco alto - Intervenção imediata", color: "text-red-600", bg: "bg-red-50" };
  };

  const verdict = getVerdict();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-3">
          <div className="px-1 mb-4">
             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critérios Biomecânicos</h5>
          </div>
          {COUTO_QUESTIONS.map((q) => (
            <button
              key={q.id}
              onClick={() => toggleAnswer(q.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                answers[q.id] 
                  ? 'bg-blue-50 border-blue-200 shadow-inner' 
                  : 'bg-white border-slate-100 hover:border-slate-300'
              }`}
            >
              <span className={`text-xs font-medium ${answers[q.id] ? 'text-blue-800' : 'text-slate-600'}`}>{q.text}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                answers[q.id] ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'
              }`}>
                {answers[q.id] && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </button>
          ))}
        </div>

        <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center sticky top-4 h-fit">
          <ClipboardCheck className="text-slate-300 mb-4" size={48} />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Check-list de Couto</span>
          <div className="text-6xl font-black text-slate-900 mb-2 tabular-nums">{countYes}</div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-6">Frequência de "Sim"</p>
          
          <div className={`w-full p-4 rounded-xl border ${verdict.bg} ${verdict.color} mb-6`}>
            <p className="text-xs font-black uppercase leading-tight">{verdict.text}</p>
          </div>

          <div className="w-full space-y-3 mb-6 text-left border-t border-slate-100 pt-6">
             <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Setor / Local</label>
                <input 
                  type="text" 
                  value={inventoryDetails.sector}
                  onChange={(e) => setInventoryDetails({...inventoryDetails, sector: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-bold"
                  placeholder="Ex: Produção"
                />
             </div>
             <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Atividade</label>
                <input 
                  type="text" 
                  value={inventoryDetails.task}
                  onChange={(e) => setInventoryDetails({...inventoryDetails, task: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-bold"
                  placeholder="Ex: Montagem Manual"
                />
             </div>
          </div>

          <button 
             onClick={() => onSave?.({
               sector: inventoryDetails.sector || 'Geral',
               task: inventoryDetails.task || 'Check-list Couto',
               score: countYes,
               priority: countYes > 6 ? 'Crítica' : countYes > 4 ? 'Alta' : 'Média',
               risk: 'Risco de LER/DORT (Biomecânico)'
             })}
             className="w-full bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mb-4"
          >
             Salvar no Inventário
          </button>

          <p className="mt-6 text-[10px] text-slate-400 font-medium leading-relaxed">
            O Check-list de Couto é uma ferramenta de triagem para identificação rápida de fatores de risco para LER/DORT.
          </p>
        </div>
      </div>

      {countYes >= 4 && (
        <div className="animate-in slide-in-from-top-4 duration-500">
          <ActionPlan5W2H riskType="Checklist de Couto" intensity={countYes > 6 ? "Crítico" : "Moderado"} />
        </div>
      )}
    </div>
  );
};
