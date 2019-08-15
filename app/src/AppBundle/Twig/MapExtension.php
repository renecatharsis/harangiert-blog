<?php declare(strict_types=1);

namespace AppBundle\Twig;

use AppBundle\Article\ArticleManagerInterface;
use Sulu\Component\Content\Compat\Structure\PageBridge;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class MapExtension extends AbstractExtension
{
    /** @var ArticleManagerInterface */
     protected $articleManager;

     public function __construct(ArticleManagerInterface $articleManager)
     {
         $this->articleManager = $articleManager;
     }

    public function getFunctions()
    {
        return [
            new TwigFunction('get_map_link_attributes', [$this, 'getMapLinkAttributes'])
        ];
    }

    public function getMapLinkAttributes(string $stopName): string
    {
        /** @var PageBridge $page */
        $page = $this->articleManager->getByStopName($stopName);
        $attributes = [
            'href' => '',
            'target' => '_self',
            'class' => '',
            'onclick' => 'return false;'
        ];

        if (null !== $page) {
            $attributes = [
                'href' => $page->getUrl(),
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