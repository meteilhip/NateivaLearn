<?php

namespace App\Modules\Library\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'max:51200'], // 50 MB
            'folder_id' => ['nullable', 'exists:library_folders,id'],
        ];
    }
}
