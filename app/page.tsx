"use client"

import { useState, useEffect } from "react"
import { ChessGame } from "@/components/chess-game"
import { PuzzleSelection } from "@/components/puzzle-selection"
import { GameInstructions } from "@/components/game-instructions"
import { PuzzleEditor } from "@/components/puzzle-editor"
import { StatsDisplay } from "@/components/stats-display"
import { Card } from "@/components/ui/card"
import { Crown, Gamepad2, BookOpen, Users, Puzzle, Edit } from "lucide-react"
import { UserStats } from "@/lib/user-stats"

type GameMode = "menu" | "puzzle" | "ai" | "multiplayer" | "instructions" | "puzzle-selection" | "puzzle-editor"

export default function Home() {
  const [gameMode, setGameMode] = useState<GameMode>("menu")
  const [selectedPuzzle, setSelectedPuzzle] = useState<number | null>(null)
  const [unlockedPuzzles, setUnlockedPuzzles] = useState<number[]>([1, 2, 3])

  // Load unlocked puzzles from user stats
  useEffect(() => {
    const unlocked = UserStats.getUnlockedPuzzles()
    setUnlockedPuzzles(unlocked)
  }, [])

  const handlePuzzleComplete = (puzzleId: number) => {
    if (!unlockedPuzzles.includes(puzzleId + 1) && puzzleId < 20) {
      const newUnlocked = [...unlockedPuzzles, puzzleId + 1]
      setUnlockedPuzzles(newUnlocked)
    }
  }

  const handleBackToMenu = () => {
    setGameMode("menu")
    // Refresh unlocked puzzles when returning to menu
    const unlocked = UserStats.getUnlockedPuzzles()
    setUnlockedPuzzles(unlocked)
  }

  if (gameMode === "instructions") {
    return <GameInstructions onBack={handleBackToMenu} />
  }

  if (gameMode === "puzzle-editor") {
    return <PuzzleEditor onBack={handleBackToMenu} />
  }

  if (gameMode === "puzzle-selection") {
    return (
      <PuzzleSelection
        unlockedPuzzles={unlockedPuzzles}
        onPuzzleSelect={(puzzleId) => {
          setSelectedPuzzle(puzzleId)
          setGameMode("puzzle")
        }}
        onBack={handleBackToMenu}
      />
    )
  }

  if (gameMode === "puzzle" && selectedPuzzle) {
    return (
      <ChessGame
        mode="puzzle"
        puzzleId={selectedPuzzle}
        onBack={() => setGameMode("puzzle-selection")}
        onPuzzleComplete={handlePuzzleComplete}
      />
    )
  }

  if (gameMode === "ai") {
    return <ChessGame mode="ai" onBack={handleBackToMenu} onPuzzleComplete={() => {}} />
  }

  if (gameMode === "multiplayer") {
    return <ChessGame mode="multiplayer" onBack={handleBackToMenu} onPuzzleComplete={() => {}} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl font-bold text-white">Checkmate</h1>
            <Crown className="w-12 h-12 text-yellow-400" />
          </div>
          <p className="text-xl text-gray-300">Master the art of chess puzzles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left column - Game modes */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => setGameMode("puzzle-selection")}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                    <Puzzle className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Puzzle Mode</h3>
                  <p className="text-gray-300">Solve challenging chess puzzles</p>
                </div>
              </Card>

              <Card
                className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => setGameMode("puzzle-editor")}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                    <Edit className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Puzzle Editor</h3>
                  <p className="text-gray-300">Create and share puzzles</p>
                </div>
              </Card>

              <Card
                className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => setGameMode("ai")}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-500/30 transition-colors">
                    <Gamepad2 className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">AI Opponent</h3>
                  <p className="text-gray-300">Challenge the computer</p>
                </div>
              </Card>

              <Card
                className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => setGameMode("multiplayer")}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
                    <Users className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Multiplayer</h3>
                  <p className="text-gray-300">Play with a friend</p>
                </div>
              </Card>

              <Card
                className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => setGameMode("instructions")}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500/30 transition-colors">
                    <BookOpen className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Instructions</h3>
                  <p className="text-gray-300">Learn how to play</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Right column - Stats */}
          <div className="lg:col-span-1">
            <StatsDisplay />
          </div>
        </div>
      </div>
    </div>
  )
}
