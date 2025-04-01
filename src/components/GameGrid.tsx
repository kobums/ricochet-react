import React from "react"
import Cell from "./Cell"
import { GameState } from "../models/types"

type GameGridProps = {
  gameState: GameState
  highlightedCells: { x: number; y: number; color: string }[]
  selectedRobot: string | null
  onRobotClick: (color: string, x: number, y: number) => void
  onMoveToCell: (x: number, y: number) => void
  onReset: () => void
}

const GameGrid: React.FC<GameGridProps> = ({
  gameState,
  highlightedCells,
  selectedRobot,
  onRobotClick,
  onMoveToCell,
  onReset,
}) => {
  return (
    <div
      className="grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(16, 40px)`,
        gridTemplateRows: `repeat(16, 40px)`,
        backgroundColor: "#ccc",
        padding: "10px",
      }}
    >
      {Array.from({ length: 16 }, (_, gridY) =>
        Array.from({ length: 16 }, (_, gridX) => {
          const realX = gridX * 2 + 1
          const realY = gridY * 2 + 1
          return (
            <Cell
              key={`${gridX}-${gridY}`}
              realX={realX}
              realY={realY}
              gameState={gameState}
              highlightedCells={highlightedCells}
              selectedRobot={selectedRobot}
              onRobotClick={onRobotClick}
              onMoveToCell={onMoveToCell}
              onReset={onReset}
            />
          )
        })
      )}
    </div>
  )
}

export default GameGrid
