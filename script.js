const playerFactory = (name, marker) => {
  return { name, marker };
};

let player1;
let player2;
let player1Turn = true;

const gameboard = (() => {
  const currentGameboard = ["", "", "", "", "", "", "", "", ""];
  const cells = document.querySelectorAll(".cell");
  const submitButton = document.querySelector('button[type="submit"]');

  submitButton.addEventListener("click", () => {
    const playerOne = document.querySelector("#playerOne");
    const playerTwo = document.querySelector("#playerTwo");

    player1 = playerFactory(playerOne.value, "X");
    player2 = playerFactory(playerTwo.value, "O");

    if (player1.name == "" || player2.name == "") {
      displayControl.generateMessage("The names can not be empty!", "var(--error-color)");
    } else {
      displayControl.clearMessages();
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
      }
    }
  };

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
  }

  const clearMessages = () => {
    const messageContainer = document.querySelector(".message-container");
    messageContainer.innerHTML = '';
  }

  return {
    displayGameboard,
    disableInput,
    enableInput,
    generateMessage,
    clearMessages,
  };
})();

displayControl.disableInput();
