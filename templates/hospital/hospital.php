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
            <th><?= $player->village?> Village</th>
        </tr>
        <tr>
            <td class="waitingArea">
                <label style='font-weight:bold;'>Current Patients: <?= $patients?></label>
                <br>
                <br>
                <label style='font-weight:bold;'>
                    Medical Ninja:
                    <?php if($medical_staff): ?>
                        <?= count($medical_staff)?>
                    <?php else: ?>
                        0
                    <?php endif ?>
                </label>
                <br>
            </td>
        </tr>
    </tbody>
</table>