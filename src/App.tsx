/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, FileText, Users, Settings, Activity, ClipboardList, AlertCircle, ChevronRight, Menu, X, ArrowUpRight, Shield, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RulaCalculator } from './components/analise/RulaCalculator';
import { RebaCalculator } from './components/analise/RebaCalculator';
import { CorlettCalculator } from './components/analise/CorlettCalculator';
import { MooreGargCalculator } from './components/analise/MooreGargCalculator';
import { CoutoCalculator } from './components/analise/CoutoCalculator';
import { NioshCalculator } from './components/analise/NioshCalculator';
import { BorgScaleCalculator } from './components/analise/BorgScaleCalculator';
import { RiskMatrix } from './components/analise/RiskMatrix';
import { LaudosView } from './components/LaudosView';
import { ComplianceChart } from './components/dashboard/ComplianceChart';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { MetodologiasView } from './components/analise/MetodologiasView';
import { SettingsView } from './components/SettingsView';
import { PGRView } from './components/PGRView';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Login } from './components/auth/Login';
import { AssessmentCategory, MethodologyType, MethodologyInfo, InventoryItem } from './types';

export default function App() {
  const [session, setSession] = React.useState<any>(null);
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isCreatingReport, setIsCreatingReport] = React.useState(false);
  
  const [branding, setBranding] = React.useState({
    logo: '/input_file_1.png',
    signature: '/input_file_0.png',
    stamp: '/input_file_2.png',
    name: 'Marco Aurélio Delboni Salvanhini',
    registry: '297597-F'
  });

  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);

  const fetchInventory = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('date', { ascending: false });
    
    if (!error && data) {
      setInventory(data);
    }
  };

  React.useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchInventory();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchInventory();
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (!session && !isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl max-w-sm text-center space-y-4">
          <AlertCircle className="mx-auto text-red-500" size={48} />
          <h2 className="text-xl font-bold">Configuração Pendente</h2>
          <p className="text-xs text-slate-500 font-medium">As variáveis de ambiente do Supabase não foram configuradas. Por favor, adicione <b>VITE_SUPABASE_URL</b> e <b>VITE_SUPABASE_ANON_KEY</b> nas configurações do projeto.</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="bg-slate-900 border-r border-slate-800 overflow-hidden hidden md:flex flex-col text-slate-300 shadow-xl z-20"
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <img src={branding.logo} alt="FEMIC Logo" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
            <span className="font-semibold tracking-tight text-white">Hub FEMIC</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest mt-2 text-slate-500 font-bold">Módulo de Ergonomia</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          <div className="text-[10px] px-3 py-2 uppercase font-bold text-slate-500">Gestão de Laudos</div>
          <SidebarItem 
            icon={<LayoutDashboard size={16} />} 
            label="Dashboard Geral" 
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <SidebarItem 
            icon={<FileText size={16} />} 
            label="Laudos (AET / LIP)" 
            active={activeTab === 'laudos'}
            onClick={() => setActiveTab('laudos')}
          />
          <SidebarItem 
            icon={<ClipboardList size={16} />} 
            label="PGR / NR1" 
            active={activeTab === 'pgr'}
            onClick={() => setActiveTab('pgr')}
          />
          
          <div className="text-[10px] px-3 py-2 mt-4 uppercase font-bold text-slate-500">Ferramentas de Análise</div>
          <SidebarItem 
            icon={<Activity size={16} />} 
            label="RULA / REBA" 
            active={activeTab === 'metodologias'}
            onClick={() => setActiveTab('metodologias')}
          />
          <SidebarItem 
            icon={<Settings size={16} />} 
            label="Configurações" 
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
           <SidebarItem 
            icon={<Users size={16} />} 
            label="Empresas" 
            active={activeTab === 'empresas'}
            onClick={() => setActiveTab('empresas')}
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-700"></div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Administrador</p>
              <p className="text-[10px] text-slate-500 truncate">femic@fisioterapia.com</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-800">
           <button 
             onClick={() => supabase.auth.signOut()}
             className="w-full flex items-center px-3 py-2 rounded-md text-sm text-red-400 hover:bg-red-500/10 transition-colors font-bold"
           >
             <X size={16} className="mr-3" />
             Sair do Sistema
           </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 md:block hidden"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-slate-800 flex items-center">
              <span className="mr-2 text-blue-600">/</span> 
              {activeTab === 'dashboard' ? 'Dashboard de Conformidade' : activeTab.toUpperCase()}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-[11px] px-2 py-1 bg-green-100 text-green-700 rounded font-bold border border-green-200 uppercase">
              NR17 ATUALIZADA (v.2023)
            </div>
            <button 
              onClick={() => {
                setActiveTab('laudos');
                setIsCreatingReport(true);
              }}
              className="px-6 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center space-x-2"
            >
              <Plus size={14} />
              <span>Emitir Novo Laudo</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <DashboardOverview inventory={inventory} />}
              {activeTab === 'laudos' && (
                <LaudosView 
                  branding={branding} 
                  initialCreate={isCreatingReport} 
                  onViewChange={() => setIsCreatingReport(false)} 
                />
              )}
              {activeTab === 'metodologias' && (
                <MetodologiasView 
                  onSave={async (item) => {
                    const newItem = {
                      ...item,
                      user_id: session.user.id,
                      status: 'Pendente',
                      date: new Date().toISOString().split('T')[0]
                    };
                    const { error } = await supabase.from('inventory').insert([newItem]);
                    if (!error) fetchInventory();
                  }} 
                />
              )}
              {activeTab === 'pgr' && <PGRView inventory={inventory} />}
              {activeTab === 'settings' && <SettingsView branding={branding} setBranding={setBranding} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-3 py-2 rounded-md transition-colors text-sm ${
      active 
        ? 'bg-blue-600/10 text-blue-400 font-medium' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
    }`}
  >
    <span className={`w-4 h-4 mr-3 flex items-center justify-center ${active ? 'text-blue-400' : ''}`}>{icon}</span>
    <span>{label}</span>
  </button>
);


