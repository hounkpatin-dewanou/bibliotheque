'use client';

import { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Clock, 
  ArrowUpRight, 
  Loader2,
  RefreshCcw,
} from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';

interface Stats {
  nbLivres: number;
  nbUtilisateurs: number;
  nbEmpruntsEnCours: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/stats');
      setStats(res.data);
    } catch (err) {
      console.error("Erreur stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-black" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Analyse des statistiques</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* HEADER MINIMALISTE */}
      <div className="flex justify-between items-end border-b border-gray-100 pb-10">
        <div>
          <h1 className="text-6xl font-black tracking-tighter uppercase leading-none text-black">
            Statistiques<br />
          </h1>
        </div>
        <button 
          onClick={fetchStats}
          className="group p-5 rounded-full border border-gray-100 hover:border-black transition-all duration-500"
        >
          <RefreshCcw size={20} className="text-gray-300 group-hover:text-black group-hover:rotate-180 transition-all duration-700" />
        </button>
      </div>

      {/* GRID STATS - 3 CARDS COHÉRENTES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* CARD 1: LIVRES EMPRUNTÉS */}
        <div className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
          <div className="flex justify-between items-start mb-12">
            <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors duration-500 text-black">
              <BookOpen size={28} />
            </div>
            <ArrowUpRight className="text-gray-100 group-hover:text-black transition-colors" />
          </div>
          <label className="text-[10px] font-black uppercase text-black tracking-[0.2em] block mb-2">Livres Empruntés</label>
          <p className="text-7xl font-black tracking-tighter text-black">{stats?.nbLivres}</p>
        </div>

        {/* CARD 2: UTILISATEURS INSCRITS */}
        <div className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
          <div className="flex justify-between items-start mb-12">
            <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors duration-500 text-black">
              <Users size={28} />
            </div>
            <ArrowUpRight className="text-gray-100 group-hover:text-black transition-colors" />
          </div>
          <label className="text-[10px] font-black uppercase text-black tracking-[0.2em] block mb-2">Utilisateurs Inscrits</label>
          <p className="text-7xl font-black tracking-tighter text-black">{stats?.nbUtilisateurs}</p>
        </div>

        {/* CARD 3: DEMANDES EN COURS (MISE EN AVANT NOIRE) */}
        <div className="group bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-300 hover:-translate-y-2 transition-all duration-500">
          <div className="flex justify-between items-start mb-12">
            <div className="p-4 bg-gray-800 rounded-2xl text-white">
              <Clock size={28} />
            </div>
          </div>
          <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-2">Demandes en cours</label>
          <p className="text-7xl font-black tracking-tighter text-black">{stats?.nbEmpruntsEnCours}</p>
        </div>

      </div>

      

    </div>
  );
}