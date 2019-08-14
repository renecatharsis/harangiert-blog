<?php declare(strict_types=1);

namespace AppBundle\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class MapExtension extends AbstractExtension
{
    public function getFunctions()
    {
        return [
            new TwigFunction('get_map_link_attributes', [$this, 'getMapLinkAttributes'])
        ];
    }

    public function getMapLinkAttributes(string $stopName): string
    {
        $attributes = [
            'href' => '',
            'target' => '_self',
            'class' => '',
            'onclick' => 'return false;'
        ];

        if (true) {
            $attributes = [
                'href' => 'foo',
                'target' => '_blank',
                'class' => 'text-underline',
                'onclick' => ';'
            ];
        }

        return sprintf(
            'xlink:href="%s" target="%s" class="%s", onclick="%s"',
            $attributes['href'],
            $attributes['target'],
            $attributes['class'],
            $attributes['onclick']
        );
    }
}