'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
      } else {
        // On ne passe à false que si le token existe
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Loader sur fond blanc (bg-white)
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // Une fois chargé, on affiche le contenu avec le fond gris léger habituel
  return <div className="bg-slate-50 min-h-screen">{children}</div>;
}