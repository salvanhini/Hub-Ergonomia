/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, User, Target, HelpCircle, TrendingUp, DollarSign, Clock } from 'lucide-react';

interface Plain5W2HProps {
  riskType: string;
  intensity: string;
}

export const ActionPlan5W2H = ({ riskType, intensity }: Plain5W2HProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-in zoom-in-95 duration-300">
      <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
        <div>
          <h4 className="text-lg font-black tracking-tight">Plano de Ação Sugerido (5W2H)</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Baseado em: {riskType} ({intensity})</p>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black">5W</div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Target size={16} />, w: 'What', label: 'O que fazer?', val: 'Ajuste de altura de bancadas e rodízio de tarefas para redução de esforço estático.' },
          { icon: <HelpCircle size={16} />, w: 'Why', label: 'Por que fazer?', val: 'Reduzir a compressão mecânica e prevenir LER/DORT identificada em estágio inicial.' },
          { icon: <User size={16} />, w: 'Who', label: 'Quem fará?', val: 'Engenharia de Processos / Comitê de Ergonomia.' },
          { icon: <Clock size={16} />, w: 'When', label: 'Quando?', val: 'Imediato (Início em 48h).' },
          { icon: <TrendingUp size={16} />, w: 'Where', label: 'Onde?', val: 'Linha de Montagem A2 (Célula de Expedição).' },
          { icon: <TrendingUp size={16} />, w: 'How', label: 'Como?', val: 'Instalação de plataformas reguláveis e treinamento de postura global.' },
          { icon: <DollarSign size={16} />, w: 'How Much', label: 'Quanto custa?', val: 'R$ 1.200,00 (Estimativa de materiais).' },
        ].map((item, idx) => (
          <div key={idx} className="space-y-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all">
            <div className="flex items-center space-x-2 text-blue-600">
              {item.icon}
              <span className="text-[9px] font-black uppercase tracking-widest">{item.w} - {item.label}</span>
            </div>
            <p className="text-xs font-bold text-slate-700 leading-relaxed">{item.val}</p>
          </div>
        ))}
      </div>
      
      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
         <button className="text-[10px] font-black uppercase tracking-widest px-6 py-3 border border-slate-200 rounded-xl hover:bg-white transition-colors">Personalizar Plano</button>
         <button className="text-[10px] font-black uppercase tracking-widest px-6 py-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20 active:scale-95 transition-all">Exportar para o PGR</button>
      </div>
    </div>
  );
};
