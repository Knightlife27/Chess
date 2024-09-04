from flask import Flask, request, jsonify
from flask_cors import CORS
from chessai import ChessAI
import chess
import base64
import hashlib
import random
import os
from flask_lambda import FlaskLambda

app = Flask(__name__)
lambda_handler = FlaskLambda(app)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})

ai = ChessAI()

def convert_react_board_to_chess_board(react_board):
    board = chess.Board(None)
    board.clear()  # Clear the default starting position

    # Mapping of piece types and colors to FEN symbols
    piece_to_fen = {
        ('king', 'white'): 'K', ('queen', 'white'): 'Q', ('rook', 'white'): 'R',
        ('bishop', 'white'): 'B', ('knight', 'white'): 'N', ('pawn', 'white'): 'P',
        ('king', 'black'): 'k', ('queen', 'black'): 'q', ('rook', 'black'): 'r',
        ('bishop', 'black'): 'b', ('knight', 'black'): 'n', ('pawn', 'black'): 'p'
    }

    def get_fen_from_image(image_data, piece_type, piece_color):
        if 'base64,' in image_data:
            image_data = image_data.split('base64,')[1]
        image_hash = hashlib.md5(image_data[:64].encode()).hexdigest()
        print(f"Image hash for {piece_color} {piece_type}: {image_hash}")
        return piece_to_fen.get((piece_type, piece_color))

    for row in range(8):
        for col in range(8):
            piece = react_board[row][col]
            if piece:
                piece_type = piece.get('type', '').lower()
                piece_color = piece.get('color', '').lower()
                image_data = piece.get('image', '')
                
                fen_symbol = get_fen_from_image(image_data, piece_type, piece_color)
                
                if fen_symbol:
                    chess_piece = chess.Piece.from_symbol(fen_symbol)
                    square = chess.square(col, 7 - row)  # chess library uses 0-63 notation
                    board.set_piece_at(square, chess_piece)
                else:
                    print(f"Unknown piece at row {row}, col {col}: {piece}")

    print("Converted board FEN:", board.fen())
    return board

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

@app.route('/test_post', methods=['POST'])
def test_post():
    data = request.json
    return jsonify({"message": "Received", "data": data})

@app.route('/get_move', methods=['POST'])
def get_move():
    try:
        react_board = request.json['board']
        print("Received board state:", react_board)
        
        chess_board = convert_react_board_to_chess_board(react_board)
        print("Converted chess board FEN:", chess_board.fen())
        
        # Ensure it's black's turn
        chess_board.turn = chess.BLACK
        
        legal_moves = list(chess_board.legal_moves)
        print(f"Number of legal moves: {len(legal_moves)}")
        print("Legal moves:", [chess_board.san(move) for move in legal_moves])
        
        if not legal_moves:
            print("No legal moves available. Checking game state.")
            if chess_board.is_checkmate():
                return jsonify({'error': 'Checkmate'}), 200
            elif chess_board.is_stalemate():
                return jsonify({'error': 'Stalemate'}), 200
            elif chess_board.is_insufficient_material():
                return jsonify({'error': 'Insufficient material'}), 200
            else:
                return jsonify({'error': 'No legal moves, but game is not over'}), 400

        ai.board = chess_board  # Update AI's internal board
        chess_move = ai.choose_move(chess_board)
        print("AI chosen move:", chess_move)

        if chess_move:
            react_move = convert_chess_move_to_react_move(chess_move)
            print("Converted React move:", react_move)
            return jsonify({'move': react_move})
        else:
            print("AI couldn't choose a move. Selecting a random legal move.")
            fallback_move = random.choice(legal_moves)
            react_move = convert_chess_move_to_react_move(fallback_move)
            print("Fallback move:", react_move)
            return jsonify({'move': react_move, 'fallback': True})

    except KeyError as e:
        print(f"KeyError: {str(e)}")
        return jsonify({'error': 'Invalid request data'}), 400
    except Exception as e:
        print(f"Error processing move: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

def handler(event, context):
    return lambda_handler(event, context)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))