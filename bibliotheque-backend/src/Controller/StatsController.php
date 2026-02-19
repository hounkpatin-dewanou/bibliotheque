<?php

namespace App\Controller;

use App\Repository\LivreRepository;
use App\Repository\UtilisateurRepository;
use App\Repository\EmpruntRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class StatsController extends AbstractController
{
    #[Route('/api/stats', name: 'app_stats', methods: ['GET'])]
    public function index(
        LivreRepository $livreRepo,
        UtilisateurRepository $userRepo,
        EmpruntRepository $empruntRepo
    ): JsonResponse {
        return new JsonResponse([
            'nbLivres' => $livreRepo->count([]),
            'nbUtilisateurs' => $userRepo->count([]),
            'nbEmpruntsEnCours' => $empruntRepo->count(['dateRetourEffective' => null]),
        ]);
    }
}

