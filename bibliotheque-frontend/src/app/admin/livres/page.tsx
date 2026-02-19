'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Eye, Edit, Trash2, 
  Book as BookIcon, Loader2, AlertCircle 
} from 'lucide-react';
import axiosInstance from '@/lib/axios';

// Interface calquée exactement sur votre JSON d'API
interface Livre {
  id: number;
  titre: string;
  auteur: string;
  estDisponible: boolean;
  genre: string;
  annee_publication: number;
  nb_pages: number;
  langue: string;
  image: string;
  // On déclare les deux variantes possibles
  nb_exemplaires?: number; 
  nbExemplaires?: number;
}

export default function ListeLivres() {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Récupération des données
  const fetchLivres = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/livres');
      
      // Extraction cruciale : votre API renvoie { member: [...] }
      const data = res.data.member || [];
      
      setLivres(data);
      setError(null);
    } catch (err) {
      console.error("Erreur API:", err);
      setError("Impossible de charger les livres. Vérifiez la connexion au backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivres();
  }, []);

  // Suppression d'un livre
  const deleteLivre = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cet ouvrage ?")) {
      try {
        await axiosInstance.delete(`/livres/${id}`);
        // Mise à jour locale de l'état
        setLivres(prev => prev.filter(l => l.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  // Filtrage pour la barre de recherche
  const filteredLivres = livres.filter(l => 
    l.titre.toLowerCase().includes(search.toLowerCase()) || 
    l.auteur.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestion des Livres</h1>
<p className="text-gray-500 mt-1">
  Consultez et gérez les <span className="font-bold text-blue-600">{livres.length}</span> ouvrages de la collection LCL.
</p>
        </div>
        <Link 
          href="/admin/livres/create" 
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus size={20} /> Nouveau Livre
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Rechercher par titre, auteur..."
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
          {/* NOUVELLE COLONNE NUMÉRO */}
          <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest w-16">#</th>
          <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Ouvrage</th>
          <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Auteur</th>
          <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Statut</th>
          <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Stock</th>
          <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {loading ? (
          <tr>
            <td colSpan={6} className="py-20 text-center"> {/* Colspan passé à 6 */}
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <span className="text-gray-400 font-medium">Synchronisation avec la base de données...</span>
              </div>
            </td>
          </tr>
        ) : filteredLivres.length > 0 ? (
          filteredLivres.map((livre, index) => ( // AJOUT DE L'INDEX ICI
            <tr key={livre.id} className="hover:bg-blue-50/30 transition-colors group">
              
              {/* CELLULE NUMÉRO : index + 1 */}
              <td className="px-6 py-4 text-sm font-bold text-gray-400">
                {String(index + 1).padStart(2, '0')}
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-200">
                    {livre.image ? (
                      <img src={livre.image} alt={livre.titre} className="object-cover w-full h-full" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300"><BookIcon size={20} /></div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 line-clamp-1">{livre.titre}</div>
                    <div className="text-xs text-blue-600 font-semibold">{livre.genre}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-medium text-gray-600">{livre.auteur}</span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  livre.estDisponible ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {livre.estDisponible ? 'Disponible' : 'Indisponible'}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
  <div className="text-sm font-bold text-gray-700 bg-gray-100 inline-block px-3 py-1 rounded-lg">
    {/* On utilise la priorité sur nb_exemplaires, sinon nbExemplaires, sinon 0 */}
    {livre.nb_exemplaires ?? livre.nbExemplaires ?? 0}
  </div>
</td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2 transition-opacity">
                  <Link 
                    href={`/admin/livres/show/${livre.id}`}
                    className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="Détails"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link 
                    href={`/admin/livres/edit/${livre.id}`}
                    className="p-2.5 text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </Link>
                  <button 
                    onClick={() => deleteLivre(livre.id)}
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
            <td colSpan={6} className="py-20 text-center text-gray-500"> {/* Colspan passé à 6 */}
              Aucun livre ne correspond à votre recherche.
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