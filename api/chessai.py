import chess
import random

class ChessAI:
    def __init__(self, depth=3):  # Increased depth
        self.depth = depth
        self.board = chess.Board()
        self.piece_values = {
            chess.PAWN: 100,
            chess.KNIGHT: 320,
            chess.BISHOP: 330,
            chess.ROOK: 500,
            chess.QUEEN: 900,
            chess.KING: 20000
        }
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

    def is_valid_move(self, board, start_square, end_square):
        piece = board.piece_at(start_square)
        if not piece:
            return False

        # Check if it's the correct player's turn
        if piece.color != board.turn:
            return False

        move = chess.Move(start_square, end_square)
        if move not in board.legal_moves:
            return False

        # Additional checks for pawns
        if piece.piece_type == chess.PAWN:
            rank_diff = chess.square_rank(end_square) - chess.square_rank(start_square)
            file_diff = abs(chess.square_file(end_square) - chess.square_file(start_square))
            
            # Check direction
            if piece.color == chess.WHITE and rank_diff > 0:
                return False
            if piece.color == chess.BLACK and rank_diff < 0:
                return False
            
            # Check diagonal capture
            if file_diff == 1:
                return board.piece_at(end_square) is not None
            
            # Check forward movement
            if file_diff == 0:
                return board.piece_at(end_square) is None

        # Check if the move captures own piece
        if board.piece_at(end_square) and board.piece_at(end_square).color == piece.color:
            return False

        return True

    def evaluate_board(self, board):
        if board.is_checkmate():
            return -9999 if board.turn == chess.WHITE else 9999
        if board.is_stalemate() or board.is_insufficient_material():
            return 0
        
        score = 0
        for square in chess.SQUARES:
            piece = board.piece_at(square)
            if piece:
                value = self.piece_values[piece.piece_type]
                position_value = self.position_values[piece.piece_type][piece.color][square]
                score += value + position_value if piece.color == chess.WHITE else -(value + position_value)

        # Center control
        center_squares = [chess.D4, chess.E4, chess.D5, chess.E5]
        for square in center_squares:
            if board.piece_at(square):
                score += 10 if board.piece_at(square).color == chess.WHITE else -10

        # Mobility (simplified)
        score += (len(list(board.legal_moves)) - len(list(board.generate_pseudo_legal_moves()))) * 0.1

        # Consider check
        if board.is_check():
            score += 50 if board.turn == chess.BLACK else -50

        return score if board.turn == chess.WHITE else -score

    def order_moves(self, board):
        def move_value(move):
            if board.is_capture(move):
                return 10
            elif board.gives_check(move):
                return 5
            elif move.promotion:
                return 4
            else:
                return 0

        return sorted(board.legal_moves, key=move_value, reverse=True)

    def quiescence_search(self, board, alpha, beta, depth=3):
        stand_pat = self.evaluate_board(board)
        if depth == 0:
            return stand_pat
        
        if stand_pat >= beta:
            return beta
        if alpha < stand_pat:
            alpha = stand_pat

        for move in self.order_moves(board):
            if board.is_capture(move):
                board.push(move)
                score = -self.quiescence_search(board, -beta, -alpha, depth - 1)
                board.pop()

                if score >= beta:
                    return beta
                if score > alpha:
                    alpha = score
        
        return alpha

    def minimax(self, board, depth, alpha, beta, maximizing_player):
        if depth == 0 or board.is_game_over():
            return self.quiescence_search(board, alpha, beta)

        if maximizing_player:
            max_eval = float('-inf')
            for move in self.order_moves(board):
                board.push(move)
                eval = self.minimax(board, depth - 1, alpha, beta, False)
                board.pop()
                max_eval = max(max_eval, eval)
                alpha = max(alpha, eval)
                if beta <= alpha:
                    break
            return max_eval
        else:
            min_eval = float('inf')
            for move in self.order_moves(board):
                board.push(move)
                eval = self.minimax(board, depth - 1, alpha, beta, True)
                board.pop()
                min_eval = min(min_eval, eval)
                beta = min(beta, eval)
                if beta <= alpha:
                    break
            return min_eval

    def choose_move(self, board):
        board.turn = chess.BLACK  # Ensure the board is always set to black's turn

        best_moves = []
        best_eval = float('inf')  # We want the minimum score for black
        
        legal_moves = list(self.order_moves(board))
        print(f"Legal moves: {[board.san(move) for move in legal_moves]}")

        if not legal_moves:
            print("No legal moves available")
            return None

        for move in legal_moves:
            if board.piece_at(move.to_square) and board.piece_at(move.to_square).color == board.turn:
                print(f"Skipping move {board.san(move)} because it captures own piece.")
                continue

            if self.is_valid_move(board, move.from_square, move.to_square):
                board.push(move)
                eval = self.minimax(board, self.depth - 1, float('-inf'), float('inf'), False)
                board.pop()
                
                print(f"Evaluating move: {board.san(move)}, Eval: {eval}")

                if eval < best_eval:
                    best_eval = eval
                    best_moves = [move]
                elif eval == best_eval:
                    best_moves.append(move)

        if best_moves:
            chosen_move = random.choice(best_moves)
            print(f"Chosen move: {board.san(chosen_move)} with eval: {best_eval}")
            return chosen_move
        else:
            print("No valid moves found")
            return None

    def update_board(self, board_state):
        self.board = chess.Board(board_state)
        self.board.turn = chess.BLACK  # Ensure it's black's turn

# You can keep your test code here if needed
if __name__ == "__main__":
    board = chess.Board()
    ai = ChessAI(depth=3)

    # Make a series of moves
    for _ in range(5):
        ai.update_board(board.fen())
        move = ai.choose_move(board)
        if move:
            print(f"AI chooses move: {board.san(move)}")
            board.push(move)
            print(board)
            print("\n")
        else:
            print("AI couldn't choose a move")
            break






