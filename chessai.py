import chess
import random

class ChessAI:

    # Where we store our piece and square VALUES.
        # 1) Store piece values.
        # 2) Store square values.
    def __init__(self, depth=3):
        self.depth = depth

        # 1) Store piece values.
        self.board = chess.Board()
        self.piece_values = {
            chess.PAWN: 100,
            chess.KNIGHT: 320,
            chess.BISHOP: 330,
            chess.ROOK: 500,
            chess.QUEEN: 900,
            chess.KING: 20000
        }

        # 2) Store square values.
        self.position_values = {
    chess.PAWN: {
        chess.WHITE: [
            0,  0,  0,  0,  0,  0,  0,  0,
            50, 50, 50, 50, 50, 50, 50, 50,
            10, 10, 20, 20, 100, 20, 10, 10,
            5,  5, 10, 100, 60, 10,  5,  5,
            0,  0,  0, 20, 20,  0,  0,  0,
            5, -5,-10,  0,  0,-10, -5,  5,
            5, 10, 10,-20,-20, 10, 10,  5,
            0,  0,  0,  0,  0,  0,  0,  0
        ],
        chess.BLACK: [
            0,  0,  0,  0,  0,  0,  0,  0,
            5, 10, 10,-20,-20, 10, 10,  5,
            5, -5,-10,  0,  0,-10, -5,  5,
            0,  0,  0, 20, 20,  0,  0,  0,
            5,  5, 10, 35, 25, 10,  5,  5,
            10, 10, 20, 20, 20, 20, 10, 10,
            50, 50, 50, 50, 50, 50, 50, 50,
            0,  0,  0,  0,  0,  0,  0,  0
        ]
    },
    chess.KNIGHT: {
        chess.WHITE: [
            -50,-40,-30,-30,-30,-30,-40,-50,
            -40,-20,  0,  0,  0,  0,-20,-40,
            -30,  0, 10, 15, 15, 10,  0,-30,
            -30,  5, 15, 20, 20, 15,  5,-30,
            -30,  0, 15, 20, 20, 15,  0,-30,
            -30,  5, 10, 15, 15, 10,  5,-30,
            -40,-20,  0,  5,  5,  0,-20,-40,
            -50,-40,-30,-30,-30,-30,-40,-50
        ],
        chess.BLACK: [
            -50,-40,-30,-30,-30,-30,-40,-50,
            -40,-20,  0,  5,  5,  0,-20,-40,
            -30,  5, 10, 15, 15, 10,  5,-30,
            -30,  0, 15, 20, 20, 15,  0,-30,
            -30,  5, 15, 20, 20, 15,  5,-30,
            -30,  0, 10, 15, 15, 10,  0,-30,
            -40,-20,  0,  0,  0,  0,-20,-40,
            -50,-40,-30,-30,-30,-30,-40,-50
        ]
    },
    chess.BISHOP: {
        chess.WHITE: [
            -20,-10,-10,-10,-10,-10,-10,-20,
            -10,  0,  0,  0,  0,  0,  0,-10,
            -10,  0,  5, 10, 10,  5,  0,-10,
            -10,  5,  5, 10, 10,  5,  5,-10,
            -10,  0, 10, 10, 10, 10,  0,-10,
            -10, 10, 10, 10, 10, 10, 10,-10,
            -10,  5,  0,  0,  0,  0,  5,-10,
            -20,-10,-10,-10,-10,-10,-10,-20
        ],
        chess.BLACK: [
            -20,-10,-10,-10,-10,-10,-10,-20,
            -10,  5,  0,  0,  0,  0,  5,-10,
            -10, 10, 10, 10, 10, 10, 10,-10,
            -10,  0, 10, 10, 10, 10,  0,-10,
            -10,  5,  5, 10, 10,  5,  5,-10,
            -10,  0,  5, 10, 10,  5,  0,-10,
            -10,  0,  0,  0,  0,  0,  0,-10,
            -20,-10,-10,-10,-10,-10,-10,-20
        ]
    },
    chess.ROOK: {
        chess.WHITE: [
            0,  0,  0,  0,  0,  0,  0,  0,
            5, 10, 10, 10, 10, 10, 10,  5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            0,  0,  0,  5,  5,  0,  0,  0
        ],
        chess.BLACK: [
            0,  0,  0,  5,  5,  0,  0,  0,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            5, 10, 10, 10, 10, 10, 10,  5,
            0,  0,  0,  0,  0,  0,  0,  0
        ]
    },
    chess.QUEEN: {
        chess.WHITE: [
            -20,-10,-10, -5, -5,-10,-10,-20,
            -10,  0,  0,  0,  0,  0,  0,-10,
            -10,  0,  5,  5,  5,  5,  0,-10,
            -5,  0,  5,  5,  5,  5,  0, -5,
            0,  0,  5,  5,  5,  5,  0, -5,
            -10,  5,  5,  5,  5,  5,  0,-10,
            -10,  0,  5,  0,  0,  0,  0,-10,
            -20,-10,-10, -5, -5,-10,-10,-20
        ],
        chess.BLACK: [
            -20,-10,-10, -5, -5,-10,-10,-20,
            -10,  0,  5,  0,  0,  0,  0,-10,
            -10,  5,  5,  5,  5,  5,  0,-10,
            0,  0,  5,  5,  5,  5,  0, -5,
            -5,  0,  5,  5,  5,  5,  0, -5,
            -10,  0,  5,  5,  5,  5,  0,-10,
            -10,  0,  0,  0,  0,  0,  0,-10,
            -20,-10,-10, -5, -5,-10,-10,-20
        ]
    },
    chess.KING: {
        chess.WHITE: [
            -30,-40,-40,-50,-50,-40,-40,-30,
            -30,-40,-40,-50,-50,-40,-40,-30,
            -30,-40,-40,-50,-50,-40,-40,-30,
            -30,-40,-40,-50,-50,-40,-40,-30,
            -20,-30,-30,-40,-40,-30,-30,-20,
            -10,-20,-20,-20,-20,-20,-20,-10,
            20, 20,  0,  0,  0,  0, 20, 20,
            20, 30, 10,  0,  0, 10, 30, 20
        ],
        chess.BLACK: [
            20, 30, 10,  0,  0, 10, 30, 20,
            20, 20,  0,  0,  0,  0, 20, 20,
            -10,-20,-20,-20,-20,-20,-20,-10,
            -20,-30,-30,-40,-40,-30,-30,-20,
            -30,-40,-40,-50,-50,-40,-40,-30,
            -30,-40,-40,-50,-50,-40,-40,-30,
            -30,-40,-40,-50,-50,-40,-40,-30,
            -30,-40,-40,-50,-50,-40,-40,-30
        ]
    }
}
    

    def evaluate_board(self, board):
        # 1) Logic highlighting checkmate and stalemate lines based on the minimax algorithm.
        if board.is_checkmate():
            return -9999 if board.turn == chess.WHITE else 9999
        if board.is_stalemate() or board.is_insufficient_material():
            return 0
        
        # 2) Calculates the chess score: + for White, - for Black based on material and their board positions.
        score = 0
        for square in chess.SQUARES:
            piece = board.piece_at(square)
            if piece is not None:
                # If there is a piece, set it's piece_type to "value" and position_value is that plus it's color and square.
                value = self.piece_values[piece.piece_type]
                position_value = self.position_values[piece.piece_type][piece.color][square]

                if piece.color == chess.WHITE:
                    score += value + position_value
                else: 
                    score -= value + position_value

        return score if board.turn == chess.WHITE else -score
    
    def minimax(self, board, depth, alpha, beta, maximizing_player):
        # 1) If the game is over, this evaluates the current board.
        if depth == 0 or board.is_game_over():
            return self.evaluate_board(board)
        # 2) For whoever's turn it is, iterates through all legal moves and applies best to the board.
        if maximizing_player:
            max_eval = float('-inf')
            for move in board.legal_moves:
                board.push(move)
                # 3) Recursively calling the minimax for the opponent's turn with 1 less depth.
                eval = self.minimax(board, depth -1, alpha, beta, False)
            
            # 4) Undo the move to restore the board to its previous state.
                board.pop()
            # 5) Update max_eval if we found a better move.
                max_eval = max(max_eval, eval)
            # 6) Update alpha for alpha-beta pruning.
                alpha = max(alpha, eval)
            # 7) Removing any moves that would allow the opposing player have a counter that would give them the advantage.
                if beta <= alpha:
                    break
            return max_eval
        else:
            min_eval = float('inf')
            for move in board.legal_moves:
                board.push(move)
                eval = self.minimax(board, depth - 1, alpha, beta, True)
                board.pop()
                min_eval = min(min_eval, eval)
                beta = min(beta, eval)
                if beta <= alpha:
                    break
            return min_eval

    def choose_move(self, board):
        best_moves = []
        best_eval = float('-inf') if board.turn == chess.WHITE else float('inf')
        alpha = float('-inf')
        beta = float('inf')

        legal_moves = list(board.legal_moves)
        if not legal_moves:
            print("No legal moves available")
            return None

        print(f"Legal moves: {[board.san(move) for move in legal_moves]}")

        for move in legal_moves:
            board.push(move)
            eval = self.minimax(board, self.depth - 1, alpha, beta, board.turn != chess.WHITE)
            board.pop()

            print(f"Move: {board.san(move)}, Eval: {eval}")  

            if board.turn == chess.WHITE:
                if eval > best_eval:
                    best_eval = eval
                    best_moves = [move]
                    alpha = max(alpha, eval)
                elif eval == best_eval:
                    best_moves.append(move)
            else:
                if eval < best_eval:
                    best_eval = eval
                    best_moves = [move]
                    beta = min(beta, eval)
                elif eval == best_eval:
                    best_moves.append(move)

            if beta <= alpha:
                break

        chosen_move = random.choice(best_moves)
        print(f"Chosen move: {board.san(chosen_move)} with eval: {best_eval}")

        return chosen_move


if __name__ == "__main__":
    board = chess.Board()
    ai = ChessAI()

    # Example: Make a move
    move = ai.choose_move(board)
    print(f"AI chooses move: {board.san(move)}")