<?php
/**
 * @var User $player
 * @var System $system
 * @var int $patients
 * @var array $medical_staff
 */
?>
<style></style>
<table class="table">
    <tbody>
        <tr>
            <th>Medical Ninja Registration</th>
        </tr>
    <tr>
        <?php if ($player->rank >= Rank::CHUUNIN && $player->medical_rank === 0 && !$player->medical_exam_stage) : ?>
            <td>
                <p>Would you like to apply to become a medical ninja for the <?=$player->village?> village?</p>
                <button id="applyBtn" value="apply">Apply now!</button>
                <dialog id="medicalApplicationConfirmation">
                    <form method="post">
                        <p>Are you sure you would like to become a medical ninja?</p>
                        <div>
                            <button value="cancel">Cancel</button>
                            <button name="confirm" value="1">Confirm</button>
                        </div>
                    </form>
                </dialog>
            </td>
        <?php elseif ($player->medical_exam_stage): ?>
            <td>
               <p>Best of luck! We expect great things!</p>
            </td>
        <?php else: ?>
            <td>
                <p>Sorry, you must be at least Chuunin in rank in order to apply.</p>
            </td>
        <?php endif;?>
    </tr>
    </tbody>
</table>
<script>
    const applicationFormDialog = document.getElementById("medicalApplicationConfirmation");
    const applicationButton = document.getElementById("applyBtn");

    applicationButton.addEventListener('click', (e) => {
        applicationFormDialog.showModal();
    })
</script>