<?php

require_once __DIR__ . '/../APIResponse.php';

class TravelPageAPIResponse extends APIResponse {
    public array $location_data = [];
    public string $location_result = "";
    public array $rank_data = [];
    public array $scout_data = [];

    public function __construct(array $location_data = [], string $location_result = "", array $rank_data = [], array $scout_data = [], array $errors = []) {
        $this->location_data = $location_data;
        $this->location_result = $location_result;
        $this->rank_data = $rank_data;
        $this->scout_data = $scout_data;
        $this->errors = $errors;
    }
}