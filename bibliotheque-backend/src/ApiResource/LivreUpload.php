<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Controller\LivreUploadController;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/livres/upload',
            controller: LivreUploadController::class . '::upload',
            name: 'api_livres_upload',
            deserialize: false, // Important pour le FormData
            read: false,
            validate: false
        )
    ]
)]
class LivreUpload
{
    // Classe porteuse pour l'upload
}
