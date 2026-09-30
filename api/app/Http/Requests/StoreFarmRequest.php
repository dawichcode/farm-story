<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFarmRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isCoffee = strtolower($this->input('primary_crop', '')) === 'coffee';

        return [
            'farmer_id'   => ['required', 'integer', 'exists:farmers,id'],
            'farm_name'   => ['required', 'string', 'max:255'],
            'location'    => ['required', 'string', 'max:255'],
            'latitude'    => ['required', 'numeric', 'between:-90,90'],
            'longitude'   => ['required', 'numeric', 'between:-180,180'],
            'size_acres'  => ['required', 'numeric', 'min:0.01'],
            'primary_crop'=> ['required', 'string', 'max:100'],
            'challenges'  => ['required', 'array'],
            'challenges.*'=> ['string', 'in:low_yield,pests_disease,soil_quality,water_availability,access_to_buyers,access_to_finance,input_costs'],

            // Coffee-specific fields
            'coffee_varieties'            => [$isCoffee ? 'required' : 'nullable', 'string', 'max:255'],
            'coffee_tree_count'           => [$isCoffee ? 'required' : 'nullable', 'integer', 'min:1'],
            'estimated_annual_production' => [$isCoffee ? 'required' : 'nullable', 'numeric', 'min:0'],
            'last_harvest_date'           => ['nullable', 'string', 'max:50'],
        ];
    }
}
