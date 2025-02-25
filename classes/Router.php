<?php

require_once __DIR__ . "/battle/Battle.php";
require_once __DIR__ . "/Route.php";

// NOTES: Routes are initialized at the bottom of this file.
class Router {
    // Keep in sync with pages
    const PAGE_IDS = [
        'profile' => 1,
        'inbox' => 2,
        'settings' => 3,
        'gear' => 5,
        'members' => 6,
        'chat' => 7,
        'store' => 8,
        'villageHQ' => 9,
        'bloodline' => 10,
        'travel' => 11,
        'arena' => 12,
        'training' => 13,
        'mission' => 14,
        'specialmissions' => 15,
        'mod' => 16,
        'admin' => 17,
        'report' => 18,
        'battle' => 19,
        'clan' => 20,
        'premium' => 21,
        'spar' => 22,
        'healingShop' => 23,
        'team' => 24,
        'rankup' => 25,
        'view_battles' => 26,
        'event' => 27,
        'marriage' => 29,
        'support' => 30,
        'chat_log' => 31,
        'news' => 32,
        'academy' => 33,
        'account_record' => 34,
        'send_money' => 35,
        'forbiddenShop' => 36,
        'war' => 37,
        'challenge' => 38,
    ];

    /** @var Route[] $routes */
    public static array $routes;

    public string $base_url;

    public array $links = [
        'github' => 'https://github.com/elementum-games/shinobi-chronicles',
        'discord' => 'https://discord.gg/Kx52dbXEf3',
    ];
    public array $api_links = [
        'battle' => ''
    ];

    public function __construct(string $base_url) {
        $this->base_url = $base_url;

        foreach(self::PAGE_IDS as $slug => $id) {
            $this->links[$slug] = $this->base_url . '?id=' . $id;
        }

        $this->api_links['battle'] = $this->base_url . 'api/battle.php';
        $this->api_links['inbox'] = $this->base_url . 'api/inbox.php';
        $this->api_links['travel'] = $this->base_url . 'api/travel.php';
        $this->api_links['notification'] = $this->base_url . 'api/notification.php';
        $this->api_links['navigation'] = $this->base_url . 'api/navigation.php';
        $this->api_links['user'] = $this->base_url . 'api/user.php';
        $this->api_links['chat'] = $this->base_url . 'api/chat.php';
        $this->api_links['news'] = $this->base_url . 'api/news.php';
        $this->api_links['forbidden_shop'] = $this->base_url . 'api/forbidden_shop.php';
        $this->api_links['village'] = $this->base_url . 'api/village.php';
    }

    /**
     * @param string $page_name
     * @return string
     * @throws RuntimeException
     */
    public function getUrl(string $page_name, array $url_params = []): string {
        $id = self::PAGE_IDS[$page_name] ?? null;
        if($id == null) {
            throw new RuntimeException("Invalid page name!");
        }

        $extra_params_str = "";
        foreach($url_params as $key => $val) {
            $extra_params_str .= "&{$key}={$val}";
        }

        return $this->base_url . '?id=' . $id . $extra_params_str;
    }

    /**
     * @param Route $route
     * @param User  $player
     * @return void
     * @throws RuntimeException
     */
    public function assertRouteIsValid(Route $route, User $player): void {
        $system = $player->system;
        $routes = self::$routes;

        // Dev only page
        if($route->dev_only && !$system->isDevEnvironment()) {
            throw new RuntimeException("Invalid page!");
        }

        // Check for battle if page is restricted
        if(isset($route->battle_ok) && $route->battle_ok === false) {
            if($player->battle_id) {
                $contents_arr = [];
                foreach($_GET as $key => $val) {
                    $contents_arr[] = "GET[{$key}]=$val";
                }
                foreach($_POST as $key => $val) {
                    $contents_arr[] = "POST[{$key}]=$val";
                }
                $player->log(User::LOG_IN_BATTLE, implode(',', $contents_arr));
                throw new RuntimeException("You cannot visit this page while in battle!");
            }
        }

        // Check for spar/fight PvP type, stop page if trying to load spar/battle while in NPC battle
        if(isset($route->battle_type)) {
            $result = $system->db->query(
                "SELECT `battle_type` FROM `battles` WHERE `battle_id`='$player->battle_id' LIMIT 1"
            );
            if($system->db->last_num_rows > 0) {
                $battle_type = $system->db->fetch($result)['battle_type'];
                if($battle_type != $route->battle_type) {
                    throw new RuntimeException("You cannot visit this page while in combat!");
                }
            }
        }

        // Check if challenge locked
        if (isset($route->challenge_lock_ok) && $route->challenge_lock_ok === false) {
            if ($player->locked_challenge > 0) {
                throw new RuntimeException("You are unable to access this page while locked-in for battle!");
            }
        }

        if(isset($route->user_check)) {
            if(!($route->user_check instanceof Closure)) {
                throw new RuntimeException("Invalid user check!");
            }

            $page_ok = $route->user_check->call($this, $player);

            if(!$page_ok) {
                throw new RuntimeException("");
            }
        }

        // Check location restrictions
        $player_location_type = TravelManager::getPlayerLocationType($system, $player);
        if ($player_location_type == TravelManager::LOCATION_TYPE_HOME_VILLAGE) {
            if (!$route->allowed_location_types[TravelManager::LOCATION_TYPE_HOME_VILLAGE]) {
                // Player is allowed in up to rank 3, then must go outside village
                if ($player->rank_num > 2) {
                    throw new RuntimeException("You cannot access this page while in a village!");
                }
            }
        }
        else if (!$route->allowed_location_types[$player_location_type]) {
            throw new RuntimeException("You can not access this page at your current location!");
        }

        if(isset($route->min_rank)) {
            if($player->rank_num < $route->min_rank) {
                throw new RuntimeException("You are not a high enough rank to access this page!");
            }
        }
    }
}

Router::$routes = require __DIR__ . '/../config/routes.php';


