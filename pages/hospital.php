<?php

function hospital()
{
    global $system;
    global $player;
    global $self_link;


    renderHospitalSubmenu();

    if ($player->medical_rank) {
        // Level up/rank up checks
        $exp_needed = $player->expForNextMedicalLevel();

        // Level up
        if ($player->medical_level < $player->medical_max_level && $player->medical_level_exp >= $exp_needed) {
            if ($player->battle_id) {
                echo "<p style='text-align:center;font-style:italic;'>
                    You must be out of battle to level up.</p>";
            } else {
                require("levelUp.php");
                levelUp();
                $exp_needed = $player->expForNextMedicalLevel();
            }
        } // Rank up
        else if ($player->medical_level >= $player->medical_max_level && $player->medical_level_exp >= $exp_needed && $player->medical_rank < System::SC_MAX_MEDICAL_RANK) {
            $next_rank = $system->query("SELECT `rank_required` FROM `medical_ranks` WHERE id='" . $player->medical_rank + 1 ."'");
            if ($system->db_last_num_rows == 0)
            {
                $system->printMessage('Failed to fetch next rank!');
                return false;
            }
            $next_rank = $system->db_fetch($next_rank);
            if ($player->rank < $next_rank)
            {
                $rank_names = RankManager::fetchNames($system);
                $system->printMessage("You are not eligible for a promotion! A rank of {$rank_names[$next_rank]} is required.");
                return false;
            }
            if ($player->battle_id > 0 or !$player->in_village) {
                echo "<p style='text-align:center;font-style:italic;'>
                    You must be out of battle and in your village to rank up.</p>";
            } else {
                if ($player->medical_exam_stage) {
                    $prompt = "Resume exam for the next rank";
                } else {
                    $prompt = "Take exam for the next rank";
                }

                echo "<p style='text-align:center;font-size:1.1em;'>
                    <a class='button' style='padding:5px 10px 4px;margin-bottom:0;text-decoration:none;' href='{$system->links['medical_rankup']}'>{$prompt}</a>
                </p>";
            }
        }
    }

    $page = $_GET['view'] ?? 'hospital_info';

    if($page === 'hospital_info')
    {
        $patients = $system->query("SELECT COUNT(`user_id`) as Count_1 FROM `users` WHERE `village`='{$player->village}' AND `hospitalized` = 1");
        $patients = $system->db_fetch($patients)['Count_1'];

        $medical_staff = $system->query("SELECT `user_name`, `medical_rank`, `patients_treated` FROM `users` WHERE `village`='{$player->village}' AND `medical_rank` >= 1 ORDER BY `medical_rank`, `patients_treated` DESC");
        $medical_staff = $system->db_fetch($medical_staff);

        require_once "templates/hospital/hospital.php";
    }
    else if ($page === 'medical_staff')
    {
        $medical_staff = $system->query("SELECT `user_name`, `medical_rank`, `patients_treated` FROM `users` WHERE `village`='{$player->village}' AND `medical_rank` >= 1 ORDER BY `medical_rank`, `patients_treated` DESC");
        $medical_staff = $system->db_fetch($medical_staff);

        require_once "templates/hospital/medical_staff.php";
    }
    else if ($page === 'patients')
    {
        require_once "templates/hospital/patients.php";
    }
    else if ($page == 'applications')
    {
        require_once "templates/hospital/applications.php";
    }
    else if ($page == 'staff_room')
    {
        require_once "templates/hospital/staff_room.php";
    }

}

function renderHospitalSubmenu() {
    global $system;
    global $player;
    global $self_link;

    $submenu_links = [
        [
            'link' => $self_link . '&view=hospital_info',
            'title' => 'Waiting Area',
        ],
        [
            'link' => $self_link . '&view=medical_staff',
            'title' => 'Medical Staff',
        ],
        [
            'link' => $self_link . '&view=patients',
            'title' => 'Patients',
        ],
    ];
    if(!$player->medical_rank && $player->rank >= Rank::CHUUNIN) {
        $submenu_links[] = [
            'link' => $self_link . '&view=applications',
            'title' => 'Applications',
        ];
    }
    if($player->medical_rank) {
        $submenu_links[] = [
            'link' => $self_link . '&view=staff_room',
            'title' => 'Staff Room',
        ];
    }

    echo "<div class='submenu'>
    <ul class='submenu'>";
    $submenu_link_width = round(100 / count($submenu_links), 1);
    foreach($submenu_links as $link) {
        echo "<li style='width:{$submenu_link_width}%;'><a href='{$link['link']}'>{$link['title']}</a></li>";
    }
    echo "</ul>
    </div>
    <div class='submenuMargin'></div>
    ";
}