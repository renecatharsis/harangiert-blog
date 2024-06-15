<?php

declare(strict_types=1);

namespace App\Controller\Website;

use App\Article\ArticleManagerInterface;
use Sulu\Bundle\WebsiteBundle\Controller\WebsiteController;
use Sulu\Component\Content\Compat\StructureInterface;
use Symfony\Component\HttpFoundation\Response;

class HomeController extends WebsiteController
{
    public function indexAction(StructureInterface $structure, ArticleManagerInterface $articleManager, $preview = false, $partial = false): Response
    {
        $articles = $articleManager->getLatest();

        return $this->renderStructure(
            $structure,
            [
                'articles' => $articles,
            ],
            $preview,
            $partial
        );
    }
}