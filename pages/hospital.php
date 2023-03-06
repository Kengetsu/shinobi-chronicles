<?php

function hospital()
{
    global $system;
    global $player;
    global $self_link;


    renderHospitalSubmenu();

    $page = $_GET['page'] ?? 'hospital_info';

    require_once "templates/hospital/hospital.php";
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
            'link' => $self_link . '&view=application',
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