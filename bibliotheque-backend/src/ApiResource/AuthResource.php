<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\Controller\AuthController;

#[ApiResource(
    operations: [
        // Route pour la vérification du token
        new Get(
            uriTemplate: '/verify-token/{token}',
            controller: AuthController::class . '::verifyToken',
            name: 'app_verify_token',
            read: false
        ),
        // Route pour le renvoi de l'email
        new Post(
            uriTemplate: '/resend-verification',
            controller: AuthController::class . '::resendVerification',
            name: 'app_resend_verification',
            read: false,
            validate: false
        )
    ]
)]
class AuthResource
{
    // Classe porteuse pour exposer les routes d'auth dans la doc API
}
