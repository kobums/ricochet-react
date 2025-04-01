import React from "react"
import { motion } from "framer-motion"
import { GameState } from "../models/types"

interface CellProps {
  realX: number
  realY: number
  gameState: GameState
  highlightedCells: { x: number; y: number; color: string }[]
  selectedRobot: string | null
  onRobotClick: (color: string, x: number, y: number) => void
  onMoveToCell: (x: number, y: number) => void
  onReset: () => void
}

const Cell: React.FC<CellProps> = ({
  realX,
  realY,
  gameState,
  highlightedCells,
  selectedRobot,
  onRobotClick,
  onMoveToCell,
  onReset,
}) => {
  const isResetButton =
    (realX === 15 || realX === 17) && (realY === 15 || realY === 17)

  const robot = Object.entries(gameState.robots).find(
    ([, r]) => r.pos.x === realX && r.pos.y === realY
  )

  const isHighlighted = highlightedCells.some(
    (h) => h.x === realX && h.y === realY
  )

  const highlightColor = highlightedCells.find(
    (h) => h.x === realX && h.y === realY
  )?.color

  const isTarget =
    gameState.target.pos.x === realX && gameState.target.pos.y === realY

  const handleClick = () => {
    if (isResetButton) {
      onReset()
    } else if (isHighlighted) {
      onMoveToCell(realX, realY)
    } else if (robot) {
      onRobotClick(robot[0], realX, realY)
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        width: "40px",
        height: "40px",
        backgroundColor: isHighlighted
          ? highlightColor === "red"
            ? "rgba(255,0,0,0.3)"
            : highlightColor === "blue"
            ? "rgba(0,0,255,0.3)"
            : highlightColor === "green"
            ? "rgba(0,128,0,0.3)"
            : "rgba(255,215,0,0.3)"
          : "#f7f1d0",
        border: "1px solid #aaa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        cursor: "pointer",
      }}
    >
      {robot && (
        <motion.div
          key={robot[0]}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 18,
            duration: 0.5,
          }}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              color:
                robot[0] === "red"
                  ? "red"
                  : robot[0] === "blue"
                  ? "blue"
                  : robot[0] === "green"
                  ? "green"
                  : "gold",
            }}
          >
            ●
          </span>
        </motion.div>
      )}

      {isResetButton && !robot && !isTarget && (
        <span style={{ color: "white", fontSize: "20px" }}>⟳</span>
      )}

      {isTarget && !robot && (
        <span style={{ fontSize: "16px", color: gameState.target.color }}>
          ★
        </span>
      )}

      {/* 오른쪽 벽 */}
      {gameState.board[realY][realX + 1]?.isWall && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "25%",
            bottom: "25%",
            width: "3px",
            background: "#333",
          }}
        />
      )}
      {/* 아래쪽 벽 */}
      {gameState.board[realY + 1]?.[realX]?.isWall && (
        <div
          style={{
            position: "absolute",
            left: "25%",
            right: "25%",
            bottom: 0,
            height: "3px",
            background: "#333",
          }}
        />
      )}
      {/* 위쪽 외벽 */}
      {realY === 1 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "25%",
            right: "25%",
            height: "3px",
            background: "#333",
          }}
        />
      )}
      {/* 왼쪽 외벽 */}
      {realX === 1 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "25%",
            bottom: "25%",
            width: "3px",
            background: "#333",
          }}
        />
      )}
    </div>
  )
}

export default Cell
