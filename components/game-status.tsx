"use client"

import type { GameState } from "@/lib/chess-logic"
import { Card } from "@/components/ui/card"
import { Crown, Clock, Target, AlertTriangle, Star } from "lucide-react"

interface GameStatusProps {
  gameState: GameState
  whiteMoves: number
  blackMoves: number
  message: string
  mode: "puzzle" | "ai" | "multiplayer"
  puzzleRating?: number
}

export function GameStatus({ gameState, whiteMoves, blackMoves, message, mode, puzzleRating }: GameStatusProps) {
  return (
    <div className="space-y-4">
      {/* Current Player */}
      <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
        <div className="flex items-center gap-3">
          <div
            className={`w-4 h-4 rounded-full ${gameState.currentPlayer === "white" ? "bg-white" : "bg-gray-800"} border-2 border-gray-400`}
          ></div>
          <Crown className={`w-6 h-6 ${gameState.currentPlayer === "white" ? "text-yellow-400" : "text-purple-400"}`} />
          <div>
            <h3 className="font-semibold text-white">Current Turn</h3>
            <p className="text-gray-300 capitalize font-medium">{gameState.currentPlayer} to move</p>
          </div>
        </div>
      </Card>

      {/* Move Counter */}
      <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-400" />
          <div className="w-full">
            <h3 className="font-semibold text-white mb-2">Moves Made</h3>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <p className="text-gray-300 font-medium">White: {whiteMoves}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                <p className="text-gray-300 font-medium">Black: {blackMoves}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Puzzle Rating */}
      {mode === "puzzle" && puzzleRating && (
        <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-400" />
            <div>
              <h3 className="font-semibold text-white">Puzzle Rating</h3>
              <div className="flex items-center gap-2">
                <p className="text-gray-300 text-lg font-bold">{puzzleRating}</p>
                <div className="flex">
                  {Array.from({ length: getDifficultyStars(puzzleRating) }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                  {Array.from({ length: 5 - getDifficultyStars(puzzleRating) }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gray-600" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Puzzle Target */}
      {mode === "puzzle" && (
        <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-green-400" />
            <div>
              <h3 className="font-semibold text-white">Objective</h3>
              <p className="text-gray-300">Find the best move sequence</p>
              <p className="text-sm text-green-400 mt-1">Any other move is a mistake</p>
            </div>
          </div>
        </Card>
      )}

      {/* Game Message */}
      {message && (
        <Card
          className={`p-4 backdrop-blur-sm border-2 ${
            message.includes("solved")
              ? "bg-green-500/20 border-green-400/50"
              : message.includes("Check")
                ? "bg-yellow-500/20 border-yellow-400/50"
                : message.includes("turn") || message.includes("Find")
                  ? "bg-blue-500/20 border-blue-400/50"
                  : "bg-red-500/20 border-red-400/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle
              className={`w-6 h-6 ${
                message.includes("solved")
                  ? "text-green-400"
                  : message.includes("Check")
                    ? "text-yellow-400"
                    : message.includes("turn") || message.includes("Find")
                      ? "text-blue-400"
                      : "text-red-400"
              }`}
            />
            <div>
              <h3 className="font-semibold text-white">Game Status</h3>
              <p className="text-gray-100 font-medium">{message}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Captured Pieces */}
      <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
        <h3 className="font-semibold text-white mb-3">Captured Pieces</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-400 mb-1">White captured:</p>
            <div className="flex flex-wrap gap-1 min-h-[24px] p-2 bg-black/20 rounded">
              {gameState.capturedPieces.white.map((piece, index) => (
                <span
                  key={index}
                  className="text-xl text-gray-900"
                  style={{ textShadow: "1px 1px 2px rgba(255,255,255,0.8)" }}
                >
                  {piece.type === "king"
                    ? "♚"
                    : piece.type === "queen"
                      ? "♛"
                      : piece.type === "rook"
                        ? "♜"
                        : piece.type === "bishop"
                          ? "♝"
                          : piece.type === "knight"
                            ? "♞"
                            : "♟"}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Black captured:</p>
            <div className="flex flex-wrap gap-1 min-h-[24px] p-2 bg-white/20 rounded">
              {gameState.capturedPieces.black.map((piece, index) => (
                <span key={index} className="text-xl text-white" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>
                  {piece.type === "king"
                    ? "♔"
                    : piece.type === "queen"
                      ? "♕"
                      : piece.type === "rook"
                        ? "♖"
                        : piece.type === "bishop"
                          ? "♗"
                          : piece.type === "knight"
                            ? "♘"
                            : "♙"}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function getDifficultyStars(rating: number): number {
  if (rating < 1200) return 1
  if (rating < 1500) return 2
  if (rating < 1800) return 3
  if (rating < 2100) return 4
  return 5
}
