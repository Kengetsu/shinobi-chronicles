import { apiFetch } from "../utils/network.js";


type Props = {|
    +player: Array,
    +system: Array,
    +travelApiLink: string,
    +mapSize: Array,
    +villages: Array,
    +villageIcons: Array,
|};

function AreaMap({
        player: player,
        system: system,
        travelApiLink: travelApiLink,
        mapSize: mapSize,
        villages: villages,
        villageIcons: villageIcons,

}: Props) {
    const [currentLocation, setLocation] = React.useState([player.x, player.y]);
    const [error, setError] = React.useState(null);

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

    const updateLocation = (newLocation) =>
    {
        apiFetch(travelApiLink, {travel: newLocation})
            .then(handleApiResponse);

    };
    const Board = () => {
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
    }
    const RenderMap = () =>
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
                    <Board />
                </tbody>
            </table>
        );
    }

    const MissionPrompt = () =>
    {
        console.log(player.mission_stage, currentLocation);
        if (!player.mission_id) return null;
        if (player.mission_stage['action_type'] === 'travel' | player.mission_stage['action_type'] === 'search')
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
    }
    return (
        <table id='scoutTable' className='table'>
            <tbody>
                <tr>
                    <th colSpan='5'>Your location: {currentLocation.join('.') === player.village_location ? `${currentLocation.join('.')} (${player.village})` : currentLocation.join('.')}</th>
                </tr>
                <tr>
                    <td colSpan='5' style={{textAlign: "center"}}>
                        <MissionPrompt />
                        <span style={{fontStyle: 'italic', marginBottom: '3px', display: 'inline-block', fontSize: '0.9em'}}>
                            (Use WASD, arrow keys, or the arrows below)
                        </span>
                        <div id='TravelContainer' className='travelContainer'>
                            <div id='AreaMap' className='mapContainer'>
                                <p className='systemMessage'>{error}</p>
                                <RenderMap />
                                <button onClick={() => updateLocation('north')} className='travelButton north'>
                                    <span className='upArrow'></span>
                                </button>
                                <button onClick={() => updateLocation('east')} className='travelButton east'>
                                    <span className='rightArrow'></span>
                                </button>
                                <button onClick={() => updateLocation('south')} className='travelButton south'>
                                    <span className='downArrow'></span>
                                </button>
                                <button onClick={() => updateLocation('west')} className='travelButton west'>
                                    <span className='leftArrow'></span>
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );

}

window.AreaMap = AreaMap;