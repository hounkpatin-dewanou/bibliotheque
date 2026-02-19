'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Eye, Edit, Trash2, 
  User as UserIcon, Loader2, AlertCircle, ShieldCheck, Mail, Phone
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { CheckCircle2, XCircle } from 'lucide-react'; // Ajout pour les messages

// Interface calquée exactement sur votre JSON d'API Utilisateur
interface Utilisateur {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  roles: string[];
  telephone?: string;
  verified: boolean;
  emprunts: string[]; // Liste d'IRIs
}

export default function ListeUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Récupération des données
  const fetchUtilisateurs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/utilisateurs');
      
      // Extraction : API Platform renvoie les données dans "member"
      const data = res.data.member || [];
      
      setUtilisateurs(data);
      setError(null);
    } catch (err) {
      console.error("Erreur API:", err);
      setError("Impossible de charger les utilisateurs. Vérifiez la connexion au backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

const deleteUtilisateur = async (user: Utilisateur) => {
    const hasEmprunts = user.emprunts.length > 0;
    const firstConfirm = confirm(`Voulez-vous vraiment supprimer ${user.prenom} ${user.nom} ?`);
    
    if (!firstConfirm) return;

    if (hasEmprunts) {
      const secondConfirm = confirm(`ATTENTION : Cet utilisateur a ${user.emprunts.length} emprunt(s) en cours. La suppression peut entraîner des erreurs de données. Continuer quand même ?`);
      if (!secondConfirm) return;
    }

    try {
      await axiosInstance.delete(`/utilisateurs/${user.id}`);
      setUtilisateurs(prev => prev.filter(u => u.id !== user.id));
      setMessage({ type: 'success', text: `L'utilisateur ${user.nom} a été supprimé avec succès.` });
      setTimeout(() => setMessage(null), 5000); // Disparition auto
    } catch (err) {
      setMessage({ type: 'error', text: "Erreur critique : Impossible de supprimer cet utilisateur (contrainte de base de données)." });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  // Filtrage
  const filteredUsers = utilisateurs.filter(u => 
    u.nom.toLowerCase().includes(search.toLowerCase()) || 
    u.prenom.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-gray-500 mt-1">
            Il y a actuellement <span className="font-bold text-blue-600">{utilisateurs.length}</span> membres inscrits sur LCL.
          </p>
        </div>
        <Link 
          href="/admin/utilisateurs/create" 
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus size={20} /> Nouvel Utilisateur
        </Link>
      </div>

        {/* MESSAGES ÉLÉGANTS */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl border animate-in slide-in-from-top-2 duration-300 ${
          message.type === 'success' 
          ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
          : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <p className="font-bold">{message.text}</p>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Rechercher par nom, prénom ou email..."
          className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm text-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
          <AlertCircle size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* MAIN TABLE */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest w-16">#</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Identité</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Rôle</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Emprunts</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-blue-600" size={32} />
                      <span className="text-gray-400 font-medium">Chargement des utilisateurs...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-gray-400">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold shadow-sm">
                          {user.prenom[0]}{user.nom[0]}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{user.prenom} {user.nom}</div>
                          <div className="text-xs flex items-center gap-1 text-gray-400 font-medium">
                            {user.verified && <ShieldCheck size={12} className="text-emerald-500" />} 
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user.roles.includes('ROLE_ADMIN') ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.roles.includes('ROLE_ADMIN') ? 'Admin' : 'Lecteur'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
                          <Mail size={14} className="text-black-500" /> {user.email}
                        </div>
                        {user.telephone && (
                          <div className="text-xs text-gray-600 flex items-center gap-2">
                            <Phone size={14} className="text-black-500" /> {user.telephone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-bold text-gray-700 bg-gray-100 inline-block px-3 py-1 rounded-lg">
                        {user.emprunts.length}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/utilisateurs/show/${user.id}`}
                          className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Détails"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link 
                          href={`/admin/utilisateurs/edit/${user.id}`}
                          className="p-2.5 text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => deleteUtilisateur(user)}
                          className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
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
                  <td colSpan={6} className="py-20 text-center text-gray-500">
                    Aucun utilisateur trouvé pour cette recherche.
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