<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'farmer_id' => ['required', 'integer', 'exists:farmers,id'],
            'farm_id'   => ['required', 'integer', 'exists:farms,id'],
            'type'      => [
                'required',
                'string',
                'in:agronomist_visit,soil_test,biochar_assessment,coffee_quality_assessment,buyer_offtake_support',
            ],
            'notes'     => ['nullable', 'string', 'max:1000'],
        ];
    }
}
