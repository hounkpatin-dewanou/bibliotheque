'use client';

import { useEffect, useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Users, 
  ArrowLeftRight, 
  BarChart3, 
  Camera, 
  Info,
  ChevronRight
} from 'lucide-react';
import axiosInstance from '@/lib/axios';

interface Stats {
  nbLivres: number;
  nbUtilisateurs: number;
  nbEmpruntsEnCours: number;
}

export default function AdminHome() {
  const [stats, setStats] = useState<Stats>({ nbLivres: 0, nbUtilisateurs: 0, nbEmpruntsEnCours: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupération des statistiques détaillées pour l'administrateur
    axiosInstance.get('/stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des statistiques:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center animate-in fade-in duration-700">
      
      {/* --- SECTION PROFIL (Google Style) --- */}
      <div className="relative group mb-6">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-md border-4 border-white">
          A
        </div>
        <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors text-gray-600">
          <Camera size={16} />
        </button>
      </div>

      <h1 className="text-[28px] font-normal text-gray-900 mb-1">
        Bienvenue, Amadou SARR
      </h1>
      <p className="text-gray-500 text-[14px] mb-10">
        Gérez les livres, les utilisateurs et les demandes d&apos;emprunt de la bibliothèque LCL.
      </p>

      {/* --- BARRE DE RECHERCHE CENTRALE --- */}
      <div className="w-full max-w-[720px] relative mb-12 group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
          <Search size={22} />
        </div>
        <input 
          type="text" 
          placeholder="Rechercher dans votre interface d'administration..."
          className="w-full bg-white border border-gray-200 rounded-full py-4.5 pl-14 pr-6 outline-none shadow-sm hover:shadow-md focus:shadow-md focus:border-transparent transition-all text-gray-700 text-lg"
        />
      </div>

      {/* --- GRILLE DE GESTION (Cartes CRUD & Stats) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[850px]">
        
        {/* Gestion des Livres */}
        <ActionCard 
          href="/admin/livres"
          icon={<BookOpen className="text-blue-600" size={24} />}
          title="Gestion des livres"
          description="Création, lecture, mise à jour et suppression de livres dans votre catalogue."
          badge={`${stats.nbLivres} titres`}
        />

        {/* Gestion des Utilisateurs */}
        <ActionCard 
          href="/admin/utilisateurs"
          icon={<Users className="text-purple-600" size={24} />}
          title="Gestion des utilisateurs"
          description="Contrôlez les accès, gérez les rôles et les informations des membres inscrits."
          badge={`${stats.nbUtilisateurs} inscrits`}
        />

        {/* Gestion des Emprunts */}
        <ActionCard 
          href="/admin/emprunts"
          icon={<ArrowLeftRight className="text-orange-600" size={24} />}
          title="Demandes d'emprunt"
          description="Traitez les demandes en cours et validez les retours de livres."
          badge={`${stats.nbEmpruntsEnCours} en attente`}
        />

        {/* Statistiques Détaillées */}
        <ActionCard 
          href="/admin/stats"
          icon={<BarChart3 className="text-emerald-600" size={24} />}
          title="Statistiques détaillées"
          description="Analyse du nombre d'emprunts et activité globale de la plateforme."
          badge="Rapports"
        />
      </div>

      {/* --- FOOTER INFORMATIF --- */}
      <div className="mt-16 p-6 border border-gray-100 rounded-2xl flex items-start gap-4 max-w-[700px] bg-gray-50/50">
        <Info className="text-blue-600 mt-1 shrink-0" size={20} />
        <p className="text-[13px] text-gray-500 leading-relaxed">
          En tant qu&apos;administrateur, vos actions impactent directement la disponibilité des ouvrages. 
          Assurez-vous de vérifier les demandes d&apos;emprunt régulièrement pour maintenir une fluidité de service.
          <a href="#" className="text-blue-600 font-medium hover:underline ml-1">En savoir plus sur la gestion LCL</a>
        </p>
      </div>
    </div>
  );
}

// Sous-composant pour les cartes d'action
// 1. Définition du type pour les props
interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  badge: string;
}

// 2. Application du type au composant
function ActionCard({ icon, title, description, href, badge }: ActionCardProps) {
  return (
    <a 
      href={href}
      className="bg-white border border-gray-200 rounded-2xl p-6 transition-all hover:border-gray-300 hover:shadow-sm group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
            {badge}
          </span>
        </div>
        <h3 className="text-gray-900 font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          {description}
        </p>
      </div>
      <div className="flex items-center text-blue-600 text-sm font-medium">
        Accéder
        <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  );
}