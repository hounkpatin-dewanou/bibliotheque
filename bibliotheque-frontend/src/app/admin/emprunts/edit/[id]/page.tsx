'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import EmpruntForm, { EmpruntFormData } from '@/components/admin/EmpruntForm';
import { toast, Toaster } from 'react-hot-toast';
import { AxiosError } from 'axios';

interface ApiPlatformError {
  'hydra:description'?: string;
}

export default function EditEmprunt({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [initialData, setInitialData] = useState<EmpruntFormData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadEmprunt = async () => {
      try {
        setFetching(true);
        const res = await axiosInstance.get(`/emprunts/${id}`);
        const data = res.data;

        // On transforme les données reçues en format attendu par le formulaire (IRIs)
        setInitialData({
  usagerId: typeof data.usager === 'string' ? data.usager : `/api/utilisateurs/${data.usager.id}`,
  livreId: typeof data.livre === 'string' ? data.livre : `/api/livres/${data.livre.id}`,
  dateDebut: data.dateDebut.split('T')[0],
  dateFinPrevue: data.dateFinPrevue.split('T')[0],
  nbExemplaires: data.nbExemplaires,
  accordee: data.accordee, // On récupère l'état actuel (true, false ou null)
});
      } catch (err) {
        toast.error("Impossible de charger les données de l'emprunt");
      } finally {
        setFetching(false);
      }
    };

    loadEmprunt();
  }, [id]);

  const handleUpdate = async (formData: EmpruntFormData) => {
    setUpdating(true);
    
    // Payload pour la mise à jour
    const payload = {
      usager: formData.usagerId,
      livre: formData.livreId,
      dateDebut: formData.dateDebut,
      dateFinPrevue: formData.dateFinPrevue,
      nbExemplaires: formData.nbExemplaires,
      accordee: formData.accordee,
    };

    try {
      // 1. On passe en .patch
      // 2. On ajoute le header spécifique requis par API Platform pour le PATCH
      await axiosInstance.patch(`/emprunts/${id}`, payload, {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      });
      
      toast.success("MISE À JOUR RÉUSSIE");
      setTimeout(() => router.push('/admin/emprunts'), 1500);
    } catch (err) {
      const error = err as AxiosError<ApiPlatformError>;
      toast.error(error.response?.data?.['hydra:description'] || "Erreur lors de la modification");
    } finally {
      setUpdating(false);
    }
  };

  if (fetching) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Récupération du dossier...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12 animate-in fade-in duration-500">
      <Toaster position="bottom-right" />
      
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-400 hover:text-black font-black text-[10px] tracking-widest uppercase transition-all w-fit cursor-pointer"
        >
          <ArrowLeft size={14} /> Retour
        </button>
        
        <div className="relative">
          <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-amber-500 rounded-full" />
          <h1 className="text-2xl font-black text-black uppercase tracking-tighter leading-none">
            Modifier l&apos;emprunt<br />
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100/50 border border-gray-50">
        {initialData && (
          <EmpruntForm 
            initialData={initialData} 
            onSubmit={handleUpdate} 
            isSubmitting={updating} 
          />
        )}
      </div>
    </div>
  );
}