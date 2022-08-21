<?php

class Travel {
    /**
     * @param System $system
     * @param User $player
     * @param String $directionMoved
     * @return array
     * @throws Exception
     */
    public static function moveDirection(System $system, User $player, String $directionMoved): array
    {
        $target_x = $player->x;
        $target_y = $player->y;

        $ignore_travel_restrictions = $player->isHeadAdmin();

        switch($directionMoved) {
            case 'north':
                if($player->y <= 1 && !$ignore_travel_restrictions) {
                    throw new Exception("You cannot travel farther this way!");
                }

                $target_y--;
                break;
            case 'south':
                if($player->y >= System::MAP_SIZE_Y && !$ignore_travel_restrictions) {
                    throw new Exception("You cannot travel farther this way!");
                }

                $target_y++;
                break;
            case 'east':
                if($player->x >= System::MAP_SIZE_X && !$ignore_travel_restrictions) {
                    throw new Exception("You cannot travel farther this way!");
                }

                $target_x++;
                break;
            case 'west':
                if($player->x <= 1 && !$ignore_travel_restrictions) {
                    throw new Exception("You cannot travel farther this way!");
                }

                $target_x--;
                break;
            default:
                break;
        }
        $location = $target_x . "." . $target_y;

        if(isset($villages[$location]) && $location !== $player->village_location && !$ignore_travel_restrictions) {
            throw new Exception("You cannot travel into another village!");
        }

        if($player->last_death > time() - 15 && !$ignore_travel_restrictions) {
            throw new Exception("You died within the last 15 seconds, please wait " .
                (($player->last_death + 15) - time()) . " more seconds before moving.");
        }

        if ($player->special_mission) {
            throw new Exception("You are currently in a Special Mission and cannot travel!");
        }

        $player->location = $location;
        $player->y = $target_y;
        $player->x = $target_x;

        if($player->mission_id && $player->mission_stage['action_type'] == 'combat') {
            $mission = new Mission($player->mission_id, $player);
            if($mission->mission_type == 5) {
                $mission->nextStage($player->mission_stage['stage_id'] = 4);
                $player->mission_stage['mission_money'] /= 2;
                throw new Exception("Mission failed! Return to village.");
            }
        }

        $player->updateData();


        // Village check
        if($player->location == $player->village_location) {
            $player->in_village = true;
        }
        else {
            $player->in_village = false;
        }

        return [$player->x, $player->y];
    }

}