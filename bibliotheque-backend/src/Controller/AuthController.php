<?php

namespace App\Controller;

use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class AuthController extends AbstractController
{
    public function verifyToken(string $token, UtilisateurRepository $utilisateurRepository, EntityManagerInterface $em): JsonResponse
{
    // 1. On cherche l'utilisateur par le token
    $user = $utilisateurRepository->findOneBy(['verificationToken' => $token]);

    // 2. Si on ne trouve personne avec ce token
    if (!$user) {
        return $this->json([
            'message' => 'Ce lien de confirmation est invalide ou a déjà été utilisé.'
        ], 400);
    }

    // 3. Cas de sécurité : Si l'utilisateur est déjà vérifié mais que le token est encore là
    if ($user->isVerified()) {
        // On nettoie le token par sécurité s'il restait
        $user->setVerificationToken(null);
        $em->flush();

        return $this->json([
            'message' => 'Votre compte est déjà activé. Vous pouvez vous connecter.'
        ], 200);
    }

    // 4. Succès de la première vérification
    $user->setIsVerified(true);
    $user->setVerificationToken(null); // On supprime le token pour qu'il ne soit plus réutilisable
    $em->flush();

    return $this->json([
        'message' => 'Félicitations ! Votre compte a été activé avec succès.'
    ], 200);
}
    public function resendVerification(Request $request, UtilisateurRepository $repository, MailerInterface $mailer, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $emailAddress = $data['email'] ?? null;
        $user = $repository->findOneBy(['email' => $emailAddress]);

        if ($user && !$user->isVerified()) {
            $token = bin2hex(random_bytes(32));
            $user->setVerificationToken($token);
            $em->flush();

            $email = (new Email())
                ->from('noreply@lecoinlecture.com')
                ->to($user->getEmail())
                ->subject('Nouveau lien de confirmation - Le Coin Lecture')
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
            $mailer->send($email);
        }

        return $this->json(['message' => 'Si le compte existe, un email a été envoyé.']);
    }
}
