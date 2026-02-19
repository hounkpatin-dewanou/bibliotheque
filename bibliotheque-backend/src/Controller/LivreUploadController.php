<?php

namespace App\Controller;

use App\Entity\Livre;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class LivreUploadController extends AbstractController
{
    public function upload(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $livre = new Livre();

        // 1. On remplit les données textuelles
        $livre->setTitre($request->request->get('titre') ?? 'Sans titre');
        $livre->setAuteur($request->request->get('auteur') ?? 'Auteur inconnu');
        $livre->setGenre($request->request->get('genre') ?? 'Divers');
        $livre->setDescription($request->request->get('description') ?? '');
        $livre->setAnneePublication((int)$request->request->get('annee_publication'));
        $livre->setNbPages((int)$request->request->get('nb_pages'));
        $livre->setLangue($request->request->get('langue') ?? 'Français');
        $livre->setNbExemplaires((int)$request->request->get('nb_exemplaires'));

        $dispo = $request->request->get('estDisponible');
        $livre->setEstDisponible($dispo === 'true' || $dispo === '1');

        // Initialisation de l'image pour éviter l'erreur SQL "Not Null"
        // On mettra le vrai chemin après avoir récupéré l'ID
        $livre->setImage('/images/livres/default.jpg');

        // 2. On persiste et on flush une première fois pour obtenir l'ID de l'auto-incrément
        $em->persist($livre);
        $em->flush();

        // 3. Gestion du fichier image
        $file = $request->files->get('image_file');
        if ($file) {
            $extension = $file->guessExtension() ?? 'jpg';
            // On utilise l'ID tout juste généré
            $fileName = 'livre' . $livre->getId() . '.' . $extension;

            // Chemin dynamique portable
            $projectDir = $this->getParameter('kernel.project_dir');
            $destination = $projectDir . '/../bibliotheque-frontend/public/images/livres';

            if (!file_exists($destination)) {
                mkdir($destination, 0777, true);
            }

            try {
                $file->move($destination, $fileName);

                // 4. On met à jour le champ image avec le bon nom de fichier
                $livre->setImage('/images/livres/' . $fileName);
                $em->flush(); // Deuxième flush pour enregistrer le chemin de l'image
            } catch (\Exception $e) {
                // En cas d'erreur d'écriture, on peut logguer l'erreur
            }
        }

        return new JsonResponse([
            'id' => $livre->getId(),
            'message' => 'Livre créé avec succès'
        ], 201);
    }
}
