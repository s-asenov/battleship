import Board from "./board";
import Player from "./player";

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

export default Playground;
