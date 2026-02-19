<?php

namespace App\DataPersister;

use ApiPlatform\Core\DataPersister\ContextAwareDataPersisterInterface;
use App\Entity\Livre;
use Doctrine\ORM\EntityManagerInterface;

final class LivreDataPersister implements ContextAwareDataPersisterInterface
{
    private $decorated;
    private $em;
    private $projectDir;

    public function __construct(EntityManagerInterface $em, string $projectDir)
    {
        $this->em = $em;
        $this->projectDir = $projectDir;
    }

    public function supports($data, array $context = []): bool
    {
        return $data instanceof Livre;
    }

    public function persist($data, array $context = [])
    {
        // 1. On sauvegarde d'abord pour avoir l'ID
        $this->em->persist($data);
        $this->em->flush();

        // 2. Gestion de l'image Base64
        $base64String = $data->getImage();

        if (str_contains($base64String, 'data:image')) {
            // Extraire l'extension et les données
            preg_match('/data:image\/(?<extension>.*?);base64,(?<data>.*)/', $base64String, $match);
            $extension = $match['extension'];
            $imageData = base64_decode($match['data']);

            $fileName = 'livre' . $data->getId() . '.' . $extension;
            $relativeDir = '/images/livres/';
            $absoluteDir = $this->projectDir . '/public' . $relativeDir;

            if (!file_exists($absoluteDir)) {
                mkdir($absoluteDir, 0777, true);
            }

            file_put_contents($absoluteDir . $fileName, $imageData);

            // 3. Mettre à jour l'URL en base
            $data->setImage($relativeDir . $fileName);
            $this->em->flush();
        }

        return $data;
    }

    public function remove($data, array $context = [])
    {
        $this->em->remove($data);
        $this->em->flush();
    }
}
