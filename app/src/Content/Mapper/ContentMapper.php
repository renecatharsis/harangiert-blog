<?php declare(strict_types=1);

namespace App\Content\Mapper;

use PHPCR\Query\QueryInterface;
use Sulu\Bundle\DocumentManagerBundle\Bridge\DocumentInspector;
use Sulu\Component\Content\Compat\StructureInterface;
use Sulu\Component\Content\Compat\StructureManagerInterface;
use Sulu\Component\Content\Document\Behavior\StructureBehavior;
use Sulu\Component\Content\Document\LocalizationState;
use Sulu\Component\DocumentManager\DocumentManager;

/**
 * Based on Sulu's deprecated ContentMapper
 * No real alternative was provided
 */
class ContentMapper
{
    private StructureManagerInterface $structureManager;
    private DocumentManager $documentManager;
    private DocumentInspector $inspector;

    public function __construct(
        DocumentManager $documentManager,
        DocumentInspector $inspector,
        StructureManagerInterface $structureManager
    ) {
        $this->structureManager = $structureManager;
        $this->documentManager = $documentManager;
        $this->inspector = $inspector;
    }

    public function loadByQuery(
        QueryInterface $query,
        $locale,
        $excludeGhost = true,
        $loadGhostContent = false
    ): array {
        $options = [
            'exclude_ghost' => $excludeGhost,
            'load_ghost_content' => $loadGhostContent,
        ];

        $documents = $this->documentManager->createQuery($query, $locale, $options)->execute();

        return $this->documentsToStructureCollection($documents, $options);
    }

    private function optionsShouldExcludeDocument($document, array $options = null): bool
    {
        if (null === $options) {
            return false;
        }

        $options = \array_merge(
            [
                'exclude_ghost' => true,
                'exclude_shadow' => true,
            ],
            $options
        );

        $state = $this->inspector->getLocalizationState($document);

        if ($options['exclude_ghost'] && LocalizationState::GHOST == $state) {
            return true;
        }

        if ($options['exclude_ghost'] && $options['exclude_shadow'] && LocalizationState::SHADOW == $state) {
            return true;
        }

        return false;
    }

    private function documentToStructure($document): ?StructureInterface
    {
        if (null === $document) {
            return null;
        }

        $structure = $this->inspector->getStructureMetadata($document);
        $documentAlias = $this->inspector->getMetadata($document)->getAlias();

        $structureBridge = $this->structureManager->wrapStructure($documentAlias, $structure);
        $structureBridge->setDocument($document);

        return $structureBridge;
    }

    private function documentsToStructureCollection($documents, $filterOptions = null): array
    {
        $collection = [];
        foreach ($documents as $document) {
            if (!$document instanceof StructureBehavior) {
                continue;
            }

            if ($this->optionsShouldExcludeDocument($document, $filterOptions)) {
                continue;
            }

            $collection[] = $this->documentToStructure($document);
        }

        return $collection;
    }
}
