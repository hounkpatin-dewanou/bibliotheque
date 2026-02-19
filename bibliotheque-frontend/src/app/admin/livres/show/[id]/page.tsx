'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Edit, Trash2, Calendar, 
  BookOpen, Hash, Languages, CheckCircle, 
  XCircle, Library, Loader2 
} from 'lucide-react';
import axiosInstance from '@/lib/axios';

interface Livre {
  id: number;
  titre: string;
  auteur: string;
  description: string;
  genre: string;
  anneePublication: number;
  nbPages: number;
  langue: string;
  image: string;
  nbExemplaires: number;
  estDisponible: boolean;
}

export default function DetailLivre({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [livre, setLivre] = useState<Livre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLivre = async () => {
      try {
        const res = await axiosInstance.get(`/livres/${id}`);
        setLivre(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement du livre:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLivre();
  }, [id]);

  const deleteLivre = async () => {
    if (confirm("Confirmer la suppression définitive ?")) {
      try {
        await axiosInstance.delete(`/livres/${id}`);
        router.push('/admin/livres');
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-gray-500 font-medium">Chargement des détails...</p>
      </div>
    );
  }

  if (!livre) return <div className="p-10 text-center">Livre introuvable.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* BARRE D'ACTIONS */}
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/livres" 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Retour à la liste
        </Link>
        <div className="flex gap-3">
          <Link 
            href={`/admin/livres/edit/${id}`}
            className="flex items-center gap-2 text-yellow-700 px-4 py-2 rounded-xl font-bold hover:bg-amber-100 transition-all"
          >
            <Edit size={18} /> Modifier
          </Link>
          <button 
            onClick={deleteLivre}
            className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition-all cursor-pointer"
          >
            <Trash2 size={18} /> Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : IMAGE */}
        <div className="md:col-span-1">
          <div className="sticky top-6">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-gray-100">
              {livre.image ? (
                <img src={livre.image} alt={livre.titre} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                  <BookOpen size={64} />
                </div>
              )}
            </div>
            <div className={`mt-6 flex items-center justify-center gap-2 py-3 rounded-2xl font-black uppercase tracking-widest text-sm ${
              livre.estDisponible ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              {livre.estDisponible ? <CheckCircle size={18}/> : <XCircle size={18}/>}
              {livre.estDisponible ? 'Disponible' : 'Indisponible'}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : INFOS */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">{livre.genre}</span>
            <h1 className="text-4xl font-black text-gray-900 mt-2 leading-tight">{livre.titre}</h1>
            <p className="text-2xl text-gray-500 font-medium mt-2">par <span className="text-gray-800">{livre.auteur}</span></p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Library size={20} className="text-blue-600" /> Résumé de l&apos;ouvrage
            </h3>
            <p className="text-gray-600 leading-relaxed italic">
              &quot;{livre.description || "Aucune description disponible pour cet ouvrage."}&quot;
            </p>
          </div>

          {/* GRILLE DE CARACTÉRISTIQUES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InfoCard icon={<Calendar size={20}/>} label="Année" value={livre.anneePublication} />
            <InfoCard icon={<Hash size={20}/>} label="Pages" value={livre.nbPages} />
            <InfoCard icon={<Languages size={20}/>} label="Langue" value={livre.langue} />
            <InfoCard icon={<Library size={20}/>} label="Stock" value={`${livre.nbExemplaires} ex.`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-1">
      <div className="text-blue-600 mb-1">{icon}</div>
      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{label}</span>
      <span className="text-sm font-bold text-gray-800">{value}</span>
    </div>
  );
}