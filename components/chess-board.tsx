"use client"

import { useRef, useEffect } from "react"
import type { GameState, Position, Piece, PieceColor } from "@/lib/chess-logic"
import { cn } from "@/lib/utils"

interface ChessBoardProps {
  gameState: GameState
  selectedSquare: Position | null
  validMoves: Position[]
  onSquareClick: (position: Position) => void
  hintMove?: { from: Position; to: Position } | null
  orientation?: PieceColor
}

export function ChessBoard({
  gameState,
  selectedSquare,
  validMoves,
  onSquareClick,
  hintMove,
  orientation = "white",
}: ChessBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null)

  const getPieceSymbol = (piece: Piece | null): string => {
    if (!piece) return ""

    const symbols = {
      white: {
        king: "♔",
        queen: "♕",
        rook: "♖",
        bishop: "♗",
        knight: "♘",
        pawn: "♙",
      },
      black: {
        king: "♚",
        queen: "♛",
        rook: "♜",
        bishop: "♝",
        knight: "♞",
        pawn: "♟",
      },
    }

    return symbols[piece.color][piece.type]
  }

  const isValidMove = (row: number, col: number): boolean => {
    return validMoves.some((move) => move.row === row && move.col === col)
  }

  const isSelected = (row: number, col: number): boolean => {
    return selectedSquare?.row === row && selectedSquare?.col === col
  }

  const isLightSquare = (row: number, col: number): boolean => {
    return (row + col) % 2 === 0
  }

  const isHintFrom = (row: number, col: number): boolean => {
    return hintMove?.from.row === row && hintMove?.from.col === col
  }

  const isHintTo = (row: number, col: number): boolean => {
    return hintMove?.to.row === row && hintMove?.to.col === col
  }

  // Fix for disappearing pieces
  useEffect(() => {
    const board = boardRef.current
    if (!board) return

    // Force a repaint when the board changes
    const forceRepaint = () => {
      if (board) {
        board.style.display = "none"
        void board.offsetHeight // Trigger reflow
        board.style.display = ""
      }
    }

    forceRepaint()
  }, [gameState, selectedSquare, validMoves, hintMove])

  // Get board coordinates based on orientation
  const getCoordinates = (row: number, col: number): [number, number] => {
    if (orientation === "white") {
      return [row, col]
    } else {
      return [7 - row, 7 - col]
    }
  }

  return (
    <div className="inline-block p-6 relative">
      {/* Glass board container with enhanced glass effects */}
      <div className="relative">
        {/* Glass base with multiple layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-2xl backdrop-blur-xl border border-white/30 shadow-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/10 via-transparent to-purple-500/10 rounded-2xl"></div>

        {/* Inner glass reflection */}
        <div className="absolute inset-2 bg-gradient-to-br from-white/15 via-transparent to-white/5 rounded-xl border border-white/20"></div>

        {/* Glass surface highlight */}
        <div className="absolute top-2 left-2 right-1/2 bottom-1/2 bg-gradient-to-br from-white/25 via-white/10 to-transparent rounded-tl-xl blur-sm"></div>

        <div
          ref={boardRef}
          className="relative grid gap-0 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.3),inset_0_0_30px_rgba(255,255,255,0.1)]"
          style={{
            gridTemplateColumns: `repeat(8, 1fr)`,
            width: "560px",
            height: "560px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {Array.from({ length: 8 }, (_, rowIndex) =>
            Array.from({ length: 8 }, (_, colIndex) => {
              const [displayRow, displayCol] = getCoordinates(rowIndex, colIndex)
              const piece = gameState.board[rowIndex][colIndex]
              const position: Position = { row: rowIndex, col: colIndex }

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "flex items-center justify-center cursor-pointer transition-all duration-300 relative group",
                    "hover:brightness-125 hover:scale-[1.02] hover:z-10",
                    // Glass square styling with frosted effect
                    isLightSquare(displayRow, displayCol)
                      ? "bg-gradient-to-br from-white/25 via-white/15 to-white/10 backdrop-blur-sm border-r border-b border-white/10"
                      : "bg-gradient-to-br from-gray-800/40 via-gray-700/30 to-gray-600/20 backdrop-blur-sm border-r border-b border-white/5",
                    // Selection and move indicators with glass effects
                    isSelected(rowIndex, colIndex) &&
                      "ring-4 ring-blue-400/70 ring-inset shadow-[inset_0_0_20px_rgba(59,130,246,0.3)]",
                    isValidMove(rowIndex, colIndex) &&
                      "ring-4 ring-green-400/70 ring-inset shadow-[inset_0_0_20px_rgba(34,197,94,0.3)]",
                    isHintFrom(rowIndex, colIndex) &&
                      "ring-4 ring-purple-400/70 ring-inset animate-pulse shadow-[inset_0_0_20px_rgba(168,85,247,0.3)]",
                    isHintTo(rowIndex, colIndex) &&
                      "ring-4 ring-orange-400/70 ring-inset animate-pulse shadow-[inset_0_0_20px_rgba(251,146,60,0.3)]",
                  )}
                  style={{
                    width: "70px",
                    height: "70px",
                  }}
                  onClick={() => onSquareClick(position)}
                >
                  {/* Glass square inner reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>

                  {/* Glass square highlight on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  {/* Hint indicators with glass effect */}
                  {isHintFrom(rowIndex, colIndex) && (
                    <div className="absolute top-1 left-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg backdrop-blur-sm border border-purple-300/50"></div>
                  )}
                  {isHintTo(rowIndex, colIndex) && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse shadow-lg backdrop-blur-sm border border-orange-300/50"></div>
                  )}

                  {/* Valid move indicator with glass effect */}
                  {isValidMove(rowIndex, colIndex) && !piece && (
                    <div className="w-4 h-4 bg-green-400/80 rounded-full shadow-lg backdrop-blur-sm border border-green-300/50 animate-pulse"></div>
                  )}

                  {/* Chess piece with enhanced shadows and glass reflection */}
                  {piece && (
                    <div className="relative">
                      {/* Piece reflection on glass surface */}
                      <span
                        className={cn(
                          "absolute top-1 text-5xl select-none font-bold opacity-20 blur-sm",
                          piece.color === "white" ? "text-white" : "text-gray-900",
                        )}
                        style={{
                          transform: "scaleY(-0.3) translateY(100%)",
                          filter: "blur(2px)",
                        }}
                      >
                        {getPieceSymbol(piece)}
                      </span>

                      {/* Main piece */}
                      <span
                        className={cn(
                          "relative text-5xl select-none transition-all duration-300 font-bold z-10",
                          "group-hover:scale-110 group-hover:-translate-y-1",
                          piece.color === "white" ? "text-white" : "text-gray-900",
                          isValidMove(rowIndex, colIndex) &&
                            "ring-2 ring-green-400/70 rounded-full bg-green-100/20 backdrop-blur-sm",
                        )}
                        style={{
                          textShadow:
                            piece.color === "white"
                              ? "2px 2px 8px rgba(0,0,0,0.8), -1px -1px 4px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.3)"
                              : "2px 2px 8px rgba(255,255,255,0.8), -1px -1px 4px rgba(255,255,255,0.5), 0 0 20px rgba(0,0,0,0.3)",
                          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
                        }}
                      >
                        {getPieceSymbol(piece)}
                      </span>
                    </div>
                  )}

                  {/* Coordinate labels with glass styling */}
                  {displayRow === 7 && (
                    <div className="absolute bottom-1 right-1 text-xs font-bold text-white/80 bg-black/20 px-1 rounded backdrop-blur-sm">
                      {String.fromCharCode(97 + displayCol)}
                    </div>
                  )}
                  {displayCol === 0 && (
                    <div className="absolute top-1 left-1 text-xs font-bold text-white/80 bg-black/20 px-1 rounded backdrop-blur-sm">
                      {8 - displayRow}
                    </div>
                  )}
                </div>
              )
            }),
          )}
        </div>

        {/* Glass board edge lighting */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-50 -z-10"></div>
        <div className="absolute -inset-2 bg-gradient-to-r from-white/10 via-transparent to-white/10 rounded-3xl blur-2xl opacity-30 -z-20"></div>
      </div>
    </div>
  )
}
