const gameboard = (() => {
  const currentGameboard = ["", "", "", "", "", "", "", "", ""];
  /*
    0 1 2
    3 4 5
    6 7 8
  */

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      currentGameboard[cell.getAttribute("data-index")] = "X";
      displayControl.displayGameboard();
    });
  });

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
        cell.classList.add("symbol", "symbol__x");
      }
    }
  };

  return {
    displayGameboard,
  };
})();
