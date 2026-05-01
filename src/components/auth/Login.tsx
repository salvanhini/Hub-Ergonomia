/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { supabase } from '../../lib/supabase';
import { LogIn, ShieldCheck, Mail, Lock } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error("Supabase não inicializado.");
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } catch (err: any) {
      setError(err.message || "Erro inesperado ao entrar.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error("Supabase não inicializado.");
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setError("Verifique seu e-mail para confirmar o cadastro!");
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado no cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/20">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">ErgoSystem AI</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Gestão Ergonômica Avançada</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all outline-none"
                placeholder="ex: voce@empresa.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] font-bold text-red-600 text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white rounded-2xl py-4 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-900/10"
            >
              {loading ? 'Acessando...' : 'Entrar no Sistema'}
            </button>
            <button 
              type="button" 
              onClick={handleSignUp}
              disabled={loading}
              className="w-full text-slate-400 py-2 font-black text-[9px] uppercase tracking-[0.1em] hover:text-slate-600 transition-colors"
            >
              Não tem conta? Cadastre-se
            </button>
          </div>
        </form>
      </div>
      
      <p className="mt-8 text-[10px] font-bold text-white/30 uppercase tracking-widest">
        POWERED BY POSTGRESQL & AI
      </p>
    </div>
  );
};
