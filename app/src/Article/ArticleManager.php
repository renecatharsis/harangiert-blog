<?php declare(strict_types=1);

namespace App\Article;

use App\Content\Mapper\ContentMapper;
use App\Page\Types;
use PHPCR\Query\QOM\QueryObjectModelConstantsInterface;
use PHPCR\Query\QueryInterface;
use PHPCR\SessionInterface;
use PHPCR\Util\QOM\QueryBuilder;
use Sulu\Component\Content\Compat\StructureInterface;
use Sulu\Component\DocumentManager\DocumentManager;
use Sulu\Component\Webspace\Analyzer\RequestAnalyzerInterface;

class ArticleManager implements ArticleManagerInterface
{
    protected DocumentManager $documentManager;
    protected ContentMapper $contentMapper;
    protected RequestAnalyzerInterface $requestAnalyzer;
    protected SessionInterface $session;

    public function __construct(
        DocumentManager $documentManager,
        ContentMapper $contentMapper,
        RequestAnalyzerInterface $requestAnalyzer,
        SessionInterface $session
    )
    {
        $this->documentManager = $documentManager;
        $this->contentMapper = $contentMapper;
        $this->requestAnalyzer = $requestAnalyzer;
        $this->session = $session;
    }

    public function getLatest(int $amount = null, string $excludedUuid = null): array
    {
        return $this->getAllStructuresSortedByCreatedDate($amount, $excludedUuid);
    }

    public function getPrevious(StructureInterface $structure)
    {
        return $this->getClosestSiblingByDateCondition(
            $structure,
            QueryObjectModelConstantsInterface::JCR_OPERATOR_LESS_THAN,
        );
    }

    public function getNext(StructureInterface $structure)
    {
        return $this->getClosestSiblingByDateCondition(
            $structure,
            QueryObjectModelConstantsInterface::JCR_OPERATOR_GREATER_THAN,
            'ASC'
        );
    }

    public function getByStopName(string $stopName)
    {
        $qb = $this->getQueryBuilder();
        $qb
            ->setMaxResults(1)
            ->andWhere(
                $qb->qomf()->comparison(
                    $qb->qomf()->propertyValue('node', sprintf(
                        'i18n:%s-stop',
                        $this->requestAnalyzer->getCurrentLocalization()->getLocale()
                    )),
                    QueryObjectModelConstantsInterface::JCR_OPERATOR_EQUAL_TO,
                    $qb->qomf()->literal($stopName)
                )
            );

        $pages = $this->executeQuery($qb->getQuery());

        if (0 === count($pages)) {
            return null;
        }

        return current($pages);
    }

    protected function getClosestSiblingByDateCondition(StructureInterface $structure, string $condition, string $orderBy = 'DESC')
    {
        $qb = $this->getQueryBuilderForAllPagesByTemplate(Types::ARTICLE);
        $qb = $this->excludeUuid($qb, (string)$structure->getUuid());

        $qb
            ->setMaxResults(1)
            ->andWhere(
                $qb->qomf()->comparison(
                    $qb->qomf()->propertyValue('node', sprintf(
                        'i18n:%s-created',
                        $this->requestAnalyzer->getCurrentLocalization()->getLocale()
                    )),
                    $condition,
                    $qb->qomf()->literal($structure->getCreated())
                )
            )
            ->orderBy(
                $qb->qomf()->propertyValue(
                    'node',
                    sprintf(
                        'i18n:%s-created',
                        $this->requestAnalyzer->getCurrentLocalization()->getLocale()
                    )),
                $orderBy
        );

        $data = $this->executeQuery($qb->getQuery());

        if (0 === count($data)) {
            return null;
        }

        return current($data);
    }

    protected function getAllStructuresSortedByCreatedDate(int $amount = null, string $excludedUuid = null): array
    {
        $qb = $this->getQueryBuilderForAllPagesByTemplate(Types::ARTICLE);

        if (null !== $amount) {
            $qb->setMaxResults($amount);
        }

        if (null !== $excludedUuid) {
            $qb = $this->excludeUuid($qb, $excludedUuid);
        }

        $qb->orderBy(
            $qb->qomf()->propertyValue(
                'node',
                sprintf(
                    'i18n:%s-created',
                    $this->requestAnalyzer->getCurrentLocalization()->getLocale()
                )),
            'DESC'
        );

        return $this->executeQuery($qb->getQuery());
    }

    protected function getQueryBuilderForAllPagesByTemplate(string $template): QueryBuilder
    {
        $qb = $this->getQueryBuilder();

        $qb->andWhere(
            $qb->qomf()->comparison(
                $qb->qomf()->propertyValue('node', sprintf(
                    'i18n:%s-template',
                    $this->requestAnalyzer->getCurrentLocalization()->getLocale()
                )),
                QueryObjectModelConstantsInterface::JCR_OPERATOR_EQUAL_TO,
                $qb->qomf()->literal($template)
            )
        );

        return $qb;
    }

    protected function excludeUuid(QueryBuilder $qb, string $uuid): QueryBuilder
    {
        return $qb->andWhere(
            $qb->qomf()->comparison(
                $qb->qomf()->propertyValue('node', 'jcr:uuid'),
                QueryObjectModelConstantsInterface::JCR_OPERATOR_NOT_EQUAL_TO,
                $qb->qomf()->literal($uuid)
            )
        );
    }

    protected function getQueryBuilder(): QueryBuilder
    {
        $queryManager = $this->session->getWorkspace()->getQueryManager();

        $qf = $queryManager->getQOMFactory();
        $qb = new QueryBuilder($qf);

        $qb->from(
            $qb->qomf()->selector('node', 'nt:unstructured')
        );

        $qb->andWhere(
            $qb->qomf()->comparison(
                $qb->qomf()->propertyValue('node', 'jcr:mixinTypes'),
                QueryObjectModelConstantsInterface::JCR_OPERATOR_EQUAL_TO,
                $qb->qomf()->literal('sulu:page')
            )
        );

        return $qb;
    }

    protected function executeQuery(QueryInterface $query): array
    {
        return $this->contentMapper->loadByQuery(
            $query,
            $this->requestAnalyzer->getCurrentLocalization()->getLocale()
        );
    }
}