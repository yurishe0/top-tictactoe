const playerFactory = (name, marker) => {
  return { name, marker };
};

const player1 = playerFactory("Adam", "X");
const player2 = playerFactory("Bob", "O");
let player1Turn = true;


const gameboard = (() => {
  const currentGameboard = ["", "", "", "", "", "", "", "", ""];
  /*
    0 1 2
    3 4 5
    6 7 8
  */

	const getMarker = () => {
		if (player1Turn) {
			return player1.marker;
		} else {
			return player2.marker;
		}
	}

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
			if(!cell.hasChildNodes()) {
				currentGameboard[cell.getAttribute("data-index")] = getMarker();
				displayControl.displayGameboard();
				switchTurn();
			}
    });
  });

  const switchTurn = () => {
    if (player1Turn) {
      player1Turn = false;
    } else {
			player1Turn = true;
		}
    }

  return {
    currentGameboard,
  };
})();

const displayControl = (() => {
  const displayGameboard = () => {
    for (let i = 0; i < gameboard.currentGameboard.length; i++) {
      if (gameboard.currentGameboard[i] != "") {
        const cell = document.querySelector(`[data-index="${i}"]`);

        cell.textContent = gameboard.currentGameboard[i];
        cell.classList.add("symbol", `symbol__${gameboard.currentGameboard[i]}`);
      }
    }
  };

  return {
    displayGameboard,
  };
})();
