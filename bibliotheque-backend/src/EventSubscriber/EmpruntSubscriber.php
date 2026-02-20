<?php
namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Emprunt;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Bundle\SecurityBundle\Security;

class EmpruntSubscriber implements EventSubscriberInterface
{
    private Security $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['setUserAndStatus', EventPriorities::PRE_WRITE],
        ];
    }

    public function setUserAndStatus(ViewEvent $event): void
    {
        $emprunt = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$emprunt instanceof Emprunt || $method !== 'POST') {
            return;
        }

        $user = $this->security->getUser();

        if ($user) {
            $emprunt->setUsager($user);
        }

        $emprunt->setAccordee(null);
    }
}
