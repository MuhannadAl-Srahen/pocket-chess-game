"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Star, Edit, Lock, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PuzzleData } from "@/lib/puzzle-data"
import { CustomPuzzleManager, type CustomPuzzle } from "@/lib/custom-puzzle-manager"
import { UserStats } from "@/lib/user-stats"

interface PuzzleSelectionProps {
  unlockedPuzzles: number[]
  onPuzzleSelect: (puzzleId: number | string) => void
  onBack: () => void
}

export function PuzzleSelection({ unlockedPuzzles, onPuzzleSelect, onBack }: PuzzleSelectionProps) {
  const [showWarning, setShowWarning] = useState(false)
  const [selectedPuzzle, setSelectedPuzzle] = useState<number>(1)

  // Add state for custom puzzles
  const [customPuzzles, setCustomPuzzles] = useState<CustomPuzzle[]>(CustomPuzzleManager.getAllPuzzles())
  const [showCustomPuzzles, setShowCustomPuzzles] = useState(false)

  const handlePuzzleClick = (puzzleId: number) => {
    if (unlockedPuzzles.includes(puzzleId)) {
      onPuzzleSelect(puzzleId)
    } else {
      setSelectedPuzzle(puzzleId)
      setShowWarning(true)
    }
  }

  const handleForceUnlock = () => {
    onPuzzleSelect(selectedPuzzle)
    setShowWarning(false)
  }

  const getDifficultyStars = (rating: number): number => {
    if (rating < 600) return 1
    if (rating < 800) return 2
    if (rating < 1000) return 3
    if (rating < 1200) return 4
    return 5
  }

  const totalPuzzles = PuzzleData.getTotalPuzzles()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold text-white">Select a Puzzle</h2>
          <div className="flex items-center gap-4">
            <Button
              variant={showCustomPuzzles ? "default" : "outline"}
              onClick={() => setShowCustomPuzzles(!showCustomPuzzles)}
              className={
                showCustomPuzzles
                  ? "bg-purple-500 hover:bg-purple-600"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }
            >
              {showCustomPuzzles ? "Built-in Puzzles" : "Custom Puzzles"}
            </Button>
          </div>
        </div>

        {showCustomPuzzles ? (
          // Custom puzzles grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {customPuzzles.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Edit className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Custom Puzzles Yet</h3>
                <p className="text-gray-400 mb-4">Create your first puzzle using the Puzzle Editor!</p>
                <Button onClick={onBack} className="bg-purple-500 hover:bg-purple-600 text-white">
                  Go to Puzzle Editor
                </Button>
              </div>
            ) : (
              customPuzzles.map((puzzle) => (
                <Card
                  key={puzzle.id}
                  className="p-4 cursor-pointer transition-all duration-300 bg-white/10 hover:bg-white/20 border-white/20"
                  onClick={() => onPuzzleSelect(`custom_${puzzle.id}`)}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-purple-500/20">
                      <Edit className="w-6 h-6 text-purple-400" />
                    </div>

                    <h3 className="font-semibold mb-1 text-white text-sm">{puzzle.title}</h3>

                    <div className="flex justify-center mb-2">
                      {Array.from({ length: getDifficultyStars(puzzle.difficulty) }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                      {Array.from({ length: 5 - getDifficultyStars(puzzle.difficulty) }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-gray-600" />
                      ))}
                    </div>

                    <p className="text-xs text-gray-400 mb-1">{puzzle.theme}</p>
                    <p className="text-xs text-gray-500">by {puzzle.author}</p>
                  </div>
                </Card>
              ))
            )}
          </div>
        ) : (
          // Built-in puzzles grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: totalPuzzles }, (_, i) => {
              const puzzleId = i + 1
              const isUnlocked = unlockedPuzzles.includes(puzzleId)
              const isSolved = UserStats.isPuzzleSolved(puzzleId)
              const rating = PuzzleData.getPuzzleRating(puzzleId)
              const difficulty = PuzzleData.getPuzzleDifficulty(puzzleId)
              const moveCount = PuzzleData.getPuzzleMoveCount(puzzleId)

              return (
                <Card
                  key={puzzleId}
                  className={`p-4 cursor-pointer transition-all duration-300 ${
                    isUnlocked
                      ? "bg-white/10 hover:bg-white/20 border-white/20"
                      : "bg-gray-800/50 border-gray-600/50 cursor-not-allowed"
                  } ${isSolved ? "ring-2 ring-green-400/50" : ""}`}
                  onClick={() => handlePuzzleClick(puzzleId)}
                >
                  <div className="text-center">
                    <div className="relative mb-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                          isUnlocked ? "bg-blue-500/20" : "bg-gray-600/20"
                        }`}
                      >
                        {isUnlocked ? (
                          <span className="text-xl font-bold text-white">{puzzleId}</span>
                        ) : (
                          <Lock className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      {isSolved && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>

                    <h3 className={`font-semibold mb-1 ${isUnlocked ? "text-white" : "text-gray-400"}`}>
                      Puzzle {puzzleId}
                    </h3>

                    {isUnlocked && (
                      <>
                        <div className="flex justify-center mb-2">
                          {Array.from({ length: getDifficultyStars(rating) }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          ))}
                          {Array.from({ length: 5 - getDifficultyStars(rating) }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-gray-600" />
                          ))}
                        </div>

                        <p className="text-xs text-gray-400 mb-1">{difficulty}</p>
                        <p className="text-xs text-gray-500">
                          {moveCount} move{moveCount !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-gray-500">Rating: {rating}</p>
                      </>
                    )}

                    {!isUnlocked && <p className="text-xs text-gray-500">Complete previous puzzles</p>}
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        <Dialog open={showWarning} onOpenChange={setShowWarning}>
          <DialogContent className="bg-slate-800 border-slate-600">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Puzzle Locked
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                This puzzle is locked. You should complete the previous puzzles first to unlock it naturally. Are you
                sure you want to skip ahead to Puzzle {selectedPuzzle}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowWarning(false)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Cancel
              </Button>
              <Button onClick={handleForceUnlock} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                Yes, Unlock Puzzle {selectedPuzzle}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
