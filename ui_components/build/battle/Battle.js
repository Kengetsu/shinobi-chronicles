import BattleLog from "./BattleLog.js";
import BattleActionPrompt from "./BattleActionPrompt.js";
import { apiFetch } from "../utils/network.js";
import { findPlayerJutsu } from "./playerUtils.js";
import { FightersAndField } from "./FightersAndField.js";
function Battle({
  battle: initialBattle,
  battleApiLink,
  membersLink
}) {
  // STATE
  const [battle, setBattle] = React.useState(initialBattle);
  const [battleResult, setBattleResult] = React.useState(null);
  const [attackInput, setAttackInput] = React.useState({
    handSeals: [],
    jutsuId: -1,
    jutsuCategory: 'ninjutsu',
    jutsuType: 'ninjutsu',
    weaponId: 0,
    targetTileIndex: null
  });
  const [error, setError] = React.useState(null);

  // DERIVED STATE
  const isAttackSelected = battle.isAttackPhase && (attackInput.jutsuId !== -1 || attackInput.handSeals.length > 0);
  const isSelectingTile = battle.isMovementPhase || isAttackSelected;
  const selectedJutsu = battle.isAttackPhase ? findPlayerJutsu(battle, attackInput.jutsuId, attackInput.jutsuCategory === 'bloodline') : null;

  // STATE MUTATORS
  const updateAttackInput = newAttackInput => {
    setAttackInput(prevSelectedAttack => ({
      ...prevSelectedAttack,
      ...newAttackInput
    }));
  };
  const handleApiResponse = response => {
    if (response.data.battle != null && Object.keys(response.data.battle).length > 0) {
      setBattle(response.data.battle);
    }
    if (response.data.battleResult != null) {
      setBattleResult(response.data.battleResult);
    }
    if (response.errors.length > 0) {
      setError(response.errors.join(' '));
    } else {
      setError(null);
    }
  };

  // ACTIONS
  const handleTileSelect = tileIndex => {
    console.log('selected tile', tileIndex);
    if (battle.isMovementPhase) {
      apiFetch(battleApiLink, {
        submit_movement_action: "yes",
        selected_tile: tileIndex
      }).then(handleApiResponse);
    } else if (isAttackSelected) {
      apiFetch(battleApiLink, {
        submit_attack: "1",
        hand_seals: attackInput.handSeals,
        jutsu_id: attackInput.jutsuId,
        jutsu_category: attackInput.jutsuCategory,
        weapon_id: attackInput.weaponId,
        target_tile: tileIndex
      }).then(handleApiResponse);
    }
  };
  const handleForfeit = () => {
    apiFetch(battleApiLink, {
      forfeit: "yes"
    }).then(handleApiResponse);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "systemMessage"
  }, error), /*#__PURE__*/React.createElement(FightersAndField, {
    battle: battle,
    attackInput: attackInput,
    membersLink: membersLink,
    isSelectingTile: isSelectingTile,
    selectedJutsu: selectedJutsu,
    onTileSelect: handleTileSelect
  }), battle.isSpectating && /*#__PURE__*/React.createElement(SpectateStatus, null), !battle.isSpectating && !battle.isComplete && /*#__PURE__*/React.createElement(BattleActionPrompt, {
    battle: battle,
    attackInput: attackInput,
    updateAttackInput: updateAttackInput,
    isAttackSelected: isSelectingTile,
    forfeitBattle: handleForfeit
  }), /*#__PURE__*/React.createElement(BattleLog, {
    lastTurnLog: battle.lastTurnLog,
    leftFighterId: battle.playerId,
    rightFighterId: battle.opponentId
  }), battleResult && /*#__PURE__*/React.createElement(BattleResult, {
    description: battleResult,
    isBattleComplete: battle.isComplete
  }));
}
function SpectateStatus() {
  return /*#__PURE__*/React.createElement("div", null, "Spectate Status");

  /*
      <table class='table' style='margin-top:2px;'>
      <tr><td style='text-align:center;'>
          <?php if($battle->winner == BattleV2::TEAM1): ?>
             <?=  $battle->player1->getName() ?> won!
          <?php elseif($battle->winner == BattleV2::TEAM2): ?>
              <?= $battle->player2->getName() ?> won!
          <?php elseif($battle->winner == BattleV2::DRAW): ?>
              Fight ended in a draw.
          <?php else: ?>
              <b><?= $battle->timeRemaining() ?></b> seconds remaining<br />
              <a href='<?= $refresh_link ?>'>Refresh</a>
          <?php endif; ?>
      </td></tr>
  </table>
     */
}

function BattleResult({
  description,
  isBattleComplete
}) {
  const secondUrlParamIndex = window.location.href.indexOf('&');

  // Exclude whatever section is after ?id=XYZ because it might trigger an action.
  // We can probably remove this after we migrate to POST actions via APIs
  const continueUrl = window.location.href.substring(0, secondUrlParamIndex);
  return /*#__PURE__*/React.createElement("table", {
    className: "table"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Battle Results")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: description
    }
  }), isBattleComplete && /*#__PURE__*/React.createElement("button", {
    onClick: () => window.location.assign(continueUrl)
  }, "Continue")))));
}
window.Battle = Battle;