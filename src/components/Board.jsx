import React, { useState } from "react";
import "./Board.css";

const Board = () => {
  const rows = 6;
  const columns = 7;
  const [grid, setGrid] = useState(
    Array(rows)
      .fill()
      .map(() => Array(columns).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 for Player 1, 2 for Player 2
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Function to check if a move is valid (column not full)
  const isValidMove = (col) => {
    return grid[0][col] === null;
  };

  // Function to get the lowest empty row in a column
  const getLowestEmptyRow = (col) => {
    for (let row = rows - 1; row >= 0; row--) {
      if (grid[row][col] === null) {
        return row;
      }
    }
    return -1;
  };

  // Function to check for a win
  const checkWin = (grid, row, col, player) => {
    // Check horizontal
    let count = 1;
    // Check left
    for (let i = col - 1; i >= 0 && grid[row][i] === player; i--) count++;
    // Check right
    for (let i = col + 1; i < columns && grid[row][i] === player; i++) count++;
    if (count >= 4) return true;

    // Check vertical
    count = 1;
    // Check down
    for (let i = row + 1; i < rows && grid[i][col] === player; i++) count++;
    if (count >= 4) return true;

    // Check diagonal (top-left to bottom-right)
    count = 1;
    // Check up-left
    for (
      let i = 1;
      row - i >= 0 && col - i >= 0 && grid[row - i][col - i] === player;
      i++
    )
      count++;
    // Check down-right
    for (
      let i = 1;
      row + i < rows && col + i < columns && grid[row + i][col + i] === player;
      i++
    )
      count++;
    if (count >= 4) return true;

    // Check diagonal (top-right to bottom-left)
    count = 1;
    // Check up-right
    for (
      let i = 1;
      row - i >= 0 && col + i < columns && grid[row - i][col + i] === player;
      i++
    )
      count++;
    // Check down-left
    for (
      let i = 1;
      row + i < rows && col - i >= 0 && grid[row + i][col - i] === player;
      i++
    )
      count++;
    if (count >= 4) return true;

    return false;
  };

  // Handle column click (not individual cell)
  const handleColumnClick = (col) => {
    if (gameOver || !isValidMove(col)) return;

    const row = getLowestEmptyRow(col);
    const newGrid = grid.map((row) => [...row]);
    newGrid[row][col] = currentPlayer;

    setGrid(newGrid);

    // Check for win
    if (checkWin(newGrid, row, col, currentPlayer)) {
      setGameOver(true);
      setWinner(currentPlayer);
    } else {
      // Switch players
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  // Restart the game
  const restartGame = () => {
    setGrid(
      Array(rows)
        .fill()
        .map(() => Array(columns).fill(null))
    );
    setCurrentPlayer(1);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="game-container">
      <div className="game-info">
        {gameOver ? (
          <h2>Player {winner} Wins!</h2>
        ) : (
          <h2>Player {currentPlayer}'s Turn</h2>
        )}
        <button onClick={restartGame} className="restart-btn">
          Restart Game
        </button>
      </div>

      <div className="board">
        {Array(columns)
          .fill()
          .map((_, colIndex) => (
            <div
              key={colIndex}
              className="column"
              onClick={() => handleColumnClick(colIndex)}
            >
              {Array(rows)
                .fill()
                .map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`cell ${
                      grid[rowIndex][colIndex]
                        ? `player-${grid[rowIndex][colIndex]}`
                        : ""
                    }`}
                  >
                    {grid[rowIndex][colIndex] && <div className="piece"></div>}
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Board;
