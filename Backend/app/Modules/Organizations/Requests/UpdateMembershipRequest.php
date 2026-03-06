<?php

namespace App\Modules\Organizations\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMembershipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'center_owner';
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', Rule::in(['accepted', 'rejected'])],
        ];
    }
}
