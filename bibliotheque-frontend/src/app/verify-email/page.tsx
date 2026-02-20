'use client';

import { useSearchParams } from 'next/navigation';
import { Mail, RotateCcw, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { AxiosError } from 'axios';

// Définition du type pour les messages d'état
interface StatusMessage {
  type: 'success' | 'error';
  text: string;
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);

  const handleResend = async () => {
    if (!email) return;
    
    setIsLoading(true);
    setStatus(null); // Reset l'ancien message

    try {
      // Appel à Symfony pour renvoyer l'email
      await axiosInstance.post('/resend-verification', { email });
      
      setStatus({
        type: 'success',
        text: 'Un nouveau lien de validation vient d\'être envoyé.'
      });
      
      // On efface le message de succès après 8 secondes
      setTimeout(() => setStatus(null), 8000);
      
    } catch (err) {
      // Typage de l'erreur Axios
      const error = err as AxiosError<{ message?: string }>;
      const errorMessage = error.response?.data?.message || "Impossible de renvoyer l'email pour le moment.";
      
      setStatus({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#3b5998] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
        
        {/* Icône animée */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
          <div className="relative bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center">
            <Mail className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vérifiez vos emails</h1>
          <p className="text-slate-500 leading-relaxed font-medium">
            Un message de confirmation a été envoyé à :<br/>
            <span className="font-bold text-blue-600 break-all">{email || 'votre adresse email'}</span>
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 text-left border border-slate-100">
          <p className="flex gap-2">
            <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />
            <span>Cliquez sur le bouton dans l&apos;email pour activer votre compte.</span>
          </p>
        </div>

        {/* Zone de notifications (Succès / Erreur) */}
        {status && (
          <div className={`p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 ${
            status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {status.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-sm font-bold text-left">{status.text}</span>
          </div>
        )}

        <div className="space-y-4 pt-2">
          <button 
            onClick={handleResend}
            disabled={isLoading || !email}
            className="w-full bg-[#4c69ba] hover:bg-[#3b5998] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          >
            <RotateCcw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} /> 
            {isLoading ? 'Renvoi en cours...' : 'Renvoyer l\'email'}
          </button>

          <Link 
            href="/login" 
            className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors group"
          >
            
            Retour à la connexion<ArrowRight className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}