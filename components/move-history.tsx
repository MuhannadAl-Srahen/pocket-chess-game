"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, XCircle } from "lucide-react"

interface MoveHistoryProps {
  moveHistory: {
    from: { row: number; col: number }
    to: { row: number; col: number }
    piece: { type: string; color: string }
    captured?: { type: string; color: string }
  }[]
  puzzleCompleted: boolean
  puzzleFailed: boolean
}

export function MoveHistory({ moveHistory, puzzleCompleted, puzzleFailed }: MoveHistoryProps) {
  const formatPosition = (pos: { row: number; col: number }): string => {
    const file = String.fromCharCode(97 + pos.col)
    const rank = 8 - pos.row
    return `${file}${rank}`
  }

  const formatMove = (
    from: { row: number; col: number },
    to: { row: number; col: number },
    piece: { type: string; color: string },
    captured?: { type: string; color: string },
  ): string => {
    const pieceSymbol = getPieceSymbol(piece.type, piece.color)
    const fromPos = formatPosition(from)
    const toPos = formatPosition(to)
    const captureSymbol = captured ? "x" : ""
    return `${pieceSymbol}${fromPos}${captureSymbol}${toPos}`
  }

  const getPieceSymbol = (type: string, color: string): string => {
    if (type === "pawn") return ""
    const symbols: Record<string, string> = {
      king: "K",
      queen: "Q",
      rook: "R",
      bishop: "B",
      knight: "N",
    }
    return symbols[type] || ""
  }

  const getPairs = () => {
    const pairs = []
    for (let i = 0; i < moveHistory.length; i += 2) {
      pairs.push({
        white: moveHistory[i],
        black: i + 1 < moveHistory.length ? moveHistory[i + 1] : null,
      })
    }
    return pairs
  }

  return (
    <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white">Move History</h3>
        {puzzleCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
        {puzzleFailed && <XCircle className="w-5 h-5 text-red-400" />}
      </div>
      <ScrollArea className="h-[200px] pr-4">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-sm">
              <th className="w-10 text-left">#</th>
              <th className="text-left">White</th>
              <th className="text-left">Black</th>
            </tr>
          </thead>
          <tbody>
            {getPairs().map((pair, index) => (
              <tr key={index} className="border-b border-white/10 last:border-0">
                <td className="py-2 text-gray-500">{index + 1}.</td>
                <td className="py-2 text-white">
                  {pair.white && formatMove(pair.white.from, pair.white.to, pair.white.piece, pair.white.captured)}
                </td>
                <td className="py-2 text-gray-300">
                  {pair.black && formatMove(pair.black.from, pair.black.to, pair.black.piece, pair.black.captured)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </Card>
  )
}
