<?php declare(strict_types=1);

namespace App\Twig;

use App\Article\ArticleManagerInterface;
use Sulu\Component\Content\Compat\Structure\PageBridge;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class MapExtension extends AbstractExtension
{
     protected ArticleManagerInterface $articleManager;

     public function __construct(ArticleManagerInterface $articleManager)
     {
         $this->articleManager = $articleManager;
     }

    public function getFunctions()
    {
        return [
            new TwigFunction('get_map_link_opening', [$this, 'getMapLinkOpening']),
            new TwigFunction('get_map_link_closing', [$this, 'getMapLinkClosing'])
        ];
    }

    public function getMapLinkOpening(string $stopName, string $cx, string $cy, string $rx, string $ry): string
    {
        /** @var PageBridge $page */
        $page = $this->articleManager->getByStopName($stopName);
        $attributes = [
            'href' => '',
            'class' => '',
            'onclick' => 'return false;'
        ];

        if (null !== $page) {
            $attributes = [
                'href' => $page->getUrl(),
                'class' => 'highlight',
                'onclick' => ';'
            ];
        }

        return sprintf(
            '<a xlink:href="%s" class="%s" onclick="%s">' .
            '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" style="fill:#ffffff;stroke:#aaaaaa;stroke-width:0.5;opacity: 0.9;" />',
            $attributes['href'],
            $attributes['class'],
            $attributes['onclick'],
            $cx,
            $cy,
            $rx,
            $ry
        );
    }

    public function getMapLinkClosing(): string
    {
        return '</a>';
    }
}