<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Controller\StatsController;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/stats',
            // On ajoute ::index ici pour dire à API Platform quelle fonction lancer
            controller: StatsController::class . '::index',
            name: 'api_stats',
            read: false // API Platform ne pas chercher en base de données, mais utiliser le controller
        )
    ]
)]
class Stats
{
    // Classe vide juste pour porter la documentation
}
