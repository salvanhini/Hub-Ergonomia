import React from 'react';
import { User } from 'lucide-react';

const BODY_REGIONS = [
  { id: 'neck', label: 'Pescoço', x: '50%', y: '15%' },
  { id: 'shoulder_r', label: 'Ombro D', x: '35%', y: '22%' },
  { id: 'shoulder_l', label: 'Ombro E', x: '65%', y: '22%' },
  { id: 'back_up', label: 'Costas Sup.', x: '50%', y: '30%' },
  { id: 'back_low', label: 'Costas Inf.', x: '50%', y: '45%' },
  { id: 'elbow_r', label: 'Cotovelo D', x: '30%', y: '35%' },
  { id: 'elbow_l', label: 'Cotovelo E', x: '70%', y: '35%' },
  { id: 'wrist_r', label: 'Punho D', x: '25%', y: '48%' },
  { id: 'wrist_l', label: 'Punho E', x: '75%', y: '48%' },
  { id: 'knee_r', label: 'Joelho D', x: '40%', y: '75%' },
  { id: 'knee_l', label: 'Joelho E', x: '60%', y: '75%' },
];

export const CorlettCalculator = ({ onSave }: { onSave?: (res: any) => void }) => {
  const [inventoryDetails, setInventoryDetails] = React.useState({ sector: '', task: '' });
  const [selections, setSelections] = React.useState<Record<string, number>>({});

  const toggleRegion = (id: string) => {
    setSelections(prev => {
      const current = prev[id] || 0;
      if (current >= 5) return { ...prev, [id]: 0 };
      return { ...prev, [id]: current + 1 };
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="relative aspect-[3/4] bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-center overflow-hidden">
         <User size={300} className="text-slate-200 opacity-50" />
         {BODY_REGIONS.map((region) => (
           <button
             key={region.id}
             onClick={() => toggleRegion(region.id)}
             style={{ left: region.x, top: region.y }}
             className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${
               selections[region.id] 
                 ? 'bg-red-500 border-red-700 text-white scale-110 shadow-lg' 
                 : 'bg-white border-slate-300 text-slate-400 hover:border-blue-500'
             }`}
           >
             {selections[region.id] || ''}
           </button>
         ))}
         <div className="absolute bottom-4 left-4 text-[9px] font-bold text-slate-400 uppercase">
           Interação: Clique para aumentar grau de desconforto (1-5)
         </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">Mapa de Desconforto (Corlett)</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">Indique as zonas de dor relatadas pelo colaborador na escala de 0 a 5.</p>
        </div>

        <div className="space-y-2">
          {Object.entries(selections).filter(([_, val]) => (val as number) > 0).map(([id, val]) => (
            <div key={id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
              <span className="text-xs font-bold text-slate-700 capitalize">{BODY_REGIONS.find(r => r.id === id)?.label}</span>
              <div className="flex items-center space-x-2">
                 <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${((val as number) / 5) * 100}%` }} />
                 </div>
                 <span className="text-[10px] font-black text-red-600">{val}/5</span>
              </div>
            </div>
          ))}
          {Object.keys(selections).length === 0 && (
            <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300">
               <User size={40} className="mb-2 opacity-20" />
               <p className="text-[10px] font-bold uppercase tracking-widest">Nenhuma zona selecionada</p>
            </div>
          )}
        </div>

        <div className="w-full space-y-3 pt-4 border-t border-slate-100 text-left">
           <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Setor / Local</label>
              <input 
                type="text" 
                value={inventoryDetails.sector}
                onChange={(e) => setInventoryDetails({...inventoryDetails, sector: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-bold"
                placeholder="Ex: Operacional"
              />
           </div>
           <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Atividade</label>
              <input 
                type="text" 
                value={inventoryDetails.task}
                onChange={(e) => setInventoryDetails({...inventoryDetails, task: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-bold"
                placeholder="Ex: Pintura"
              />
           </div>
        </div>

        <button 
          onClick={() => {
            const values = Object.values(selections) as number[];
            const maxScore = values.length > 0 ? Math.max(...values) : 0;
            onSave?.({
              sector: inventoryDetails.sector || 'Geral',
              task: inventoryDetails.task || 'Diagrama de Corlett',
              score: maxScore,
              priority: maxScore >= 4 ? 'Crítica' : maxScore >= 2 ? 'Alta' : 'Baixa',
              risk: 'Desconforto / Dor Osteomuscular'
            });
          }}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-colors shadow-xl shadow-blue-600/20 active:scale-95"
        >
          Gravar no Inventário
        </button>
      </div>
    </div>
  );
};
