import Ship from "./ship";

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
    1. Proverqva dali veche e natisnato - hit or miss I guess they never miss HUUUUUUUUUH
		2. Proverqva dali e horizontal/vertical
		3. Ako e horizontal proverqva dali atakata e vurhu pravilniq red ako e vertical dali e vurhu pravilnata kolona
		4. I ako e na pravilniq block po xAxis-ata/yAxis-ata
		5. markira kato miss/hit
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

export default Board;
