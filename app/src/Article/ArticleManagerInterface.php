<?php declare(strict_types=1);

namespace App\Article;

use Sulu\Component\Content\Compat\StructureInterface;

interface ArticleManagerInterface
{
    public function getLatest(int $amount = null, string $excludedUuid = null): array;
    public function getPrevious(StructureInterface $structure);
    public function getNext(StructureInterface $structure);
    public function getByStopName(string $stopName);
}