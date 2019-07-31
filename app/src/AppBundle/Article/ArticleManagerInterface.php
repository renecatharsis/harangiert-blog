<?php declare(strict_types=1);

namespace AppBundle\Article;

use Sulu\Component\Content\Compat\StructureInterface;

interface ArticleManagerInterface
{
    public function getLatest(int $amount = null, string $excludedUuid = null): array;
    public function getPrevious(StructureInterface $structure): ?StructureInterface;
    public function getNext(StructureInterface $structure): ?StructureInterface;
}