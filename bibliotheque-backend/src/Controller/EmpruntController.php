<?php

namespace App\Controller;

use App\Repository\LivreRepository;
use App\Repository\UtilisateurRepository;
use App\Repository\EmpruntRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class EmpruntController extends AbstractController
{
   public function validerEmprunt(Emprunt $emprunt, Request $request) {
    $decision = $request->get('decision'); // true ou false
    $emprunt->setAccordee($decision);

    if ($decision === true) {
        // Décrémenter le stock du livre
        $livre = $emprunt->getLivre();
        $livre->setNbExemplaires($livre->getNbExemplaires() - $emprunt->getNbExemplaires());
    }

    $this->entityManager->flush();
}
}

