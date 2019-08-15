<?php declare(strict_types=1);

namespace AppBundle\EventSubscriber;

use Asm89\Twig\CacheExtension\CacheProvider\PsrCacheAdapter;
use Asm89\Twig\CacheExtension\CacheStrategy\LifetimeCacheStrategy;
use Asm89\Twig\CacheExtension\Extension as CacheExtension;
use Psr\Cache\CacheItemPoolInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Twig\Environment;

class TwigCacheEventSubscriber implements EventSubscriberInterface
{
    /** @var Environment */
    protected $twig;

    /** @var CacheItemPoolInterface */
    protected $cachePool;

    public function __construct(Environment $twigEnvironment, CacheItemPoolInterface $cacheItemPool)
    {
        $this->twig = $twigEnvironment;
        $this->cachePool = $cacheItemPool;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::REQUEST => 'registerTwigCacheExtension',
        ];
    }

    public function registerTwigCacheExtension(GetResponseEvent $event)
    {
        if (!$event->isMasterRequest()) {
            return;
        }

        $cacheProvider  = new PsrCacheAdapter($this->cachePool);
        $cacheStrategy  = new LifetimeCacheStrategy($cacheProvider);
        $cacheExtension = new CacheExtension($cacheStrategy);

        $this->twig->addExtension($cacheExtension);
    }
}