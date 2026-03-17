<?php

namespace App\Modules\Library\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShareRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'recipient_id' => ['required', 'exists:users,id'],
            'shareable_type' => ['required', Rule::in(['file', 'folder'])],
            'shareable_id' => ['required', 'integer'],
        ];
    }
}
