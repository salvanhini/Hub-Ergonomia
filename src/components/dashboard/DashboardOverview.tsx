/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { Users, FileText, AlertCircle, Building2 } from 'lucide-react';

const riskData = [
  { name: 'Jan', riscos: 40, corrigidos: 24 },
  { name: 'Fev', riscos: 30, corrigidos: 13 },
  { name: 'Mar', riscos: 20, corrigidos: 35 },
  { name: 'Abr', riscos: 27, corrigidos: 39 },
  { name: 'Mai', riscos: 18, corrigidos: 48 },
  { name: 'Jun', riscos: 23, corrigidos: 38 },
];

const methodologyData = [
  { name: 'RULA', value: 400 },
  { name: 'REBA', value: 300 },
  { name: 'NIOSH', value: 200 },
  { name: 'M-Garg', value: 278 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const DashboardOverview = ({ inventory = [] }: { inventory?: any[] }) => {
  const criticalCount = inventory.filter(i => i.priority === 'Crítica').length;
  const totalCount = inventory.length;
  const solvedCount = inventory.filter(i => i.status === 'Resolvido').length;

  const methodologyCounts = inventory.reduce((acc: any, item) => {
    acc[item.methodology] = (acc[item.methodology] || 0) + 1;
    return acc;
  }, {});

  const methodologyData = Object.entries(methodologyCounts).map(([name, value]) => ({
    name,
    value: Number(value)
  })).slice(0, 4);

  // Fallback for empty data
  const displayMethodData = methodologyData.length > 0 ? methodologyData : [
    { name: 'Nenhuma', value: 1 }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: <Building2 />, label: 'Empresas', val: '01', trend: 'Ativa' },
          { icon: <Users />, label: 'Colaboradores', val: '--', trend: 'Pendente' },
          { icon: <FileText />, label: 'Análises', val: totalCount.toString(), trend: `${totalCount > 0 ? 'Atualizado' : 'Inicie agora'}` },
          { icon: <AlertCircle />, label: 'Riscos Críticos', val: criticalCount.toString().padStart(2, '0'), trend: 'Prioridade Total' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
             <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 mb-3">
                {React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
             <h4 className="text-2xl font-black text-slate-800 my-1">{stat.val}</h4>
             <p className="text-[9px] font-bold text-blue-500 uppercase">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Chart */}
        <div className="md:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h5 className="text-sm font-black text-slate-800">Evolução de Riscos vs Ações</h5>
                 <p className="text-[10px] text-slate-400 font-medium">Histórico semestral de conformidade ergonômica.</p>
              </div>
              <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Riscos</span>
                 </div>
                 <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Ações</span>
                 </div>
              </div>
           </div>
           
           <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={riskData}>
                    <defs>
                       <linearGradient id="colorRiscos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorAções" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                    />
                    <Tooltip 
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="riscos" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRiscos)" />
                    <Area type="monotone" dataKey="corrigidos" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAções)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Methodology Dist */}
        <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
           <h5 className="text-sm font-black text-slate-800 mb-1">Metodologias Utilizadas</h5>
           <p className="text-[10px] text-slate-400 font-medium mb-8">Frequência de aplicação por ferramenta.</p>
           
           <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={displayMethodData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                    >
                       {displayMethodData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                       ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
           </div>
           
           <div className="grid grid-cols-2 gap-2 mt-4">
              {displayMethodData.map((item, i) => (
                 <div key={i} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">{item.name}</span>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
