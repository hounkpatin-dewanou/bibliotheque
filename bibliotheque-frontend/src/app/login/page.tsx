'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Mail, Lock, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { AxiosError } from 'axios';

// Définition de l'interface pour la réponse d'erreur de ton API
interface ApiErrorResponse {
  message?: string;
}

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setShowSuccess(true);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/login_check', credentials);
      const token = response.data.token;
      
      localStorage.setItem('token', token);

      try {
          // On décode la partie "Payload" du JWT (le milieu du token)
          const payloadBase64 = token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payloadBase64));
          
          console.log("Payload décodé du token :", decodedPayload);

          const roles = decodedPayload.roles || [];

          if (roles.includes('ROLE_ADMIN')) {
              console.log("Redirection vers ADMIN confirmée");
              router.push('/admin');
          } else {
              console.log("Redirection vers USER confirmée");
              router.push('/recherche');
          }
      } catch (e) {
          console.error("Erreur lors du décodage du token", e);
          router.push('/recherche'); // Par sécurité
      }
    } catch (err) {
      // Cast de l'erreur en AxiosError avec notre interface personnalisée
      const axiosError = err as AxiosError<ApiErrorResponse>;
      
      if (axiosError.response?.status === 401) {
        setError('Email ou mot de passe incorrect.');
      } else {
        setError(axiosError.response?.data?.message || 'Une erreur est survenue lors de la connexion.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* SECTION GAUCHE VISUELLE */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <Image 
          src="/login-bg.jpg" 
          alt="Espace membre" 
          fill 
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
        <div className="relative z-10 w-full p-20 flex flex-col justify-between text-white">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-12 w-12 transition-transform duration-300 group-hover:scale-110">
              <Image 
                src="/logo_wbg.png" 
                alt="Le Coin Lecture" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-black tracking-tighter">Le Coin Lecture</span>
          </Link>
          <blockquote className="text-5xl font-extralight italic">
            &quot;Lire, c&apos;est voyager ; voyager, c&apos;est lire.&quot;
          </blockquote>
          <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
            <ShieldCheck className="text-blue-500 h-5 w-5" /> Connexion sécurisée
          </div>
        </div>
      </div>

      {/* SECTION DROITE FORMULAIRE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-slate-50/50">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Se Connecter</h2>
            <p className="text-slate-500 font-medium">Ravis de vous revoir.</p>
          </div>

          {showSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Compte vérifié ! Connectez-vous maintenant.
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-2xl animate-in shake-in">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Adresse Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-700"
                  placeholder="votre@email.com"
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="password" 
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-700"
                  placeholder="••••••••"
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all disabled:bg-blue-400 cursor-pointer"
            >
              {isLoading ? "Vérification..." : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-slate-500 font-medium">
            Pas encore inscrit ? <Link href="/register" className="text-blue-600 font-bold hover:text-blue-700 transition-colors underline-offset-4 hover:underline">S&apos;inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}