/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { User } from "@supabase/supabase-js";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/Layout";

const queryClient = new QueryClient();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isConfigured = 
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_URL !== "https://placeholder.supabase.co" &&
    import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isConfigured]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-blue-100">
            <div className="w-6 h-6 bg-white rounded-sm rotate-45"></div>
          </div>
          <div className="text-xs font-bold tracking-[0.3em] text-slate-400 uppercase">Aether Systems</div>
        </div>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          <div className="flex items-center space-x-3 mb-6 text-rose-600">
            <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-rose-600 rounded-full animate-ping"></div>
            </div>
            <h1 className="font-bold text-lg">Configuration Required</h1>
          </div>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Please configure your Supabase environment variables in the <b>Secrets panel</b> of AI Studio to enable authentication and data storage.
          </p>
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 font-mono text-[10px] break-all">
              VITE_SUPABASE_URL
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 font-mono text-[10px] break-all">
              VITE_SUPABASE_ANON_KEY
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Layout user={user}>
        {user ? <Dashboard user={user} /> : <Auth />}
      </Layout>
    </QueryClientProvider>
  );
}
