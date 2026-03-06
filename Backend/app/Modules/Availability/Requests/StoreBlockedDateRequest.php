<?php

namespace App\Modules\Availability\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlockedDateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'tutor';
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date', 'after_or_equal:today'],
        ];
    }
}
