import { apiFetch } from "../utils/network.js";

const AreaMap = ({
  player: player,
  system: system,
  travelApiLink: travelApiLink
}) => {
  const [currentLocation, setLocation] = React.useState([player.x, player.y]);
  const [isTraveling, setIsTraveling] = React.useState(false);
  const [travelingInterval, setTravelingInterval] = React.useState(0);
  const [error, setError] = React.useState(null);
  const [rankData, setRankData] = React.useState([]);
  const [scoutData, setScoutData] = React.useState([]);

  const updateScoutData = () => {
    apiFetch(travelApiLink, {
      scout: {
        min: 0,
        max: 30
      }
    }).then(handleApiResponse);
  };

  React.useEffect(() => {
    updateScoutData();
    const interval = setInterval(() => {
      updateScoutData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateLocation = newLocation => {
    // if (isTraveling === true)
    // {
    //     setError(`You must wait ${travelingInterval} seconds before traveling again.`);
    //     return;
    // }
    apiFetch(travelApiLink, {
      travel: newLocation
    }).then(handleApiResponse);
    updateScoutData(); //setIsTraveling(true);
  };

  const handleApiResponse = response => {
    //console.log(response);
    if (response.data.location != null && response.data.location.length > 0) {
      setLocation(response.data.location);
    }

    if (response.data.scout_data != null && response.data.scout_data.length > 0) {
      setScoutData(response.data.scout_data);
    }

    if (response.data.rank_data != null) {
      //console.log(Object.values(response.data.rank_data));
      setRankData(Object.values(response.data.rank_data));
    }

    if (response.errors.length > 0) {
      setError(response.errors.join(' '));
    } else {
      setError(null);
    }
  };

  const handleKeyInput = evt => {
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
    let direction = '';

    if (evt.which === leftArrow || evt.which === aLower || evt.which === aUpper) {
      direction = 'west';
    } else if (evt.which === upArrow || evt.which === wLower || evt.which === wUpper) {
      direction = 'north';
    } else if (evt.which === rightArrow || evt.which === dLower || evt.which === dUpper) {
      direction = 'east';
    } else if (evt.which === downArrow || evt.which === sLower || evt.which === sUpper) {
      direction = 'south';
    }

    if (direction.length > 1) {
      updateLocation(direction);
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', e => {
      e.preventDefault();
      handleKeyInput(e);
    });
  }, []);
  return [/*#__PURE__*/React.createElement("p", {
    key: "systemMessage",
    className: "systemMessage"
  }, error), /*#__PURE__*/React.createElement("table", {
    key: "scoutTable",
    id: "scoutTable",
    className: "table"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    colSpan: "5"
  }, "Your location: ", currentLocation.join('.') === player.village_location ? `${currentLocation.join('.')} (${player.village} Village)` : currentLocation.join('.'))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "5",
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(MissionPrompt, {
    player: player,
    system: system,
    currentLocation: currentLocation
  }), /*#__PURE__*/React.createElement("span", {
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
  }, /*#__PURE__*/React.createElement(RenderMap, {
    currentLocation: currentLocation
  }), /*#__PURE__*/React.createElement(MapArrows, {
    updateLocation: updateLocation
  }))))), /*#__PURE__*/React.createElement(ScoutTable, {
    rankData: rankData,
    scoutData: scoutData,
    currentLocation: currentLocation
  })))];
};

const MissionPrompt = ({
  player: player,
  system: system,
  currentLocation: currentLocation
}) => {
  //console.log(player.mission_stage, currentLocation);
  if (!player.mission_id) return null;

  if (player.mission_stage['action_type'] === 'travel' || player.mission_stage['action_type'] === 'search') {
    if (currentLocation.join('.') === player.mission_stage['action_data']) {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
        href: system.links['mission']
      }, /*#__PURE__*/React.createElement("button", {
        className: "button",
        style: {
          marginTop: '5px'
        }
      }, "Go to Mission Location")), /*#__PURE__*/React.createElement("br", null));
    } else if (player.mission_stage['action_type'] === 'combat') {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Warning: Attempting to travel will cancel your mission!"));
    }
  }

  return null;
};

const Board = ({
  mapSize: mapSize,
  villages: villages,
  villageIcons: villageIcons,
  currentLocation: currentLocation
}) => {
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
        backgroundColor: cellId === player.village_location ? '#FFEF30' : null
      }
    }, cellId === currentLocation[0] + '.' + currentLocation[1] ? /*#__PURE__*/React.createElement("img", {
      alt: "Player Icon",
      src: "../images/ninja_head.png"
    }) : null) : /*#__PURE__*/React.createElement("td", {
      key: cellId
    }, cellId === currentLocation[0] + '.' + currentLocation[1] ? /*#__PURE__*/React.createElement("img", {
      alt: "Player Icon",
      src: "../images/ninja_head.png"
    }) : null)));
  });
};

const RenderMap = ({
  currentLocation: currentLocation
}) => {
  return /*#__PURE__*/React.createElement("table", {
    className: "map",
    style: {
      padding: '0',
      border: '1px solid #000',
      borderCollapse: 'collapse',
      borderSpacing: '0',
      borderRadius: '0'
    }
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement(Board, {
    mapSize: mapSize,
    villages: villages,
    villageIcons: villageIcons,
    currentLocation: currentLocation
  })));
};

const MapArrows = ({
  updateLocation
}) => {
  const directions = [{
    name: 'north',
    img: 'upArrow'
  }, {
    name: 'south',
    img: 'downArrow'
  }, {
    name: 'east',
    img: 'rightArrow'
  }, {
    name: 'west',
    img: 'leftArrow'
  }];
  return directions.map(({
    name,
    img
  }) => {
    return /*#__PURE__*/React.createElement("a", {
      key: name,
      onClick: () => updateLocation(name),
      className: `travelButton ${name}`
    }, /*#__PURE__*/React.createElement("span", {
      className: img
    }));
  });
};

const ScoutTable = ({
  scoutData: scoutData,
  rankData: rankData,
  currentLocation: currentLocation
}) => {
  return [/*#__PURE__*/React.createElement("tr", {
    key: "ScoutHeader"
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'center'
    },
    colSpan: "5"
  }, "Scout Area (Scout Range: ", player.scout_range, " squares)")), /*#__PURE__*/React.createElement("tr", {
    key: "ScoutDescription"
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'center'
    },
    colSpan: "5"
  }, /*#__PURE__*/React.createElement("br", null), "You can view other ninja within your scout range here. You can also attack or issue spar challenges.")), /*#__PURE__*/React.createElement("tr", {
    key: "ScoutDataHeader"
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      width: '28%'
    }
  }, "Username"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '20%'
    }
  }, "Rank"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '17%'
    }
  }, "Village"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '17%'
    }
  }, "Location"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '18%'
    }
  }, "\xA0")), scoutData.map(user => {
    return /*#__PURE__*/React.createElement("tr", {
      key: user.user_name,
      className: "table_multicolumns"
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        width: '28%'
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: `${system.links['members']}&user=${user.user_name}`
    }, user.user_name)), /*#__PURE__*/React.createElement("td", {
      style: {
        width: '20%',
        textAlign: 'center'
      }
    }, rankData[user.rank - 1]), /*#__PURE__*/React.createElement("td", {
      style: {
        width: '17%',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("img", {
      alt: `${user.village} Village Icon`,
      src: `./images/village_icons/${user.village.toLowerCase()}.png`,
      style: {
        maxHeight: '18px',
        maxWidth: '18px'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 'bold',
        color: user.village === player.village ? '#00C000' : '#C00000'
      }
    }, user.village)), /*#__PURE__*/React.createElement("td", {
      style: {
        width: '17%',
        textAlign: 'center'
      }
    }, user.location), /*#__PURE__*/React.createElement("td", {
      style: {
        width: '18%',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement(CombatLinks, {
      system: system,
      player: player,
      opponent: user,
      currentLocation: currentLocation
    })));
  })];
};

const CombatLinks = ({
  system: system,
  player: player,
  opponent: opponent,
  currentLocation: currentLocation
}) => {
  let links = [];

  if (parseInt(opponent.battle_id) !== 0) {
    return 'In battle';
  }

  if (parseInt(opponent.user_id) !== player.user_id && opponent.location === currentLocation.join('.')) {
    links.push( /*#__PURE__*/React.createElement("a", {
      key: `${opponent.user_id}_spar`,
      href: `${system.links['spar']}&challenge=${opponent.user_id}`
    }, "Spar"));

    if (opponent.village !== player.village && parseInt(opponent.rank) > 2 && player.rank > 2) {
      links.push('|');
      links.push( /*#__PURE__*/React.createElement("a", {
        key: `${opponent.user_id}_attack`,
        href: `${system.links['battle']}&attack=${opponent.user_id}`
      }, "Attack"));
    }
  } //console.log(links);


  return links;
};

window.AreaMap = AreaMap;