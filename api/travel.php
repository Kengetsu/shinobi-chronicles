<?php
# Begin standard auth
require "../classes/_autoload.php";

$system = new System();
$system->is_api_request = true;

try {
    $player = Auth::getUserFromSession($system);
} catch(Exception $e) {
    API::exitWithError($e->getMessage());
}
# End standard auth

require(__DIR__ . '/../pages/travel.php');

$player->loadData(User::UPDATE_NOTHING);

$newLocation = '';
if(!empty($_POST['travel'])) {
    $newLocation = $_POST['travel'];
}

$response = TravelAPI($system, $player, $newLocation);
if(!($response instanceof TravelPageAPIResponse)) {
    API::exitWithError("Invalid travel API response! - Expected TravelPageAPIResponse, got " . get_class($response));
}

API::exitWithData(
    data: [
        'location' => $response->location_data,
        'newLocation' => $response->location_result,
    ],
    errors: $response->errors,
    debug_messages: $system->debug_messages,
);





