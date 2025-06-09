"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Crown, Target, Zap, Users } from "lucide-react"

interface GameInstructionsProps {
  onBack: () => void
}

export function GameInstructions({ onBack }: GameInstructionsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          <h1 className="text-3xl font-bold text-white">How to Play</h1>
          <div></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Rules */}
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Basic Chess Rules</h2>
            </div>
            <div className="space-y-3 text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-1">Piece Movement:</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• King: One square in any direction</li>
                  <li>• Queen: Any direction, any distance</li>
                  <li>• Rook: Horizontal/vertical lines</li>
                  <li>• Bishop: Diagonal lines</li>
                  <li>• Knight: L-shape (2+1 squares)</li>
                  <li>• Pawn: Forward one square (two on first move)</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Checkmate */}
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-red-400" />
              <h2 className="text-xl font-bold text-white">What is Checkmate?</h2>
            </div>
            <div className="space-y-3 text-gray-300">
              <p className="text-sm">
                Checkmate occurs when the king is in check (under attack) and has no legal moves to escape capture.
              </p>
              <div>
                <h3 className="font-semibold text-white mb-1">Check vs Checkmate:</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>
                    • <span className="text-yellow-400">Check:</span> King is under attack but can escape
                  </li>
                  <li>
                    • <span className="text-red-400">Checkmate:</span> King is under attack with no escape
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Puzzle Mode */}
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Puzzle Mode</h2>
            </div>
            <div className="space-y-3 text-gray-300">
              <p className="text-sm">Solve checkmate puzzles in 1-5 moves. Each puzzle has a specific solution.</p>
              <div>
                <h3 className="font-semibold text-white mb-1">Tips:</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Look for forcing moves (checks, captures)</li>
                  <li>• Consider all possible opponent responses</li>
                  <li>• Use the hint button if you're stuck</li>
                  <li>• Try again if you make a wrong move</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Game Modes */}
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-green-400" />
              <h2 className="text-xl font-bold text-white">Game Modes</h2>
            </div>
            <div className="space-y-3 text-gray-300">
              <div>
                <h3 className="font-semibold text-blue-400 mb-1">Puzzle Mode:</h3>
                <p className="text-sm">Solve predefined checkmate puzzles (Levels 1-10)</p>
              </div>
              <div>
                <h3 className="font-semibold text-red-400 mb-1">AI Opponent:</h3>
                <p className="text-sm">Play full games against the computer</p>
              </div>
              <div>
                <h3 className="font-semibold text-green-400 mb-1">Multiplayer:</h3>
                <p className="text-sm">Play with a friend on the same device</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 mt-6">
          <h2 className="text-xl font-bold text-white mb-4">Game Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Making Moves:</h3>
              <ul className="text-sm space-y-1">
                <li>1. Click on a piece to select it</li>
                <li>2. Valid moves will be highlighted</li>
                <li>3. Click on a highlighted square to move</li>
                <li>4. Click elsewhere to deselect</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Visual Indicators:</h3>
              <ul className="text-sm space-y-1">
                <li>• Blue highlight: Selected piece</li>
                <li>• Green highlight: Valid move</li>
                <li>• Green dots: Empty valid squares</li>
                <li>• Coordinates: Board positions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Buttons:</h3>
              <ul className="text-sm space-y-1">
                <li>• Reset: Restart the current game</li>
                <li>• Hint: Get a clue (puzzle mode)</li>
                <li>• Back: Return to main menu</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
