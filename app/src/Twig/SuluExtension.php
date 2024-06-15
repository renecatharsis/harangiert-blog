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
            new TwigFilter('filter_rich_text', [$this, 'filterRichTextEditor']),
        ];
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('absolute_url', [$this, 'getAbsoluteUrl'])
        ];
    }

    public function filterRichTextEditor(string $str): string
    {
        return preg_replace('!^<p>(.*?)</p>$!i', '$1', $str);
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
