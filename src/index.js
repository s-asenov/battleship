import Playground from "./playground";

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
  const fields = document.getElementsByClassName("player-field");

  for (let i = 0; i < fields.length; i++) {
    fields[i].style.display = "none";
  }
};

const showTables = () => {
  const fields = document.getElementsByClassName("player-field");

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
