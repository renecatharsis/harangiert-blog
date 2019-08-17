<?php declare(strict_types=1);

namespace AppBundle\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class GeneratorEventSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::RESPONSE => 'onResponse',
        ];
    }

    public function onResponse(FilterResponseEvent $event)
    {
        /**
         * Don't do anything here.
         * This overrides Sulu's default behaviour of sending X-Generator header with the used Sulu version.
         * Seems unnecessary to me, also a potential security issue if Sulu is out of date
         */
    }
}