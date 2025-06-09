"use client"

import { useState, useEffect } from "react"
import { ChessBoard } from "./chess-board"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Play,
  Save,
  Share2,
  Trash2,
  RotateCcw,
  Copy,
  Upload,
  Minus,
  Crown,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
} from "lucide-react"
import { ChessLogic, type GameState, type Position, type PieceType, type PieceColor } from "@/lib/chess-logic"
import { CustomPuzzleManager, type CustomPuzzle } from "@/lib/custom-puzzle-manager"
import { toast } from "sonner"

interface PuzzleEditorProps {
  onBack: () => void
}

export function PuzzleEditor({ onBack }: PuzzleEditorProps) {
  const [gameState, setGameState] = useState<GameState>(ChessLogic.getInitialState())
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [editorMode, setEditorMode] = useState<"setup" | "solution" | "test">("setup")
  const [selectedPiece, setSelectedPiece] = useState<{ type: PieceType; color: PieceColor } | null>(null)
  const [solutionMoves, setSolutionMoves] = useState<string[]>([])
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0)
  const [puzzleInfo, setPuzzleInfo] = useState({
    title: "",
    description: "",
    theme: "tactics",
    difficulty: "1200",
    author: "",
  })
  const [savedPuzzles, setSavedPuzzles] = useState<CustomPuzzle[]>(CustomPuzzleManager.getAllPuzzles())
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareCode, setShareCode] = useState("")
  const [showInstructions, setShowInstructions] = useState(false)
  const [testGameState, setTestGameState] = useState<GameState | null>(null)
  const [testSelectedSquare, setTestSelectedSquare] = useState<Position | null>(null)
  const [testValidMoves, setTestValidMoves] = useState<Position[]>([])
  const [testMessage, setTestMessage] = useState("")

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false)

  const tutorialSteps = [
    {
      title: "Welcome to the Puzzle Editor! 🎯",
      content:
        "Create your own chess puzzles and share them with the world. This tutorial will guide you through all the features step by step.",
      highlight: "welcome",
    },
    {
      title: "Step 1: Setup Mode 🛠️",
      content:
        "In Setup Mode, you can place pieces on the board. Select a piece from the palette on the left, then click on the board to place it. You can also move existing pieces by clicking them first.",
      highlight: "setup",
    },
    {
      title: "Step 2: Piece Palette 🎨",
      content:
        "The piece palette contains all chess pieces in white and black. Click a piece to select it, then click on the board to place it. Click the same piece again to deselect it.",
      highlight: "pieces",
    },
    {
      title: "Step 3: Board Controls 🎮",
      content:
        "Use the control buttons to Clear the board, Reset to starting position, or Switch which side moves first. These help you set up your puzzle position quickly.",
      highlight: "controls",
    },
    {
      title: "Step 4: Solution Mode 🎯",
      content:
        "Switch to Solution Mode to record the correct moves. Click pieces and squares to play through the solution. Each move is automatically recorded in chess notation.",
      highlight: "solution",
    },
    {
      title: "Step 5: Puzzle Information 📝",
      content:
        "Fill in your puzzle details: Title, Description, Theme (like 'fork' or 'pin'), Difficulty rating (800-2500), and your name as the author.",
      highlight: "info",
    },
    {
      title: "Step 6: Test Mode 🧪",
      content:
        "Use Test Mode to try solving your own puzzle. This ensures it works correctly and has the right difficulty before you save and share it.",
      highlight: "test",
    },
    {
      title: "Step 7: Save & Share 💾",
      content:
        "Save your puzzle locally or generate a share code that others can import. Your saved puzzles appear in the right panel and in the main puzzle selection.",
      highlight: "save",
    },
    {
      title: "You're Ready! 🚀",
      content:
        "You now know how to create amazing chess puzzles! Start with Setup Mode, create your position, record the solution, test it, and share it with the world. Happy puzzling!",
      highlight: "complete",
    },
  ]

  // Check if user has seen tutorial before
  useEffect(() => {
    const hasSeenTutorialBefore = localStorage.getItem("puzzle_editor_tutorial_seen")
    if (!hasSeenTutorialBefore) {
      setShowTutorial(true)
    }
    setHasSeenTutorial(!!hasSeenTutorialBefore)
  }, [])

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1)
    } else {
      setShowTutorial(false)
      localStorage.setItem("puzzle_editor_tutorial_seen", "true")
      setHasSeenTutorial(true)
    }
  }

  const prevTutorialStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1)
    }
  }

  const skipTutorial = () => {
    setShowTutorial(false)
    localStorage.setItem("puzzle_editor_tutorial_seen", "true")
    setHasSeenTutorial(true)
  }

  const pieces: { type: PieceType; color: PieceColor }[] = [
    { type: "king", color: "white" },
    { type: "queen", color: "white" },
    { type: "rook", color: "white" },
    { type: "bishop", color: "white" },
    { type: "knight", color: "white" },
    { type: "pawn", color: "white" },
    { type: "king", color: "black" },
    { type: "queen", color: "black" },
    { type: "rook", color: "black" },
    { type: "bishop", color: "black" },
    { type: "knight", color: "black" },
    { type: "pawn", color: "black" },
  ]

  const themes = [
    "tactics",
    "endgame",
    "fork",
    "pin",
    "discovery",
    "sacrifice",
    "deflection",
    "clearance",
    "interference",
    "attraction",
    "zugzwang",
    "overloading",
    "decoy",
    "mating-attack",
    "smothered-mate",
    "combination",
  ]

  const getPieceSymbol = (piece: { type: PieceType; color: PieceColor }): string => {
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

  const handleSquareClick = (position: Position) => {
    if (editorMode === "setup") {
      if (selectedPiece) {
        // Place piece
        const newBoard = gameState.board.map((row) => [...row])
        newBoard[position.row][position.col] = selectedPiece
        setGameState({ ...gameState, board: newBoard })
      } else {
        // Remove piece or select for moving
        if (selectedSquare) {
          // Move piece
          const piece = gameState.board[selectedSquare.row][selectedSquare.col]
          if (piece) {
            const newBoard = gameState.board.map((row) => [...row])
            newBoard[position.row][position.col] = piece
            newBoard[selectedSquare.row][selectedSquare.col] = null
            setGameState({ ...gameState, board: newBoard })
          }
          setSelectedSquare(null)
        } else {
          const piece = gameState.board[position.row][position.col]
          if (piece) {
            setSelectedSquare(position)
          } else {
            // Remove piece if clicking empty square
            const newBoard = gameState.board.map((row) => [...row])
            newBoard[position.row][position.col] = null
            setGameState({ ...gameState, board: newBoard })
          }
        }
      }
    } else if (editorMode === "solution") {
      // Record solution moves
      if (selectedSquare) {
        const piece = gameState.board[selectedSquare.row][selectedSquare.col]
        if (piece && piece.color === gameState.currentPlayer) {
          const moveNotation = ChessLogic.getMoveNotation(gameState, selectedSquare, position)
          const newGameState = ChessLogic.makeMove(gameState, selectedSquare, position)
          if (newGameState) {
            setGameState(newGameState)
            setSolutionMoves([...solutionMoves, moveNotation])
            setCurrentMoveIndex(currentMoveIndex + 1)
          }
        }
        setSelectedSquare(null)
      } else {
        const piece = gameState.board[position.row][position.col]
        if (piece && piece.color === gameState.currentPlayer) {
          setSelectedSquare(position)
        }
      }
    }
  }

  const clearBoard = () => {
    const emptyBoard = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))
    setGameState({ ...gameState, board: emptyBoard })
  }

  const resetToInitial = () => {
    setGameState(ChessLogic.getInitialState())
  }

  const switchSides = () => {
    setGameState({
      ...gameState,
      currentPlayer: gameState.currentPlayer === "white" ? "black" : "white",
    })
  }

  const undoMove = () => {
    if (solutionMoves.length > 0) {
      const newMoves = solutionMoves.slice(0, -1)
      setSolutionMoves(newMoves)
      setCurrentMoveIndex(Math.max(0, currentMoveIndex - 1))
    }
  }

  const testPuzzle = () => {
    if (solutionMoves.length === 0) {
      toast.error("Please record a solution first")
      return
    }

    setEditorMode("test")
    setTestGameState({ ...gameState })
    setTestMessage("Try to solve your puzzle!")
  }

  const savePuzzle = () => {
    if (!puzzleInfo.title.trim()) {
      toast.error("Please enter a puzzle title")
      return
    }

    if (solutionMoves.length === 0) {
      toast.error("Please record at least one solution move")
      return
    }

    const puzzle: CustomPuzzle = {
      id: Date.now().toString(),
      title: puzzleInfo.title,
      description: puzzleInfo.description,
      theme: puzzleInfo.theme,
      difficulty: Number.parseInt(puzzleInfo.difficulty),
      author: puzzleInfo.author || "Anonymous",
      fen: ChessLogic.boardToFEN(gameState),
      solution: solutionMoves,
      createdAt: new Date().toISOString(),
    }

    CustomPuzzleManager.savePuzzle(puzzle)
    setSavedPuzzles(CustomPuzzleManager.getAllPuzzles())
    toast.success("Puzzle saved successfully!")
  }

  const sharePuzzle = () => {
    const puzzle: CustomPuzzle = {
      id: Date.now().toString(),
      title: puzzleInfo.title,
      description: puzzleInfo.description,
      theme: puzzleInfo.theme,
      difficulty: Number.parseInt(puzzleInfo.difficulty),
      author: puzzleInfo.author || "Anonymous",
      fen: ChessLogic.boardToFEN(gameState),
      solution: solutionMoves,
      createdAt: new Date().toISOString(),
    }

    const encoded = CustomPuzzleManager.encodePuzzle(puzzle)
    setShareCode(encoded)
    setShowShareDialog(true)
  }

  const copyShareCode = () => {
    navigator.clipboard.writeText(shareCode)
    toast.success("Share code copied to clipboard!")
  }

  const loadPuzzle = (puzzle: CustomPuzzle) => {
    const gameState = ChessLogic.fenToBoard(puzzle.fen)
    setGameState(gameState)
    setSolutionMoves(puzzle.solution)
    setPuzzleInfo({
      title: puzzle.title,
      description: puzzle.description,
      theme: puzzle.theme,
      difficulty: puzzle.difficulty.toString(),
      author: puzzle.author,
    })
    setEditorMode("setup")
  }

  const deletePuzzle = (puzzleId: string) => {
    CustomPuzzleManager.deletePuzzle(puzzleId)
    setSavedPuzzles(CustomPuzzleManager.getAllPuzzles())
    toast.success("Puzzle deleted")
  }

  const importPuzzle = () => {
    const code = prompt("Enter puzzle share code:")
    if (code) {
      try {
        const puzzle = CustomPuzzleManager.decodePuzzle(code)
        loadPuzzle(puzzle)
        toast.success("Puzzle imported successfully!")
      } catch (error) {
        toast.error("Invalid puzzle code")
      }
    }
  }

  // Add this function after the existing helper functions
  const parseMove = (moveStr: string): { from: Position; to: Position } | null => {
    if (moveStr.length < 4) return null

    const fromFile = moveStr.charCodeAt(0) - 97
    const fromRank = 8 - Number.parseInt(moveStr.charAt(1))
    const toFile = moveStr.charCodeAt(2) - 97
    const toRank = 8 - Number.parseInt(moveStr.charAt(3))

    if (
      fromRank < 0 ||
      fromRank > 7 ||
      fromFile < 0 ||
      fromFile > 7 ||
      toRank < 0 ||
      toRank > 7 ||
      toFile < 0 ||
      toFile > 7
    ) {
      return null
    }

    return {
      from: { row: fromRank, col: fromFile },
      to: { row: toRank, col: toFile },
    }
  }

  const handleTestSquareClick = (position: Position) => {
    if (!testGameState) return

    const piece = testGameState.board[position.row][position.col]

    if (testSelectedSquare) {
      // Try to make a move
      if (testValidMoves.some((move) => move.row === position.row && move.col === position.col)) {
        const moveNotation = ChessLogic.getMoveNotation(testGameState, testSelectedSquare, position)
        const newGameState = ChessLogic.makeMove(testGameState, testSelectedSquare, position)

        if (newGameState) {
          setTestGameState(newGameState)

          // Check if this matches the expected solution
          if (solutionMoves.length > 0) {
            const playerMoveIndex = Math.floor(testGameState.moveHistory.length)
            const expectedMove = solutionMoves[playerMoveIndex]?.toLowerCase().replace(/[+#]/g, "")
            const playerMove = moveNotation.toLowerCase().replace(/[+#]/g, "")

            if (playerMove === expectedMove) {
              if (playerMoveIndex >= solutionMoves.length - 1) {
                setTestMessage("🎉 Puzzle solved correctly! Your solution works!")
              } else {
                setTestMessage("✓ Correct move! Continue...")

                // Auto-play opponent's response if it exists
                const nextMoveIndex = playerMoveIndex + 1
                if (nextMoveIndex < solutionMoves.length) {
                  setTimeout(() => {
                    const nextMove = ChessLogic.parseNotation(solutionMoves[nextMoveIndex])
                    if (nextMove[0] && nextMove[1]) {
                      const responseState = ChessLogic.makeMove(newGameState, nextMove[0], nextMove[1])
                      if (responseState) {
                        setTestGameState(responseState)
                        setTestMessage("Your turn - find the next move!")
                      }
                    }
                  }, 1000)
                }
              }
            } else {
              setTestMessage("❌ Wrong move! Try again or check your solution.")
            }
          } else {
            setTestMessage("Move made! (No solution recorded to check against)")
          }

          // Check for checkmate
          if (ChessLogic.isCheckmate(newGameState, newGameState.currentPlayer)) {
            setTestMessage("🏆 Checkmate! Position resolved.")
          } else if (ChessLogic.isInCheck(newGameState, newGameState.currentPlayer)) {
            setTestMessage(`Check! ${newGameState.currentPlayer} king is in danger.`)
          }
        }
      }
      setTestSelectedSquare(null)
      setTestValidMoves([])
    } else if (piece && piece.color === testGameState.currentPlayer) {
      setTestSelectedSquare(position)
      setTestValidMoves(ChessLogic.getValidMoves(testGameState, position))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>

          <h1 className="text-3xl font-bold text-white">Puzzle Editor</h1>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowInstructions(true)}
              className="bg-yellow-500/20 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Help
            </Button>
            {hasSeenTutorial && (
              <Button
                variant="outline"
                onClick={() => setShowTutorial(true)}
                className="bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
              >
                Tutorial
              </Button>
            )}
            <Button
              variant="outline"
              onClick={savePuzzle}
              className="bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              onClick={sharePuzzle}
              className="bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Tools */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mode Selector */}
            <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
              <h3 className="font-semibold text-white mb-3">Editor Mode</h3>
              <Tabs value={editorMode} onValueChange={(value) => setEditorMode(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="setup">Setup</TabsTrigger>
                  <TabsTrigger value="solution">Solution</TabsTrigger>
                  <TabsTrigger value="test">Test</TabsTrigger>
                </TabsList>
              </Tabs>
            </Card>

            {/* Piece Palette */}
            {editorMode === "setup" && (
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
                <h3 className="font-semibold text-white mb-3">Piece Palette</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {pieces.map((piece, index) => (
                    <Button
                      key={index}
                      variant={selectedPiece === piece ? "default" : "outline"}
                      className={`h-12 text-2xl ${
                        selectedPiece === piece
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-white/10 border-white/20 hover:bg-white/20"
                      }`}
                      onClick={() => setSelectedPiece(selectedPiece === piece ? null : piece)}
                    >
                      {getPieceSymbol(piece)}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearBoard}
                    className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetToInitial}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={switchSides}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Crown className="w-4 h-4 mr-1" />
                    Switch
                  </Button>
                </div>
              </Card>
            )}

            {/* Solution Recording */}
            {editorMode === "solution" && (
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
                <h3 className="font-semibold text-white mb-3">Solution Moves</h3>
                <div className="space-y-2 mb-4">
                  {solutionMoves.map((move, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded">
                      <span className="text-white">
                        {index + 1}. {move}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newMoves = solutionMoves.filter((_, i) => i !== index)
                          setSolutionMoves(newMoves)
                        }}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undoMove}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Undo Move
                </Button>
              </Card>
            )}

            {/* Puzzle Information */}
            <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
              <h3 className="font-semibold text-white mb-3">Puzzle Info</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={puzzleInfo.title}
                    onChange={(e) => setPuzzleInfo({ ...puzzleInfo, title: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Enter puzzle title"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={puzzleInfo.description}
                    onChange={(e) => setPuzzleInfo({ ...puzzleInfo, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Describe the puzzle"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="theme" className="text-white">
                    Theme
                  </Label>
                  <Select
                    value={puzzleInfo.theme}
                    onValueChange={(value) => setPuzzleInfo({ ...puzzleInfo, theme: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme} value={theme}>
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty" className="text-white">
                    Difficulty Rating
                  </Label>
                  <Input
                    id="difficulty"
                    type="number"
                    value={puzzleInfo.difficulty}
                    onChange={(e) => setPuzzleInfo({ ...puzzleInfo, difficulty: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="1000-2500"
                  />
                </div>
                <div>
                  <Label htmlFor="author" className="text-white">
                    Author
                  </Label>
                  <Input
                    id="author"
                    value={puzzleInfo.author}
                    onChange={(e) => setPuzzleInfo({ ...puzzleInfo, author: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Your name"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Center - Chess Board */}
          <div className="lg:col-span-2 flex justify-center">
            {editorMode === "test" ? (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Test Your Puzzle</h3>
                  <p className="text-gray-300 mb-2">{testMessage}</p>
                  {solutionMoves.length > 0 && (
                    <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30 mb-4">
                      <p className="text-blue-200 text-sm">
                        <strong>Solution to follow:</strong> {solutionMoves.join(", ")}
                      </p>
                      <p className="text-blue-300 text-xs mt-1">
                        Try to play the moves in this sequence to test your puzzle
                      </p>
                    </div>
                  )}
                </div>
                <ChessBoard
                  gameState={testGameState || gameState}
                  selectedSquare={testSelectedSquare}
                  validMoves={testValidMoves}
                  onSquareClick={handleTestSquareClick}
                  orientation="white"
                />
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTestGameState({ ...gameState })
                      setTestSelectedSquare(null)
                      setTestValidMoves([])
                      setTestMessage("Try to solve your puzzle!")
                    }}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Test
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditorMode("setup")}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Back to Setup
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (solutionMoves.length > 0) {
                        // Show hint for next move
                        const nextMoveIndex = Math.floor(testGameState?.moveHistory.length || 0)
                        if (nextMoveIndex < solutionMoves.length) {
                          const nextMove = solutionMoves[nextMoveIndex]
                          setTestMessage(`💡 Hint: Next move should be ${nextMove}`)
                          setTimeout(() => setTestMessage("Try to solve your puzzle!"), 3000)
                        }
                      }
                    }}
                    className="bg-yellow-500/20 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Hint
                  </Button>
                </div>
              </div>
            ) : (
              <ChessBoard
                gameState={gameState}
                selectedSquare={selectedSquare}
                validMoves={
                  editorMode === "solution"
                    ? ChessLogic.getValidMoves(gameState, selectedSquare || { row: 0, col: 0 })
                    : []
                }
                onSquareClick={handleSquareClick}
                orientation="white"
              />
            )}
          </div>

          {/* Right Panel - Saved Puzzles */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">Saved Puzzles</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={importPuzzle}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Import
                </Button>
              </div>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {savedPuzzles.map((puzzle) => (
                    <Card key={puzzle.id} className="p-3 bg-white/5 border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white text-sm">{puzzle.title}</h4>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => loadPuzzle(puzzle)} className="h-6 w-6 p-0">
                            <Play className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePuzzle(puzzle.id)}
                            className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-1 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {puzzle.theme}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {puzzle.difficulty}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-xs">{puzzle.description}</p>
                      <p className="text-gray-500 text-xs mt-1">by {puzzle.author}</p>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>

        {/* Tutorial Dialog */}
        <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
          <DialogContent className="bg-slate-800 border-slate-600 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">{tutorialSteps[tutorialStep].title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-300 text-lg leading-relaxed">{tutorialSteps[tutorialStep].content}</p>

              {/* Progress indicator */}
              <div className="flex items-center justify-center space-x-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === tutorialStep ? "bg-blue-400" : "bg-gray-600"}`}
                  />
                ))}
              </div>

              <div className="text-center text-sm text-gray-400">
                Step {tutorialStep + 1} of {tutorialSteps.length}
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                {tutorialStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={prevTutorialStep}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={skipTutorial}
                  className="bg-gray-500/20 border-gray-500/30 text-gray-300 hover:bg-gray-500/30"
                >
                  Skip Tutorial
                </Button>
              </div>

              <Button onClick={nextTutorialStep} className="bg-blue-600 hover:bg-blue-700 text-white">
                {tutorialStep === tutorialSteps.length - 1 ? "Get Started!" : "Next"}
                {tutorialStep < tutorialSteps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="bg-slate-800 border-slate-600">
            <DialogHeader>
              <DialogTitle className="text-white">Share Puzzle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Share Code</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={shareCode} readOnly className="bg-white/10 border-white/20 text-white" />
                  <Button onClick={copyShareCode} variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Share this code with others so they can import and play your puzzle!
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Instructions Dialog */}
        <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
          <DialogContent className="bg-slate-800 border-slate-600 max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">Puzzle Editor Instructions</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">🛠️ Setup Mode</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    • <strong>Select a piece</strong> from the palette, then click on the board to place it
                  </li>
                  <li>
                    • <strong>Move pieces:</strong> Click a piece on the board, then click where you want to move it
                  </li>
                  <li>
                    • <strong>Remove pieces:</strong> Click an empty square in the palette, then click a piece to remove
                    it
                  </li>
                  <li>
                    • <strong>Clear board:</strong> Remove all pieces at once
                  </li>
                  <li>
                    • <strong>Reset:</strong> Return to standard starting position
                  </li>
                  <li>
                    • <strong>Switch:</strong> Change which player moves first
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">🎯 Solution Mode</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    • <strong>Record moves:</strong> Click pieces and squares to record the correct solution
                  </li>
                  <li>
                    • <strong>Move sequence:</strong> Each move is automatically recorded in chess notation
                  </li>
                  <li>
                    • <strong>Undo moves:</strong> Remove the last move if you make a mistake
                  </li>
                  <li>
                    • <strong>Alternating turns:</strong> The game automatically switches between white and black
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">🧪 Test Mode</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    • <strong>Play your puzzle:</strong> Try solving it yourself to make sure it works
                  </li>
                  <li>
                    • <strong>Verify solution:</strong> Make sure only the recorded moves work
                  </li>
                  <li>
                    • <strong>Check difficulty:</strong> Ensure the puzzle matches your intended rating
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">📝 Puzzle Information</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    • <strong>Title:</strong> Give your puzzle a descriptive name
                  </li>
                  <li>
                    • <strong>Description:</strong> Explain what the puzzle is about
                  </li>
                  <li>
                    • <strong>Theme:</strong> Choose the tactical theme (fork, pin, sacrifice, etc.)
                  </li>
                  <li>
                    • <strong>Difficulty:</strong> Rate from 800 (beginner) to 2500+ (expert)
                  </li>
                  <li>
                    • <strong>Author:</strong> Your name or username
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">💾 Saving & Sharing</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    • <strong>Save:</strong> Store your puzzle locally in your browser
                  </li>
                  <li>
                    • <strong>Share:</strong> Generate a code that others can import
                  </li>
                  <li>
                    • <strong>Import:</strong> Load puzzles from share codes
                  </li>
                  <li>
                    • <strong>Load saved:</strong> Click the play button on any saved puzzle to edit it
                  </li>
                </ul>
              </div>

              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Tips for Good Puzzles</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Start with a clear tactical idea (fork, pin, mate in 2, etc.)</li>
                  <li>• Make sure there's only one correct solution</li>
                  <li>• Test your puzzle thoroughly before sharing</li>
                  <li>• Keep the position realistic - avoid too many queens!</li>
                  <li>• Write a helpful description that guides solvers</li>
                  <li>• Rate difficulty honestly based on how hard it is to find</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
