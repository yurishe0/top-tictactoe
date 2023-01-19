const playerFactory = (name, marker, score) => {
  return { name, marker, score};
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
      player1 = playerFactory(playerOne.value, "X", 0);
      player2 = playerFactory(playerTwo.value, "O", 0);
      playerOne.value = "";
      playerTwo.value = "";
      displayControl.clearMessages();
      displayControl.clearBoard();
      displayControl.displayScore();
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

        if (getMarker() == "X") {
          player1.score++;
        } else {
          player2.score++;
        }
        displayControl.updateScore();

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

  const displayScore = () => {
    const player1Container = document.querySelector(".player1");
    const player2Container = document.querySelector(".player2");
    player1Container.innerHTML = "";
    player2Container.innerHTML = "";

    const player1Header = document.createElement("h2");
    const player1Score = document.createElement("p");
    const player2Header = document.createElement("h2");
    const player2Score = document.createElement("p");

    player1Header.textContent = player1.name;
    player1Score.textContent = "0";
    player2Header.textContent = player2.name;
    player2Score.textContent = "0";

    const scoreContainer = document.querySelector(".score-container");

    player1Container.appendChild(player1Header);
    player1Container.appendChild(player1Score);
    player2Container.appendChild(player2Header);
    player2Container.appendChild(player2Score);
    scoreContainer.style.appearance = "";
  };

  const updateScore = () => {
    const player1Score = document.querySelector(".player1 p");
    const player2Score = document.querySelector(".player2 p");

    player1Score.textContent = player1.score;
    player2Score.textContent = player2.score;
  }

  return {
    displayGameboard,
    disableInput,
    enableInput,
    generateMessage,
    clearMessages,
    clearBoard,
    displayScore,
    updateScore,
  };
})();

displayControl.disableInput();
