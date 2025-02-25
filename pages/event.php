<?php

/**
 * @throws RuntimeException
 */
function event() {
    global $system;

    global $player;
    global $self_link;

    $player->getInventory();

    $gifts = [
        1227 => '_yen_ Yen!',
        1228 => '_days_ days of _seal_!',
        1229 => '1 Ancient Kunai!',
        1230 => '_yen_ Yen!',
        1231 => '_ak_ Ancient Kunai!',
        101 => 'Crystal Pendant!',
    ];

    if ($system->event == null) {
        throw new RuntimeException("No event in progress!");
    }

    if (isset($_GET['exchange'])) {
        try {
            // Change the item ID values based on dev/prod
            // These are placeholder exchange options
            switch ($_GET['exchange']) {
                case "red_yen_small":
                    $yen_gain = $system->event->config['yen_per_lantern'];
                    $player->getInventory();
                    if (!$player->hasItem($system->event->item_ids['red_lantern_id'])) {
                        throw new RuntimeException("You do not have this item!");
                    }
                    if ($player->items[$system->event->item_ids['red_lantern_id']]->quantity < 1) {
                        throw new RuntimeException("You do not have enough of this item!");
                    }

                    $player->items[$system->event->item_ids['red_lantern_id']]->quantity -= 1;
                    if ($player->items[$system->event->item_ids['red_lantern_id']]->quantity < 1) {
                        unset($player->items[$system->event->item_ids['red_lantern_id']]);
                    }

                    $player->addMoney("25", "Event");
                    $system->message("You exchanged 1 Red Lantern for " . $yen_gain . "&#165;!");

                    $player->updateInventory();
                    $player->updateData();
                    break;
                case "red_yen_medium":
                    $yen_gain = $system->event->config['yen_per_lantern'] * 10;
                    $player->getInventory();
                    if (!$player->hasItem($system->event->item_ids['red_lantern_id'])) {
                        throw new RuntimeException("You do not have this item!");
                    }
                    if ($player->items[$system->event->item_ids['red_lantern_id']]->quantity < 10) {
                        throw new RuntimeException("You do not have enough of this item!");
                    }
                    $player->items[$system->event->item_ids['red_lantern_id']]->quantity -= 10;
                    if ($player->items[$system->event->item_ids['red_lantern_id']]->quantity < 1) {
                        unset($player->items[$system->event->item_ids['red_lantern_id']]);
                    }
                    $player->addMoney("250", "Event");
                    $system->message("You exchanged 10 Red Lanterns for " . $yen_gain . "&#165;!");
                    $player->updateInventory();
                    $player->updateData();
                    break;
                case "red_yen_large":
                    $yen_gain = $system->event->config['yen_per_lantern'] * 100;
                    $player->getInventory();
                    if (!$player->hasItem($system->event->item_ids['red_lantern_id'])) {
                        throw new RuntimeException("You do not have this item!");
                    }
                    if ($player->items[$system->event->item_ids['red_lantern_id']]->quantity < 100) {
                        throw new RuntimeException("You do not have enough of this item!");
                    }
                    $player->items[$system->event->item_ids['red_lantern_id']]->quantity -= 100;
                    if ($player->items[$system->event->item_ids['red_lantern_id']]->quantity < 1) {
                        unset($player->items[$system->event->item_ids['red_lantern_id']]);
                    }
                    $player->addMoney("2500", "Event");
                    $system->message("You exchanged 100 Red Lanterns for " . $yen_gain . "&#165;!");
                    $player->updateInventory();
                    $player->updateData();
                    break;
                case "red_rep":
                    $player->getInventory();
                    if($player->reputation->canGain(UserReputation::ACTIVITY_TYPE_PVE)) {
                      throw new RuntimeException("You've already received your weekly reputation limit!");
                    }
                    if (!$player->hasItem($system->event->item_ids['red_lantern_id'])) {
                        throw new RuntimeException("You do not have this item!");
                    }
                    if ($player->items[$system->event->item_ids['red_lantern_id']]->quantity < 50) {
                        throw new RuntimeException("You do not have enough of this item!");
                    }

                    $player->items[$system->event->item_ids['red_lantern_id']]->quantity -= 50;
                    if ($player->items[$system->event->item_ids['red_lantern_id']]->quantity < 1) {
                        unset($player->items[$system->event->item_ids['red_lantern_id']]);
                    }
                    $player->reputation->addRep(1, UserReputation::ACTIVITY_TYPE_PVE);

                    $system->message("You exchanged 50 Red Lanterns for 1 Reputation!");
                    $player->updateInventory();
                    $player->updateData();
                    break;
                case "blue_red":
                    doEventItemExchange(
                        system: $system,
                        player: $player,
                        source_item_id: $system->event->item_ids['blue_lantern_id'],
                        source_item_name: 'Blue Lantern',
                        source_quantity_given: 1,
                        target_item_id: $system->event->item_ids['red_lantern_id'],
                        target_item_name: 'Red Lantern',
                        target_quantity_received: LanternEvent::$static_config['red_lanterns_per_blue'],
                    );
                    break;
                case "violet_red":
                    doEventItemExchange(
                        system: $system,
                        player: $player,
                        source_item_id: $system->event->item_ids['violet_lantern_id'],
                        source_item_name: 'Violet Lantern',
                        source_quantity_given: 1,
                        target_item_id: $system->event->item_ids['red_lantern_id'],
                        target_item_name: 'Red Lantern',
                        target_quantity_received: LanternEvent::$static_config['red_lanterns_per_violet'],
                    );
                    break;
                case "gold_red":
                    doEventItemExchange(
                        system: $system,
                        player: $player,
                        source_item_id: $system->event->item_ids['gold_lantern_id'],
                        source_item_name: 'Gold Lantern',
                        source_quantity_given: 1,
                        target_item_id: $system->event->item_ids['red_lantern_id'],
                        target_item_name: 'Red Lantern',
                        target_quantity_received: LanternEvent::$static_config['red_lanterns_per_gold'],
                    );
                    break;
                case "red_shadow":
                    doEventItemExchange(
                        system: $system,
                        player: $player,
                        source_item_id: $system->event->item_ids['red_lantern_id'],
                        source_item_name: 'Red Lantern',
                        source_quantity_given: 100,
                        target_item_id: $system->event->item_ids['shadow_essence_id'],
                        target_item_name: 'Shadow Essence',
                        target_quantity_received: 1,
                    );
                    break;
                case "shadow_red":
                    doEventItemExchange(
                        system: $system,
                        player: $player,
                        source_item_id: $system->event->item_ids['shadow_essence_id'],
                        source_item_name: 'Shadow Essence',
                        source_quantity_given: 1,
                        target_item_id: $system->event->item_ids['red_lantern_id'],
                        target_item_name: 'Red Lantern',
                        target_quantity_received: LanternEvent::$static_config['red_lanterns_per_shadow'],
                    );
                    break;
                case "shadow_sacred_red":
                    if ($player->hasItem($system->event->item_ids['sacred_lantern_red_id'])) {
                        throw new RuntimeException("You already have this item!");
                    }

                    doEventItemExchange(
                        system: $system,
                        player: $player,
                        source_item_id: $system->event->item_ids['shadow_essence_id'],
                        source_item_name: 'Shadow Essence',
                        source_quantity_given: 5,
                        target_item_id: $system->event->item_ids['sacred_lantern_red_id'],
                        target_item_name: 'Sacred Red Lantern',
                        target_quantity_received: 1,
                    );
                    break;
                case "shadow_sacred_blue":
                    if ($player->hasItem($system->event->item_ids['sacred_lantern_blue_id'])) {
                        throw new RuntimeException("You already have this item!");
                    }

                    doEventItemExchange(
                        system: $system,
                        player: $player,
                        source_item_id: $system->event->item_ids['shadow_essence_id'],
                        source_item_name: 'Shadow Essence',
                        source_quantity_given: 5,
                        target_item_id: $system->event->item_ids['sacred_lantern_blue_id'],
                        target_item_name: 'Sacred Blue Lantern',
                        target_quantity_received: 1,
                    );
                    break;
                case "shadow_sacred_violet":
                    if ($player->hasItem($system->event->item_ids['sacred_lantern_violet_id'])) {
                        throw new RuntimeException("You already have this item!");
                    }

                    doEventItemExchange(
                        system: $system,
                        player: $player,
                        source_item_id: $system->event->item_ids['shadow_essence_id'],
                        source_item_name: 'Shadow Essence',
                        source_quantity_given: 5,
                        target_item_id: $system->event->item_ids['sacred_lantern_violet_id'],
                        target_item_name: 'Sacred Violet Lantern',
                        target_quantity_received: 1,
                    );
                    break;
                case "shadow_sacred_gold":
                    if ($player->hasItem($system->event->item_ids['sacred_lantern_gold_id'])) {
                        throw new RuntimeException("You already have this item!");
                    }

                    doEventItemExchange(
                        system: $system,
                        player: $player,
                        source_item_id: $system->event->item_ids['shadow_essence_id'],
                        source_item_name: 'Shadow Essence',
                        source_quantity_given: 5,
                        target_item_id: $system->event->item_ids['sacred_lantern_gold_id'],
                        target_item_name: 'Sacred Gold Lantern',
                        target_quantity_received: 1,
                    );
                    break;
                case "shadow_jutsu":
                    if ($player->hasItem($system->event->item_ids['forbidden_jutsu_scroll_id'])) {
                        throw new RuntimeException("You already have this item!");
                    }

                    doEventItemExchange(
                        system: $system,
                        player: $player,
                        source_item_id: $system->event->item_ids['shadow_essence_id'],
                        source_item_name: 'Shadow Essence',
                        source_quantity_given: 25,
                        target_item_id: $system->event->item_ids['forbidden_jutsu_scroll_id'],
                        target_item_name: 'Forbidden Jutsu Scroll',
                        target_quantity_received: 1,
                    );

                    $player->getInventory();
                    break;
            }
        } catch (RuntimeException $e) {
            $system->message($e->getMessage());
        }

    }

    if($system->message && !$system->message_displayed) {
        $system->printMessage();
    }
    require 'templates/temp_event.php';
}

function doEventItemExchange(
    System $system,
    User $player,
    int $source_item_id,
    string $source_item_name,
    int $source_quantity_given,
    int $target_item_id,
    string $target_item_name,
    int $target_quantity_received
): void {
    $player->getInventory();

    if ($player->itemQuantity($source_item_id) < $source_quantity_given) {
        throw new RuntimeException("You do not have enough {$source_item_name}s!");
    }

    if(isset(LanternEvent::$max_item_quantities[$target_item_id]) &&
        $player->itemQuantity($target_item_id) >= LanternEvent::$max_item_quantities[$target_item_id]
    ) {
        throw new RuntimeException("You have reached the maximum amount of {$target_item_name}s!");
    }

    $player->items[$source_item_id]->quantity -= $source_quantity_given;
    if ($player->items[$source_item_id]->quantity < 1) {
        unset($player->items[$source_item_id]);
    }

    $player->giveItemById($target_item_id, $target_quantity_received);

    $system->message(
    "You exchanged {$source_quantity_given} {$source_item_name}"
        . ($source_quantity_given > 1 ? "s" : "")
        . " for {$target_quantity_received} {$target_item_name}"
        . ($target_quantity_received > 1 ? "s" : "")
        . "!"
    );

    $player->updateInventory();
    $player->updateData();
}

