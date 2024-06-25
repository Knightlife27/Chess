import "./styles.css";
import React, { useState, useEffect } from "react";

// Initialized Objects, Variables, Loops, & useStates:
const chessPieces = {
  whiteKing: {
    symbol: '♔',
    color: 'white',
    type: 'king'
  },
  whiteQueen: {
    symbol: '♕',
    color: 'white',
    type: 'queen'
  },
  whiteRook: {
    symbol: '♖',
    color: 'white',
    type: 'rook',
  },
  whiteBishop: {
    symbol: '♗',
    color: 'white',
    type: 'bishop'
  },
  whiteKnight: {
    symbol: '♘',
    color: 'white',
    type: 'knight'
  },
  whitePawn: {
    symbol: '♙',
    color: 'white',
    type: 'pawn'
  },
  blackKing: {
    symbol: '♚',
    color: 'black',
    type: 'king'
  },
  blackQueen: {
    symbol: '♛',
    color: 'black',
    type: 'queen'
  },
  blackRook: {
    symbol: '♜',
    color: 'black',
    type: 'rook'
  },
  blackBishop: {
    symbol: '♝',
    color: 'black',
    type: 'bishop'
  },
  blackKnight: {
    symbol: '♞',
    color: 'black',
    type: 'knight'
  },
  blackPawn: {
    symbol: '♙',
    color: 'black',
    type: 'pawn'
  },
};

const startingPosition = [
  [chessPieces.blackRook, chessPieces.blackKnight, chessPieces.blackBishop, chessPieces.blackQueen, chessPieces.blackKing, chessPieces.blackBishop, chessPieces.blackKnight, chessPieces.blackRook],
  [chessPieces.blackPawn, chessPieces.blackPawn, chessPieces.blackPawn, chessPieces.blackPawn, chessPieces.blackPawn, chessPieces.blackPawn, chessPieces.blackPawn, chessPieces.blackPawn],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [chessPieces.whitePawn, chessPieces.whitePawn, chessPieces.whitePawn, chessPieces.whitePawn, chessPieces.whitePawn, chessPieces.whitePawn, chessPieces.whitePawn, chessPieces.whitePawn],
  [chessPieces.whiteRook, chessPieces.whiteKnight, chessPieces.whiteBishop, chessPieces.whiteQueen, chessPieces.whiteKing, chessPieces.whiteBishop, chessPieces.whiteKnight, chessPieces.whiteRook],
];

// HELPER FUNCTION RIGHT HERE:::

const getPieceColor = (chessPiece) => {
  if (!chessPiece) return null;
  return chessPiece.color;
};

const App = () => {
  // Dynamic Objects, Variables, & useStates:::
  const [board, setBoard] = useState(startingPosition);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [playerTurn, setPlayerTurn] = useState('white');
  const [alert, setAlert] = useState({ show: false, message: "" });

  useEffect(() => {
    console.log('selectedPiece:', selectedPiece);
  }, [selectedPiece]);

  const showAlert = (message) => {
    setAlert({ show: true, message });
    setTimeout(() => {
      setAlert({ show: false, message: "" });
    }, 3000);
  };

  // handleClick => 
  // 1) Define the chess piece or else define it as null.
  // 2) Define logic for when we click on a chess piece.
  // 3) Define logic for when that chess piece passes our isValidMove function.
  // 4) Define logic for when that chess piece does not pass our isValidMove function.
  const handleClick = (row, col) => {
    // 1) Define the player's piece as "chessPiece" if there is a piece on the clicked coordinates.
    const chessPiece = board[row][col];
    console.log(`Clicked on ${row} & ${col}`)

    // 2) Define logic for when we click on a chess piece.
    if (selectedPiece) {
      // 3) Define logic for when that chess piece passes our isValidMove function.
      if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
        executeMove(selectedPiece.row, selectedPiece.col, row, col);
      } else {
        // 4) Define logic for when that chess piece does not pass our isValidMove function.
        showAlert("Invalid move. Please try again.");
        setSelectedPiece(null);
      }
    } else {
      if (chessPiece && chessPiece.color === playerTurn) {
        setSelectedPiece({ chessPiece, row, col });
      } else {
        showAlert("Wrong piece selected. It's not your turn.");
      }
    }
  };
  // isPathClear => A helper function designed to make sure pieces can't move past other pieces in their given direction.
  const isPathClear = (board, startRow, startCol, endRow, endCol) => {
    console.log('isPathClear being called from', startRow, startCol, endRow, endCol)
    const rowStep = Math.sign(endRow - startRow);
    const colStep = Math.sign(endCol - startCol);
    let currentRow = startRow + rowStep;
    let currentCol = startCol + colStep;

    while (currentRow !== endRow || currentCol !== endCol) {
      if (board[currentRow][currentCol] !== null) {
        return false; // There's a piece in the way
      }
      currentRow += rowStep;
      currentCol += colStep;
    }
    return true; // The path is clear
  };

  // isValidMove =>

  const isValidMove = (startRow, startCol, endRow, endCol, piece) => {
    console.log('isValidMove called with:', startRow, startCol, endRow, endCol);
    // 1) Define the coordinates of the attacking piece.
    const attackingPiece = board[startRow][startCol];
    if (!attackingPiece) return false; // No piece to move
    // 2) Define the row and column difference of the move.
    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    console.log('Start piece:', attackingPiece);
    console.log('Row difference:', rowDiff);
    console.log('Column difference:', colDiff);

    // 3) Define the direction each player can move their pawns.
    const isPlayer1 = attackingPiece.color === "white";
    const forwardPawn = isPlayer1
      ? rowDiff === -1 || rowDiff === 2 || rowDiff === 1
      : rowDiff === 1 || rowDiff === -2 || rowDiff === -1;
    const validPawnDirection = isPlayer1 ? rowDiff < 0 : rowDiff > 0;

    console.log('Is player 1:', isPlayer1);
    console.log('Forward move:', forwardPawn);
    console.log('Valid direction:', validPawnDirection);

    // 4) Define the logic for every chess piece.
    if (attackingPiece.type === 'pawn') {
      const targetPiece = board[endRow][endCol];
      const isDiagonalAttack = Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1;
      if (isDiagonalAttack) {
        return validPawnDirection && targetPiece && targetPiece.color !== attackingPiece.color;
      } else if (Math.abs(colDiff) === 0 && rowDiff === -1 || rowDiff === 1 && colDiff === 0) {
        return validPawnDirection;
      }
    } else if (attackingPiece.type === 'bishop') {
      if (Math.abs(colDiff) === Math.abs(rowDiff)) {
        if (isPathClear(board, startRow, startCol, endRow, endCol)) {
          const targetPiece = board[endRow][endCol];
          // Allow move if destination is empty or has an opponent's piece
          return !targetPiece || targetPiece.color !== attackingPiece.color;
        }
      }
    } else if (attackingPiece.type === 'rook') {
      if (colDiff === 0 || rowDiff === 0) {
        if (isPathClear(board, startRow, startCol, endRow, endCol)) {
          const targetPiece = board[endRow][endCol];
          // Allow move if destination is empty or has an opponent's piece
          return !targetPiece || targetPiece.color !== attackingPiece.color;
        }
      }
    } else if (attackingPiece.type === 'queen') {
      if (colDiff === 0 || rowDiff === 0 || Math.abs(colDiff) === Math.abs(rowDiff)) {
        if (isPathClear(board, startRow, startCol, endRow, endCol)) {
          const targetPiece = board[endRow][endCol];
          // Allow move if destination is empty or has an opponent's piece
          return !targetPiece || targetPiece.color !== attackingPiece.color;
        }
      }
    } else if (attackingPiece.type === 'king') {
      if (Math.abs(colDiff) === 1 || Math.abs(rowDiff) === 1) {
        const targetPiece = board[endRow][endCol];
        // Allow move if destination is empty or has an opponent's piece
        return !targetPiece || targetPiece.color !== attackingPiece.color;
      }
    } else if (attackingPiece.type === 'knight') {
      if (Math.abs(colDiff) === 1 && Math.abs(rowDiff) === 2 || Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2) {
        const targetPiece = board[endRow][endCol];
        // Allow move if destination is empty or has an opponent's piece
        return !targetPiece || targetPiece.color !== attackingPiece.color;
      }
    }












    showAlert("Invalid move: Move does not comply with the rules.");
    return false;
  };
  // checkCapture => Checking to see if there is a piece that is the opposite color on the captured piece square.
  // 1) Define attacking and defending pieces.
  // 2) Return true if opposite colored piece is on defending square.
  const checkCapture = (startRow, startCol, endRow, endCol) => {
    // Console Log.
    console.log('checkCapture called with:', startRow, startCol, endRow, endCol);
    // 1) Define the attacking and defending pieces and their coordinates.
    const defendingPiece = board[endRow][endCol];
    const attackingPiece = board[startRow][startCol];
    // 2) return true if there is an opposing colored defending piece on that square.
    return defendingPiece !== null && defendingPiece.color !== attackingPiece.color;
  };
  // executeMove => Executing the move on the board visually, by updating the board useState.
  // 1) Create copy.
  // 2) Updating squares within copy.
  // 3) Update board useState.
  const executeMove = (startRow, startCol, endRow, endCol) => {
    console.log('executeMove called with:', startRow, startCol, endRow, endCol);
    // 1) Creating a copy with the spread operator. Defining piece.
    const newBoard = board.map((row) => [...row]);
    let piece = board[startRow][startCol];

    console.log('Piece to be moved:', piece);
    // 2) Updating values of these squares within our new copy we made.
    newBoard[endRow][endCol] = piece;
    newBoard[startRow][startCol] = null;

    // if (Math.abs(startRow - endRow) === 2) {
    //   const middleRow = Math.floor((startRow + endRow) / 2);
    //   const middleCol = Math.floor((startCol + endCol) / 2);
    //   newBoard[middleRow][middleCol] = null;
    // }
    // 3) Update board, playerTurn, and selectedPiece useStates. Makes move show on board.
    setBoard(newBoard);
    setSelectedPiece(null);
    setPlayerTurn(playerTurn === 'white' ? 'black' : 'white');
  };

  return (
    <div className="chessPieces">
      <h1>Let's Create This Chess Game</h1>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="rowClass">
          {row.map((piece, colIndex) => (
            <div
              key={colIndex}
              className={
                colIndex % 2 === rowIndex % 2
                  ? "whiteSquare"
                  : "blackSquare"
              }
              onClick={() => handleClick(rowIndex, colIndex)}
            >
              {piece ? (
                <div className={`${piece.color}`}>{piece.symbol}</div>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;