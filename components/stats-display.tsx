"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Flame, Target, Award, BarChart, Star, Calendar, Brain, TrendingUp } from "lucide-react"
import { PuzzleData } from "@/lib/puzzle-data"
import { UserStats, type PuzzleStats } from "@/lib/user-stats"
import { useEffect, useState } from "react"

export function StatsDisplay() {
  const [stats, setStats] = useState<PuzzleStats | null>(null)
  const [isClient, setIsClient] = useState(false)
  const totalPuzzles = PuzzleData.getTotalPuzzles()

  useEffect(() => {
    setIsClient(true)
    const userStats = UserStats.getStats()
    setStats(userStats)
  }, [])

  if (!isClient || !stats) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Loading Stats...</h3>
      </Card>
    )
  }

  const completionPercentage = Math.round((stats.totalSolved / totalPuzzles) * 100) || 0

  // Calculate stats by difficulty level
  const difficultyLevels = PuzzleData.getDifficultyLevels()
  const puzzlesByDifficulty = difficultyLevels.map((level) => {
    const puzzleIds = PuzzleData.getPuzzlesByDifficulty(level)
    const solved = puzzleIds.filter((id) => stats.solved.includes(id)).length
    const total = puzzleIds.length
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0
    return { level, solved, total, percentage }
  })

  // Get highest rating solved
  const highestRatingSolved =
    stats.solved.length > 0 ? Math.max(...stats.solved.map((id) => PuzzleData.getPuzzleRating(id))) : 0

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-white/20 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Your Progress</h3>
        <div className="bg-blue-500/20 p-2 rounded-full">
          <BarChart className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      <div className="space-y-8">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 font-medium">Puzzles Completed</span>
            <span className="text-white font-bold text-lg">
              {stats.totalSolved} / {totalPuzzles}
            </span>
          </div>
          <div className="relative">
            <Progress
              value={completionPercentage}
              className="h-3 bg-gray-700/50"
              indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
            />
            <p className="text-sm text-gray-400 mt-1 text-right">{completionPercentage}% complete</p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-yellow-500/20 to-amber-600/20 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-500/20 p-2 rounded-full">
                <Trophy className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-gray-300 text-sm font-medium">Success Rate</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.successRate}%</p>
            <p className="text-xs text-gray-400 mt-1">
              {stats.successRate > 70 ? "Excellent!" : stats.successRate > 50 ? "Good progress!" : "Keep practicing!"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-xl p-4 border border-orange-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-500/20 p-2 rounded-full">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-gray-300 text-sm font-medium">Current Streak</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.streakCurrent} days</p>
            <p className="text-xs text-gray-400 mt-1">
              {stats.streakCurrent > 0 ? "Keep it going!" : "Start solving today!"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-500/20 p-2 rounded-full">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-gray-300 text-sm font-medium">Best Streak</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.streakBest} days</p>
            <p className="text-xs text-gray-400 mt-1">
              {stats.streakCurrent >= stats.streakBest && stats.streakBest > 0
                ? "New record!"
                : stats.streakBest > 0
                  ? "Can you beat it?"
                  : "Start your first streak!"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500/20 p-2 rounded-full">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-gray-300 text-sm font-medium">Total Attempts</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalAttempted}</p>
            <p className="text-xs text-gray-400 mt-1">
              {stats.totalAttempted > 50
                ? "Dedicated solver!"
                : stats.totalAttempted > 20
                  ? "Getting experienced!"
                  : "Just getting started!"}
            </p>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-blue-400" />
            <h4 className="text-white font-medium">Difficulty Breakdown</h4>
          </div>
          <div className="space-y-3">
            {puzzlesByDifficulty.map((level) => (
              <div key={level.level}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">{level.level}</span>
                  <span className="text-xs text-gray-400">
                    {level.solved}/{level.total}
                  </span>
                </div>
                <div className="relative">
                  <Progress
                    value={level.percentage}
                    className="h-2 bg-gray-700/50"
                    indicatorClassName={`${
                      level.level === "Rookie"
                        ? "bg-green-500"
                        : level.level === "Easy"
                          ? "bg-blue-500"
                          : level.level === "Mid"
                            ? "bg-yellow-500"
                            : level.level === "Hard"
                              ? "bg-orange-500"
                              : level.level === "Extreme Hard"
                                ? "bg-red-500"
                                : "bg-purple-500"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300 text-xs">Highest Rating Solved</span>
            </div>
            <p className="text-lg font-bold text-white">{highestRatingSolved || "N/A"}</p>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-xs">Last Solved</span>
            </div>
            <p className="text-lg font-bold text-white">
              {stats.lastSolvedDate ? new Date(stats.lastSolvedDate).toLocaleDateString() : "Never"}
            </p>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-500/20 text-center">
          <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-2" />
          <p className="text-white font-medium">
            {stats.totalSolved === 0
              ? "Ready to solve your first puzzle?"
              : stats.totalSolved === totalPuzzles
                ? "Amazing! You've solved all puzzles!"
                : `${totalPuzzles - stats.totalSolved} more puzzles to master!`}
          </p>
        </div>
      </div>
    </Card>
  )
}
