/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Info, Filter, Search, MoreHorizontal } from 'lucide-react';
import { InventoryItem } from '../types';

export const PGRView = ({ inventory }: { inventory: InventoryItem[] }) => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Inventário de Riscos (NR1 / PGR)</h3>
        <p className="text-xs text-slate-500 font-medium">Listagem consolidada de todos os perigos e riscos ergonômicos identificados.</p>
      </div>
      <div className="flex items-center space-x-3">
         <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={14} />
            <span>Filtrar</span>
         </button>
         <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-slate-800 transition-colors">
            Exportar PGR
         </button>
      </div>
    </div>

    {/* Summary Board */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
       {[
         { label: 'Total de Riscos', val: inventory.length, color: 'slate' },
         { label: 'Prioridade Crítica', val: inventory.filter(i => i.priority === 'Crítica').length, color: 'red' },
         { label: 'Em Plano de Ação', val: inventory.filter(i => i.status === 'Em Ação').length, color: 'blue' },
         { label: 'Conformidade', val: '92%', color: 'green' },
       ].map((stat, i) => (
         <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className={`text-2xl font-black ${stat.color === 'red' ? 'text-red-500' : 'text-slate-800'}`}>{stat.val}</h4>
         </div>
       ))}
    </div>

    {/* Inventory Table */}
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
       <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Setor / Atividade</th>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Perigo / Risco</th>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Fator/Met.</th>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Severidade</th>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                   <th className="px-6 py-4"></th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {inventory.map((item) => (
                   <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                         <div className="font-bold text-xs text-slate-800">{item.sector}</div>
                         <div className="text-[10px] text-slate-400 mt-0.5">{item.task}</div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-xs font-medium text-slate-600">{item.risk}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded uppercase">{item.methodology}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="text-xs font-black text-slate-800 tabular-nums">{item.score}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${
                            item.priority === 'Crítica' ? 'bg-red-50 text-red-600 border-red-100' :
                            item.priority === 'Alta' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                            'bg-blue-50 text-blue-600 border-blue-100'
                         }`}>
                            {item.priority}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex items-center justify-center space-x-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                               item.status === 'Pendente' ? 'bg-amber-400 animate-pulse' :
                               item.status === 'Em Ação' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-emerald-500'
                            }`} />
                            <span className="text-[10px] font-bold text-slate-500">{item.status}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end space-x-2">
                           <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <Search size={14} />
                           </button>
                           <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                              <MoreHorizontal size={14} />
                           </button>
                         </div>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  </div>
);
