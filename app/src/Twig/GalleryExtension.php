<?php

declare(strict_types=1);

namespace App\Twig;

use Sulu\Bundle\MediaBundle\Api\Media;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class GalleryExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('gallery_images', [$this, 'getGalleryImages'])
        ];
    }

    public function getGalleryImages(array $sources): array
    {
        $images = [];
        foreach ($sources as $source) {
            /** @var Media $source */
            $images[] = [
                'title' => $source->getDescription(),
                'href' => $source->getFormats()['547x410'],
            ];
        }

        return $images;
    }
}