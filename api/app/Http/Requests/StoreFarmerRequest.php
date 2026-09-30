<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFarmerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name'          => ['required', 'string', 'max:255'],
            'mobile_number'      => ['required', 'string', 'max:20'],
            'email'              => ['nullable', 'email', 'max:255'],
            'county'             => ['required', 'string', 'max:100'],
            'preferred_language' => ['required', 'string', 'max:50'],
        ];
    }
}
