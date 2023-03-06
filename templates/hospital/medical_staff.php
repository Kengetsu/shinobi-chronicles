<?php
/**
 * @var User $player
 * @var System $system
 * @var int $patients
 * @var array $medical_staff
 */
?>

<style>

</style>
<table class="table">
    <tbody>
        <tr>
            <th colspan="3">Medical Ninja</th>
        </tr>
        <tr>
            <th style='width:30%;'>Username</th>
            <th style='width:20%;'>Rank</th>
            <th style='width:20%;'>Patients Treated</th>
        </tr>
        <?php if ($medical_staff): ?>
            <?php foreach ($medical_staff as $doctor): ?>
                <td>
                    <a href='<?= $system->links['members']?>&user=<?=$doctor['user_name']?>'><?=$doctor['user_name']?></a>
                </td>
                <td><?=$doctor['medical_rank']?></td>
                <td><?=$doctor['patients_treated']?></td>
            <?php endforeach; ?>
        <?php endif; ?>
    </tbody>
</table>
