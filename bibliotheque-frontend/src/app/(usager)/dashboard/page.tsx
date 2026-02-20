'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/user/NavbarUsager';
import { Loader2, BookOpen, Clock, CheckCircle2, AlertCircle, Calendar, Hash, User } from 'lucide-react';
import axiosInstance from '@/lib/axios';

// --- INTERFACES COMPLÈTES ---
interface Livre {
  id: number;
  titre: string;
  auteur: string;
  isbn?: string;
  categorie?: string;
}

interface Emprunt {
  id: number;
  dateDebut: string;
  dateFinPrevue: string;
  dateRetourEffective: string | null;
  nbExemplaires: number;
  accordee: boolean | null;
  usager: string | { id: number; email: string };
  livre: string | Livre; // Peut être un lien (string) ou l'objet complet
}

interface HydraData<T> {
  'hydra:member'?: T[];
  'member'?: T[];
}

interface HydraResponse<T> {
  'hydra:member'?: T[];
}

export default function DashboardPage() {
  const [empruntsComplets, setEmpruntsComplets] = useState<Emprunt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const ensureArray = <T,>(data: HydraData<T> | T[] | undefined): T[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data['hydra:member'] || data['member'] || [];
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Session expiree");

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userEmail = payload.username || payload.email;

        // 1. Récupérer Utilisateurs + Livres + Emprunts en parallèle pour la vitesse
        const [resUsers, resLivres, resEmprunts] = await Promise.all([
  axiosInstance.get('/utilisateurs?pagination=false'), // Désactive la pagination
  axiosInstance.get('/livres?pagination=false'),       // Désactive la pagination
  axiosInstance.get('/emprunts?pagination=false')      // CRUCIAL : récupère tout pour filtrer
]);

        const users = ensureArray<{ id: number; email: string }>(resUsers.data);
        const livres = ensureArray<Livre>(resLivres.data);
        const allEmprunts = ensureArray<Emprunt>(resEmprunts.data);

        const currentUser = users.find(u => u.email === userEmail);
        if (!currentUser) throw new Error("Profil utilisateur introuvable");

        // 2. Filtrage et Enrichissement (La "Jointure")
        const enriched = allEmprunts
          .filter(emp => {
            const uId = typeof emp.usager === 'string' 
              ? parseInt(emp.usager.split('/').pop() || '0') 
              : emp.usager.id;
            return uId === currentUser.id;
          })
          .map(emp => {
            // Si le livre est une string (IRI), on cherche l'objet correspondant dans la table livres
            if (typeof emp.livre === 'string') {
              const livreId = parseInt(emp.livre.split('/').pop() || '0');
              const livreInfos = livres.find(l => l.id === livreId);
              return { ...emp, livre: livreInfos || emp.livre };
            }
            return emp;
          });

        setEmpruntsComplets(enriched);
      } catch (err) {
        console.error("Dashboard Error:", err);
        setError("Impossible de synchroniser vos donnees.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatus = (emp: Emprunt) => {
    if (emp.dateRetourEffective) return {
      label: "Rendu",
      color: "text-emerald-700 bg-emerald-100",
      icon: <CheckCircle2 size={14} />
    };
    if (emp.accordee === false) return {
      label: "Refuse",
      color: "text-red-700 bg-red-100",
      icon: <AlertCircle size={14} />
    };
    if (emp.accordee === true) return {
      label: "Accepte / En cours",
      color: "text-blue-700 bg-blue-100",
      icon: <BookOpen size={14} />
    };
    return {
      label: "En attente",
      color: "text-amber-700 bg-amber-100",
      icon: <Clock size={14} />
    };
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="py-20 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-black text-slate-900">Tableau de bord</h1>
            <p className="text-slate-500">Consultez l&apos;historique complet de vos emprunts et demandes.</p>
          </header>

          {loading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-slate-400 font-medium">Chargement de votre bibliotheque...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-4">
              <AlertCircle /> {error}
            </div>
          ) : (
            <div className="grid gap-6">
              {empruntsComplets.length > 0 ? (
                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="px-6 py-5 text-sm font-semibold uppercase tracking-wider">Livre / Auteur</th>
                        <th className="px-6 py-5 text-sm font-semibold uppercase tracking-wider">Details Emprunt</th>
                        <th className="px-6 py-5 text-sm font-semibold uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-5 text-sm font-semibold uppercase tracking-wider text-right">Exemplaires</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {empruntsComplets.map((emp) => {
                        const status = getStatus(emp);
                        const livreObj = typeof emp.livre === 'object' ? emp.livre as Livre : null;
                        
                        return (
                          <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-6">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800 text-lg">
                                  {livreObj?.titre || "Titre non disponible"}
                                </span>
                                <span className="text-slate-500 flex items-center gap-1 text-sm">
                                  <User size={12} /> {livreObj?.auteur || "Auteur inconnu"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <div className="space-y-1 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} className="text-blue-500" />
                                  <span>Debut: <b>{new Date(emp.dateDebut).toLocaleDateString()}</b></span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={14} className="text-orange-500" />
                                  <span>Fin: <b>{new Date(emp.dateFinPrevue).toLocaleDateString()}</b></span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase ${status.color}`}>
                                {status.icon} {status.label}
                              </span>
                            </td>
                            <td className="px-6 py-6 text-right">
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-lg font-mono font-bold text-slate-700">
                                <Hash size={14} /> {emp.nbExemplaires}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                  <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 text-lg">Vous n&apos;avez pas encore effectue d&apos;emprunt.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}