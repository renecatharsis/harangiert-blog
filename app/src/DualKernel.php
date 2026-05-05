<?php

declare(strict_types=1);

namespace App;

use Sulu\Component\HttpKernel\SuluKernel;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\TerminableInterface;

class DualKernel implements HttpKernelInterface, TerminableInterface
{
    private Kernel $adminKernel;

    private Kernel $websiteKernel;

    public function __construct($context)
    {
        Request::enableHttpMethodParameterOverride();

        $this->adminKernel = new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG'], SuluKernel::CONTEXT_ADMIN);
        $this->websiteKernel = new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG'], SuluKernel::CONTEXT_WEBSITE);
    }

    public function handle(Request $request, int $type = self::MAIN_REQUEST, bool $catch = true): Response
    {
        if (preg_match('/^\/admin(\/|$)/', $request->getPathInfo())) {
            return $this->adminKernel->handle($request, $type, $catch);
        }

        return $this->websiteKernel->handle($request, $type, $catch);
    }

    public function terminate(Request $request, Response $response): void
    {
        if (preg_match('/^\/admin(\/|$)/', $request->getPathInfo())) {
            $this->adminKernel->terminate($request, $response);
        }

        $this->websiteKernel->terminate($request, $response);
    }
}