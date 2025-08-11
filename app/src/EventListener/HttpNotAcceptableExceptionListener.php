<?php

declare(strict_types=1);

namespace App\EventListener;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\NotAcceptableHttpException;
use Twig\Environment;

readonly class HttpNotAcceptableExceptionListener
{
    public function __construct(private Environment $twig)
    {}

    /**
     * Configuring a fallback error template for 406 errors fixes Sulu's behaviour of not matching
     * an error template for the provided format when requesting a non-existing format.
     *
     * For example: requesting harangiert.de/.env
     * will have Sulu resolve the root page in env format (?) instead of html.
     * It then tries to render the 406 or default error page in env format as well.
     * Since that won't match either, the exception will be bubbled up for us to catch it here.
     *
     * Unfortunately, Sulu sets the Content-Type header to match the requested format, resulting in the
     * Content-Type being "env" and the browser therefor not rendering the returned HTML.
     * Overriding the Content-Type here fixes that.
     *
     * @param ExceptionEvent $event
     * @return void
     */
    public function __invoke(ExceptionEvent $event): void
    {
        $throwable = $event->getThrowable();
        if (!$throwable instanceof NotAcceptableHttpException) {
            return;
        }

        $content = '';
        try {
            $content = $this->twig->render('error/default.html.twig');
        } catch (\Throwable) {}

        $response = new Response(
            $content,
            Response::HTTP_NOT_ACCEPTABLE,
            ['Content-Type' => 'text/html']
        );

        $event->setResponse($response);
    }
}