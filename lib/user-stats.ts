export interface PuzzleStats {
  solved: number[]
  attempted: number[]
  totalSolved: number
  totalAttempted: number
  successRate: number
  streakCurrent: number
  streakBest: number
  lastSolvedDate: string | null
}

export class UserStats {
  private static STORAGE_KEY = "checkmate_user_stats"

  static getStats(): PuzzleStats {
    if (typeof window === "undefined") {
      return {
        solved: [],
        attempted: [],
        totalSolved: 0,
        totalAttempted: 0,
        successRate: 0,
        streakCurrent: 0,
        streakBest: 0,
        lastSolvedDate: null,
      }
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) {
        return {
          solved: [],
          attempted: [],
          totalSolved: 0,
          totalAttempted: 0,
          successRate: 0,
          streakCurrent: 0,
          streakBest: 0,
          lastSolvedDate: null,
        }
      }

      const stats = JSON.parse(stored) as PuzzleStats
      return stats
    } catch (error) {
      console.error("Error loading user stats:", error)
      return {
        solved: [],
        attempted: [],
        totalSolved: 0,
        totalAttempted: 0,
        successRate: 0,
        streakCurrent: 0,
        streakBest: 0,
        lastSolvedDate: null,
      }
    }
  }

  static saveStats(stats: PuzzleStats): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats))
    } catch (error) {
      console.error("Error saving user stats:", error)
    }
  }

  static markPuzzleAttempted(puzzleId: number): void {
    const stats = this.getStats()
    if (!stats.attempted.includes(puzzleId)) {
      stats.attempted.push(puzzleId)
      stats.totalAttempted = stats.attempted.length
      this.updateSuccessRate(stats)
      this.saveStats(stats)
    }
  }

  static markPuzzleSolved(puzzleId: number): void {
    const stats = this.getStats()
    if (!stats.solved.includes(puzzleId)) {
      stats.solved.push(puzzleId)
      stats.totalSolved = stats.solved.length

      // Update streak
      const today = new Date().toISOString().split("T")[0]
      if (stats.lastSolvedDate === today) {
        stats.streakCurrent += 1
      } else if (stats.lastSolvedDate === null) {
        stats.streakCurrent = 1
      } else {
        const lastDate = new Date(stats.lastSolvedDate)
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        if (lastDate.toISOString().split("T")[0] === yesterday.toISOString().split("T")[0]) {
          stats.streakCurrent += 1
        } else {
          stats.streakCurrent = 1
        }
      }

      stats.lastSolvedDate = today
      stats.streakBest = Math.max(stats.streakBest, stats.streakCurrent)

      this.updateSuccessRate(stats)
      this.saveStats(stats)
    }
  }

  private static updateSuccessRate(stats: PuzzleStats): void {
    if (stats.totalAttempted > 0) {
      stats.successRate = Math.round((stats.totalSolved / stats.totalAttempted) * 100)
    } else {
      stats.successRate = 0
    }
  }

  static resetStats(): void {
    const emptyStats: PuzzleStats = {
      solved: [],
      attempted: [],
      totalSolved: 0,
      totalAttempted: 0,
      successRate: 0,
      streakCurrent: 0,
      streakBest: 0,
      lastSolvedDate: null,
    }
    this.saveStats(emptyStats)
  }

  static isPuzzleSolved(puzzleId: number): boolean {
    const stats = this.getStats()
    return stats.solved.includes(puzzleId)
  }

  static getUnlockedPuzzles(): number[] {
    const stats = this.getStats()
    const solved = stats.solved

    // Always unlock the first 3 puzzles
    const unlocked = [1, 2, 3]

    // Unlock next puzzles based on solved ones
    for (let i = 1; i <= 20; i++) {
      if (solved.includes(i) && i < 20) {
        unlocked.push(i + 1)
      }
    }

    return [...new Set(unlocked)].sort((a, b) => a - b)
  }
}
