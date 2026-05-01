import React from 'react';
import { Shield, Users } from 'lucide-react';

export const SettingsView = ({ branding, setBranding }: { branding: any, setBranding: any }) => {
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const signatureInputRef = React.useRef<HTMLInputElement>(null);
  const stampInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBranding((prev: any) => ({ ...prev, [field]: url }));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Preferências do Sistema</h3>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Gerencie sua identidade profissional, branding e normas técnicas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <input type="file" ref={logoInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'logo')} accept="image/*" />
          <input type="file" ref={signatureInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'signature')} accept="image/*" />
          <input type="file" ref={stampInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'stamp')} accept="image/*" />

          {/* Identidade Profissional */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
              <Shield size={16} className="mr-2 text-blue-600" />
              Identidade Profissional (Validação Digital)
            </h4>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assinatura Digitalizada</label>
                  <div 
                    onClick={() => signatureInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all cursor-pointer group relative"
                  >
                    <img src={branding.signature} alt="Assinatura" className="h-16 object-contain mb-2 mix-blend-multiply" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Alterar Arquivo</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Carimbo Profissional</label>
                  <div 
                    onClick={() => stampInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all cursor-pointer group relative"
                  >
                    <img src={branding.stamp} alt="Carimbo" className="h-16 object-contain mb-2 mix-blend-multiply" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Alterar Arquivo</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-3 tracking-widest">Logo da Empresa (FEMIC)</label>
                <div className="flex items-center space-x-6">
                  <div 
                    onClick={() => logoInputRef.current?.click()}
                    className="w-24 h-24 bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-center shadow-inner group cursor-pointer relative overflow-hidden"
                  >
                    <img src={branding.logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <span className="text-[8px] text-white font-bold uppercase">Editar</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 max-w-xs font-medium">Sua logomarca será aplicada automaticamente em todos os cabeçalhos de PDFs e relatórios gerados.</p>
                    <div className="flex space-x-2">
                       <button onClick={() => logoInputRef.current?.click()} className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-3 py-1.5 rounded border border-blue-100 hover:bg-blue-100 transition-colors">Trocar Imagem</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dados Legais */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
               <Users size={16} className="mr-2 text-slate-400" />
               Informações de Registro
            </h4>
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nome Completo</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                    value={branding.name}
                    onChange={(e) => setBranding((prev: any) => ({...prev, name: e.target.value}))}
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Registro (Conselho/Número)</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-700 outline-none" 
                      value={branding.registry}
                      onChange={(e) => setBranding((prev: any) => ({...prev, registry: e.target.value}))}
                    />
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl sticky top-24">
             <h4 className="font-bold text-sm mb-4 border-b border-white/10 pb-2 uppercase tracking-widest text-slate-400">Validação Profissional</h4>
             <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-tight">Perito Certificado</p>
                  <p className="text-[10px] text-slate-400">Status: Conformidade Total</p>
                </div>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed mb-8 font-medium">
               Sua assinatura e carimbo são processados com canal alfa para sobreposição perfeita em fundos de documentos, garantindo um visual profissional nos laudos digitais.
             </p>
             <div className="space-y-3">
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                  Salvar Preferências
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
