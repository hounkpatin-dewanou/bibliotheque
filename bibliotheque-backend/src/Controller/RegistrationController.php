<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\ApiResource\RegistrationInput;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpFoundation\JsonResponse;

#[AsController]
class RegistrationController extends AbstractController
{
    public function __invoke(
        #[MapRequestPayload] RegistrationInput $data,
        UserPasswordHasherInterface $hasher,
        EntityManagerInterface $em,
        MailerInterface $mailer,
        UtilisateurRepository $repository
    ): JsonResponse {

        // 1. Vérifier si l'utilisateur existe déjà
        $existingUser = $repository->findOneBy(['email' => $data->email]);
        if ($existingUser) {
            return $this->json([
                'message' => 'Cette adresse email est déjà utilisée.'
            ], 409);
        }

        try {
            $user = new Utilisateur();
            $user->setEmail($data->email);
            $user->setNom($data->nom);
            $user->setPrenom($data->prenom);

            $user->setPassword($hasher->hashPassword($user, $data->password));
            $user->setIsVerified(false);

            $token = bin2hex(random_bytes(32));
            $user->setVerificationToken($token);

            $em->persist($user);
            $em->flush();

            // 2. Préparation de l'email
            $email = (new Email())
                ->from('noreply@lecoinlecture.com')
                ->to($user->getEmail())
                ->subject('Bienvenue ! Confirmez votre email')
                ->html("
                                <div style='font-family: Arial, sans-serif; background-color: #f9fafb; padding: 50px 20px;'>
                    <div style='max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 8px; border: 1px solid #e5e7eb;'>
                        <div style='margin-bottom: 25px;'>
                            <span style='color: #4c69ba; font-size: 24px; font-weight: bold;'>
                                <img src='https://votre-logo-url.com/logo.png' alt='' style='vertical-align: middle; margin-right: 8px; width: 30px;'>
                                Le Coin Lecture
                            </span>
                        </div>

                        <p style='font-size: 16px; color: #374151;'>Bonjour {$user->getPrenom()},</p>

                        <p style='font-size: 16px; color: #374151; line-height: 1.5;'>
                            Merci de vous être inscrit sur Le Coin Lecture. Nous sommes ravis de vous compter parmi nous !
                        </p>

                        <p style='font-size: 16px; color: #374151; margin-top: 20px;'>
                            Cette adresse e-mail a été utilisée pour votre inscription :<br>
                            <strong style='color: #2563eb;'>{$user->getEmail()}</strong>
                        </p>

                        <p style='font-size: 16px; color: #374151; margin-top: 20px;'>
                            Cliquez sur le bouton ci-dessous pour vérifier que vous êtes bien le propriétaire :
                        </p>

                        <div style='margin-top: 30px; margin-bottom: 30px;'>
                            <a href='http://localhost:3000/confirm-email?token=$token'
                            style='background-color: #4c69ba; color: white; padding: 12px 35px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;'>
                                Vérifier l'e-mail
                            </a>
                        </div>

                        <p style='font-size: 14px; color: #6b7280; line-height: 1.5;'>
                            Si vous avez des difficultés à cliquer sur le bouton, copiez et collez l'URL ci-dessous dans votre navigateur :
                        </p>

                        <p style='font-size: 14px; color: #2563eb; word-break: break-all;'>
                            http://localhost:3000/confirm-email?token=$token
                        </p>

                        <hr style='border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;'>

                        <p style='font-size: 14px; color: #6b7280;'>Ce lien expirera dans 48 heures.</p>

                        <div style='background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin-top: 20px;'>
                            <p style='font-size: 14px; color: #374151; margin: 0;'>
                                Si vous n'avez pas créé ce compte, ignorez simplement ce message.
                            </p>
                        </div>

                        <p style='font-size: 16px; color: #374151; margin-top: 30px;'>
                            Cordialement,<br>
                            <strong>L'équipe Le Coin Lecture</strong>
                        </p>
                    </div>

                    <div style='text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;'>
                        LeCoinLecture.com, Tous droits réservés.<br>
                        Vous avez reçu cet e-mail car quelqu'un a tenté d'enregistrer cette adresse sur notre service.
                    </div>
                </div>
                ");

            // 3. Tentative d'envoi
            $mailer->send($email);

            return $this->json([
                'message' => 'Inscription réussie ! Un email de validation vous a été envoyé.',
                'user' => [
                    'email' => $user->getEmail(),
                    'nom' => $user->getNom()
                ]
            ], 201);

        } catch (\Exception $e) {
            // IMPORTANT : Si l'email échoue, on annule la création de l'utilisateur
            // pour permettre de retenter l'inscription sans erreur de doublon.
            if (isset($user) && $em->contains($user)) {
                $em->remove($user);
                $em->flush();
            }

            return $this->json([
                'message' => "Erreur technique : " . $e->getMessage()
            ], 500);
        }
    }

}
