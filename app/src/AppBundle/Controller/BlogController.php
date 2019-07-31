<?php declare(strict_types=1);

namespace AppBundle\Controller;

use AppBundle\Article\ArticleManagerInterface;
use Sulu\Bundle\WebsiteBundle\Controller\WebsiteController;
use Sulu\Component\Content\Compat\StructureInterface;
use Symfony\Component\HttpFoundation\Response;

class BlogController extends WebsiteController
{
    public function articleAction(StructureInterface $structure, ArticleManagerInterface $articleManager, $preview = false, $partial = false): Response
    {
        $response = $this->renderStructure(
            $structure,
            [
                'previousArticle' => $articleManager->getPrevious($structure),
                'nextArticle' => $articleManager->getNext($structure),
            ],
            $preview,
            $partial
        );

        return $response;
    }
}