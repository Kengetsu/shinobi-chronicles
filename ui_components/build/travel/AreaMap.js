import { apiFetch } from "../utils/network.js";

function AreaMap({
  player: player,
  travelApiLink: travelApiLink,
  mapSize: mapSize,
  villages: villages,
  villageIcons: villageIcons
}) {
  const [currentLocation, setLocation] = React.useState([player.x, player.y]);
  const [error, setError] = React.useState(null);

  const handleApiResponse = response => {
    //console.log(response);
    if (response.data.location != null && response.data.location.length > 0) {
      setLocation(response.data.location);
    }

    if (response.errors.length > 0) {
      setError(response.errors.join(' '));
    } else {
      setError(null);
    }
  };

  const updateLocation = newLocation => {
    apiFetch(travelApiLink, {
      travel: newLocation
    }).then(handleApiResponse);
  };

  const Board = () => {
    let maxX = mapSize[0];
    let maxY = mapSize[1];
    let board = Array.from({
      length: maxY
    }, (_, i) => Array.from({
      length: maxX
    }, (_, j) => [j + 1, i + 1].join('.'))); //console.log(villages, villageIcons);

    return board.map((row, index) => {
      index += 1;
      return /*#__PURE__*/React.createElement("tr", {
        key: row[index]
      }, row.map(cellId => villages[cellId] ? /*#__PURE__*/React.createElement("td", {
        key: cellId,
        className: "village",
        style: {
          backgroundImage: `url('./images/village_icons/${villageIcons[villages[cellId]['count']]}`,
          backgroundColor: cellId === player.village_location ? '#FFEF30' : ''
        }
      }, cellId === currentLocation[0] + '.' + currentLocation[1] ? /*#__PURE__*/React.createElement("img", {
        src: "../images/ninja_head.png"
      }) : '') : /*#__PURE__*/React.createElement("td", {
        key: cellId
      }, cellId === currentLocation[0] + '.' + currentLocation[1] ? /*#__PURE__*/React.createElement("img", {
        src: "../images/ninja_head.png"
      }) : '')));
    });
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
  };

  const RenderMap = () => {
    return /*#__PURE__*/React.createElement("table", {
      className: "map",
      style: {
        padding: '0',
        border: '1px solid #000',
        borderCollapse: 'collapse',
        borderSpacing: '0',
        borderRadius: '0'
      }
    }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement(Board, null)));
  };

  return /*#__PURE__*/React.createElement("table", {
    id: "scoutTable",
    className: "table"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    colSpan: "5"
  }, "Your location: ", currentLocation[0], ".", currentLocation[1])), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "5",
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      marginBottom: '3px',
      display: 'inline-block',
      fontSize: '0.9em'
    }
  }, "(Use WASD, arrow keys, or the arrows below)"), /*#__PURE__*/React.createElement("div", {
    id: "TravelContainer",
    className: "travelContainer"
  }, /*#__PURE__*/React.createElement("div", {
    id: "AreaMap",
    className: "mapContainer"
  }, /*#__PURE__*/React.createElement("p", {
    className: "systemMessage"
  }, error), /*#__PURE__*/React.createElement(RenderMap, null), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateLocation('north'),
    className: "travelButton north"
  }, /*#__PURE__*/React.createElement("span", {
    className: "upArrow"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateLocation('east'),
    className: "travelButton east"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rightArrow"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateLocation('south'),
    className: "travelButton south"
  }, /*#__PURE__*/React.createElement("span", {
    className: "downArrow"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateLocation('west'),
    className: "travelButton west"
  }, /*#__PURE__*/React.createElement("span", {
    className: "leftArrow"
  }))))))));
}

window.AreaMap = AreaMap;