
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

  useEffect(() => {
    if (playerTurn === 'black') {
      setTimeout(blackTurnAIMove, 500);
    }
  }, [playerTurn]);

  const getAIMove = async () => {
    console.log("Attempting to get AI move");
    try {
        const response = await fetch('https://ominous-pancake-5gq9gprrwrrw24667-5000.app.github.dev/get_move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                board: board,
                turn: 'black'
            }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No valid move found');
            } else if (response.status === 400) {
                throw new Error('Invalid request data');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const data = await response.json();
        console.log('AI response data:', data);
        return data;
    } catch (error) {
        console.error('Error getting AI move:', error);
        throw error;
    }
};

const blackTurnAIMove = async () => {
    if (playerTurn !== 'black') {
        console.log("Not black's turn, skipping AI move");
        return;
    }

    try {
        const response = await getAIMove();
        console.log('AI response:', response);
        if (response && response.move) {
            const move = response.move;
            console.log('AI chose move:', move);

            if (typeof move === 'object' && 'startRow' in move && 'startCol' in move && 'endRow' in move && 'endCol' in move) {
                const { startRow, startCol, endRow, endCol } = move;
                const moveSuccess = executeMove(startRow, startCol, endRow, endCol);
                if (!moveSuccess) {
                    console.error('AI attempted an invalid move');
                    showAlert('AI attempted an invalid move');
                }
            } else {
                console.log('AI returned an invalid move format');
                showAlert('AI move error. Invalid move format.');
            }
        } else {
            console.log('AI did not return a valid move');
            showAlert('AI move error. Please try again.');
        }
    } catch (error) {
        console.error('Error during AI move:', error);
        showAlert('Network error. Please check your connection and try again.');
    }
};

  const handleClick = (row, col) => {
    const chessPiece = board[row][col];
    console.log(`Clicked on ${row} & ${col}`)

    if (selectedPiece) {
      if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
        executeMove(selectedPiece.row, selectedPiece.col, row, col);
      } else {
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

  const isValidMove = (startRow, startCol, endRow, endCol) => {
    console.log('isValidMove called with:', startRow, startCol, endRow, endCol);
    const attackingPiece = board[startRow][startCol];
    if (!attackingPiece) return false;

    // Check if it's the correct player's turn
    if (attackingPiece.color !== playerTurn) {
      console.log('Wrong color piece selected');
      return false;
    }

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    // For black pieces, pawn movement should be downwards (positive rowDiff)
    const validPawnDirection = attackingPiece.color === 'black' ? rowDiff > 0 : rowDiff < 0;

    if (attackingPiece.type === 'pawn') {
      const targetPiece = board[endRow][endCol];
      if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) {
        // Diagonal capture
        return validPawnDirection && targetPiece && targetPiece.color !== attackingPiece.color;
      } else if (Math.abs(colDiff) === 0) {
        // Forward movement
        if (Math.abs(rowDiff) === 1) {
          return validPawnDirection && !targetPiece;
        } else if (Math.abs(rowDiff) === 2) {
          // Initial two-square move
          const initialRow = attackingPiece.color === 'black' ? 1 : 6;
          return startRow === initialRow && !targetPiece && !board[startRow + (rowDiff / 2)][startCol];
        }
      }
    } else if (attackingPiece.type === 'bishop') {
      if (Math.abs(colDiff) === Math.abs(rowDiff) && isPathClear(board, startRow, startCol, endRow, endCol)) {
        const targetPiece = board[endRow][endCol];
        return !targetPiece || targetPiece.color !== attackingPiece.color;
      }
    } else if (attackingPiece.type === 'rook') {
      if ((colDiff === 0 || rowDiff === 0) && isPathClear(board, startRow, startCol, endRow, endCol)) {
        const targetPiece = board[endRow][endCol];
        return !targetPiece || targetPiece.color !== attackingPiece.color;
      }
    } else if (attackingPiece.type === 'queen') {
      if ((colDiff === 0 || rowDiff === 0 || Math.abs(colDiff) === Math.abs(rowDiff)) && isPathClear(board, startRow, startCol, endRow, endCol)) {
        const targetPiece = board[endRow][endCol];
        return !targetPiece || targetPiece.color !== attackingPiece.color;
      }
    } else if (attackingPiece.type === 'king') {
      if (Math.abs(colDiff) === 1 || Math.abs(rowDiff) === 1) {
        const targetPiece = board[endRow][endCol];
        return !targetPiece || targetPiece.color !== attackingPiece.color;
      }
    } else if (attackingPiece.type === 'knight') {
      if ((Math.abs(colDiff) === 1 && Math.abs(rowDiff) === 2) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)) {
        const targetPiece = board[endRow][endCol];
        return !targetPiece || targetPiece.color !== attackingPiece.color;
      }
    }

    showAlert("Invalid move: Move does not comply with the rules.");
    return false;
  };

  const checkCapture = (startRow, startCol, endRow, endCol) => {
    console.log('checkCapture called with:', startRow, startCol, endRow, endCol);
    const defendingPiece = board[endRow][endCol];
    const attackingPiece = board[startRow][startCol];
    return defendingPiece !== null && defendingPiece.color !== attackingPiece.color;
  };

  const executeMove = (startRow, startCol, endRow, endCol, promotionPiece = null) => {
  console.log('executeMove called with:', startRow, startCol, endRow, endCol);
  const newBoard = board.map((row) => [...row]);
  let piece = board[startRow][startCol];
  console.log('Piece to be moved:', piece);

  // Basic move validation
  if (!piece || piece.color !== playerTurn) {
    console.error('Invalid move: No piece or wrong color');
    return false;
  }

  // Handle pawn promotion
  if (promotionPiece) {
    piece = {
      symbol: promotionPiece === 'Q' ? '♛' : promotionPiece === 'R' ? '♜' : promotionPiece === 'B' ? '♝' : '♞',
      color: piece.color,
      type: promotionPiece.toLowerCase()
    };
  }

  newBoard[endRow][endCol] = piece;
  newBoard[startRow][startCol] = null;

  setBoard(newBoard);
  setSelectedPiece(null);
  const newTurn = playerTurn === 'white' ? 'black' : 'white';
  setPlayerTurn(newTurn);

  console.log(`Turn changed to ${newTurn}`);

  return true;
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








// import "./styles.css";
// import React, { useState, useEffect } from "react";


// // Initialized Objects, Variables, Loops, & useStates:
// const chessPieces = {
//   whiteKing: {
//     symbol: '♔',
//     color: 'white',
//     type: 'king'
//   },
//   whiteQueen: {
//     symbol: '♕',
//     color: 'white',
//     type: 'queen'
//   },
//   whiteRook: {
//     symbol: '♖',
//     color: 'white',
//     type: 'rook',
//   },
//   whiteBishop: {
//     symbol: '♗',
//     color: 'white',
//     type: 'bishop'
//   },
//   whiteKnight: {
//     symbol: '♘',
//     color: 'white',
//     type: 'knight'
//   },
//   whitePawn: {
//     symbol: '♙',
//     color: 'white',
//     type: 'pawn'
//   },
//   blackKing: {
//     symbol: '♚',
//     color: 'black',
//     type: 'king'
//   },
//   blackQueen: {
//     symbol: '♛',
//     color: 'black',
//     type: 'queen'
//   },
//   blackRook: {
//     symbol: '♜',
//     color: 'black',
//     type: 'rook'
//   },
//   blackBishop: {
//     symbol: '♝',
//     color: 'black',
//     type: 'bishop'
//   },
//   blackKnight: {
//     symbol: '♞',
//     color: 'black',
//     type: 'knight'
//   },
//   blackPawn: {
//     symbol: '♙',
//     color: 'black',
//     type: 'pawn'
//   },
// };

// const startingPosition = [
//   [chessPieces.blackRook, chessPieces.blackKnight, chessPieces.blackBishop, chessPieces.blackQueen, chessPieces.blackKing, chessPieces.blackBishop, chessPieces.blackKnight, chessPieces.blackRook],
//   [chessPieces.blackPawn, chessPieces.blackPawn, chessPieces.blackPawn, chessPieces.blackPawn, chessPieces.blackPawn, chessPieces.blackPawn, chessPieces.blackPawn, chessPieces.blackPawn],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [chessPieces.whitePawn, chessPieces.whitePawn, chessPieces.whitePawn, chessPieces.whitePawn, chessPieces.whitePawn, chessPieces.whitePawn, chessPieces.whitePawn, chessPieces.whitePawn],
//   [chessPieces.whiteRook, chessPieces.whiteKnight, chessPieces.whiteBishop, chessPieces.whiteQueen, chessPieces.whiteKing, chessPieces.whiteBishop, chessPieces.whiteKnight, chessPieces.whiteRook],
// ];

// // HELPER FUNCTION RIGHT HERE:::

// const getPieceColor = (chessPiece) => {
//   if (!chessPiece) return null;
//   return chessPiece.color;
// };

// const App = () => {
//   // Dynamic Objects, Variables, & useStates:::
//   const [board, setBoard] = useState(startingPosition);
//   const [selectedPiece, setSelectedPiece] = useState(null);
//   const [playerTurn, setPlayerTurn] = useState('white');
//   const [alert, setAlert] = useState({ show: false, message: "" });

//   useEffect(() => {
//     console.log('selectedPiece:', selectedPiece);
//   }, [selectedPiece]);

//   const showAlert = (message) => {
//     setAlert({ show: true, message });
//     setTimeout(() => {
//       setAlert({ show: false, message: "" });
//     }, 3000);
//   };
  
//   useEffect(() => {
//     if (playerTurn === 'black') {
//       blackTurnAIMove();
//     }
//   }, [playerTurn]);


//   const getAIMove = async () => {
//     try {
//       const response = await fetch('https://ominous-pancake-5gq9gprrwrrw24667-5000.app.github.dev/get_move', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ board: board }),
//       });
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       const data = await response.json();
//       console.log('AI response data:', data);
//       return data;
//     } catch (error) {
//       console.error('Error getting AI move:', error);
//       throw error;
//     }
//   };
  
//   const blackTurnAIMove = async () => {
//     if (playerTurn !== 'black') {
//       console.log("Not black's turn, skipping AI move");
//       return;
//     }
  
//     try {
//       const response = await getAIMove();
//       console.log('AI response:', response);
//       if (response && response.move) {
//         const move = response.move;
//         console.log('AI chose move:', move);
  
//         if (typeof move === 'object' && 'startRow' in move && 'startCol' in move && 'endRow' in move && 'endCol' in move) {
//           const { startRow, startCol, endRow, endCol } = move;
//           const moveSuccess = executeMove(startRow, startCol, endRow, endCol);
//           if (!moveSuccess) {
//             console.error('AI attempted an invalid move');
//           }
//         } else {
//           console.log('AI returned an invalid move format');
//           showAlert('AI move error. Invalid move format.');
//         }
//       } else {
//         console.log('AI did not return a valid move');
//         showAlert('AI move error. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error during AI move:', error);
//       showAlert('AI move error. Please try again.');
//     }
//   };

//   useEffect(() => {
//     if (playerTurn === 'black') {
//       setTimeout(blackTurnAIMove, 500);
//     }
//   }, [playerTurn]);

//   // handleClick => 
//   // 1) Define the chess piece or else define it as null.
//   // 2) Define logic for when we click on a chess piece.
//   // 3) Define logic for when that chess piece passes our isValidMove function.
//   // 4) Define logic for when that chess piece does not pass our isValidMove function.
//   const handleClick = (row, col) => {
//     // 1) Define the player's piece as "chessPiece" if there is a piece on the clicked coordinates.
//     const chessPiece = board[row][col];
//     console.log(`Clicked on ${row} & ${col}`)

//     // 2) Define logic for when we click on a chess piece.
//     if (selectedPiece) {
//       // 3) Define logic for when that chess piece passes our isValidMove function.
//       if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
//         executeMove(selectedPiece.row, selectedPiece.col, row, col);
//       } else {
//         // 4) Define logic for when that chess piece does not pass our isValidMove function.
//         showAlert("Invalid move. Please try again.");
//         setSelectedPiece(null);
//       }
//     } else {
//       if (chessPiece && chessPiece.color === playerTurn) {
//         setSelectedPiece({ chessPiece, row, col });
//       } else {
//         showAlert("Wrong piece selected. It's not your turn.");
//       }
//     }
//   };
//   // isPathClear => A helper function designed to make sure pieces can't move past other pieces in their given direction.
//   const isPathClear = (board, startRow, startCol, endRow, endCol) => {
//     console.log('isPathClear being called from', startRow, startCol, endRow, endCol)
//     const rowStep = Math.sign(endRow - startRow);
//     const colStep = Math.sign(endCol - startCol);
//     let currentRow = startRow + rowStep;
//     let currentCol = startCol + colStep;

//     while (currentRow !== endRow || currentCol !== endCol) {
//       if (board[currentRow][currentCol] !== null) {
//         return false; // There's a piece in the way
//       }
//       currentRow += rowStep;
//       currentCol += colStep;
//     }
//     return true; // The path is clear
//   };

//   // isValidMove =>

//     const isValidMove = (startRow, startCol, endRow, endCol) => {
//       console.log('isValidMove called with:', startRow, startCol, endRow, endCol);
//       const attackingPiece = board[startRow][startCol];
//       if (!attackingPiece) return false;
    
//       // Check if it's the correct player's turn
//       if (attackingPiece.color !== playerTurn) {
//         console.log('Wrong color piece selected');
//         return false;
//       }
    
//       const rowDiff = endRow - startRow;
//       const colDiff = endCol - startCol;
    
//       // For black pieces, pawn movement should be downwards (positive rowDiff)
//       const validPawnDirection = attackingPiece.color === 'black' ? rowDiff > 0 : rowDiff < 0;
    
//       if (attackingPiece.type === 'pawn') {
//         const targetPiece = board[endRow][endCol];
//         if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) {
//           // Diagonal capture
//           return validPawnDirection && targetPiece && targetPiece.color !== attackingPiece.color;
//         } else if (Math.abs(colDiff) === 0) {
//           // Forward movement
//           if (Math.abs(rowDiff) === 1) {
//             return validPawnDirection && !targetPiece;
//           } else if (Math.abs(rowDiff) === 2) {
//             // Initial two-square move
//             const initialRow = attackingPiece.color === 'black' ? 1 : 6;
//             return startRow === initialRow && !targetPiece && !board[startRow + (rowDiff / 2)][startCol];
//           }
//         }
//       } else if (attackingPiece.type === 'bishop') {
//         if (Math.abs(colDiff) === Math.abs(rowDiff) && isPathClear(board, startRow, startCol, endRow, endCol)) {
//           const targetPiece = board[endRow][endCol];
//           return !targetPiece || targetPiece.color !== attackingPiece.color;
//         }
//       } else if (attackingPiece.type === 'rook') {
//         if ((colDiff === 0 || rowDiff === 0) && isPathClear(board, startRow, startCol, endRow, endCol)) {
//           const targetPiece = board[endRow][endCol];
//           return !targetPiece || targetPiece.color !== attackingPiece.color;
//         }
//       } else if (attackingPiece.type === 'queen') {
//         if ((colDiff === 0 || rowDiff === 0 || Math.abs(colDiff) === Math.abs(rowDiff)) && isPathClear(board, startRow, startCol, endRow, endCol)) {
//           const targetPiece = board[endRow][endCol];
//           return !targetPiece || targetPiece.color !== attackingPiece.color;
//         }
//       } else if (attackingPiece.type === 'king') {
//         if (Math.abs(colDiff) === 1 || Math.abs(rowDiff) === 1) {
//           const targetPiece = board[endRow][endCol];
//           return !targetPiece || targetPiece.color !== attackingPiece.color;
//         }
//       } else if (attackingPiece.type === 'knight') {
//         if ((Math.abs(colDiff) === 1 && Math.abs(rowDiff) === 2) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)) {
//           const targetPiece = board[endRow][endCol];
//           return !targetPiece || targetPiece.color !== attackingPiece.color;
//         }
//       }
    
//       showAlert("Invalid move: Move does not comply with the rules.");
//       return false;
//     };
//   // checkCapture => Checking to see if there is a piece that is the opposite color on the captured piece square.
//   // 1) Define attacking and defending pieces.
//   // 2) Return true if opposite colored piece is on defending square.
//   const checkCapture = (startRow, startCol, endRow, endCol) => {
//     // Console Log.
//     console.log('checkCapture called with:', startRow, startCol, endRow, endCol);
//     // 1) Define the attacking and defending pieces and their coordinates.
//     const defendingPiece = board[endRow][endCol];
//     const attackingPiece = board[startRow][startCol];
//     // 2) return true if there is an opposing colored defending piece on that square.
//     return defendingPiece !== null && defendingPiece.color !== attackingPiece.color;
//   };
//   // executeMove => Executing the move on the board visually, by updating the board useState.
//   // 1) Create copy.
//   // 2) Updating squares within copy.
//   // 3) Update board useState.
//   const executeMove = (startRow, startCol, endRow, endCol, promotionPiece = null) => {
//     console.log('executeMove called with:', startRow, startCol, endRow, endCol);
//     const newBoard = board.map((row) => [...row]);
//     let piece = board[startRow][startCol];
//     console.log('Piece to be moved:', piece);
  
//     // Basic move validation
//     if (!piece || piece.color !== playerTurn) {
//       console.error('Invalid move: No piece or wrong color');
//       return false;
//     }
  
//     // Handle pawn promotion
//     if (promotionPiece) {
//       piece = {
//         symbol: promotionPiece === 'Q' ? '♛' : promotionPiece === 'R' ? '♜' : promotionPiece === 'B' ? '♝' : '♞',
//         color: piece.color,
//         type: promotionPiece.toLowerCase()
//       };
//     }
  
//     newBoard[endRow][endCol] = piece;
//     newBoard[startRow][startCol] = null;
  
//     setBoard(newBoard);
//     setSelectedPiece(null);
//     const newTurn = playerTurn === 'white' ? 'black' : 'white';
//     setPlayerTurn(newTurn);
  
//     console.log(`Turn changed to ${newTurn}`);
  
//     return true;
//   };

//   return (
//     <div className="chessPieces">
//       <h1>Let's Create This Chess Game</h1>
//       {board.map((row, rowIndex) => (
//         <div key={rowIndex} className="rowClass">
//           {row.map((piece, colIndex) => (
//             <div
//               key={colIndex}
//               className={
//                 colIndex % 2 === rowIndex % 2
//                   ? "whiteSquare"
//                   : "blackSquare"
//               }
//               onClick={() => handleClick(rowIndex, colIndex)}
//             >
//               {piece ? (
//                 <div className={`${piece.color}`}>{piece.symbol}</div>
//               ) : null}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default App;