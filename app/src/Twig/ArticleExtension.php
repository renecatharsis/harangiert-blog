<?php

declare(strict_types=1);

namespace App\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class ArticleExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('get_article_text', [$this, 'getArticleText'])
        ];
    }

    public function getArticleText(array $page): string
    {
        foreach ($page['content']['blocks'] as $block) {
            if ('article' === $block['type']) {
                return $block['text'];
            }
        }

        return '';
    }
}