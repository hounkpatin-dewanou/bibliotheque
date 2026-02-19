'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Book, 
  Send, 
  Loader2, 
  CheckCircle2, 
  Filter,
  ArrowRight,
  Link
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast, Toaster } from 'react-hot-toast';

interface Livre {
  id: number;
  titre: string;
  auteur: string;
  isbn: string;
  disponible: boolean;
}

export default function RechercheLivres() {
  const [query, setQuery] = useState('');
  const [livres, setLivres] = useState<Livre[]>([]);
  const [loading, setLoading] = useState(false);
  const [requestingId, setRequestingId] = useState<number | null>(null);

  // Recherche automatique avec un petit délai (debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 2) fetchLivres();
      if (query.length === 0) setLivres([]);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchLivres = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/livres?titre=${query}`);
      // On adapte selon si ton API renvoie 'hydra:member' ou un tableau simple
      setLivres(res.data['hydra:member'] || res.data);
    } catch (err) {
      console.error("Erreur recherche:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemandeEmprunt = async (livreId: number) => {
    setRequestingId(livreId);
    try {
      // Ton endpoint pour créer un emprunt
      await axiosInstance.post('/emprunts', {
        livre: `/api/livres/${livreId}`,
        dateDemande: new Date().toISOString(),
      });
      
      toast.success("Demande envoyée avec succès !");
      // Rafraîchir l'état local pour ce livre
      setLivres(livres.map(l => l.id === livreId ? { ...l, disponible: false } : l));
    } catch (err) {
      toast.error("Impossible d'envoyer la demande.");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 animate-in fade-in duration-700">
      <Toaster position="bottom-center" />

      {/* HEADER USAGER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10">
        <div>
          <h1 className="text-6xl font-black tracking-tighter uppercase text-black leading-none">
            Bibliothèque<br />
            <span className="text-gray-200">Numérique</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-6">
            Trouvez votre prochaine lecture
          </p>
        </div>
      </div>

      {/* BARRE DE RECHERCHE MASSIVE */}
      <div className="relative group">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={24} />
        <input 
          type="text"
          placeholder="Titre, auteur ou ISBN..."
          className="w-full bg-gray-50 border-none rounded-[2.5rem] py-8 pl-20 pr-8 text-xl font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-black transition-all outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 animate-spin text-black" size={24} />}
      </div>

      {/* RÉSULTATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {livres.length > 0 ? (
          livres.map((livre) => (
            <div key={livre.id} className="group bg-white p-8 rounded-[3rem] border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <Book size={24} className="text-black" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${livre.disponible ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                    {livre.disponible ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight leading-tight mb-2 italic">
                  {livre.titre}
                </h3>
                <p className="text-gray-400 font-bold text-sm mb-6">{livre.auteur}</p>
              </div>

              {livre.disponible && (
                <button 
                  onClick={() => handleDemandeEmprunt(livre.id)}
                  disabled={requestingId === livre.id}
                  className="w-full flex items-center justify-center gap-3 bg-black text-white py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                  {requestingId === livre.id ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>Demander l&apos;emprunt <Send size={14} /></>
                  )}
                </button>
              )}
            </div>
          ))
        ) : query.length > 2 && !loading ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-300 font-black uppercase tracking-widest text-lg">Aucun ouvrage trouvé</p>
          </div>
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
             <div className="flex justify-center"><Filter size={48} className="text-gray-100" /></div>
             <p className="text-gray-300 font-bold italic">Saisissez au moins 3 caractères pour lancer la recherche.</p>
          </div>
        )}
      </div>

      {/* FOOTER : ACCÈS PROFIL */}
      <div className="bg-gray-50 rounded-[3rem] p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <CheckCircle2 size={24} className="text-black" />
            <p className="text-xs font-black uppercase tracking-widest">Connecté en tant qu&apos;Usager</p>
        </div>
        <Link href="/mon-profil" className="text-xs font-black uppercase underline decoration-2 underline-offset-4">
            Mes emprunts <ArrowRight size={14} className="inline ml-1" />
        </Link>
      </div>
    </div>
  );
}