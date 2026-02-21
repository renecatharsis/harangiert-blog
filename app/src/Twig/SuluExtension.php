<?php

declare(strict_types=1);

namespace App\Twig;

use Symfony\Component\HttpFoundation\RequestStack;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

class SuluExtension extends AbstractExtension
{
    private RequestStack $request;

    public function __construct(RequestStack $request)
    {
        $this->request = $request;
    }

    public function getFilters(): array
    {
        return [
            new TwigFilter('tailwind_rich_text', [$this, 'addTailwindClassesToRichTextEditor']),
        ];
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('absolute_url', [$this, 'getAbsoluteUrl'])
        ];
    }

    public function addTailwindClassesToRichTextEditor(string $str): string
    {
        return str_replace([
            '<h1>', '<h2>', '<p>', '<a ',
        ], [
            '<h1 class="text-3xl font-bold mb-4">', '<h2 class="text-2xl font-bold mb-4">', '<p class="text-2xl mt-4 mb-4">', '<a class="underline" '
        ], $str);
    }

    public function getAbsoluteUrl(?string $path = null): string
    {
        return sprintf(
            '%s%s',
            $this->request->getCurrentRequest()->getSchemeAndHttpHost(),
            (string)$path
        );
    }
}
