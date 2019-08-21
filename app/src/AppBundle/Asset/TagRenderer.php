<?php declare(strict_types=1);

namespace AppBundle\Asset;

use \Symfony\WebpackEncoreBundle\Asset\TagRenderer as SymfonyTagRenderer;

class TagRenderer extends SymfonyTagRenderer
{
    public function renderWebpackScriptTags(string $entryName, string $packageName = null, string $entrypointName = '_default'): string
    {
        $result = parent::renderWebpackScriptTags($entryName, $packageName, $entrypointName);
        $result = preg_replace('/<script src=/', '<script async src=', $result);

        return $result;
    }
}