<?php

namespace App\Exceptions;

use Exception;

class MailDeliveryException extends Exception
{
    public function __construct(
        string $message = 'We could not send the email right now. Please try again later.',
        ?\Throwable $previous = null,
    ) {
        parent::__construct($message, 0, $previous);
    }
}
