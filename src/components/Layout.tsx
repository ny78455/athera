import React from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { LogOut, Activity, BarChart3, Settings, Shield } from "lucide-react";
import { motion } from "motion/react";

export function Layout({ children, user }: { children: React.ReactNode; user: User | null }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {user && (
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 shadow-xl group cursor-pointer overflow-hidden">
                <div className="w-5 h-5 bg-blue-500 rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-700 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <span className="font-bold text-slate-900 text-xl tracking-tighter font-display">AETHER<span className="text-blue-600">.</span>OS</span>
                <span className="text-slate-200 mx-3 font-light text-2xl">|</span>
                <div className="flex flex-col -space-y-1">
                  <span className="font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em] font-mono">Telemetry Node</span>
                  <span className="font-bold text-slate-900 text-xs font-mono">{user.email?.split('@')[0]}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => supabase.auth.signOut()}
                className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors uppercase tracking-widest"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-auto bg-slate-50/50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-[1600px] mx-auto p-4 md:p-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
