<?php

namespace App\Modules\Availability\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'tutor';
    }

    public function rules(): array
    {
        return [
            // On autorise maintenant l'absence totale de créneaux :
            // - si "slots" est présent, il doit être un tableau
            // - il peut être vide pour signifier "aucun jour disponible"
            'slots' => ['nullable', 'array'],
            'slots.*.day_of_week' => ['required', 'integer', 'between:0,6'],
            'slots.*.start_time' => ['required', 'date_format:H:i'],
            'slots.*.end_time' => ['required', 'date_format:H:i', 'after:slots.*.start_time'],
        ];
    }
}
