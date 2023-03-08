<?php

function medicalRankUp()
{
    global $system;

    global $player;

    $self_link = $system->links['medical_exam'];

    if($player->medical_exam_stage > 0 && !empty($_POST['abandon_exam'])) {
        $player->medical_exam_stage = 0;
        $player->updateData();
        $system->message("Understanding that this is not your time, you bow out of the exam. Maybe next time
            will be your chance!<br />
            <a href='{$system->links['profile']}'>Continue</a>");
        $system->printMessage();
        return true;
    }

    require_once "templates/hospital/medical_exam.php";
}