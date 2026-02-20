'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Eye, Edit, Trash2, Loader2, AlertCircle, 
  Book, User as UserIcon, Calendar, CheckCircle, XCircle, Clock, Hash
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast, Toaster } from 'react-hot-toast';

// --- TYPAGE ---
interface Livre {
  id: number;
  titre: string;
  auteur: string;
}

interface Utilisateur {
  id: number;
  email: string;
  nom: string;
  prenom: string;
}

interface Emprunt {
  id: number;
  dateDebut: string;
  dateFinPrevue: string;
  dateRetourEffective: string | null;
  nbExemplaires: number;
  accordee: boolean | null;
  usager: string | Utilisateur;
  livre: string | Livre;
}

interface HydraResponse<T> {
  'hydra:member'?: T[];
  'member'?: T[];
}

export default function ListeEmpruntsAdmin() {
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
  if (!confirm("Voulez-vous vraiment supprimer cet emprunt de façon permanente ?")) return;

  try {
    await axiosInstance.delete(`/emprunts/${id}`);
    // Mise à jour de l'état local pour supprimer la ligne instantanément
    setEmprunts(prev => prev.filter(emp => emp.id !== id));
    toast.success("Emprunt supprimé avec succès");
  } catch (err) {
    toast.error("Impossible de supprimer cet enregistrement");
  }
};

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resEmp, resUsers, resLivres] = await Promise.all([
        axiosInstance.get<HydraResponse<Emprunt>>('/emprunts?pagination=false'),
        axiosInstance.get<HydraResponse<Utilisateur>>('/utilisateurs?pagination=false'),
        axiosInstance.get<HydraResponse<Livre>>('/livres?pagination=false')
      ]);

      const rawEmprunts = resEmp.data['hydra:member'] || resEmp.data['member'] || [];
      const users = resUsers.data['hydra:member'] || resUsers.data['member'] || [];
      const livres = resLivres.data['hydra:member'] || resLivres.data['member'] || [];

      const enriched = rawEmprunts.map(emp => {
        const uId = typeof emp.usager === 'string' ? parseInt(emp.usager.split('/').pop() || '0') : emp.usager.id;
        const lId = typeof emp.livre === 'string' ? parseInt(emp.livre.split('/').pop() || '0') : emp.livre.id;
        
        return {
          ...emp,
          usager: users.find(u => u.id === uId) || emp.usager,
          livre: livres.find(l => l.id === lId) || emp.livre
        };
      });

      setEmprunts(enriched);
    } catch (err) {
      setError("Erreur lors du chargement des emprunts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getStatusBadge = (emp: Emprunt) => {
    if (emp.dateRetourEffective) return (
      <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
        <CheckCircle size={12} /> Rendu
      </span>
    );
    if (emp.accordee === false) return (
      <span className="flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
        <XCircle size={12} /> Refusé
      </span>
    );
    if (emp.accordee === null) return (
      <span className="flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
        <Clock size={12} /> En Attente
      </span>
    );
    return (
      <span className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
        <Book size={12} /> En cours
      </span>
    );
  };

  const filteredEmprunts = emprunts.filter(e => {
    const u = e.usager as Utilisateur;
    const l = e.livre as Livre;
    const term = search.toLowerCase();
    return (
      u.nom?.toLowerCase().includes(term) || 
      l.titre?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  // --- RENDU DU CHARGEMENT CENTRÉ ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Synchronisation des registres...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <Toaster position="top-right" />
      {/* HEADER SECTION AVEC COMPTEUR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestion des Emprunts</h1>
          <p className="text-gray-500 mt-1">
            Il y a actuellement <span className="text-blue-600 font-bold">{emprunts.length}</span> emprunts enregistrés.
          </p>
        </div>
        <Link href="/admin/emprunts/create" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg flex items-center gap-2 active:scale-95">
          <Plus size={20} /> Nouvel Emprunt
        </Link>
      </div>

      {/* RECHERCHE */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Rechercher par livre, utilisateur ou email..." 
          className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLEAU */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-400 text-[11px] font-black uppercase tracking-[0.1em]">
              <tr>
                <th className="px-6 py-5 w-16">#</th>
                <th className="px-6 py-5">Ouvrage</th>
                <th className="px-6 py-5">Lecteur</th>
                <th className="px-6 py-5">Période</th>
                <th className="px-6 py-5 text-center">Statut</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEmprunts.length > 0 ? (
                filteredEmprunts.map((emp, index) => (
                  <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors group">
                    {/* NUMÉROTATION */}
                    <td className="px-6 py-4 text-sm font-bold text-gray-400">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    {/* LIVRE */}
                    <td className="px-6 py-4">
                      <Link href={`/admin/livres/show/${(emp.livre as Livre).id}`} className="group/link">
                        <div className="font-bold text-gray-900 group-hover/link:text-blue-600 transition-colors">{(emp.livre as Livre).titre}</div>
                        <div className="text-xs text-gray-400">{(emp.livre as Livre).auteur}</div>
                      </Link>
                    </td>
                    {/* LECTEUR */}
                    <td className="px-6 py-4">
                      <Link href={`/admin/utilisateurs/show/${(emp.usager as Utilisateur).id}`} className="group/user">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover/user:bg-blue-100 group-hover/user:text-blue-600 transition-colors text-black">
                            <UserIcon size={14} />
                          </div>
                          <div>
                            <div className="text-sm font-bold group-hover/user:text-blue-600 transition-colors text-black">{(emp.usager as Utilisateur).prenom} {(emp.usager as Utilisateur).nom}</div>
                            <div className="text-[10px] text-black">{(emp.usager as Utilisateur).email}</div>
                          </div>
                        </div>
                      </Link>
                    </td>
                    {/* DATES */}
                    <td className="px-6 py-4">
                      <div className="text-xs font-medium text-gray-600 space-y-1">
                        <div className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-500" /> {new Date(emp.dateDebut).toLocaleDateString()}</div>
                        <div className="flex items-center gap-1.5 text-gray-400"><Clock size={12} /> {new Date(emp.dateFinPrevue).toLocaleDateString()}</div>
                      </div>
                    </td>
                    {/* STATUT */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">{getStatusBadge(emp)}</div>
                    </td>
                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/emprunts/show/${emp.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Détails"><Eye size={18} /></Link>
                        <Link href={`/admin/emprunts/edit/${emp.id}`} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Modifier"><Edit size={18} /></Link>
                       <button 
  onClick={() => handleDelete(emp.id)}
  className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors" 
  title="Supprimer"
>
  <Trash2 size={18} />
</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-gray-400">
                    Aucun emprunt ne correspond à votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}