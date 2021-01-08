'use strict';

const Ship = (name, length) => {
  let hits = 0;
  const position = [];

  const hit = () => {
    hits++;
  };

  const isSunk = () => {
    if (hits === length) {
      return true;
    }
    return false;
  };

  return {
    name,
    length,
    hit,
    isSunk,
    position,
  };
};

const Board = (number, size = 15) => {
  const area = [...Array(size)].map(() => [...Array(size)].map(() => ""));
  const ships = [];
  let fleetHp = 0;

  const deployShip = (length) => {
    const directionArray = ["horizontal", "vertical"];
    const direction = directionArray[Math.floor(Math.random() * 2)];

    let position = {};

    if (direction === "vertical") {
      let y = [];
      let yStart = Math.floor((Math.random() * size) / 2);

      for (let i = 0; i < length; i++) {
        if (yStart + length <= size) {
          y = [...y, yStart + i];
        } else {
          y = [...y, yStart - i];
        }
      }

      position["direction"] = direction;
      position["x"] = Math.floor(Math.random() * size);
      position["y"] = y;
    }

    if (direction === "horizontal") {
      let x = [];
      let xStart = Math.floor((Math.random() * size) / 2);

      for (let i = 0; i < length; i++) {
        if (xStart + length <= size) {
          x = [...x, xStart + i];
        } else {
          x = [...x, xStart - i];
        }
      }

      position["direction"] = direction;
      position["y"] = Math.floor(Math.random() * size);
      position["x"] = x;
    }

    return position;
  };

  const hasCollision = (coordinates) => {
    if (coordinates["direction"] === "horizontal") {
      for (let i = 0; i < coordinates["x"].length; i++) {
        if (area[coordinates["y"]][coordinates["x"][i]] !== "") {
          return true;
        }
        area[coordinates["y"]][coordinates["x"][i]] = "ship"; // = coordinates['x'][i]
      }
    }

    if (coordinates["direction"] === "vertical") {
      for (let i = 0; i < coordinates["y"].length; i++) {
        if (area[coordinates["y"][i]][coordinates["x"]] !== "") {
          return true;
        }
        area[coordinates["y"][i]][coordinates["x"]] = "ship"; // = coordinates['y'][i]
      }
    }
    return false;
  };

  const generateFleet = () => {
    const table = document.getElementById(`fleet-${number}-hp`);
    var row = table.insertRow(0);

    for (let i = 1; i <= 6; i++) {
      fleetHp += i;
      const shipName = `ship-${number}-${i}`;
      const newShip = Ship(shipName, i);

      for (let j = 0; j < i; j++) {
        row.insertCell(j);
      }

      ships.push(newShip);
    }

    for (let i = 0; i < ships.length; i++) {
      let collision;
      let ship;

      do {
        ship = deployShip(ships[i].length);

        collision = hasCollision(ship);
      } while (collision);

      ships[i].position = ship;
    }
  };

  /* 
		1. Proverqva dali e horizontal/vertical
		2. Ako e horizontal proverqva dali atakata e vurhu pravilniq red ako e vertical dali e vurhu pravilnata kolona
		3. I ako e na pravilniq block po xAxis-ata/yAxis-ata
		4. markira kato mis/hit
	*/
  const receiveAttack = (x, y) => {
    if (area[y][x] === "hit" || area[y][x] === "miss") {
      return false;
    }

    for (let i = 0; i < ships.length; i++) {
      if (ships[i].position["direction"] === "horizontal") {
        if (
          ships[i].position["y"] === y &&
          ships[i].position["x"].indexOf(x) >= 0
        ) {
          area[y][x] = "hit";
          ships[i].hit();

          let table = document.getElementById(`fleet-${number}-hp`);
          --fleetHp;
          table.rows[0].cells[fleetHp].style.backgroundColor = "gold";

          return "hit";
        } else {
          area[y][x] = "miss";
        }
      }

      if (ships[i].position["direction"] === "vertical") {
        if (
          ships[i].position["x"] === x &&
          ships[i].position["y"].indexOf(y) >= 0
        ) {
          area[y][x] = "hit";
          ships[i].hit();

          let table = document.getElementById(`fleet-${number}-hp`);
          --fleetHp;
          table.rows[0].cells[fleetHp].style.backgroundColor = "gold";

          return "hit";
        } else {
          area[y][x] = "miss";
        }
      }
    }
  };

  const fleetIsDestroyed = () => {
    let counter = 0;

    for (let i = 0; i < ships.length; i++) {
      if (ships[i].isSunk()) {
        counter += 1;
      }
    }

    if (counter === ships.length) {
      return true;
    }

    return false;
  };

  return {
    size,
    area,
    ships,
    fleetIsDestroyed,
    receiveAttack,
    generateFleet,
    deployShip,
  };
};

const Player = (name, id) => {
	return {
		name,
		id
	}
};

const Playground = () => {
  let boards = [];
  let move = 0;
  let players = [];
  let stop = false;

  const setPlayers = (checkbox, input) => {
    let playerOne;
    let playerTwo;

    if (checkbox) {
      playerOne = Player(input.playerOne, 0);
      playerTwo = Player(input.playerTwo, 1);
    } else {
      playerOne = Player(input, 0);
      playerTwo = Player("computer", 1);
    }

    players.push(playerOne, playerTwo);
  };

  const startGame = () => {
    const firstBoard = Board(1);
    firstBoard.generateFleet();

    const secondBoard = Board(2); //computer
    secondBoard.generateFleet();

    boards.push(firstBoard, secondBoard);
  };

  const computerAttack = () => {
    console.log(stop, getStop());
    let attack;
    do {
      if (move % 2 === 1 && !stop) {
        const square = Math.floor(
          Math.random() * boards[0].size * boards[0].size
        );
        const target = document.getElementById(`area-table-1-${square}`);
        let y = Math.floor(square / boards[0].size);
        let x = square % boards[0].size;

        attack = boards[0].receiveAttack(x, y);
        if (attack === "hit") {
          target.classList.add("hit");
          if (boards[0].fleetIsDestroyed()) {
            const winDiv = document.getElementById("win-div");
            winDiv.style.display = "";
            winDiv.innerHTML = "Computer won";

            stopGame();
          }
        } else {
          target.classList.add("miss");
        }
      }

      incrementMove();
    } while (attack === false);
  };

  const stopGame = () => {
    stop = true;
  };

  const getStop = () => {
    return stop;
  };

  const incrementMove = () => {
    ++move;
  };

  const getMove = () => {
    return move;
  };

  const restartGame = () => {
    boards = [];
    move = 0;
    players = [];
  };

  return {
    stopGame,
    stop,
    getStop,
    players,
    getMove,
    boards,
    incrementMove,
    move,
    startGame,
    restartGame,
    computerAttack,
    setPlayers,
  };
};

const start = () => {
  const playerTables = ["table-1", "table-2"];
  //add boards and game
  const playground = Playground();

  let input;

  if (checkbox.checked) {
    input = {
      playerOne: playerOneInput.value,
      playerTwo: playerTwoInput.value,
    };
  } else {
    input = playerOneInput.value;
  }

  playground.setPlayers(checkbox.checked, input);

  playground.startGame();
  for (let i = 0; i < playground.boards.length; i++) {
    let board = playground.boards[i];
    let opponentBoardIndex = Math.abs(i - 1);

    var table = document.getElementById(playerTables[i]);

    for (let j = 0; j < board.size; j++) {
      var row = table.insertRow(j);
      for (let k = 0; k < board.size; k++) {
        const square = j * board.size + k;

        var cell = row.insertCell(k);
        cell.setAttribute("id", `area-${playerTables[i]}-${square}`);

        cell.addEventListener("click", () =>
          cellClickHandler({
            opponentBoardIndex,
            playground,
            board,
            square,
            playerTables,
            i,
          })
        );
      }
    }
  }
};

const cellClickHandler = (argumentObject) => {
  // let splitId = e.target.id.split("-");
  let {
    opponentBoardIndex,
    playground,
    board,
    square,
    playerTables,
    i,
  } = argumentObject;

  console.log(playground.stop, playground.getStop());

  let isEven = playground.getMove() % 2;

  if (isEven !== opponentBoardIndex || playground.getStop()) {
    return;
  }

  let clicked = document.getElementById(`area-${playerTables[i]}-${square}`);

  let y = Math.floor(square / board.size);
  let x = square % board.size;

  let attack = board.receiveAttack(x, y);

  if (attack === false) {
    return;
  }

  if (attack === "hit") {
    clicked.classList.add("hit");
    if (board.fleetIsDestroyed()) {
      winDiv.style.display = "";
      winDiv.innerHTML = `${playground.players[opponentBoardIndex].name} won!`;
      playground.stopGame();
    }
  } else {
    clicked.classList.add("miss");
  }

  playground.incrementMove();

  if (playground.players[i].name === "computer") {
    playground.computerAttack();
  }
};

const clearTables = () => {
  // OLD
  // const tables = document.getElementsByTagName("TABLE");

  // for (let i = 0; i < tables.length; i++) {
  //   while (tables[i].firstChild) {
  //     tables[i].removeChild(tables[i].lastChild);
  //     tables[i].style.display = "none";
  //   }
  // }

  var fields = document.getElementsByClassName("player-field");

  for (let i = 0; i < fields.length; i++) {
    fields[i].style.display = "none";
  }
};

const showTables = () => {
  // OLD
  // const tables = document.getElementsByTagName("TABLE");

  // for (let i = 0; i < tables.length; i++) {
  //   tables[i].style.display = "";
  // }

  var fields = document.getElementsByClassName("player-field");

  for (let i = 0; i < fields.length; i++) {
    fields[i].style.display = "";
  }
};

var checkbox = document.getElementById("checkbox");
var winDiv = document.getElementById("win-div");
var restartbtn = document.getElementById("restart-btn");
var playerOneInput = document.getElementById("player-one-input");
var playerTwoInput = document.getElementById("player-two-input");
var form = document.getElementById("start-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  start();
  showTables();

  form.style.display = "none";
  restartbtn.style.display = "";
  winDiv.innerHTML = "";
});

// startbtn.addEventListener("click", (e) => {
//   e.preventDefault();
// });

restartbtn.addEventListener("click", () => {
  clearTables();

  playerOneInput.style.display = "";
  if (checkbox.checked) {
    playerTwoInput.style.display = "";
  } else {
    playerTwoInput.style.display = "none";
  }

  form.style.display = "";
  winDiv.style.display = "none";
  restartbtn.style.display = "none";
});

checkbox.addEventListener("change", (e) => {
  if (e.target.checked) {
    playerTwoInput.style.display = "";
    playerTwoInput.setAttribute("required", "true");
  } else {
    playerTwoInput.style.display = "none";
    playerTwoInput.removeAttribute("required");
  }
});
