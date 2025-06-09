export type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn"
export type PieceColor = "white" | "black"

export interface Piece {
  type: PieceType
  color: PieceColor
  hasMoved?: boolean
}

export interface Position {
  row: number
  col: number
}

export interface GameState {
  board: (Piece | null)[][]
  currentPlayer: PieceColor
  capturedPieces: {
    white: Piece[]
    black: Piece[]
  }
  moveHistory: { from: Position; to: Position; piece: Piece; captured?: Piece }[]
}

export class ChessLogic {
  static getInitialState(): GameState {
    const board: (Piece | null)[][] = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))

    // Set up initial chess position
    const backRank: PieceType[] = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]

    // Black pieces
    for (let col = 0; col < 8; col++) {
      board[0][col] = { type: backRank[col], color: "black" }
      board[1][col] = { type: "pawn", color: "black" }
    }

    // White pieces
    for (let col = 0; col < 8; col++) {
      board[7][col] = { type: backRank[col], color: "white" }
      board[6][col] = { type: "pawn", color: "white" }
    }

    return {
      board,
      currentPlayer: "white",
      capturedPieces: { white: [], black: [] },
      moveHistory: [],
    }
  }

  static isValidPosition(row: number, col: number, boardSize = 8): boolean {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize
  }

  static getPieceAt(board: (Piece | null)[][], position: Position): Piece | null {
    return board[position.row]?.[position.col] || null
  }

  static getValidMoves(gameState: GameState, position: Position): Position[] {
    const piece = this.getPieceAt(gameState.board, position)
    if (!piece || piece.color !== gameState.currentPlayer) return []

    // Get all possible moves without check validation first
    const possibleMoves = this.getPossibleMoves(gameState, position)

    // Filter out moves that would put own king in check
    return possibleMoves.filter((move) => {
      // Create a temporary board state to test the move
      const newBoard = gameState.board.map((row) => [...row])
      const capturedPiece = this.getPieceAt(newBoard, move)

      // Make the move on the temporary board
      newBoard[move.row][move.col] = piece
      newBoard[position.row][position.col] = null

      // Create temporary game state
      const tempState: GameState = {
        ...gameState,
        board: newBoard,
      }

      // Check if this move would put own king in check
      return !this.isInCheck(tempState, piece.color)
    })
  }

  static getPossibleMoves(gameState: GameState, position: Position): Position[] {
    const piece = this.getPieceAt(gameState.board, position)
    if (!piece) return []

    switch (piece.type) {
      case "pawn":
        return this.getPawnMoves(gameState, position)
      case "rook":
        return this.getRookMoves(gameState, position)
      case "bishop":
        return this.getBishopMoves(gameState, position)
      case "queen":
        return [...this.getRookMoves(gameState, position), ...this.getBishopMoves(gameState, position)]
      case "knight":
        return this.getKnightMoves(gameState, position)
      case "king":
        return this.getKingMoves(gameState, position)
      default:
        return []
    }
  }

  static getPawnMoves(gameState: GameState, position: Position): Position[] {
    const moves: Position[] = []
    const piece = this.getPieceAt(gameState.board, position)
    if (!piece) return moves

    const { row, col } = position
    const direction = piece.color === "white" ? -1 : 1
    const startRow = piece.color === "white" ? 6 : 1
    const boardSize = gameState.board.length

    // Forward move
    const newRow = row + direction
    if (this.isValidPosition(newRow, col, boardSize) && !this.getPieceAt(gameState.board, { row: newRow, col })) {
      moves.push({ row: newRow, col })

      // Double move from starting position
      if (row === startRow) {
        const doubleRow = row + 2 * direction
        if (
          this.isValidPosition(doubleRow, col, boardSize) &&
          !this.getPieceAt(gameState.board, { row: doubleRow, col }) &&
          !this.getPieceAt(gameState.board, { row: newRow, col }) // Ensure no piece in between
        ) {
          moves.push({ row: doubleRow, col })
        }
      }
    }

    // Captures
    for (const captureCol of [col - 1, col + 1]) {
      if (this.isValidPosition(newRow, captureCol, boardSize)) {
        const target = this.getPieceAt(gameState.board, { row: newRow, col: captureCol })
        if (target && target.color !== piece.color) {
          moves.push({ row: newRow, col: captureCol })
        }
      }
    }

    return moves
  }

  static getRookMoves(gameState: GameState, position: Position): Position[] {
    const moves: Position[] = []
    const piece = this.getPieceAt(gameState.board, position)
    if (!piece) return moves

    const directions = [
      [0, 1], // right
      [0, -1], // left
      [1, 0], // down
      [-1, 0], // up
    ]
    const boardSize = gameState.board.length

    for (const [dRow, dCol] of directions) {
      for (let i = 1; i < boardSize; i++) {
        const newRow = position.row + dRow * i
        const newCol = position.col + dCol * i

        if (!this.isValidPosition(newRow, newCol, boardSize)) break

        const target = this.getPieceAt(gameState.board, { row: newRow, col: newCol })
        if (!target) {
          moves.push({ row: newRow, col: newCol })
        } else {
          // Can capture opponent's piece but can't move through it
          if (target.color !== piece.color) {
            moves.push({ row: newRow, col: newCol })
          }
          break // Stop in this direction after encountering any piece
        }
      }
    }

    return moves
  }

  static getBishopMoves(gameState: GameState, position: Position): Position[] {
    const moves: Position[] = []
    const piece = this.getPieceAt(gameState.board, position)
    if (!piece) return moves

    const directions = [
      [1, 1], // down-right
      [1, -1], // down-left
      [-1, 1], // up-right
      [-1, -1], // up-left
    ]
    const boardSize = gameState.board.length

    for (const [dRow, dCol] of directions) {
      for (let i = 1; i < boardSize; i++) {
        const newRow = position.row + dRow * i
        const newCol = position.col + dCol * i

        if (!this.isValidPosition(newRow, newCol, boardSize)) break

        const target = this.getPieceAt(gameState.board, { row: newRow, col: newCol })
        if (!target) {
          moves.push({ row: newRow, col: newCol })
        } else {
          // Can capture opponent's piece but can't move through it
          if (target.color !== piece.color) {
            moves.push({ row: newRow, col: newCol })
          }
          break // Stop in this direction after encountering any piece
        }
      }
    }

    return moves
  }

  static getKnightMoves(gameState: GameState, position: Position): Position[] {
    const moves: Position[] = []
    const piece = this.getPieceAt(gameState.board, position)
    if (!piece) return moves

    const knightMoves = [
      [-2, -1], // 2 up, 1 left
      [-2, 1], // 2 up, 1 right
      [-1, -2], // 1 up, 2 left
      [-1, 2], // 1 up, 2 right
      [1, -2], // 1 down, 2 left
      [1, 2], // 1 down, 2 right
      [2, -1], // 2 down, 1 left
      [2, 1], // 2 down, 1 right
    ]
    const boardSize = gameState.board.length

    for (const [dRow, dCol] of knightMoves) {
      const newRow = position.row + dRow
      const newCol = position.col + dCol

      if (this.isValidPosition(newRow, newCol, boardSize)) {
        const target = this.getPieceAt(gameState.board, { row: newRow, col: newCol })
        // Knight can jump over pieces, so we only check the destination
        if (!target || target.color !== piece.color) {
          moves.push({ row: newRow, col: newCol })
        }
      }
    }

    return moves
  }

  static getKingMoves(gameState: GameState, position: Position): Position[] {
    const moves: Position[] = []
    const piece = this.getPieceAt(gameState.board, position)
    if (!piece) return moves

    const directions = [
      [-1, -1], // up-left
      [-1, 0], // up
      [-1, 1], // up-right
      [0, -1], // left
      [0, 1], // right
      [1, -1], // down-left
      [1, 0], // down
      [1, 1], // down-right
    ]
    const boardSize = gameState.board.length

    for (const [dRow, dCol] of directions) {
      const newRow = position.row + dRow
      const newCol = position.col + dCol

      if (this.isValidPosition(newRow, newCol, boardSize)) {
        const target = this.getPieceAt(gameState.board, { row: newRow, col: newCol })
        if (!target || target.color !== piece.color) {
          moves.push({ row: newRow, col: newCol })
        }
      }
    }

    // TODO: Add castling logic here if needed

    return moves
  }

  static makeMove(gameState: GameState, from: Position, to: Position): GameState | null {
    const piece = this.getPieceAt(gameState.board, from)
    if (!piece || piece.color !== gameState.currentPlayer) return null

    // Check if the move is valid
    const validMoves = this.getValidMoves(gameState, from)
    if (!validMoves.some((move) => move.row === to.row && move.col === to.col)) {
      return null
    }

    const newBoard = gameState.board.map((row) => [...row])
    const capturedPiece = this.getPieceAt(newBoard, to)

    // Make the move
    newBoard[to.row][to.col] = { ...piece, hasMoved: true }
    newBoard[from.row][from.col] = null

    // Create new game state
    const newGameState: GameState = {
      board: newBoard,
      currentPlayer: gameState.currentPlayer === "white" ? "black" : "white",
      capturedPieces: {
        white: [...gameState.capturedPieces.white],
        black: [...gameState.capturedPieces.black],
      },
      moveHistory: [...gameState.moveHistory, { from, to, piece, captured: capturedPiece || undefined }],
    }

    // Add captured piece to the correct array
    if (capturedPiece) {
      if (capturedPiece.color === "white") {
        newGameState.capturedPieces.black.push(capturedPiece)
      } else {
        newGameState.capturedPieces.white.push(capturedPiece)
      }
    }

    return newGameState
  }

  static findKing(board: (Piece | null)[][], color: PieceColor): Position | null {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col]
        if (piece && piece.type === "king" && piece.color === color) {
          return { row, col }
        }
      }
    }
    return null
  }

  static isInCheck(gameState: GameState, color: PieceColor): boolean {
    const kingPos = this.findKing(gameState.board, color)
    if (!kingPos) return false

    // Check if any opponent piece can attack the king
    for (let row = 0; row < gameState.board.length; row++) {
      for (let col = 0; col < gameState.board[row].length; col++) {
        const piece = gameState.board[row][col]
        if (piece && piece.color !== color) {
          // Use getPossibleMoves to avoid infinite recursion
          const moves = this.getPossibleMoves(gameState, { row, col })
          if (moves.some((move) => move.row === kingPos.row && move.col === kingPos.col)) {
            return true
          }
        }
      }
    }

    return false
  }

  static isCheckmate(gameState: GameState, color: PieceColor): boolean {
    if (!this.isInCheck(gameState, color)) return false

    // Check if any move can get out of check
    for (let row = 0; row < gameState.board.length; row++) {
      for (let col = 0; col < gameState.board[row].length; col++) {
        const piece = gameState.board[row][col]
        if (piece && piece.color === color) {
          const moves = this.getValidMoves(gameState, { row, col })
          if (moves.length > 0) return false
        }
      }
    }

    return true
  }

  static getAIMove(gameState: GameState): { from: Position; to: Position } | null {
    // Simple AI: find all valid moves and pick one randomly
    const allMoves: { from: Position; to: Position }[] = []

    for (let row = 0; row < gameState.board.length; row++) {
      for (let col = 0; col < gameState.board[row].length; col++) {
        const piece = gameState.board[row][col]
        if (piece && piece.color === gameState.currentPlayer) {
          const moves = this.getValidMoves(gameState, { row, col })
          for (const move of moves) {
            allMoves.push({ from: { row, col }, to: move })
          }
        }
      }
    }

    if (allMoves.length === 0) return null

    // Prioritize captures and checks
    const captures = allMoves.filter((move) => this.getPieceAt(gameState.board, move.to) !== null)

    const checks = allMoves.filter((move) => {
      const testState = this.makeMove(gameState, move.from, move.to)
      return testState && this.isInCheck(testState, testState.currentPlayer)
    })

    if (checks.length > 0) {
      return checks[Math.floor(Math.random() * checks.length)]
    }

    if (captures.length > 0) {
      return captures[Math.floor(Math.random() * captures.length)]
    }

    return allMoves[Math.floor(Math.random() * allMoves.length)]
  }

  // Simple coordinate notation: "e2e4"
  static getMoveNotation(gameState: GameState, from: Position, to: Position): string {
    const fromFile = String.fromCharCode(97 + from.col)
    const fromRank = 8 - from.row
    const toFile = String.fromCharCode(97 + to.col)
    const toRank = 8 - to.row

    return `${fromFile}${fromRank}${toFile}${toRank}`
  }

  static parseNotation(notation: string): [Position, Position] | [null, null] {
    // Parse simple coordinate notation like "e2e4"
    if (notation.length >= 4) {
      const fromFile = notation.charCodeAt(0) - 97
      const fromRank = Number.parseInt(notation.charAt(1))
      const toFile = notation.charCodeAt(2) - 97
      const toRank = Number.parseInt(notation.charAt(3))

      if (
        fromFile >= 0 &&
        fromFile < 8 &&
        fromRank >= 1 &&
        fromRank <= 8 &&
        toFile >= 0 &&
        toFile < 8 &&
        toRank >= 1 &&
        toRank <= 8
      ) {
        return [
          { row: 8 - fromRank, col: fromFile },
          { row: 8 - toRank, col: toFile },
        ]
      }
    }
    return [null, null]
  }

  static boardToFEN(gameState: GameState): string {
    // Simplified FEN generation - just the board position
    let fen = ""

    for (let row = 0; row < 8; row++) {
      let emptyCount = 0

      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col]

        if (!piece) {
          emptyCount++
        } else {
          if (emptyCount > 0) {
            fen += emptyCount.toString()
            emptyCount = 0
          }

          let pieceChar = piece.type.charAt(0)
          if (piece.type === "knight") pieceChar = "n"

          fen += piece.color === "white" ? pieceChar.toUpperCase() : pieceChar.toLowerCase()
        }
      }

      if (emptyCount > 0) {
        fen += emptyCount.toString()
      }

      if (row < 7) fen += "/"
    }

    // Add current player
    fen += ` ${gameState.currentPlayer.charAt(0)}`

    // Add castling rights (simplified)
    fen += " KQkq"

    // Add en passant (simplified)
    fen += " -"

    // Add halfmove and fullmove counters
    fen += " 0 1"

    return fen
  }

  static fenToBoard(fen: string): GameState {
    // Simplified FEN parsing - just parse the board position
    const parts = fen.split(" ")
    const boardPart = parts[0]
    const currentPlayer = parts[1] === "w" ? "white" : "black"

    const board: (Piece | null)[][] = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))

    const rows = boardPart.split("/")

    for (let row = 0; row < 8; row++) {
      let col = 0
      const rowStr = rows[row]

      for (let i = 0; i < rowStr.length; i++) {
        const char = rowStr[i]

        if (char >= "1" && char <= "8") {
          // Empty squares
          col += Number.parseInt(char)
        } else {
          // Piece
          const isWhite = char === char.toUpperCase()
          const color: PieceColor = isWhite ? "white" : "black"

          let type: PieceType
          const lowerChar = char.toLowerCase()

          switch (lowerChar) {
            case "k":
              type = "king"
              break
            case "q":
              type = "queen"
              break
            case "r":
              type = "rook"
              break
            case "b":
              type = "bishop"
              break
            case "n":
              type = "knight"
              break
            case "p":
              type = "pawn"
              break
            default:
              continue
          }

          board[row][col] = { type, color }
          col++
        }
      }
    }

    return {
      board,
      currentPlayer,
      capturedPieces: { white: [], black: [] },
      moveHistory: [],
    }
  }
}
