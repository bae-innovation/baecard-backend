<?php

use App\Support\PhoneSearch;

it('normalizes phone numbers for search', function () {
    expect(PhoneSearch::normalize('+880 1712-345-678'))->toBe('1712345678')
        ->and(PhoneSearch::matches('+8801712345678', '01712345678'))->toBeTrue()
        ->and(PhoneSearch::matches('01712345678', '1712345678'))->toBeTrue()
        ->and(PhoneSearch::matches('01712345678', '9999999999'))->toBeFalse();
});
