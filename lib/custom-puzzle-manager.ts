export interface CustomPuzzle {
  id: string
  title: string
  description: string
  theme: string
  difficulty: number
  author: string
  fen: string
  solution: string[]
  createdAt: string
}

export class CustomPuzzleManager {
  private static STORAGE_KEY = "custom_chess_puzzles"

  static getAllPuzzles(): CustomPuzzle[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading puzzles:", error)
      return []
    }
  }

  static savePuzzle(puzzle: CustomPuzzle): void {
    if (typeof window === "undefined") return

    try {
      const puzzles = this.getAllPuzzles()
      const existingIndex = puzzles.findIndex((p) => p.id === puzzle.id)

      if (existingIndex >= 0) {
        puzzles[existingIndex] = puzzle
      } else {
        puzzles.push(puzzle)
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(puzzles))
    } catch (error) {
      console.error("Error saving puzzle:", error)
    }
  }

  static deletePuzzle(puzzleId: string): void {
    if (typeof window === "undefined") return

    try {
      const puzzles = this.getAllPuzzles()
      const filtered = puzzles.filter((p) => p.id !== puzzleId)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error("Error deleting puzzle:", error)
    }
  }

  static getPuzzle(puzzleId: string): CustomPuzzle | null {
    const puzzles = this.getAllPuzzles()
    return puzzles.find((p) => p.id === puzzleId) || null
  }

  static encodePuzzle(puzzle: CustomPuzzle): string {
    try {
      const data = JSON.stringify(puzzle)
      return btoa(data)
    } catch (error) {
      console.error("Error encoding puzzle:", error)
      return ""
    }
  }

  static decodePuzzle(code: string): CustomPuzzle {
    try {
      const data = atob(code)
      return JSON.parse(data)
    } catch (error) {
      console.error("Error decoding puzzle:", error)
      throw new Error("Invalid puzzle code")
    }
  }

  static exportPuzzles(): string {
    const puzzles = this.getAllPuzzles()
    return JSON.stringify(puzzles, null, 2)
  }

  static importPuzzles(data: string): number {
    try {
      const puzzles: CustomPuzzle[] = JSON.parse(data)
      const existing = this.getAllPuzzles()

      let imported = 0
      puzzles.forEach((puzzle) => {
        if (!existing.find((p) => p.id === puzzle.id)) {
          this.savePuzzle(puzzle)
          imported++
        }
      })

      return imported
    } catch (error) {
      console.error("Error importing puzzles:", error)
      throw new Error("Invalid puzzle data")
    }
  }

  static searchPuzzles(query: string): CustomPuzzle[] {
    const puzzles = this.getAllPuzzles()
    const lowercaseQuery = query.toLowerCase()

    return puzzles.filter(
      (puzzle) =>
        puzzle.title.toLowerCase().includes(lowercaseQuery) ||
        puzzle.description.toLowerCase().includes(lowercaseQuery) ||
        puzzle.theme.toLowerCase().includes(lowercaseQuery) ||
        puzzle.author.toLowerCase().includes(lowercaseQuery),
    )
  }

  static getPuzzlesByTheme(theme: string): CustomPuzzle[] {
    const puzzles = this.getAllPuzzles()
    return puzzles.filter((puzzle) => puzzle.theme === theme)
  }

  static getPuzzlesByDifficulty(minRating: number, maxRating: number): CustomPuzzle[] {
    const puzzles = this.getAllPuzzles()
    return puzzles.filter((puzzle) => puzzle.difficulty >= minRating && puzzle.difficulty <= maxRating)
  }
}
