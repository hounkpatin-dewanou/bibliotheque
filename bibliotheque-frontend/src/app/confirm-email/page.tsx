'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, XCircle, ArrowRight } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { AxiosError } from 'axios';
import Link from 'next/link';

// On définit un type strict pour l'état
type VerificationStatus = 'loading' | 'success' | 'error';

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  // Le useRef est crucial pour éviter le double appel en mode Strict de React
  const hasCalledVerification = useRef(false);
  
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState<string>('Vérification de votre compte en cours...');

  useEffect(() => {
    // 1. On définit la fonction de vérification à l'intérieur de l'effet
    const verifyToken = async () => {
      // Si on n'a pas de token, on passe en erreur de façon asynchrone
      if (!token) {
        setStatus('error');
        setMessage('Le lien de confirmation est manquant ou invalide.');
        return;
      }

      // Sécurité pour ne pas lancer l'appel API deux fois
      if (hasCalledVerification.current) return;
      hasCalledVerification.current = true;

      try {
        // Appel à ton nouveau point de terminaison ApiResource
        await axiosInstance.get(`/verify-token/${token}`);
        
        setStatus('success');
        setMessage('Votre compte a été activé avec succès !');

        // Redirection après 7 secondes
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 7000);

      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        setStatus('error');
        setMessage(error.response?.data?.message || 'Ce lien a déjà été utilisé ou a expiré.');
      }
    };

    // 2. On lance la vérification
    verifyToken();
    
  }, [token, router]); // Dépendances correctes

  return (
    <div className="min-h-screen bg-[#3b5998] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
        
        {/* État de chargement */}
        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin relative" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{message}</h1>
          </div>
        )}

        {/* État de succès */}
        {status === 'success' && (
          <div className="space-y-6 animate-in zoom-in duration-500">
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Compte validé !</h1>
              <p className="text-slate-500 font-medium leading-relaxed">{message}</p>
            </div>
            <div className="pt-4 flex items-center justify-center gap-2 text-blue-600 font-bold animate-pulse">
              Redirection automatique <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        )}

        {/* État d'erreur */}
        {status === 'error' && (
          <div className="space-y-6 animate-in shake-in duration-500">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Erreur</h1>
              <p className="text-red-500 font-bold leading-relaxed">{message}</p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Link 
                href="/register" 
                className="w-full bg-[#4c69ba] hover:bg-[#3b5998] text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
              >
                Retour à l&apos;inscription
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}