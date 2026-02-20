'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import EmpruntForm, { EmpruntFormData } from '@/components/admin/EmpruntForm';
import { toast, Toaster } from 'react-hot-toast';
import { AxiosError } from 'axios';

// Interface pour typer la réponse d'erreur de Symfony/API Platform
interface ApiPlatformError {
  'hydra:description'?: string;
  'hydra:title'?: string;
  detail?: string;
}

export default function CreateEmprunt() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData: EmpruntFormData) => {
    setSubmitting(true);
    try {
      // API Platform attend les IRIs pour les relations
      await axiosInstance.post('/emprunts', {
        usager: formData.usagerId,
        livre: formData.livreId,
        dateDebut: formData.dateDebut,
        dateFinPrevue: formData.dateFinPrevue,
        nbExemplaires: formData.nbExemplaires,
        accordee: formData.accordee ?? null //si l'admin ne touche pas c'est null 
      });
      
      toast.success("EMPRUNT CRÉÉ AVEC SUCCÈS");
      setTimeout(() => router.push('/admin/emprunts'), 1500);
    } catch (err) {
      // Cast de l'erreur avec AxiosError et notre interface personnalisée
      const error = err as AxiosError<ApiPlatformError>;
      
      // Récupération intelligente du message d'erreur
      const msg = error.response?.data?.['hydra:description'] || 
                  error.response?.data?.detail || 
                  "Erreur lors de la création";
                  
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12 animate-in fade-in duration-700">
      <Toaster position="bottom-right" />
      
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/emprunts" 
          className="flex items-center gap-2 text-gray-400 hover:text-black font-black text-[10px] tracking-widest uppercase transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Retour
        </Link>
        <h1 className="text-3xl font-black text-black uppercase tracking-tighter leading-none">
          Création Emprunt<br />
        </h1>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100/50">
         <EmpruntForm onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  );
}