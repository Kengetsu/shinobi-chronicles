<?php

require_once __DIR__ . '/../APIResponse.php';

class TravelPageAPIResponse extends APIResponse {
    public array $location_data = [];
    public string $location_result = "";

    public function __construct(array $location_data = [], string $location_result = "", array $errors = []) {
        $this->location_data = $location_data;
        $this->location_result = $location_result;
        $this->errors = $errors;
    }
}