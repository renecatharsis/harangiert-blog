<?php

declare(strict_types=1);

namespace App\Page;

enum Type: string
{
    case DEFAULT =  'default';
    case ARTICLE = 'blogpost';
}