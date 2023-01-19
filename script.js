const playerFactory = (name, marker) => {
  return { name, marker };
};

let player1;
let player2;
let player1Turn = true;

const gameboard = (() => {
  let currentGameboard = ["", "", "", "", "", "", "", "", ""];
  const cells = document.querySelectorAll(".cell");
  const submitButton = document.querySelector('button[type="submit"]');

  submitButton.addEventListener("click", () => {
    const playerOne = document.querySelector("#playerOne");
    const playerTwo = document.querySelector("#playerTwo");

    if (playerOne.value == "" || playerTwo.value == "") {
      displayControl.generateMessage(
        "The names can not be empty!",
        "var(--error-color)"
      );
    } else {
      player1 = playerFactory(playerOne.value, "X");
      player2 = playerFactory(playerTwo.value, "O");
      playerOne.value = "";
      playerTwo.value = "";
      displayControl.clearMessages();
      displayControl.clearBoard();
      displayControl.enableInput();
    }
  });

  const getMarker = () => {
    if (player1Turn) {
      return player1.marker;
    } else {
      return player2.marker;
    }
  };

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      if (!cell.hasChildNodes()) {
        currentGameboard[cell.getAttribute("data-index")] = getMarker();
        displayControl.displayGameboard();
        console.log(currentGameboard);
        checkForWin();
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
  };

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkForDraw = () => {
    let filledCells = 0;
    for (let i = 0; i < currentGameboard.length; i++) {
      if (currentGameboard[i] == "X" || currentGameboard[i] == "O") {
        filledCells++;
      }
    }

    if (filledCells == 9) {
      displayControl.generateMessage(
        "The game ends in a draw!",
        "var(--warning-color)"
      );
    }
  };

  const checkForWin = () => {
    for (let i = 0; i < winningCombinations.length; i++) {
      if (
        gameboard.currentGameboard[winningCombinations[i][0]] == getMarker() &&
        gameboard.currentGameboard[winningCombinations[i][1]] == getMarker() &&
        gameboard.currentGameboard[winningCombinations[i][2]] == getMarker()
      ) {
        displayControl.disableInput();

        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => {
          if (
            cell.getAttribute("data-index") == winningCombinations[i][0] ||
            cell.getAttribute("data-index") == winningCombinations[i][1] ||
            cell.getAttribute("data-index") == winningCombinations[i][2]
          ) {
            cell.style.fontSize = "6em";
            cell.style.textShadow = "1px 2px black";
          }
        });

        const messageContainer = document.querySelector(".message-container");
        const winnerMessage = document.createElement("p");
        const winner = document.createElement("span");

        if (getMarker() == "X") {
          winner.textContent = player1.name;
          winner.style.color = "var(--primary-color)";
        } else if (getMarker() == "O") {
          winner.textContent = player2.name;
          winner.style.color = "var(--secondary-color)";
        }

        winnerMessage.appendChild(winner);
        winnerMessage.innerHTML += ` is victorious!`;
        messageContainer.appendChild(winnerMessage);
      } else {
        checkForDraw();
      }
    }
  };

  const restartButton = document.querySelector("#restart");
  restartButton.addEventListener("click", () => {
    displayControl.clearBoard();
    displayControl.clearMessages();
    player1Turn = true;
    displayControl.enableInput();
  });

  return {
    currentGameboard,
    checkForWin,
  };
})();

const displayControl = (() => {
  const displayGameboard = () => {
    for (let i = 0; i < gameboard.currentGameboard.length; i++) {
      if (gameboard.currentGameboard[i] != "") {
        const cell = document.querySelector(`[data-index="${i}"]`);

        cell.textContent = gameboard.currentGameboard[i];
        cell.classList.add(
          "symbol",
          `symbol__${gameboard.currentGameboard[i]}`
        );
      }
    }
  };

  const enableInput = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.style.pointerEvents = "";
    });
  };

  const disableInput = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.style.pointerEvents = "none";
    });
  };

  const generateMessage = (msg, color) => {
    clearMessages();
    const messageContainer = document.querySelector(".message-container");
    const message = document.createElement("p");
    message.style.color = color;
    message.textContent = msg;
    messageContainer.appendChild(message);
  };

  const clearMessages = () => {
    const messageContainer = document.querySelector(".message-container");
    messageContainer.innerHTML = "";
  };

  const clearBoard = () => {
    for (let i = 0; i < gameboard.currentGameboard.length; i++) {
      gameboard.currentGameboard[i] = "";
    }
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.classList.remove("symbol", "symbol__X", "symbol__O");
      cell.innerHTML = "";
      cell.removeAttribute("style");
      enableInput();
    });
  };

  return {
    displayGameboard,
    disableInput,
    enableInput,
    generateMessage,
    clearMessages,
    clearBoard,
  };
})();

displayControl.disableInput();
