//Exécution côté serveur avant qu'une route ne soit interceptée
import { NextResponse } from 'next/server';  //manipuler la réponse coontinuer vers la page demandée ou modifier les headers
import type { NextRequest } from 'next/server';  //infos de la requête entrante

export function middleware(request: NextRequest) { //fonction appelée par next à chaque chargement de page
}