import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // On ne peut pas accéder au localStorage dans le middleware (côté serveur)
  // Normalement, on utilise les cookies pour le token JWT. 
  // Si tu utilises le localStorage, voici une alternative de protection "client-side" plus bas.
  
  // Si tu souhaites une protection stricte, il est conseillé de stocker 
  // le token dans un cookie lors du login.
}