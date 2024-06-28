from flask import Flask, request, jsonify
from flask_cors import CORS
from chessai import ChessAI
import chess

app = Flask(__name__)
CORS(app)

ai = ChessAI()
# Function that converts React data into Python data.
def convert_react_board_to_chess_board(react_board):
    board = chess.Board()
    board.clear()  # Clear the default starting position

    symbol_to_piece = {
            '♔': 'K', '♕': 'Q', '♖': 'R', '♗': 'B', '♘': 'N', '♙': 'P',
            '♚': 'k', '♛': 'q', '♜': 'r', '♝': 'b', '♞': 'n', '♟': 'p'
        }

    for row in range(8):
        for col in range(8):
            piece = react_board[row][col]
            if piece:
                chess_piece = chess.Piece.from_symbol(piece['symbol'])
                square = chess.square(col, 7 - row)  # chess library uses 0-63 notation
                board.set_piece_at(square, chess_piece)
    return board
# Function that converts Python data into React data.
def convert_chess_move_to_react_move(chess_move):
    from_square = chess_move.from_square
    to_square = chess_move.to_square
    return {
        'startRow': 7 - chess.square_rank(from_square),
        'startCol': chess.square_file(from_square),
        'endRow': 7 - chess.square_rank(to_square),
        'endCol': chess.square_file(to_square)
    }

@app.route('/', methods=['GET'])
def home():
    return "Chess AI server is running!"

@app.route('/get_move', methods=['POST'])
def get_move():
    try:
        react_board = request.json['board']
        chess_board = convert_react_board_to_chess_board(react_board)
        
        ai.board = chess_board  # Update AI's internal board
        chess_move = ai.choose_move(chess_board)
        
        if chess_move:
            react_move = convert_chess_move_to_react_move(chess_move)
            return jsonify({'move': react_move})
        else:
            return jsonify({'error': 'No valid move found'}), 400
    except Exception as e:
        print(f"Error processing move: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)