import React from 'react';
import { Activity, ChevronRight } from 'lucide-react';
import { RulaCalculator } from './RulaCalculator';
import { RebaCalculator } from './RebaCalculator';
import { CorlettCalculator } from './CorlettCalculator';
import { MooreGargCalculator } from './MooreGargCalculator';
import { CoutoCalculator } from './CoutoCalculator';
import { NioshCalculator } from './NioshCalculator';
import { BorgScaleCalculator } from './BorgScaleCalculator';
import { RiskMatrix } from './RiskMatrix';
import { AssessmentCategory, MethodologyType, MethodologyInfo } from '../../types';

const METHODOLOGIES: MethodologyInfo[] = [
  { id: 'RULA', name: 'RULA', category: AssessmentCategory.OFFICE, description: 'Avaliação de membros superiores e postura estática.' },
  { id: 'REBA', name: 'REBA', category: AssessmentCategory.INDUSTRY, description: 'Avaliação completa de corpo e posturas dinâmicas.' },
  { id: 'NIOSH', name: 'NIOSH / NHO 11', category: AssessmentCategory.LOGISTICS, description: 'Cálculo de limite de carga e movimentação manual.' },
  { id: 'ROSAS', name: 'ROSAS', category: AssessmentCategory.OFFICE, description: 'Ergonomia de escritório e interação com mobiliário.' },
  { id: 'MOORE_GARG', name: 'Moore & Garg', category: AssessmentCategory.INDUSTRY, description: 'Índice de esforço para extremidades superiores.' },
  { id: 'COUTO', name: 'Check-list de Couto', category: AssessmentCategory.INDUSTRY, description: 'Triagem biomecânica simplificada para LER/DORT.' },
  { id: 'CORLETT', name: 'Painel de Corlett', category: AssessmentCategory.HEALTH, description: 'Diagrama subjetivo de mapa de dor e desconforto.' },
  { id: 'BORG', name: 'Escala de Borg', category: AssessmentCategory.HEALTH, description: 'Percepção subjetiva de esforço e carga física.' },
  { id: 'MATRIX', name: 'Matriz de Risco', category: AssessmentCategory.INDUSTRY, description: 'Probabilidade x Severidade para PGR/NR1.' },
];

export const MetodologiasView = ({ onSave }: { onSave: (item: any) => void }) => {
  const [selectedMethod, setSelectedMethod] = React.useState<MethodologyType | null>(null);

  const handleSaveResult = (res: any) => {
    onSave({
      methodology: selectedMethod!,
      ...res
    });
    setSelectedMethod(null);
  };

  const renderCalculator = () => {
    switch (selectedMethod) {
      case 'RULA':
        return <RulaCalculator onSave={handleSaveResult} />;
      case 'REBA':
        return <RebaCalculator onSave={handleSaveResult} />;
      case 'CORLETT':
        return <CorlettCalculator onSave={handleSaveResult} />;
      case 'MOORE_GARG':
        return <MooreGargCalculator onSave={handleSaveResult} />;
      case 'COUTO':
        return <CoutoCalculator onSave={handleSaveResult} />;
      case 'NIOSH':
        return <NioshCalculator onSave={handleSaveResult} />;
      case 'BORG':
        return <BorgScaleCalculator onSave={handleSaveResult} />;
      case 'MATRIX':
        return <RiskMatrix onSave={handleSaveResult} />;
      default:
        return (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300">
            <Activity size={48} className="mb-4 opacity-20" />
            <p className="font-bold text-sm">Calculadora em desenvolvimento</p>
            <p className="text-xs">Este módulo estará disponível na próxima atualização do sistema.</p>
          </div>
        );
    }
  };

  if (selectedMethod) {
    const methodInfo = METHODOLOGIES.find(m => m.id === selectedMethod);
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedMethod(null)}
          className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center space-x-1 transition-colors"
        >
          <ChevronRight size={14} className="rotate-180" />
          <span>Voltar ao Menu de Metodologias</span>
        </button>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-6xl mx-auto">
          <div className="mb-8 border-b border-slate-100 pb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800">{methodInfo?.name} - Protocolo Ativo</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{methodInfo?.description}</p>
            </div>
            <div className="text-[11px] px-3 py-1 bg-slate-900 text-white rounded font-bold">UNIDADE: JOINVILLE-SC</div>
          </div>
          {renderCalculator()}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Módulos de Avaliação</h3>
        <p className="text-sm text-slate-500 max-w-lg mx-auto font-medium">Selecione a metodologia científica ideal com base no ambiente de trabalho e nos riscos identificados.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {METHODOLOGIES.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedMethod(m.id)}
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left flex flex-col h-full transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {m.category}
              </span>
              <Activity size={18} className="text-slate-300 group-hover:text-blue-500" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">{m.name}</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed flex-1">
              {m.description}
            </p>
            <div className="mt-6 flex items-center text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
              <span>Iniciar Avaliação</span>
              <ChevronRight size={14} className="ml-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
