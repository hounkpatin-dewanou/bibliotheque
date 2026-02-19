export interface IUsager {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  dateInscription?: string; // Format ISO
  // Ajoute d'autres champs selon ton entité Symfony
}