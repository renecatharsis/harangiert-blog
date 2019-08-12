<?php declare(strict_types=1);

namespace AppBundle\Twig;

use Sulu\Bundle\MediaBundle\Api\Media;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class GalleryExtension extends AbstractExtension
{
    public function getFunctions()
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
                'title' => $source->getTitle(),
                'href' => $source->getFormats()['1632x1224'],
                'thumbnail' => $source->getFormats()['102x76'],
            ];
        }

        return $images;
    }
}