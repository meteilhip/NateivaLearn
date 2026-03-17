<?php

namespace App\Modules\Organizations\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrganizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'center_owner';
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:2000'],
            'logo' => ['nullable', 'string', 'max:2097152'], // base64 data URL (~2 Mo)
            'required_languages' => ['nullable', 'array'],
            'required_languages.*' => ['string', 'max:100'],
            'subjects' => ['nullable', 'array'],
            'subjects.*' => ['string', 'max:255'],
        ];
    }
}
