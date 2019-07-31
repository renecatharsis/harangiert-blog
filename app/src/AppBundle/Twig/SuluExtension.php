<?php declare(strict_types=1);

namespace AppBundle\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class SuluExtension extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            new TwigFilter('filter_rich_text', [$this, 'filterRichTextEditor']),
        ];
    }

    public function filterRichTextEditor(string $str): string
    {
        return preg_replace('!^<p>(.*?)</p>$!i', '$1', $str);
    }
}
