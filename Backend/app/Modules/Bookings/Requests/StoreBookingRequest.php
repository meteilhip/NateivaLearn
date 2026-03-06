<?php

namespace App\Modules\Bookings\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'learner';
    }

    public function rules(): array
    {
        return [
            'tutor_id' => ['required', 'exists:users,id'],
            'organization_id' => ['nullable', 'exists:organizations,id'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'price' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
