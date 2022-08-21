import { apiFetch } from "../utils/network.js";


type Props = {|
    +player: Array,
    +travelApiLink: string,
    +mapSize: Array,
    +villages: Array,
    +villageIcons: Array,
|};

function AreaMap({
        player: player,
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
               /*
                <tr key={row[0]}>
                    {row.map(cellId => (
                            villages[index + '.' + cellId] ?
                            <td key={cellId} className='village' style={{
                                backgroundImage: './images/village_icons/' + villageIcons[villages[key]]['count'],
                                backgroundColor: key === player.village_location ? '#FFEF30' : '',
                            }}></td>
                            :
                            <td key={cellId}>
                                {cellId}
                                {(0 === currentLocation[1] && 0 === currentLocation[0]) ?
                                    <img src='../images/ninja_head.png'/> : ''}
                            </td>
                        )
                    )}
                </tr>
            ))
        );*/
        /*
        <tr>
            {villages[currentLocation] ?
                <td className='village' style={{
                    backgroundImage: './images/village_icons/' + villageIcons[villages[key]]['count'],
                    backgroundColor: key === player.village_location ? '#FFEF30' : '',
                }}></td>
                :
                <td>
                    {(0 === currentLocation[1] && 0 === currentLocation[0]) ?
                        <img src='../images/ninja_head.png'/> : ''}
                </td>
            }
        </tr>
         */

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

    return (
        <table id='scoutTable' className='table'>
            <tbody>
                <tr>
                    <th colSpan='5'>Your location: {currentLocation[0]}.{currentLocation[1]}</th>
                </tr>
                <tr>
                    <td colSpan='5' style={{textAlign: "center"}}>
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