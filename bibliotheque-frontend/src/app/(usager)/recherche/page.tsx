'use client';

import { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/user/NavbarUsager';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Loader2, Book as BookIcon, Filter } from 'lucide-react';
import axiosInstance from '@/lib/axios';

// Interface 
interface Livre {
  id: number;
  titre: string;
  auteur: string;
  est_disponible: boolean;
  description: string;
  genre: string;
  annee_publication: number;
  nb_pages: number;
  langue: string;
  image: string;
  nb_exemplaires: number;
}

export default function RecherchePage() {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // États pour les nouveaux filtres
  const [filterGenre, setFilterGenre] = useState('Tous');
  const [filterDispo, setFilterDispo] = useState('Tous');

  useEffect(() => {
    const fetchLivres = async () => {
      try {
        const res = await axiosInstance.get('/livres');
        setLivres(res.data.member || []);
      } catch (err) {
        console.error("Erreur base de données:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLivres();
  }, []);

  // Extraction des genres uniques pour le menu déroulant
  const genresExistants = useMemo(() => {
    const g = livres.map(l => l.genre);
    return ['Tous', ...Array.from(new Set(g))];
  }, [livres]);

  // RECHERCHE TOTALE ET FILTRAGE AVANCÉ
  const filteredLivres = useMemo(() => {
    return livres.filter(l => {
      const matchSearch = 
        l.titre.toLowerCase().includes(search.toLowerCase()) || 
        l.auteur.toLowerCase().includes(search.toLowerCase()) ||
        l.description.toLowerCase().includes(search.toLowerCase()) ||
        l.genre.toLowerCase().includes(search.toLowerCase()) ||
        l.annee_publication.toString().includes(search);

      const matchGenre = filterGenre === 'Tous' || l.genre === filterGenre;
      const matchDispo = filterDispo === 'Tous' || 
  (filterDispo === 'Dispo' ? l.nb_exemplaires > 0 : l.nb_exemplaires === 0);

      return matchSearch && matchGenre && matchDispo;
    });
  }, [search, filterGenre, filterDispo, livres]);

  // Fonction pour masquer l'ID (Simple Base64 pour l'esthétique de l'URL)
  const hashId = (id: number) => btoa(`lcl-book-${id}`);

  return (
    <main className="relative">
      <Navbar />

      <section id="bibliotheque" className="min-h-screen bg-slate-50 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
                La Bibliothèque
              </h2>
              <p className="text-slate-500 text-lg max-w-md">
                Catalogue complet : {filteredLivres.length} ouvrages trouvés.
              </p>
            </div>

            {/* BLOC DE FILTRES ET RECHERCHE */}
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="flex gap-2">
                {/* FILTRE GENRE */}
                <select 
                  onChange={(e) => setFilterGenre(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  {genresExistants.map(g => <option key={g} value={g}>{g}</option>)}
                </select>

                {/* FILTRE DISPO */}
                <select 
                  onChange={(e) => setFilterDispo(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  <option value="Tous">Tous les statuts</option>
                  <option value="Dispo">Disponibles</option>
                  <option value="Occupé">Empruntés</option>
                </select>
              </div>

              <div className="relative group w-full md:w-96">
                <input 
                  type="text" 
                  placeholder="Tout rechercher (titre, auteur, année...)" 
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="h-6 w-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
              <p className="text-slate-400 font-medium">Chargement des ouvrages...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredLivres.map((book) => (
                <div 
                  key={book.id} 
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
                >
                  <div className="relative h-80 w-full bg-slate-100">
                    <Image
                      src={book.image}
                      alt={book.titre}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                        <div className={`absolute top-4 right-4 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider ${book.nb_exemplaires > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}>
      {book.nb_exemplaires > 0 ? `${book.nb_exemplaires} exemplaires` : 'Épuisé'}
    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                        {book.genre} • {book.annee_publication}
                      </p>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {book.titre}
                    </h3>
                    <p className="text-slate-500 text-sm italic">
                      Par {book.auteur}
                    </p>
                    <p className="text-slate-400 text-xs line-clamp-2 h-8">
                      {book.description}
                    </p>
                    
                    <div className="pt-5 flex items-center justify-between border-t border-slate-50">
                      {/* ID Masqué ici comme demandé */}
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                         {book.langue} • {book.nb_pages}p
                      </span>

                      <Link 
  href={book.nb_exemplaires > 0 ? `/emprunt/${hashId(book.id)}` : '#'}
  className={`font-extrabold text-xs uppercase tracking-tighter flex items-center gap-1 transition-all ${
    book.nb_exemplaires > 0 
    ? 'text-blue-600 hover:text-blue-800' 
    : 'text-slate-300 cursor-not-allowed pointer-events-none'
  }`}
>
  {book.nb_exemplaires > 0 ? 'Réserver cet ouvrage' : 'Indisponible'}
  <span className="group-hover:translate-x-1 transition-transform">→</span>
</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredLivres.length === 0 && (
            <div className="text-center py-20 text-slate-500 italic bg-white rounded-3xl border border-dashed border-slate-200">
              Aucun ouvrage ne correspond à vos critères.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}