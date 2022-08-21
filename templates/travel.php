<?php
/**
 * @var System $system
 * @var User $player
 */

?>
<!--<link rel="stylesheet" type="text/css" href="ui_components/src/travel/Map.css" />-->
<div id="travelMapContainer"></div>
<script type="module" src="<?= $system->getReactFile("travel/AreaMap") ?>"></script>
<!--suppress JSUnresolvedVariable, JSUnresolvedFunction -->
<script type="text/javascript">
    const mapContainer = document.querySelector("#travelMapContainer");
    const travelApiLink = "<?= $system->api_links['travel'] ?>";
    const player = <?= json_encode($player)?>;
    const system = <?= json_encode($system)?>;
    const mapSize = ['<?= System::MAP_SIZE_X?>','<?= System::MAP_SIZE_Y?>'];
    const villages = <?= json_encode($system->getVillageLocations())?>;
    const villageIcons = ['stone.png', 'cloud.png', 'leaf.png', 'sand.png', 'mist.png'];

    window.addEventListener('load', () => {
        ReactDOM.render(
            React.createElement(AreaMap, {
                player: player,
                system: system,
                travelApiLink: travelApiLink,
                mapSize: mapSize,
                villages: villages,
                villageIcons: villageIcons,
            }), mapContainer
        );
    })
</script>