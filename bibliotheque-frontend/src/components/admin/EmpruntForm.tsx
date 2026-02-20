'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Save, Calendar, User, Book, Hash, Loader2, Info } from 'lucide-react';
import axiosInstance from '@/lib/axios';

// --- INTERFACES STRICTES ---
export interface EmpruntFormData {
  usagerId: string;
  livreId: string;
  dateDebut: string;
  dateFinPrevue: string;
  nbExemplaires: number;
  accordee: boolean | null; 
}

interface UserOption {
  id: number;
  email: string;
  nom: string;
}

interface LivreOption {
  id: number;
  titre: string;
  nb_exemplaires: number; // Pour vérifier le stock
}

interface EmpruntFormProps {
  initialData?: EmpruntFormData;
  onSubmit: (data: EmpruntFormData) => void;
  isSubmitting: boolean;
}
export default function EmpruntForm({ initialData, onSubmit, isSubmitting }: EmpruntFormProps) {
  const [formData, setFormData] = useState<EmpruntFormData>(initialData || {
    usagerId: '',
    livreId: '',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFinPrevue: '',
    nbExemplaires: 1,
    accordee: null // Par défaut en attente
  });

  const [users, setUsers] = useState<UserOption[]>([]);
  const [books, setBooks] = useState<LivreOption[]>([]);
  const [selectedBookStock, setSelectedBookStock] = useState<number | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // 1. CHARGEMENT DES DONNÉES DEPUIS L'API
  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        setLoadingData(true);
        const [resUsers, resBooks] = await Promise.all([
          axiosInstance.get('/utilisateurs?pagination=false'),
          axiosInstance.get('/livres?pagination=false')
        ]);
        
        setUsers(resUsers.data['hydra:member'] || resUsers.data['member'] || []);
        setBooks(resBooks.data['hydra:member'] || resBooks.data['member'] || []);
      } catch (err) {
        console.error("Erreur de chargement des listes:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchSelectData();
  }, []);

  // 2. LOGIQUE DE MISE À JOUR DU STOCK LORS DU CHOIX DU LIVRE
  useEffect(() => {
    if (formData.livreId) {
      const bookId = parseInt(formData.livreId.split('/').pop() || '0');
      const book = books.find(b => b.id === bookId);
      setSelectedBookStock(book ? book.nb_exemplaires : null);
    } else {
      setSelectedBookStock(null);
    }
  }, [formData.livreId, books]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Gestion spécifique pour le booléen/null du select "accordee"
    if (name === 'accordee') {
      const val = value === 'true' ? true : value === 'false' ? false : null;
      setFormData(prev => ({ ...prev, accordee: val }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  if (loadingData) return (
    <div className="flex items-center justify-center p-12 bg-white rounded-3xl border border-gray-100">
      <Loader2 className="animate-spin text-blue-600 mr-3" />
      <span className="font-bold uppercase text-xs tracking-widest text-gray-400">Préparation des données...</span>
    </div>
  );

  return (
    <form onSubmit={(e: FormEvent) => { e.preventDefault(); onSubmit(formData); }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LECTEUR */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
            <User size={18} /> Utilisateur
          </h2>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Rechercher par Email</label>
            <select 
              name="usagerId"
              value={formData.usagerId}
              onChange={handleChange}
              required
              className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black/5 outline-none font-bold text-black text-sm"
            >
              <option value="">-- Sélectionner l&apos;email --</option>
              {users.map(u => (
                <option key={u.id} value={`/api/utilisateurs/${u.id}`}>
                  {u.email} ({u.nom.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LIVRE + STOCK */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
            <Book size={18} /> Ouvrage
          </h2>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Sélectionner le livre</label>
            <select 
              name="livreId"
              value={formData.livreId}
              onChange={handleChange}
              required
              className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black/5 outline-none font-bold text-black text-sm"
            >
              <option value="">-- Choisir un titre --</option>
              {books.map(b => (
                <option key={b.id} value={`/api/livres/${b.id}`}>
                  {b.titre}
                </option>
              ))}
            </select>
          </div>

          {selectedBookStock !== null && (
            <div className={`flex items-center gap-2 p-3 rounded-xl border ${selectedBookStock > 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
              <Info size={16} />
              <p className="text-xs font-bold uppercase">Stock disponible : {selectedBookStock} ex.</p>
            </div>
          )}
        </div>

        {/* SECTION PARAMÈTRES ET APPROBATION */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Date début" name="dateDebut" type="date" value={formData.dateDebut} onChange={handleChange} required />
            <InputField label="Retour prévu" name="dateFinPrevue" type="date" value={formData.dateFinPrevue} onChange={handleChange} required />
            <InputField label="Nb exemplaires" name="nbExemplaires" type="number" min="1" max={selectedBookStock || 1} value={formData.nbExemplaires} onChange={handleChange} required />
          </div>

          <div className="pt-6 border-t border-gray-100">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-2 block">Statut de l&apos;approbation</label>
            <div className="flex flex-wrap gap-4">
              <select 
                name="accordee"
                value={formData.accordee === null ? "null" : formData.accordee.toString()}
                onChange={handleChange}
                className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest outline-none border transition-all ${
                  formData.accordee === true ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                  formData.accordee === false ? 'bg-red-50 border-red-200 text-red-700' : 
                  'bg-amber-50 border-amber-200 text-amber-700'
                }`}
              >
                <option value="null">En attente de décision</option>
                <option value="true">Approuver l&apos;emprunt</option>
                <option value="false">Refuser l&apos;emprunt</option>
              </select>
              
              <div className="flex-1 p-4 rounded-2xl bg-gray-50 flex items-center gap-3 text-gray-500 text-xs italic">
                <Info size={16} />
                {formData.accordee === true ? "Le livre sera décompté du stock et l'usager notifié." : 
                 formData.accordee === false ? "L'usager verra sa demande comme refusée." : 
                 "La demande restera visible dans votre file d'attente."}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting} className="px-12 py-5 bg-black text-white font-black rounded-2xl shadow-xl hover:bg-gray-800 transition-all flex items-center gap-3 disabled:opacity-50 cursor-pointer uppercase text-[10px] tracking-[0.2em]">
          {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
          Confirmer les modifications
        </button>
      </div>
    </form>
  );
}

function InputField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{label}</label>
      <input {...props} className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black/5 outline-none font-bold text-black text-sm" />
    </div>
  );
}