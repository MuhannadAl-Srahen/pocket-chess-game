"use client"

import { useState, useCallback, useEffect } from "react"
import { ChessBoard } from "./chess-board"
import { GameStatus } from "./game-status"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, Lightbulb, ArrowLeftRight, ExternalLink } from "lucide-react"
import { ChessLogic, type GameState, type Position, type PieceColor } from "@/lib/chess-logic"
import { PuzzleData } from "@/lib/puzzle-data"
import { SoundManager } from "@/lib/sound-manager"
import { MoveHistory } from "./move-history"
import { CustomPuzzleManager } from "@/lib/custom-puzzle-manager"
import { UserStats } from "@/lib/user-stats"

interface ChessGameProps {
  mode: "puzzle" | "ai" | "multiplayer"
  puzzleId?: number | string
  onBack: () => void
  onPuzzleComplete: (puzzleId: number) => void
}

export function ChessGame({ mode, puzzleId, onBack, onPuzzleComplete }: ChessGameProps) {
  const [gameState, setGameState] = useState<GameState>(() => {
    if (mode === "puzzle" && puzzleId) {
      if (typeof puzzleId === "string" && puzzleId.startsWith("custom_")) {
        const customId = puzzleId.replace("custom_", "")
        const customPuzzle = CustomPuzzleManager.getPuzzle(customId)
        if (customPuzzle) {
          return ChessLogic.fenToBoard(customPuzzle.fen)
        }
      }
      return PuzzleData.getPuzzle(puzzleId as number)
    }
    return ChessLogic.getInitialState()
  })

  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [whiteMoves, setWhiteMoves] = useState(0)
  const [blackMoves, setBlackMoves] = useState(0)
  const [gameMessage, setGameMessage] = useState("")
  const [showVisualHint, setShowVisualHint] = useState(false)
  const [hintMove, setHintMove] = useState<{ from: Position; to: Position } | null>(null)
  const [puzzleCompleted, setPuzzleCompleted] = useState(false)
  const [puzzleFailed, setPuzzleFailed] = useState(false)
  const [boardOrientation, setBoardOrientation] = useState<PieceColor>("white")
  const [playerMoves, setPlayerMoves] = useState<string[]>([])
  const [initialGameState, setInitialGameState] = useState<GameState | null>(null)

  const soundManager = new SoundManager()

  useEffect(() => {
    if (mode === "puzzle" && puzzleId) {
      let puzzle: GameState

      if (typeof puzzleId === "string" && puzzleId.startsWith("custom_")) {
        const customId = puzzleId.replace("custom_", "")
        const customPuzzle = CustomPuzzleManager.getPuzzle(customId)
        if (customPuzzle) {
          puzzle = ChessLogic.fenToBoard(customPuzzle.fen)
        } else {
          puzzle = PuzzleData.getPuzzle(1)
        }
      } else {
        const numericId = typeof puzzleId === "string" ? Number.parseInt(puzzleId) : puzzleId
        puzzle = PuzzleData.getPuzzle(numericId)

        // Mark puzzle as attempted in stats
        if (typeof numericId === "number") {
          UserStats.markPuzzleAttempted(numericId)
        }
      }

      setGameState(puzzle)
      setInitialGameState(puzzle)
      setWhiteMoves(0)
      setBlackMoves(0)
      setPuzzleCompleted(false)
      setPuzzleFailed(false)
      setPlayerMoves([])
      setGameMessage(typeof puzzleId === "number" ? PuzzleData.getPuzzleDescription(puzzleId) : "Find the best move!")
    }
  }, [mode, puzzleId])

  const resetGame = useCallback(() => {
    if (initialGameState) {
      setGameState(initialGameState)
      setWhiteMoves(0)
      setBlackMoves(0)
      setPuzzleCompleted(false)
      setPuzzleFailed(false)
      setPlayerMoves([])
      setGameMessage(typeof puzzleId === "number" ? PuzzleData.getPuzzleDescription(puzzleId) : "Find the best move!")
    } else if (mode === "puzzle" && puzzleId) {
      let puzzle: GameState

      if (typeof puzzleId === "string" && puzzleId.startsWith("custom_")) {
        const customId = puzzleId.replace("custom_", "")
        const customPuzzle = CustomPuzzleManager.getPuzzle(customId)
        if (customPuzzle) {
          puzzle = ChessLogic.fenToBoard(customPuzzle.fen)
        } else {
          puzzle = PuzzleData.getPuzzle(1)
        }
      } else {
        const numericId = typeof puzzleId === "string" ? Number.parseInt(puzzleId) : puzzleId
        puzzle = PuzzleData.getPuzzle(numericId)

        // Mark puzzle as attempted in stats
        if (typeof numericId === "number") {
          UserStats.markPuzzleAttempted(numericId)
        }
      }

      setGameState(puzzle)
      setInitialGameState(puzzle)
      setWhiteMoves(0)
      setBlackMoves(0)
      setPuzzleCompleted(false)
      setPuzzleFailed(false)
      setPlayerMoves([])
      setGameMessage(typeof puzzleId === "number" ? PuzzleData.getPuzzleDescription(puzzleId) : "Find the best move!")
    } else {
      setGameState(ChessLogic.getInitialState())
      setWhiteMoves(0)
      setBlackMoves(0)
    }
    setSelectedSquare(null)
    setValidMoves([])
  }, [mode, puzzleId, initialGameState])

  const convertMoveToAlgebraic = (from: Position, to: Position): string => {
    const fromFile = String.fromCharCode(97 + from.col)
    const fromRank = (8 - from.row).toString()
    const toFile = String.fromCharCode(97 + to.col)
    const toRank = (8 - to.row).toString()
    return `${fromFile}${fromRank}${toFile}${toRank}`
  }

  const handleSquareClick = (position: Position) => {
    if (puzzleCompleted || puzzleFailed) return

    const piece = gameState.board[position.row][position.col]

    if (selectedSquare) {
      // Try to make a move
      if (validMoves.some((move) => move.row === position.row && move.col === position.col)) {
        const newGameState = ChessLogic.makeMove(gameState, selectedSquare, position)

        if (newGameState) {
          // Convert move to algebraic notation
          const moveNotation = convertMoveToAlgebraic(selectedSquare, position)
          const newPlayerMoves = [...playerMoves, moveNotation]
          setPlayerMoves(newPlayerMoves)

          // Update move counters
          if (gameState.currentPlayer === "white") {
            setWhiteMoves(whiteMoves + 1)
          } else {
            setBlackMoves(blackMoves + 1)
          }

          setGameState(newGameState)
          if (gameState.board[position.row][position.col]) {
            soundManager.playCapture() // For captures
          } else {
            soundManager.playMove() // For regular moves
          }

          // Check for checkmate
          const opponentColor = newGameState.currentPlayer === "white" ? "black" : "white"
          if (ChessLogic.isCheckmate(newGameState, opponentColor)) {
            soundManager.playCheckmate()
            setGameMessage(`Checkmate! ${newGameState.currentPlayer === "white" ? "Black" : "White"} wins!`)
          } else if (ChessLogic.isInCheck(newGameState, opponentColor)) {
            soundManager.playCheck()
            setGameMessage(`Check! ${opponentColor} king is in danger!`)
          }

          // Handle puzzle mode logic
          if (mode === "puzzle" && typeof puzzleId === "number") {
            const solutionCheck = PuzzleData.checkSolution(puzzleId, newGameState, newPlayerMoves)

            if (!solutionCheck.isCorrect) {
              soundManager.playError()
              setGameMessage(solutionCheck.message)
              setPuzzleFailed(true)
              setTimeout(() => {
                resetGame()
              }, 2000)
            } else if (solutionCheck.isComplete) {
              soundManager.playCheckmate()
              setGameMessage("🎉 Puzzle solved! Excellent work!")
              setPuzzleCompleted(true)
              onPuzzleComplete(puzzleId)

              // Mark puzzle as solved in stats
              UserStats.markPuzzleSolved(puzzleId)
            } else {
              setGameMessage("✓ Correct! Continue with the solution...")
              soundManager.playSuccess()

              // Auto-play opponent's response if it exists
              if (solutionCheck.nextExpectedMove) {
                setTimeout(() => {
                  const nextMove = PuzzleData.parseMove(solutionCheck.nextExpectedMove!)
                  if (nextMove) {
                    const responseState = ChessLogic.makeMove(newGameState, nextMove.from, nextMove.to)
                    if (responseState) {
                      setGameState(responseState)
                      setPlayerMoves([...newPlayerMoves, solutionCheck.nextExpectedMove!])
                      if (responseState.board[nextMove.to.row][nextMove.to.col]) {
                        soundManager.playCapture() // For captures
                      } else {
                        soundManager.playMove() // For regular moves
                      }

                      // Check if puzzle is now complete
                      const finalCheck = PuzzleData.checkSolution(puzzleId, responseState, [
                        ...newPlayerMoves,
                        solutionCheck.nextExpectedMove!,
                      ])
                      if (finalCheck.isComplete) {
                        soundManager.playCheckmate()
                        setGameMessage("🎉 Puzzle solved! Excellent work!")
                        setPuzzleCompleted(true)
                        onPuzzleComplete(puzzleId)

                        // Mark puzzle as solved in stats
                        UserStats.markPuzzleSolved(puzzleId)
                      } else {
                        setGameMessage("Your turn - find the next move!")
                      }
                    }
                  }
                }, 1000)
              }
            }
          }

          // AI move for AI mode
          if (mode === "ai" && newGameState.currentPlayer === "black" && !puzzleCompleted) {
            setTimeout(() => {
              const aiMove = ChessLogic.getAIMove(newGameState)
              if (aiMove) {
                const aiGameState = ChessLogic.makeMove(newGameState, aiMove.from, aiMove.to)
                if (aiGameState) {
                  setGameState(aiGameState)
                  setBlackMoves(blackMoves + 1)
                  if (aiGameState.board[aiMove.to.row][aiMove.to.col]) {
                    soundManager.playCapture() // For captures
                  } else {
                    soundManager.playMove() // For regular moves
                  }

                  if (ChessLogic.isCheckmate(aiGameState, "white")) {
                    soundManager.playCheckmate()
                    setGameMessage("Checkmate! AI won!")
                  } else if (ChessLogic.isInCheck(aiGameState, "white")) {
                    soundManager.playCheck()
                    setGameMessage("Check! Your king is in danger!")
                  }
                }
              }
            }, 500)
          }
        } else {
          soundManager.playError()
          setGameMessage("Invalid move! Try again.")
          setTimeout(() => setGameMessage(""), 2000)
        }
      }

      setSelectedSquare(null)
      setValidMoves([])
    } else if (piece && piece.color === gameState.currentPlayer) {
      // Select a piece
      setSelectedSquare(position)
      setValidMoves(ChessLogic.getValidMoves(gameState, position))
      soundManager.playSelect()
    } else if (piece && piece.color !== gameState.currentPlayer) {
      soundManager.playError()
      setGameMessage(`It's ${gameState.currentPlayer}'s turn!`)
      setTimeout(() => setGameMessage(""), 2000)
    }
  }

  const handleHint = () => {
    if (mode === "puzzle" && typeof puzzleId === "number") {
      soundManager.playHint() // Add this line
      const textHint = PuzzleData.getHint(puzzleId, gameState, playerMoves.length)
      setGameMessage(`💡 Hint: ${textHint}`)

      // Show visual hint for the next expected move
      const solution = PuzzleData.getPuzzleSolution(puzzleId)
      const nextMoveIndex = playerMoves.length

      if (nextMoveIndex < solution.length) {
        const nextMove = PuzzleData.parseMove(solution[nextMoveIndex])
        if (nextMove) {
          setHintMove(nextMove)
          setShowVisualHint(true)
        }
      }

      setTimeout(() => {
        setGameMessage("")
        setShowVisualHint(false)
        setHintMove(null)
      }, 5000)
    }
  }

  const flipBoard = () => {
    setBoardOrientation(boardOrientation === "white" ? "black" : "white")
  }

  const openSourceGame = () => {
    if (typeof puzzleId === "number") {
      const gameUrl = PuzzleData.getPuzzleGameUrl(puzzleId)
      if (gameUrl) {
        window.open(gameUrl, "_blank")
      }
    }
  }

  // Get puzzle difficulty and move count for display
  const puzzleDifficulty = typeof puzzleId === "number" ? PuzzleData.getPuzzleDifficulty(puzzleId) : ""
  const puzzleMoveCount = typeof puzzleId === "number" ? PuzzleData.getPuzzleMoveCount(puzzleId) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">
              {mode === "puzzle"
                ? `Puzzle ${typeof puzzleId === "string" && puzzleId.startsWith("custom_") ? "(Custom)" : `#${puzzleId}`}`
                : mode === "ai"
                  ? "AI Challenge"
                  : "Multiplayer"}
            </h2>
            {mode === "puzzle" && typeof puzzleId === "number" && (
              <div className="text-gray-300">
                <p>
                  {puzzleDifficulty} • {puzzleMoveCount} move{puzzleMoveCount !== 1 ? "s" : ""} • Rating:{" "}
                  {PuzzleData.getPuzzleRating(puzzleId)}
                </p>
                <p className="text-xs text-gray-400">Themes: {PuzzleData.getPuzzleThemes(puzzleId).join(", ")}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {mode === "puzzle" && typeof puzzleId === "number" && (
              <Button
                variant="outline"
                onClick={openSourceGame}
                className="bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Source
              </Button>
            )}
            {mode === "puzzle" && !puzzleCompleted && !puzzleFailed && (
              <Button
                variant="outline"
                onClick={handleHint}
                className="bg-yellow-500/20 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Hint
              </Button>
            )}
            <Button
              variant="outline"
              onClick={flipBoard}
              className="bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Flip
            </Button>
            <Button
              variant="outline"
              onClick={resetGame}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Status and Move History */}
          <div className="lg:col-span-1 space-y-6">
            <GameStatus
              gameState={gameState}
              whiteMoves={whiteMoves}
              blackMoves={blackMoves}
              message={gameMessage}
              mode={mode}
              puzzleRating={typeof puzzleId === "number" ? PuzzleData.getPuzzleRating(puzzleId) : undefined}
            />

            <MoveHistory
              moveHistory={gameState.moveHistory}
              puzzleCompleted={puzzleCompleted}
              puzzleFailed={puzzleFailed}
            />
          </div>

          {/* Chess Board */}
          <div className="lg:col-span-2 flex justify-center">
            <ChessBoard
              gameState={gameState}
              selectedSquare={selectedSquare}
              validMoves={validMoves}
              onSquareClick={handleSquareClick}
              hintMove={showVisualHint ? hintMove : null}
              orientation={boardOrientation}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
