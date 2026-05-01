/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Search, Filter, MoreHorizontal, ChevronRight, FileText, CheckCircle2, ChevronLeft, Trash2, Printer, Edit3, Save } from 'lucide-react';
import { Report, InventoryItem } from '../types';
import { supabase } from '../lib/supabase';

const SECTIONS = [
  { id: 'identificacao', title: '1. Identificação da Empresa e do Documento' },
  { id: 'normas', title: '2. Bases Normativas Aplicáveis' },
  { id: 'demanda', title: '3. Análise da Demanda e Objetivo' },
  { id: 'metodologia', title: '4. Metodologia e Ferramentas' },
  { id: 'populacao', title: '5. Caracterização da População' },
  { id: 'posto', title: '6. Descrição dos Postos e Ambientes' },
  { id: 'perigos', title: '7. Levantamento de Perigos e Riscos (AEP)' },
  { id: 'tarefas', title: '8. Análise das Tarefas (Prescritas vs Reais - AET)' },
  { id: 'organizacao', title: '9. Organização do Trabalho e Cognição' },
  { id: 'diagnostico', title: '10. Diagnóstico Ergonômico' },
  { id: 'recomendacoes', title: '11. Projeto de Recomendações' },
  { id: 'plano', title: '12. Plano de Ação e Cronograma' },
  { id: 'validacao', title: '13. Restituição e Validação' },
  { id: 'anexos', title: '14. Fotos e Anexos' },
];

const REPORT_TYPES = [
  { id: 'AEP', label: 'AEP - Avaliação Ergonômica Preliminar', desc: 'Identificação básica de perigos e riscos (NR 17.3.1)' },
  { id: 'AET', label: 'AET - Análise Ergonômica do Trabalho', desc: 'Análise aprofundada de situações complexas (NR 17.3.2)' },
];

const AVAILABLE_NRS = [
  { id: 'NR17', label: 'NR 17 - Ergonomia' },
  { id: 'NR01', label: 'NR 01 - Disposições Gerais e Riscos Ocupacionais' },
  { id: 'NR07', label: 'NR 07 - PCMSO' },
  { id: 'NR09', label: 'NR 09 - Avaliação e Controle de Exposições' },
  { id: 'NR12', label: 'NR 12 - Máquinas e Equipamentos' },
  { id: 'NR24', label: 'NR 24 - Condições Sanitárias e de Conforto' },
  { id: 'NHO11', label: 'NHO 11 - Níveis de Iluminamento' },
  { id: 'ISO11228', label: 'ISO 11228 - Levantamento de Cargas' },
];

interface LaudosViewProps {
  branding: any;
  initialCreate?: boolean;
  onViewChange?: () => void;
}

const SECTION_TIPS: Record<string, string> = {
  identificacao: 'Incluir Razão Social, CNPJ, CNAE, Grau de Risco e descrição da unidade avaliada.',
  normas: 'Selecione a NR-17 e outras complementares como NR-1 (PGR), NR-12 (Mobiliário) ou NHO-11 (Luz).',
  demanda: 'Explicitar se a demanda é de saúde (queixas), legal (fiscalização) ou social (sindicatos).',
  metodologia: 'Citar as ferramentas utilizadas (RULA, REBA, Moore & Garg, etc.) e o critério científico.',
  populacao: 'Análise do perfil dos trabalhadores: faixa etária, gênero, antiguidade e rotatividade.',
  posto: 'Descrever o ambiente, mobiliário, equipamentos e condições ambientais (ruído, temperatura, luz).',
  perigos: 'Foco na identificação preliminar de perigos biomecânicos, cognitivos e organizacionais.',
  tarefas: 'Crucial para AET: Diferenciar o TRABALHO PRESCRITO (objetivo) do TRABALHO REAL (atividade de fato).',
  organizacao: 'Analisar ritmo, cadência, pausas, divisão de tarefas e exigências cognitivas.',
  diagnostico: 'Cruzamento dos achados com os dados do inventário e nexo técnico.',
  recomendacoes: 'Propor melhorias efetivas na saúde e produção. Não se limitar a expressões genéricas.',
  plano: 'Estabelecer cronograma de implementação das melhorias propostas.',
  validacao: 'Sempre ouvir e validar os resultados com os trabalhadores envolvidos no processo.',
};

const SECTION_CHECKLISTS: Record<string, string[]> = {
  identificacao: ['CNPJ e Razão Social', 'CNAE e Grau de Risco', 'Descrição do processo produtivo', 'Data da observação'],
  normas: ['NR-17 (Principal)', 'NR-01 (Gerenciamento)', 'NR-12 (Mobiliário)', 'NHO-11 (Luminosidade)'],
  demanda: ['Natureza da queixa (Saúde/Legal)', 'Objetivo da intervenção', 'Escopo da análise'],
  metodologia: ['Ferramentas utilizadas (RULA/NIOSH)', 'Processo participativo', 'Critérios de avaliação'],
  populacao: ['Pirâmide etária', 'Gênero e Antiguidade', 'Taxa de rotatividade (Turnover)'],
  posto: ['Dimensões do mobiliário', 'Espaço para pernas e pés', 'Acessibilidade de comandos'],
  perigos: ['Riscos Biomecânicos', 'Riscos Cognitivos', 'Riscos Organizacionais'],
  tarefas: ['Trabalho Prescrito (Normas)', 'Trabalho Real (Atividade)', 'Variabilidade do modo operatório'],
  organizacao: ['Ritmo e Cadência', 'Sistema de pausas', 'Conteúdo das tarefas (Monotonia)'],
  diagnostico: ['Nexo técnico causal', 'Gravidade do achado', 'Urgência de ação'],
  recomendacoes: ['Medidas de Engenharia', 'Medidas Organizacionais', 'Treinamento e Capacitação'],
  plano: ['Responsáveis', 'Prazos de execução', 'Priorização'],
  validacao: ['Assinatura dos envolvidos', 'Data da restituição', 'Parecer dos trabalhadores'],
};

const SECTION_TEMPLATES: Record<string, string[]> = {
  demanda: [
    "Intervenção motivada por demanda legal (NR-17, item 17.3.1), visando a caracterização ergonômica preliminar (AEP) do setor indicado.",
    "Solicitação fundamentada em queixas osteomusculares recorrentes, focando na identificação de nexo técnico e fatores de risco.",
    "Avaliação para auxílio na elaboração do PCMSO, visando investigar causas de fadiga visual e auditiva em central de teleatendimento."
  ],
  populacao: [
    "População composta por [N] colaboradores, com predominância do gênero [M/F]. Observa-se faixa etária média de [X] anos e baixa rotatividade.",
    "Trabalhadores experientes (antiguidade média > 5 anos), o que confere domínio técnico, porém indica exposição acumulada a riscos estáticos.",
    "Presença de trabalhadores aprendizes e menores, exigindo redução de carga suportada conforme item 17.5.1.1 da NR-17."
  ],
  posto: [
    "Mobiliário com regulagem de altura (assento e encosto: 37 a 47cm), atendendo ao item 17.6.6. Bordas frontais arredondadas para evitar compressão poplítea.",
    "Posto de trabalho em pé sem assento de descanso disponível nas proximidades, em desacordo com o item 17.6.7 da NR-17.",
    "Iluminação medida em [X] lux (campo de trabalho), seguindo NHO-11. Existência de reflexos e sombras nas telas dos terminais (ofuscamento)."
  ],
  perigos: [
    "Perigo biomecânico: Inclinação de tronco > 20º durante a descarga de materiais (nórea), aumentando a pressão intradiscal em L5/S1.",
    "Perigo organizacional: Ritmo de trabalho imposto por máquina/esteira, impedindo a autogestão da cadência pelo trabalhador.",
    "Perigo cognitivo: Alta exigência de atenção e memória em ambiente ruidoso, elevando o risco de estresse e fadiga mental."
  ],
  tarefas: [
    "Trabalho Prescrito: Manipulação de 420 peças/dia, seguindo o roteiro padrão de qualidade ISO.",
    "Trabalho Real: O operador realiza ajustes constantes nos comandos devido à má qualidade da matéria-prima, gerando esforço suplementar não previsto.",
    "A análise da tarefa real revela que o trabalhador suprime pausas para compensar incidentes operacionais, elevando a carga física total."
  ],
  organizacao: [
    "Ausência de pausas psicofisiológicas sistemáticas. Identificada necessidade de pausas de 10 min a cada 50 min trabalhados.",
    "Sistema de metas individuais atrelado a premiações, induzindo à aceleração de movimentos e desrespeito à percepção de fadiga.",
    "Conteúdo da tarefa fragmentado e monótono, com baixo grau de autonomia decisória do trabalhador sobre a sequência de suas ações."
  ],
  diagnostico: [
    "Diagnóstico: Risco elevado de desenvolvimento de DORT devido à combinação de repetitividade de MMSS e força muscular excessiva.",
    "Diagnóstico: Situação de desconforto térmico e acústico que prejudica o desempenho eficiente e gera fadiga prematura.",
    "Diagnóstico: Postura estática prolongada em pé sem possibilidade de alternância, em desconformidade técnica com o item 17.3.1."
  ],
  recomendacoes: [
    "Implantar pausas de recuperação psicofisiológica conforme item 17.4.3.1. Estas devem ser usufruídas fora do posto de trabalho.",
    "Substituir mesas fixas por planos de trabalho reguláveis, permitindo a alternância de posturas sentado/em pé conforme escolha do trabalhador.",
    "Revisar o sistema de climatização para garantir temperatura efetiva entre 20 e 23ºC e velocidade do ar inferior a 0,75m/s."
  ]
};

export const LaudosView = ({ branding, initialCreate, onViewChange }: LaudosViewProps) => {
  const [view, setView] = React.useState<'list' | 'preview' | 'create' | 'edit'>('list');
  const [reports, setReports] = React.useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = React.useState<Report | null>(null);
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeEditorSection, setActiveEditorSection] = React.useState('identificacao');
  const [editingContent, setEditingContent] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showAssistant, setShowAssistant] = React.useState(true);

  // Wizard state
  const [step, setStep] = React.useState(1);
  const [newReport, setNewReport] = React.useState({
    title: '',
    company_name: '',
    employee_name: '',
    sector: '',
    job_function: '',
    report_type: 'AET' as 'AET' | 'AEP' | 'LIP' | 'PGR',
    assessment_ids: [] as string[]
  });

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setReports(data);
    setLoading(false);
  };

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('date', { ascending: false });
    
    if (!error && data) setInventory(data);
  };

  React.useEffect(() => {
    fetchReports();
    fetchInventory();
  }, []);

  React.useEffect(() => {
    if (initialCreate) {
      setView('create');
      setStep(1);
    }
  }, [initialCreate]);

  const handleCreateReport = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Usuário não autenticado.');
        return;
      }

      const initialContent = {
        ...SECTIONS.reduce((acc, s) => ({ ...acc, [s.id]: '' }), {}),
        original_type: newReport.report_type
      };

      const { error, data } = await supabase.from('reports').insert([{
        title: newReport.title,
        company_name: newReport.company_name,
        employee_name: newReport.employee_name || null,
        sector: newReport.sector || null,
        job_function: newReport.job_function || null,
        report_type: newReport.report_type === 'AEP' ? 'AET' : newReport.report_type,
        assessment_ids: newReport.assessment_ids || [],
        user_id: user.id,
        status: 'Draft',
        content: initialContent
      }]).select().single();

      if (error) {
        console.error('Erro ao criar laudo:', error);
        alert('Erro ao criar laudo: ' + error.message);
        return;
      }

      if (data) {
        await fetchReports();
        setSelectedReport(data);
        setEditingContent(data.content || initialContent);
        setView('edit');
        onViewChange?.();
      }
    } catch (err: any) {
      console.error('Erro inesperado:', err);
      alert('Ocorreu um erro inesperado ao gerar o laudo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateReport = async () => {
    if (!selectedReport) return;
    const { error } = await supabase
      .from('reports')
      .update({ content: editingContent })
      .eq('id', selectedReport.id);
    
    if (!error) {
      alert('Laudo salvo com sucesso!');
      fetchReports();
    }
  };

  const deleteReport = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Excluir este laudo permanentemente?')) return;
    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (!error) fetchReports();
  };

  const renderCreateWizard = () => {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <button onClick={() => { setView('list'); onViewChange?.(); }} className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center">
            <ChevronLeft size={16} /> Voltar
          </button>
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-8 h-1 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-xl space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900">Novo Protocolo de Laudo</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Defina as informações básicas do projeto</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título do Documento</label>
                <input 
                  type="text" 
                  value={newReport.title}
                  onChange={e => setNewReport({...newReport, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                  placeholder="Ex: AET - Setor de Logística - Unidade Matriz"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Empresa Cliente</label>
                <input 
                  type="text" 
                  value={newReport.company_name}
                  onChange={e => setNewReport({...newReport, company_name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                  placeholder="Razão Social"
                />
              </div>
              <div className="space-y-3 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Tipo de Documento Regulamentar</label>
                <div className="grid grid-cols-2 gap-4">
                  {REPORT_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setNewReport({...newReport, report_type: type.id as any, title: `${type.id} - ${newReport.company_name || 'Nova Empresa'}`})}
                      className={`p-6 rounded-3xl border-2 text-left transition-all ${
                        newReport.report_type === type.id 
                          ? 'border-blue-600 bg-white shadow-xl shadow-blue-600/10 ring-4 ring-blue-600/5' 
                          : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                      }`}
                    >
                      <p className="text-xs font-black text-slate-900 mb-1">{type.label}</p>
                      <p className="text-[10px] font-medium text-slate-400 leading-tight">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!newReport.title || !newReport.company_name}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
            >
              Próxima Etapa: Selecionar Análises
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-xl space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900">Seleção de Análises</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Selecione os itens do inventário para o laudo</p>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {inventory.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase">Nenhuma análise disponível no inventário</p>
                </div>
              ) : (
                inventory.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      const ids = newReport.assessment_ids.includes(item.id)
                        ? newReport.assessment_ids.filter(id => id !== item.id)
                        : [...newReport.assessment_ids, item.id];
                      setNewReport({...newReport, assessment_ids: ids});
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      newReport.assessment_ids.includes(item.id) 
                        ? 'border-blue-600 bg-blue-50/50' 
                        : 'border-slate-50 hover:border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        newReport.assessment_ids.includes(item.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                      }`}>
                        {newReport.assessment_ids.includes(item.id) && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{item.sector} - {item.task}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{item.methodology} (Score: {item.score})</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                      item.priority === 'Crítica' ? 'bg-red-100 text-red-600 border-red-200' : 'bg-blue-100 text-blue-600 border-blue-200'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                Voltar
              </button>
              <button 
                onClick={() => setStep(3)}
                className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
              >
                Revisar Documento
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-xl space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900">Resumo Final</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Tudo pronto! O documento será gerado para edição</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Documento</p>
                  <p className="text-xs font-bold text-slate-800">{newReport.title}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Empresa</p>
                  <p className="text-xs font-bold text-slate-800">{newReport.company_name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleCreateReport}
                disabled={isSubmitting}
                className={`w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Gerando Documento...' : 'Gerar Laudo e Abrir Editor'}
              </button>
              <button 
                onClick={() => setStep(2)} 
                disabled={isSubmitting}
                className="w-full py-4 bg-white border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 hover:border-slate-300 rounded-2xl transition-all disabled:opacity-50"
              >
                Ajustar Seleção de Itens
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (view === 'edit' && selectedReport) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between sticky top-0 bg-slate-50/95 backdrop-blur-md py-4 z-20 border-b border-slate-200 px-6 rounded-b-3xl">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setView('list')} 
              className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 transition-all shadow-sm"
              title="Voltar para a lista"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded uppercase tracking-wider">Editorer Profissional</span>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">{selectedReport.title}</h2>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{selectedReport.company_name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => { setView('preview'); }}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-slate-400 transition-all flex items-center space-x-2 shadow-sm"
            >
              <FileText size={14} className="text-slate-400" />
              <span>Ver Prévia do PDF</span>
            </button>
            <button 
              onClick={handleUpdateReport}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center space-x-2 shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <Save size={14} />
              <span>Salvar Progresso</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 h-[calc(100vh-200px)]">
          {/* Section Navigation */}
          <div className="col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-50 bg-slate-50/50">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estrutura do Laudo (NR17)</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {SECTIONS.filter(s => {
                const reportType = (selectedReport as any)?.content?.original_type || selectedReport?.report_type;
                if (reportType === 'AEP' && s.id === 'tarefas') return false;
                if (reportType === 'AET' && s.id === 'perigos') return false;
                if (reportType === 'PGR' && ['perigos', 'tarefas', 'populacao'].includes(s.id)) return true;
                if (['PGR', 'LIP'].includes(reportType || '') && ['organizacao', 'validacao'].includes(s.id)) return false;
                return true;
              }).map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveEditorSection(s.id)}
                  className={`w-full text-left p-3 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-between group ${
                    activeEditorSection === s.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span>{s.title}</span>
                  {(editingContent[s.id]?.length || 0) > 10 && (
                    <CheckCircle2 size={12} className={activeEditorSection === s.id ? 'text-white' : 'text-emerald-500'} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Editor Area */}
          <div className="col-span-9 flex flex-col space-y-4">
            <div className="flex-1 flex space-x-4 min-h-0">
              <div className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 flex-1 flex flex-col transition-all duration-500 overflow-hidden`}>
                <div className="mb-8 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{SECTIONS.find(s => s.id === activeEditorSection)?.title}</h3>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1 bg-blue-50/50 px-3 py-1 rounded-lg inline-block">
                      Diretriz Técnica: {SECTION_TIPS[activeEditorSection]}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {activeEditorSection === 'normas' && (
                      <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">
                        Selecione as NRs aplicáveis
                      </div>
                    )}
                    <button 
                      onClick={() => setShowAssistant(!showAssistant)}
                      className={`p-2 rounded-xl border transition-all ${showAssistant ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-200 hover:text-blue-500'}`}
                      title="Assistente de Redação"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                </div>

                {activeEditorSection === 'normas' ? (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-3xl overflow-y-auto max-h-[400px]">
                    {AVAILABLE_NRS.map(nr => (
                      <label 
                        key={nr.id} 
                        className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          editingContent['normas']?.includes(nr.label)
                            ? 'border-blue-600 bg-white shadow-md' 
                            : 'border-transparent bg-white/50 hover:border-slate-200'
                        }`}
                      >
                        <input 
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          checked={editingContent['normas']?.includes(nr.label) || false}
                          onChange={(e) => {
                            const current = editingContent['normas'] || '';
                            const nrs = current.split('\n').filter(n => n.trim() !== '');
                            if (e.target.checked) {
                              if (!nrs.includes(nr.label)) nrs.push(nr.label);
                            } else {
                              const idx = nrs.indexOf(nr.label);
                              if (idx > -1) nrs.splice(idx, 1);
                            }
                            setEditingContent({...editingContent, normas: nrs.join('\n')});
                          }}
                        />
                        <span className="text-[11px] font-bold text-slate-700">{nr.label}</span>
                      </label>
                    ))}
                    <div className="col-span-2 mt-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Outras Normas/Referências</label>
                      <textarea
                        value={editingContent['normas_extra'] || ''}
                        onChange={(e) => setEditingContent({...editingContent, normas_extra: e.target.value})}
                        className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-xs font-medium text-slate-700 outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                        placeholder="Adicione outras normas ou referências técnicas aqui..."
                      />
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={editingContent[activeEditorSection] || ''}
                    onChange={(e) => setEditingContent({...editingContent, [activeEditorSection]: e.target.value})}
                    className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-3xl p-8 text-xs font-medium text-slate-700 leading-relaxed outline-none focus:ring-4 focus:ring-blue-600/5 transition-all resize-none placeholder:text-slate-300 font-sans"
                    placeholder={
                      activeEditorSection === 'anexos' 
                        ? "Descreva aqui as fotos, diagramas e outros documentos que serão anexados ao final do laudo..."
                        : "Insira as informações técnicas baseadas na NR-17 e no seu manual de aplicação..."
                    }
                  />
                )}
              </div>

              {showAssistant && SECTION_TEMPLATES[activeEditorSection] && (
                <div className="w-80 bg-slate-900 rounded-[2.5rem] p-6 flex flex-col space-y-6 shadow-2xl animate-in slide-in-from-right-4 duration-300 overflow-hidden border border-slate-800">
                  <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                      <Save size={16} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Modelos NR-17</h4>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Clique para Inserir</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1">
                    {/* Checklist Section */}
                    {SECTION_CHECKLISTS[activeEditorSection] && (
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <h5 className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center">
                          <CheckCircle2 size={10} className="mr-1" /> Checklist Técnico
                        </h5>
                        <div className="space-y-2">
                          {SECTION_CHECKLISTS[activeEditorSection].map((item, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <div className="w-1 h-1 rounded-full bg-slate-600" />
                              <span className="text-[9px] text-slate-400 font-medium italic">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Templates Section */}
                    {SECTION_TEMPLATES[activeEditorSection]?.map((template, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const currentText = editingContent[activeEditorSection] || '';
                          const newText = currentText ? `${currentText}\n\n${template}` : template;
                          setEditingContent({ ...editingContent, [activeEditorSection]: newText });
                        }}
                        className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 p-4 rounded-2xl transition-all group"
                      >
                        <p className="text-[10px] text-slate-300 leading-relaxed group-hover:text-white transition-colors">{template}</p>
                        <div className="mt-2 flex items-center text-[8px] font-black text-blue-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Adicionar texto</span>
                          <Plus size={10} className="ml-1" />
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                    <p className="text-[9px] text-blue-300 font-medium leading-relaxed italic">
                      "A análise deve levar em conta o saber do trabalhador sobre sua própria situação de trabalho." - Manual NR-17
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-2 flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                 <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                       <Edit3 size={14} className="text-blue-500" />
                       <span className="text-[10px] font-black text-slate-400 uppercase">Editor Técnico</span>
                    </div>
                    {activeEditorSection === 'diagnostico' && (
                      <button 
                        onClick={() => {
                          const assessmentsText = inventory
                            .filter(i => selectedReport?.assessment_ids.includes(i.id))
                            .map(i => `• ${i.sector} - ${i.task}: Risco ${i.priority} (${i.methodology})`)
                            .join('\n');
                          setEditingContent({
                            ...editingContent, 
                            diagnostico: (editingContent['diagnostico'] || '') + '\nResultados do Inventário:\n' + assessmentsText
                          });
                        }}
                        className="text-[9px] font-black bg-blue-600 text-white px-3 py-1 rounded-lg uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
                      >
                        Importar Dados do Inventário
                      </button>
                    )}
                 </div>
                 <div className="text-[10px] font-black text-slate-400">
                    Caracteres: {(editingContent[activeEditorSection]?.length || 0)}
                 </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

  if (view === 'create') return renderCreateWizard();

  if (view === 'preview' && selectedReport) {
    const reportAssessments = inventory.filter(i => selectedReport.assessment_ids.includes(i.id));

    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/95 backdrop-blur-md py-4 z-10 px-6 rounded-b-3xl border-b border-slate-200 shadow-sm">
          <button 
            onClick={() => setView('edit')}
            className="group flex items-center space-x-3 px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Voltar ao Editor</span>
          </button>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => window.print()}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center space-x-2 shadow-xl shadow-slate-900/10 active:scale-95"
            >
              <Printer size={16} />
              <span>Imprimir / Gerar PDF</span>
            </button>
          </div>
        </div>

        {/* Report Document Mockup */}
        <div id="report-document" className="bg-white shadow-2xl rounded-sm w-full p-[8%] flex flex-col border border-slate-100 print:shadow-none print:border-none min-h-[1414px]">
          {/* Header */}
          <div className="flex justify-between items-start border-b-[3px] border-slate-900 pb-8 mb-12">
            <img src={branding.logo} alt="Logo" className="h-16 object-contain" referrerPolicy="no-referrer" />
            <div className="text-right">
              <h1 className="text-xl font-black text-slate-900 uppercase leading-none">{selectedReport.report_type === 'AET' ? 'Análise Ergonômica' : 'Laudo Ocupacional'}</h1>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Protocolo: #REP-{selectedReport.id.slice(0, 6).toUpperCase()}</p>
            </div>
          </div>

          <div className="space-y-12 flex-1">
            {/* Dynamic Sections from Editor */}
            {SECTIONS.filter(s => {
                const reportType = (selectedReport as any).content?.original_type || selectedReport.report_type;
                if (reportType === 'AEP' && s.id === 'tarefas') return false;
                if (reportType === 'AET' && s.id === 'perigos') return false;
                if (selectedReport.report_type === 'PGR' && ['perigos', 'tarefas', 'populacao'].includes(s.id)) return true;
                if (['PGR', 'LIP'].includes(selectedReport.report_type) && ['organizacao', 'validacao'].includes(s.id)) return false;
                return true;
            }).map((section) => {
              const content = editingContent[section.id] || selectedReport.content?.[section.id];
              const isNormas = section.id === 'normas';
              
              if (!content && section.id !== 'identificacao' && section.id !== 'diagnostico' && !isNormas) return null;

              return (
                <section key={section.id} className="space-y-6">
                  <h2 className="text-[11px] font-black uppercase text-white bg-slate-900 px-3 py-2 border-l-[6px] border-blue-600 flex items-center">
                    <CheckCircle2 size={14} className="mr-2" />
                    {section.title}
                  </h2>
                  
                  {section.id === 'identificacao' && (
                    <div className="grid grid-cols-2 gap-y-6 gap-x-12 px-2">
                       {/* Identity details already handled or can be added here if customized */}
                       <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Empresa Solicitante</label>
                        <p className="text-xs font-bold text-slate-800 leading-tight border-b border-slate-100 pb-1">{selectedReport.company_name}</p>
                      </div>
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Tipo de Relatório</label>
                        <p className="text-xs font-bold text-slate-800 leading-tight border-b border-slate-100 pb-1">{selectedReport.report_type}</p>
                      </div>
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Título / Descrição</label>
                        <p className="text-xs font-bold text-slate-800 leading-tight border-b border-slate-100 pb-1">{selectedReport.title}</p>
                      </div>
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Data de Emissão</label>
                        <p className="text-xs font-bold text-slate-800 leading-tight border-b border-slate-100 pb-1">{new Date(selectedReport.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  )}

                  {isNormas && (
                    <div className="px-2 space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-800">Normas Regulamentadoras Selecionadas:</p>
                        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                          {content?.split('\n').filter(Boolean).map((n: string, i: number) => (
                            <li key={i}>{n}</li>
                          )) || <li className="italic text-slate-400">Nenhuma norma selecionada.</li>}
                        </ul>
                      </div>
                      {editingContent['normas_extra'] && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-800">Outras Referências:</p>
                          <p className="text-xs text-slate-700 whitespace-pre-wrap">{editingContent['normas_extra']}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {section.id === 'diagnostico' && reportAssessments.length > 0 && (
                    <div className="space-y-4 px-2 mb-4">
                      <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Quadros de Riscos Identificados:</p>
                      {reportAssessments.map(item => (
                        <div key={item.id} className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center group">
                          <div>
                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{item.sector} - {item.task}</p>
                            <p className="text-[9px] font-bold text-slate-400">Metodologia: {item.methodology} | Score: {item.score}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                              item.priority === 'Crítica' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                              Risco: {item.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {content && !isNormas && (
                    <p className="text-xs text-slate-700 leading-relaxed text-justify px-2 whitespace-pre-wrap">
                      {content}
                    </p>
                  )}
                </section>
              );
            })}
          </div>

          {/* Footer / Signature */}
          <div className="mt-20 border-t-2 border-slate-100 pt-10 flex flex-col items-center justify-center text-center">
            <div className="relative mb-4">
              <img src={branding.signature} alt="Signature" className="h-14 mix-blend-multiply opacity-80" referrerPolicy="no-referrer" />
              <img src={branding.stamp} alt="Stamp" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 opacity-30 mix-blend-multiply rotate-6" referrerPolicy="no-referrer" />
            </div>
            <p className="text-xs font-black text-slate-900 uppercase underline decoration-[1.5px] underline-offset-[3px]">{branding.name}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-1.5">{branding.registry}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Gerenciamento de Laudos</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Controle de Protocolos e Emissões Oficiais</p>
        </div>
        <button 
          onClick={() => setView('create')}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-3 shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>Criar Novo Protocolo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Documentos Ativos', val: reports.length, icon: <FileText size={18} className="text-blue-500" /> },
          { label: 'Em Elaboração', val: reports.filter(r => r.status === 'Draft').length, icon: <MoreHorizontal size={18} className="text-amber-500" /> },
          { label: 'Concluídos', val: reports.filter(r => r.status === 'Completed').length, icon: <CheckCircle2 size={18} className="text-emerald-500" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black text-slate-800">{stat.val.toString().padStart(2, '0')}</h4>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center bg-slate-50/30 space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar por cliente ou título..." 
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 border border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white hover:text-slate-800 transition-all">
            <Filter size={14} />
            <span>Filtrar</span>
          </button>
        </div>

        <div className="overflow-x-auto px-2 pb-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-6">Tipo</th>
                <th className="px-6 py-6">Protocolo / Cliente</th>
                <th className="px-6 py-6">Data de Criação</th>
                <th className="px-6 py-6">Status</th>
                <th className="px-6 py-6 text-right pr-10">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] animate-pulse">Carregando Protocolos...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Nenhum laudo encontrado</td></tr>
              ) : (
                reports.map((r) => {
                  const displayType = (r as any).content?.original_type || r.report_type;
                  return (
                    <tr key={r.id} onClick={() => { setSelectedReport(r); setEditingContent(r.content || {}); setView('edit'); }} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] ${
                          displayType === 'AET' ? 'bg-blue-600 text-white' : 
                          displayType === 'AEP' ? 'bg-emerald-600 text-white' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {displayType}
                        </div>
                      </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-black text-slate-800 group-hover:text-blue-600 transition-colors">{r.title}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">{r.company_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[11px] text-slate-500 font-bold tabular-nums">{new Date(r.created_at).toLocaleDateString('pt-BR')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                        r.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                        r.status === 'Draft' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {r.status === 'Completed' ? 'Finalizado' : r.status === 'Draft' ? 'Rascunho' : 'Revisão'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right pr-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={(e) => deleteReport(r.id, e)}
                          className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="p-2 text-slate-200 group-hover:text-slate-400 transition-colors">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
