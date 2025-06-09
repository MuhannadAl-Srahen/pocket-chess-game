"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Lock, Star, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LevelSelectionProps {
  unlockedLevels: number[]
  onLevelSelect: (level: number) => void
  onBack: () => void
}

export function LevelSelection({ unlockedLevels, onLevelSelect, onBack }: LevelSelectionProps) {
  const [showWarning, setShowWarning] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<number>(1)

  const handleLevelClick = (level: number) => {
    if (unlockedLevels.includes(level)) {
      onLevelSelect(level)
    } else {
      setSelectedLevel(level)
      setShowWarning(true)
    }
  }

  const handleForceUnlock = () => {
    onLevelSelect(selectedLevel)
    setShowWarning(false)
  }

  const getDifficulty = (level: number): string => {
    if (level <= 3) return "Easy"
    if (level <= 6) return "Medium"
    if (level <= 8) return "Hard"
    return "Expert"
  }

  const getDifficultyColor = (level: number): string => {
    if (level <= 3) return "text-green-400"
    if (level <= 6) return "text-yellow-400"
    if (level <= 8) return "text-orange-400"
    return "text-red-400"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold text-white">Select Puzzle Level</h2>
        <div></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 10 }, (_, i) => {
          const level = i + 1
          const isUnlocked = unlockedLevels.includes(level)

          return (
            <Card
              key={level}
              className={`p-4 cursor-pointer transition-all duration-300 ${
                isUnlocked ? "bg-white/10 hover:bg-white/20 border-white/20" : "bg-gray-800/50 border-gray-600/50"
              }`}
              onClick={() => handleLevelClick(level)}
            >
              <div className="text-center">
                <div className="relative mb-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                      isUnlocked ? "bg-blue-500/20" : "bg-gray-600/20"
                    }`}
                  >
                    {isUnlocked ? (
                      <span className="text-xl font-bold text-white">{level}</span>
                    ) : (
                      <Lock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  {isUnlocked && level <= 3 && <Star className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />}
                </div>

                <h3 className={`font-semibold mb-1 ${isUnlocked ? "text-white" : "text-gray-400"}`}>Level {level}</h3>

                <p className={`text-sm ${isUnlocked ? getDifficultyColor(level) : "text-gray-500"}`}>
                  {getDifficulty(level)}
                </p>

                {level <= 5 && <p className="text-xs text-gray-400 mt-1">6x6 Board</p>}
              </div>
            </Card>
          )
        })}
      </div>

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="bg-slate-800 border-slate-600">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Level Locked
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              This level is locked. You should complete the previous levels first to unlock it naturally. Are you sure
              you want to skip ahead to Level {selectedLevel}?
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
              Yes, Unlock Level {selectedLevel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
