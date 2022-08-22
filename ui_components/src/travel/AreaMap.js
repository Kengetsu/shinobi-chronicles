import { apiFetch } from "../utils/network.js";


type Props = {|
    +player: JSON,
    +system: JSON,
    +travelApiLink: string,
    +mapSize: Array,
    +villages: JSON,
    +villageIcons: Array,
    +currentLocation: Array,
|};

const AreaMap = ({
        player: player,
        system: system,
        travelApiLink: travelApiLink,

}) => {
    const [currentLocation, setLocation] = React.useState([player.x, player.y]);
    const [isTraveling, setIsTraveling] = React.useState(false);
    const [error, setError] = React.useState(null);

    const updateLocation = (newLocation) =>
    {
        apiFetch(travelApiLink, {travel: newLocation})
            .then(handleApiResponse);

        setIsTraveling(false);

    };
    const handleApiResponse = (response) => {
        //console.log(response);
        if (response.data.location != null && response.data.location.length > 0) {
            setLocation(response.data.location);
        }
        if(response.errors.length > 0) {
            setError(response.errors.join(' '));
        }
        else {
            setError(null);
        }
    };

    const handleKeyInput = (evt) =>
    {
        //console.log(evt);
        const leftArrow = 37;
        const upArrow = 38;
        const rightArrow = 39;
        const downArrow = 40;

        const aUpper = 65;
        const aLower = 97;

        const wUpper = 87;
        const wLower = 119;

        const dUpper = 68;
        const dLower = 100;

        const sUpper = 83;
        const sLower = 115;

        if (isTraveling) return false;
        let direction = '';
        if(evt.which === leftArrow || evt.which === aLower || evt.which === aUpper) {
            direction = 'west';
        }
        else if(evt.which === upArrow || evt.which === wLower || evt.which === wUpper) {
            direction = 'north';
        }
        else if(evt.which === rightArrow || evt.which === dLower || evt.which === dUpper) {
            direction = 'east';
        }
        else if(evt.which === downArrow || evt.which === sLower || evt.which === sUpper) {
            direction = 'south';
        }

        if(direction.length > 1) {

            setIsTraveling(true);
            updateLocation(direction);
        }
    };
    React.useEffect(() => {
        document.addEventListener('keydown', (e) => {
            e.preventDefault();
            handleKeyInput(e);
        })
    }, []);
    return ([
        <p key='systemMessage' className='systemMessage'>{error}</p>,
        <table key='scoutTable' id='scoutTable' className='table'>
            <tbody>
                <tr>
                    <th colSpan='5'>Your location: {currentLocation.join('.') === player.village_location ? `${currentLocation.join('.')} (${player.village} Village)` : currentLocation.join('.')}</th>
                </tr>
                <tr>
                    <td colSpan='5' style={{textAlign: "center"}}>
                        <MissionPrompt player={player} system={system} currentLocation={currentLocation}/>
                        <span style={{fontStyle: 'italic', marginBottom: '3px', display: 'inline-block', fontSize: '0.9em'}}>
                            (Use WASD, arrow keys, or the arrows below)
                        </span>
                        <div id='TravelContainer' className='travelContainer'>
                            <div id='AreaMap' className='mapContainer'>
                                <RenderMap currentLocation={currentLocation}/>
                                <a onClick={() => updateLocation('north')} className='travelButton north'>
                                    <span className='upArrow'></span>
                                </a>
                                <a onClick={() => updateLocation('east')} className='travelButton east'>
                                    <span className='rightArrow'></span>
                                </a>
                                <a onClick={() => updateLocation('south')} className='travelButton south'>
                                    <span className='downArrow'></span>
                                </a>
                                <a onClick={() => updateLocation('west')} className='travelButton west'>
                                    <span className='leftArrow'></span>
                                </a>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    ]);

};


const MissionPrompt = ({player: player, system: system, currentLocation: currentLocation}) =>
{
    //console.log(player.mission_stage, currentLocation);
    if (!player.mission_id) return null;
    if (player.mission_stage['action_type'] === 'travel' || player.mission_stage['action_type'] === 'search')
    {
        if (currentLocation.join('.') === player.mission_stage['action_data'])
        {
            return (
                <div>
                    <a href={system.links['mission']}>
                        <button className="button" style={{marginTop: '5px'}}>Go to Mission Location</button>
                    </a>
                    <br/>
                </div>
            );
        }
        else if (player.mission_stage['action_type'] === 'combat')
        {
            return (
                <div>
                    <h3>Warning: Attempting to travel will cancel your mission!</h3>
                </div>
            );
        }

    }
    return null;
};

const Board = ({mapSize: mapSize, villages: villages, villageIcons: villageIcons, currentLocation: currentLocation}) => {
    let maxX = mapSize[0];
    let maxY = mapSize[1];
    let board = Array.from(
        {length: maxY},
        (_, i) => Array.from(
            {length: maxX},
            (_, j) => [j + 1, i + 1].join('.')
        )
    );

    //console.log(villages, villageIcons);
    return (
        board.map((row, index) => {
            index += 1;
            return (
                <tr key={row[index]}>
                    {row.map(cellId => (
                            villages[cellId] ?
                                <td key={cellId} className='village' style={{
                                    backgroundImage: `url('./images/village_icons/${villageIcons[villages[cellId]['count']]}`,
                                    backgroundColor: cellId === player.village_location ? '#FFEF30' : '',
                                }}>
                                    {(cellId === currentLocation[0] + '.' + currentLocation[1]) ?
                                        <img src='../images/ninja_head.png'/> : ''}
                                </td>
                                :
                                <td key={cellId}>
                                    {(cellId === currentLocation[0] + '.' + currentLocation[1]) ?
                                        <img src='../images/ninja_head.png'/> : ''}
                                </td>
                        )
                    )}
                </tr>
            );
        }));
};

const RenderMap = ({currentLocation: currentLocation}) =>
{
    return (
        <table className='map' style={{
            padding: '0',
            border: '1px solid #000',
            borderCollapse: 'collapse',
            borderSpacing: '0',
            borderRadius: '0',
        }}>
            <tbody>
            <Board mapSize={mapSize} villages={villages} villageIcons={villageIcons} currentLocation={currentLocation}/>
            </tbody>
        </table>
    );
}


window.AreaMap = AreaMap;