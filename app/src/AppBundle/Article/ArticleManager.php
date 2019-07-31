<?php declare(strict_types=1);

namespace AppBundle\Article;

use AppBundle\Page\Types;
use PHPCR\Query\QOM\QueryObjectModelConstantsInterface;
use PHPCR\Query\QueryInterface;
use PHPCR\Util\QOM\QueryBuilder;
use Sulu\Component\Content\Compat\StructureInterface;
use Sulu\Component\Content\Mapper\ContentMapperInterface;
use Sulu\Component\PHPCR\SessionManager\SessionManagerInterface;
use Sulu\Component\Webspace\Analyzer\RequestAnalyzerInterface;

class ArticleManager implements ArticleManagerInterface
{
    /** @var ContentMapperInterface $contentMapper */
    protected $contentMapper;

    /** @var RequestAnalyzerInterface $requestAnalyser */
    protected $requestAnalyzer;

    /** @var SessionManagerInterface $sessionManager */
    protected $sessionManager;

    public function __construct(
        ContentMapperInterface $contentMapper,
        RequestAnalyzerInterface $requestAnalyzer,
        SessionManagerInterface $sessionManager
    )
    {
        $this->contentMapper = $contentMapper;
        $this->requestAnalyzer = $requestAnalyzer;
        $this->sessionManager = $sessionManager;
    }

    public function getLatest(int $amount = null, string $excludedUuid = null): array
    {
        return $this->getAllStructuresSortedByCreatedDate($amount, $excludedUuid);
    }

    public function getPrevious(StructureInterface $structure): ?StructureInterface
    {
        return $this->getClosestSiblingByDateCondition(
            $structure,
            QueryObjectModelConstantsInterface::JCR_OPERATOR_LESS_THAN
        );
    }

    public function getNext(StructureInterface $structure): ?StructureInterface
    {
        return $this->getClosestSiblingByDateCondition(
            $structure,
            QueryObjectModelConstantsInterface::JCR_OPERATOR_GREATER_THAN
        );
    }

    protected function getClosestSiblingByDateCondition(StructureInterface $structure, string $condition): ?StructureInterface
    {
        $qb = $this->getQueryBuilderForAllPagesByTemplate(Types::ARTICLE);
        $qb = $this->excludeUuid($qb, (string)$structure->getUuid());

        $qb
            ->setMaxResults(1)
            ->andWhere(
                $qb->qomf()->comparison(
                    $qb->qomf()->propertyValue('a', sprintf(
                        'i18n:%s-created',
                        $this->requestAnalyzer->getCurrentLocalization()->getLocale()
                    )),
                    $condition,
                    $qb->qomf()->literal($structure->getCreated())
                )
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

        $pages = $this->executeQuery($qb->getQuery());

        return $pages;
    }

    protected function executeQuery(QueryInterface $query): array
    {
        return $this->contentMapper->loadByQuery(
            $query,
            $this->requestAnalyzer->getCurrentLocalization()->getLocale(),
            $this->requestAnalyzer->getWebspace()->getKey()
        );
    }

    protected function getQueryBuilderForAllPagesByTemplate(string $template): QueryBuilder
    {
        $qb = $this->getQueryBuilder();

        $qb->andWhere(
            $qb->qomf()->comparison(
                $qb->qomf()->propertyValue('a', sprintf(
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
                $qb->qomf()->propertyValue('a', 'jcr:uuid'),
                QueryObjectModelConstantsInterface::JCR_OPERATOR_NOT_EQUAL_TO,
                $qb->qomf()->literal($uuid)
            )
        );
    }

    protected function getQueryBuilder(): QueryBuilder
    {
        $workspace = $this->sessionManager->getSession()->getWorkspace();
        $queryManager = $workspace->getQueryManager();

        $qf = $queryManager->getQOMFactory();
        $qb = new QueryBuilder($qf);

        $qb->from(
            $qb->qomf()->selector('a', 'nt:unstructured')
        );

        $qb->andWhere(
            $qb->qomf()->comparison(
                $qb->qomf()->propertyValue('a', 'jcr:mixinTypes'),
                QueryObjectModelConstantsInterface::JCR_OPERATOR_EQUAL_TO,
                $qb->qomf()->literal('sulu:page')
            )
        );

        $qb->orderBy(
            $qb->qomf()->propertyValue(
                'a',
                sprintf(
                    'i18n:%s-created',
                    $this->requestAnalyzer->getCurrentLocalization()->getLocale()
                )),
            'DESC'
        );

        return $qb;
    }
}