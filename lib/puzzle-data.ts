import type { GameState } from "./chess-logic"
import { ChessLogic } from "./chess-logic"

interface PuzzleInfo {
  id: string
  fen: string
  moves: string[]
  rating: number
  themes: string[]
  description: string
  gameUrl: string
  difficultyLevel: string
}

export class PuzzleData {
  private static puzzles: PuzzleInfo[] = [
    // Rookie Level (1-3)
    {
      id: "1",
      fen: "r6r/1bp2ppp/p1n5/1p2p3/4P1q1/2N2N2/PPP2PPP/R1BQK2R w KQ - 0 10",
      moves: ["f3h4", "g4h4"],
      rating: 820,
      themes: ["hangingPiece", "mate", "mateIn1", "middlegame", "oneMove"],
      description: "Rookie Level - White to move - Capture the hanging queen!",
      gameUrl: "https://lichess.org/training",
      difficultyLevel: "Rookie",
    },
    {
      id: "2",
      fen: "r4rk1/pp3ppp/3b4/2p1pPB1/7N/2PP3n/PP4PP/R2Q1RqK w - - 5 18",
      moves: ["f1g1", "h3f2"],
      rating: 842,
      themes: ["mate", "mateIn1", "middlegame", "oneMove", "smotheredMate"],
      description: "Rookie Level - White to move - Smothered mate pattern!",
      gameUrl: "https://lichess.org/d04UP3XD#35",
      difficultyLevel: "Rookie",
    },
    {
      id: "3",
      fen: "8/2p1k3/6p1/1p1P1p2/1P3P2/3K2Pp/7P/8 b - - 1 43",
      moves: ["e7d6", "d3d4", "g6g5", "f4g5"],
      rating: 892,
      themes: ["crushing", "endgame", "pawnEndgame", "short", "zugzwang"],
      description: "Rookie Level - Black to move - Pawn endgame zugzwang!",
      gameUrl: "https://lichess.org/BAY91mF3/black#86",
      difficultyLevel: "Rookie",
    },

    // Easy Level (4-6)
    {
      id: "4",
      fen: "r2qr1k1/b1p2ppp/pp4n1/P1P1p3/4P1n1/B2P2Pb/3NBP1P/RN1QR1K1 b - - 1 16",
      moves: ["b6c5", "e2g4", "h3g4", "d1g4"],
      rating: 1080,
      themes: ["advantage", "middlegame", "short"],
      description: "Easy Level - Black to move - Win material with tactical sequence!",
      gameUrl: "https://lichess.org/4MWQCxQ6/black#32",
      difficultyLevel: "Easy",
    },
    {
      id: "5",
      fen: "3R4/8/K7/pB2b3/1p6/1P2k3/3p4/8 w - - 4 58",
      moves: ["a6a5", "e5c7", "a5b4", "c7d8"],
      rating: 1110,
      themes: ["crushing", "endgame", "fork", "master", "short"],
      description: "Easy Level - White to move - King and bishop fork!",
      gameUrl: "https://lichess.org/tzeeBEc2#115",
      difficultyLevel: "Easy",
    },
    {
      id: "6",
      fen: "4r1k1/5ppp/r1p5/p1n1RP2/8/2P2N1P/2P3P1/3R2K1 b - - 0 21",
      moves: ["e8e5", "d1d8", "e5e8", "d8e8"],
      rating: 1120,
      themes: ["backRankMate", "endgame", "mate", "mateIn2", "short"],
      description: "Easy Level - Black to move - Back rank mate in 2!",
      gameUrl: "https://lichess.org/84RH3LaP/black#42",
      difficultyLevel: "Easy",
    },

    // Mid Level (7-9)
    {
      id: "7",
      fen: "8/4R3/1p2P3/p4r2/P6p/1P3Pk1/4K3/8 w - - 1 64",
      moves: ["e7f7", "f5e5", "e2f1", "e5e6"],
      rating: 1333,
      themes: ["advantage", "endgame", "rookEndgame", "short"],
      description: "Mid Level - White to move - Rook endgame technique!",
      gameUrl: "https://lichess.org/MQSyb3KW#127",
      difficultyLevel: "Mid",
    },
    {
      id: "8",
      fen: "4r3/1k6/pp3r2/1b2P2p/3R1p2/P1R2P2/1P4PP/6K1 w - - 0 35",
      moves: ["e5f6", "e8e1", "g1f2", "e1f1"],
      rating: 1353,
      themes: ["endgame", "mate", "mateIn2", "short"],
      description: "Mid Level - White to move - Mate in 2 with rooks!",
      gameUrl: "https://lichess.org/n8Ff742v#69",
      difficultyLevel: "Mid",
    },
    {
      id: "9",
      fen: "8/8/4k1p1/2KpP2p/5PP1/8/8/8 w - - 0 53",
      moves: ["g4h5", "g6h5", "f4f5", "e6e5", "f5f6", "e5f6"],
      rating: 1575,
      themes: ["crushing", "endgame", "long", "pawnEndgame"],
      description: "Mid Level - White to move - Complex pawn breakthrough!",
      gameUrl: "https://lichess.org/l6AejDMO#105",
      difficultyLevel: "Mid",
    },

    // Hard Level (10-13)
    {
      id: "10",
      fen: "5rk1/1p3ppp/pq3b2/8/8/1P1Q1N2/P4PPP/3R2K1 w - - 2 27",
      moves: ["d3d6", "f8d8", "d6d8", "f6d8"],
      rating: 1615,
      themes: ["advantage", "endgame", "short"],
      description: "Hard Level - White to move - Exchange to winning endgame!",
      gameUrl: "https://lichess.org/F8M8OS71#53",
      difficultyLevel: "Hard",
    },
    {
      id: "11",
      fen: "1qr2rk1/pb2bppp/8/8/2p1N3/P1Bn2P1/2Q2PBP/1R3RK1 b - - 3 23",
      moves: ["b8c7", "b1b7", "c7b7", "e4f6", "e7f6", "g2b7"],
      rating: 1656,
      themes: ["crushing", "discoveredAttack", "long", "master", "middlegame", "sacrifice"],
      description: "Hard Level - Black to move - Discovered attack combination!",
      gameUrl: "https://lichess.org/KZRiN695/black#46",
      difficultyLevel: "Hard",
    },
    {
      id: "12",
      fen: "r2q1rk1/5ppp/1np5/p1b5/2p1B3/P7/1P3PPP/R1BQ1RK1 b - - 1 17",
      moves: ["d8f6", "d1h5", "h7h6", "h5c5"],
      rating: 1717,
      themes: ["advantage", "middlegame", "short"],
      description: "Hard Level - Black to move - Queen maneuver for advantage!",
      gameUrl: "https://lichess.org/jcuxlI63/black#34",
      difficultyLevel: "Hard",
    },
    {
      id: "13",
      fen: "r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24",
      moves: ["f2g3", "e6e7", "b2b1", "b3c1", "b1c1", "h6c1"],
      rating: 1798,
      themes: ["crushing", "hangingPiece", "long", "middlegame"],
      description: "Hard Level - Black to move - Complex tactical sequence!",
      gameUrl: "https://lichess.org/787zsVup/black#48",
      difficultyLevel: "Hard",
    },

    // Extreme Hard Level (14-17)
    {
      id: "14",
      fen: "5r1k/5rp1/p7/1b2B2p/1P1P1Pq1/2R1Q3/P3p1P1/2R3K1 w - - 0 41",
      moves: ["e3g3", "f7f4", "e5f4", "f8f4"],
      rating: 1941,
      themes: ["crushing", "middlegame", "short"],
      description: "Extreme Hard - White to move - Precise calculation required!",
      gameUrl: "https://lichess.org/8sVpuwso#81",
      difficultyLevel: "Extreme Hard",
    },
    {
      id: "15",
      fen: "8/7R/8/5p2/4bk1P/8/2r2K2/6R1 w - - 7 51",
      moves: ["f2f1", "f4f3", "f1e1", "c2c1", "e1d2", "c1g1"],
      rating: 1982,
      themes: ["crushing", "endgame", "exposedKing", "long", "skewer"],
      description: "Extreme Hard - White to move - Rook endgame with skewer!",
      gameUrl: "https://lichess.org/r4xUR6fC#101",
      difficultyLevel: "Extreme Hard",
    },
    {
      id: "16",
      fen: "6k1/5p2/4p3/P1B5/2P4P/4Pnp1/Rb1rN3/5K2 b - - 1 33",
      moves: ["d2e2", "f1e2", "g3g2", "e3e4", "f3d4", "e2f2"],
      rating: 2060,
      themes: ["crushing", "endgame", "hangingPiece", "long", "quietMove"],
      description: "Extreme Hard - Black to move - Quiet move wins!",
      gameUrl: "https://lichess.org/Epr0AiEh/black#66",
      difficultyLevel: "Extreme Hard",
    },
    {
      id: "17",
      fen: "2r3k1/p1q2pp1/Q3p2p/b1Np4/2nP1P2/4P1P1/5K1P/2B1N3 b - - 3 33",
      moves: ["c7b6", "a6c8", "g8h7", "c8b7"],
      rating: 2175,
      themes: ["advantage", "hangingPiece", "middlegame", "short"],
      description: "Extreme Hard - Black to move - Find the hanging piece!",
      gameUrl: "https://lichess.org/BBn6ipaK/black#66",
      difficultyLevel: "Extreme Hard",
    },

    // Master Level (18-20)
    {
      id: "18",
      fen: "6k1/pp1r1pp1/1qp1p2p/4P2P/5Q2/1P4R1/P1Pr1PP1/R5K1 b - - 4 23",
      moves: ["b6d4", "f4f6", "d4f2", "f6f2", "d2f2", "g1f2"],
      rating: 2389,
      themes: ["advantage", "endgame", "long", "pin"],
      description: "Master Level - Black to move - Pin and exchange sequence!",
      gameUrl: "https://lichess.org/tUkE0z1z/black#46",
      difficultyLevel: "Master",
    },
    {
      id: "19",
      fen: "2kr3r/pp3p2/4p2p/1N1p2p1/3Q4/1P1P4/2q2PPP/5RK1 b - - 1 20",
      moves: ["b7b6", "d4a1", "a7a5", "f1c1"],
      rating: 2653,
      themes: ["advantage", "endgame", "pin", "short"],
      description: "Master Level - Black to move - Advanced pin technique!",
      gameUrl: "https://lichess.org/H1ARO2GL/black#40",
      difficultyLevel: "Master",
    },
    {
      id: "20",
      fen: "r4r2/1p3pkp/p5p1/3R1N1Q/3P4/8/P1q2P2/3R2K1 b - - 3 25",
      moves: ["g6f5", "d5c5", "c2e4", "h5g5", "g7h8", "g5f6"],
      rating: 2847,
      themes: ["crushing", "endgame", "long"],
      description: "Master Level - Black to move - Master-level calculation!",
      gameUrl: "https://lichess.org/e9AY2m5j/black#50",
      difficultyLevel: "Master",
    },
  ]

  static getPuzzle(puzzleId: number): GameState {
    const puzzle = this.puzzles[puzzleId - 1]
    if (!puzzle) {
      return ChessLogic.getInitialState()
    }

    return ChessLogic.fenToBoard(puzzle.fen)
  }

  static getPuzzleRating(puzzleId: number): number {
    const puzzle = this.puzzles[puzzleId - 1]
    return puzzle?.rating || 1000
  }

  static getPuzzleTheme(puzzleId: number): string {
    const puzzle = this.puzzles[puzzleId - 1]
    return puzzle?.themes[0] || "tactics"
  }

  static getPuzzleThemes(puzzleId: number): string[] {
    const puzzle = this.puzzles[puzzleId - 1]
    return puzzle?.themes || ["tactics"]
  }

  static getPuzzleDescription(puzzleId: number): string {
    const puzzle = this.puzzles[puzzleId - 1]
    return puzzle?.description || "Find the best move!"
  }

  static getPuzzleSolution(puzzleId: number): string[] {
    const puzzle = this.puzzles[puzzleId - 1]
    return puzzle?.moves || []
  }

  static getHint(puzzleId: number, gameState: GameState, moveCount: number): string {
    const puzzle = this.puzzles[puzzleId - 1]
    if (!puzzle) return "Look for the best move"

    const themes = puzzle.themes
    const isWhiteToMove = gameState.currentPlayer === "white"
    const totalMoves = puzzle.moves.length
    const moveDepth = Math.ceil(totalMoves / 2)
    const difficultyLevel = puzzle.difficultyLevel

    // Generate hints based on themes and position
    if (themes.includes("mateIn1") || themes.includes("oneMove")) {
      if (moveCount === 0) {
        return "You can deliver checkmate in just one move! Look for a decisive attack."
      } else {
        return "Find the checkmate - it's just one move away!"
      }
    }

    if (themes.includes("mateIn2")) {
      if (moveCount === 0) {
        return "You can force checkmate in two moves. Find the first forcing move!"
      } else if (moveCount === 1) {
        return "Now find the checkmate move to finish the puzzle!"
      }
    }

    if (themes.includes("smotheredMate")) {
      return "Look for a smothered mate pattern - the king will be trapped by its own pieces!"
    }

    if (themes.includes("bodenMate")) {
      return "This is a Boden's mate pattern - two bishops on diagonals can be deadly!"
    }

    if (themes.includes("backRankMate")) {
      if (moveCount === 0) {
        return "The enemy king is vulnerable on the back rank. Exploit this weakness!"
      } else {
        return "Continue the attack on the back rank!"
      }
    }

    if (themes.includes("fork")) {
      return "Look for a move that attacks multiple pieces at once!"
    }

    if (themes.includes("pin")) {
      return "Find a way to pin an enemy piece to something valuable!"
    }

    if (themes.includes("skewer")) {
      return "Look for a skewer - attack a valuable piece that must move, exposing another!"
    }

    if (themes.includes("discoveredAttack")) {
      return "A discovered attack is possible - move one piece to reveal an attack from another!"
    }

    if (themes.includes("sacrifice")) {
      if (moveCount === 0) {
        return "Look for a sacrifice that leads to a strong advantage!"
      } else if (moveCount === 1) {
        return "After the sacrifice, find the follow-up that justifies it!"
      } else {
        return "Continue the combination by finding the strongest move!"
      }
    }

    if (themes.includes("hangingPiece")) {
      return "There's an undefended piece that can be captured!"
    }

    if (themes.includes("zugzwang")) {
      return "Put your opponent in zugzwang - any move they make will worsen their position!"
    }

    if (themes.includes("pawnEndgame")) {
      return "This is a pawn endgame - look for breakthrough moves or king activity!"
    }

    if (themes.includes("rookEndgame")) {
      return "In rook endgames, activity is key - look for active rook moves!"
    }

    if (themes.includes("exposedKing")) {
      return "The enemy king is exposed - find a way to exploit its vulnerability!"
    }

    if (themes.includes("quietMove")) {
      return "Sometimes the best move is a quiet one - not all tactics involve captures or checks!"
    }

    // Hints based on difficulty level
    if (difficultyLevel === "Rookie") {
      return "This is a beginner puzzle. Look for simple tactics like checks, captures, or mate in one."
    } else if (difficultyLevel === "Easy") {
      return "Look for basic tactical patterns like forks, pins, or simple combinations."
    } else if (difficultyLevel === "Mid") {
      return "This requires intermediate calculation. Consider forcing moves and their consequences."
    } else if (difficultyLevel === "Hard") {
      return "This is a challenging puzzle. Look for complex combinations and deep calculation."
    } else if (difficultyLevel === "Extreme Hard") {
      return "This requires expert-level calculation. Consider quiet moves and long-term advantages."
    } else if (difficultyLevel === "Master") {
      return "This is a master-level puzzle. Deep calculation and precise evaluation are required."
    }

    // Default hints based on move count and puzzle rating
    if (puzzle.rating < 1000) {
      return "This is an easy puzzle. Look for checks, captures, or immediate threats."
    } else if (puzzle.rating < 1500) {
      return "This is a medium difficulty puzzle. Look for tactical motifs like forks, pins or sacrifices."
    } else if (puzzle.rating < 2000) {
      return "This is a challenging puzzle. Consider sacrifices and long-term positional advantages."
    } else {
      return "This is a master-level puzzle requiring deep calculation and precise evaluation."
    }
  }

  static parseMove(moveStr: string): { from: { row: number; col: number }; to: { row: number; col: number } } | null {
    // Parse algebraic notation like "e2e4" or "f5d3"
    if (moveStr.length < 4) return null

    const fromFile = moveStr.charCodeAt(0) - 97 // a=0, b=1, etc.
    const fromRank = Number.parseInt(moveStr.charAt(1)) - 1 // 1=0, 2=1, etc. (but we need to flip)
    const toFile = moveStr.charCodeAt(2) - 97
    const toRank = Number.parseInt(moveStr.charAt(3)) - 1

    // Convert to our coordinate system (row 0 = rank 8)
    const fromRow = 8 - Number.parseInt(moveStr.charAt(1))
    const fromCol = fromFile
    const toRow = 8 - Number.parseInt(moveStr.charAt(3))
    const toCol = toFile

    if (fromRow < 0 || fromRow > 7 || fromCol < 0 || fromCol > 7 || toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
      return null
    }

    return {
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
    }
  }

  static checkSolution(
    puzzleId: number,
    gameState: GameState,
    playerMoves: string[],
  ): {
    isCorrect: boolean
    isComplete: boolean
    nextExpectedMove: string | null
    message: string
  } {
    const puzzle = this.puzzles[puzzleId - 1]
    if (!puzzle) {
      return { isCorrect: false, isComplete: false, nextExpectedMove: null, message: "Puzzle not found" }
    }

    const expectedMoves = puzzle.moves
    const currentMoveIndex = playerMoves.length

    if (currentMoveIndex >= expectedMoves.length) {
      return { isCorrect: true, isComplete: true, nextExpectedMove: null, message: "Puzzle solved!" }
    }

    const lastPlayerMove = playerMoves[playerMoves.length - 1]
    const expectedMove = expectedMoves[currentMoveIndex - 1]

    if (lastPlayerMove && lastPlayerMove !== expectedMove) {
      return {
        isCorrect: false,
        isComplete: false,
        nextExpectedMove: expectedMoves[0],
        message: "Wrong move! Try again.",
      }
    }

    const nextExpectedMove = expectedMoves[currentMoveIndex]
    const isComplete = currentMoveIndex >= expectedMoves.length

    return {
      isCorrect: true,
      isComplete,
      nextExpectedMove,
      message: isComplete ? "Puzzle solved!" : "Correct! Continue...",
    }
  }

  static getTotalPuzzles(): number {
    return this.puzzles.length
  }

  static getPuzzleGameUrl(puzzleId: number): string {
    const puzzle = this.puzzles[puzzleId - 1]
    return puzzle?.gameUrl || ""
  }

  static getPuzzleMoveCount(puzzleId: number): number {
    const puzzle = this.puzzles[puzzleId - 1]
    if (!puzzle) return 0
    return Math.ceil(puzzle.moves.length / 2) // Convert to full moves (1 full move = white+black)
  }

  static getPuzzleDifficulty(puzzleId: number): string {
    const puzzle = this.puzzles[puzzleId - 1]
    return puzzle?.difficultyLevel || "Unknown"
  }

  static getPuzzlesByDifficulty(difficulty: string): number[] {
    return this.puzzles
      .map((puzzle, index) => ({ puzzle, index: index + 1 }))
      .filter(({ puzzle }) => puzzle.difficultyLevel === difficulty)
      .map(({ index }) => index)
  }

  static getDifficultyLevels(): string[] {
    return ["Rookie", "Easy", "Mid", "Hard", "Extreme Hard", "Master"]
  }
}
