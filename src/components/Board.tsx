import React, { useState, useEffect } from "react"
import { getGameState, shuffleQuadrants } from "../controllers/gameController"
import { GRID_SIZE } from "../models/gameState"
import { motion } from "framer-motion"
import { HistoryEntry } from "../models/types"
import HistoryPanel from "./HistoryPanel"
import RobotMoveLog from "./RobotMoveLog"

const Board: React.FC = () => {
  const gameState = getGameState()
  const [selectedRobot, setSelectedRobot] = useState<string | null>(null)
  const [highlightedCells, setHighlightedCells] = useState<
    { x: number; y: number; color: string }[]
  >([])
  const [moveCount, setMoveCount] = useState(0)
  const [robotHistory, setRobotHistory] = useState<HistoryEntry[]>([])
  const [robotMoveLog, setRobotMoveLog] = useState<
    { color: string; direction: "up" | "down" | "left" | "right" }[]
  >([])

  const colors = ["red", "blue", "green", "yellow"]

  const getColor = (color: string) => {
    switch (color) {
      case "red":
        return "red"
      case "blue":
        return "blue"
      case "green":
        return "green"
      case "yellow":
        return "gold"
      default:
        return "black"
    }
  }

  const getHighlightColor = (color: string) => {
    switch (color) {
      case "red":
        return "rgba(255,0,0,0.3)"
      case "blue":
        return "rgba(0,0,255,0.3)"
      case "green":
        return "rgba(0,128,0,0.3)"
      case "yellow":
        return "rgba(255,215,0,0.3)"
      default:
        return "transparent"
    }
  }

  const Wall: React.FC<{ position: "top" | "bottom" | "left" | "right" }> = ({
    position,
  }) => {
    const styles: Record<string, React.CSSProperties> = {
      top: {
        position: "absolute",
        top: 0,
        left: "25%",
        right: "25%",
        height: "3px",
        background: "#333",
      },
      bottom: {
        position: "absolute",
        left: "25%",
        right: "25%",
        bottom: 0,
        height: "3px",
        background: "#333",
      },
      left: {
        position: "absolute",
        left: 0,
        top: "25%",
        bottom: "25%",
        width: "3px",
        background: "#333",
      },
      right: {
        position: "absolute",
        right: 0,
        top: "25%",
        bottom: "25%",
        width: "3px",
        background: "#333",
      },
    }
    return <div style={styles[position]} />
  }

  const makeTarget = () => {
    // 목표 위치 설정
    while (true) {
      const x = Math.floor(Math.random() * (GRID_SIZE / 2)) * 2 + 1
      const y = Math.floor(Math.random() * (GRID_SIZE / 2)) * 2 + 1
      // 범위 체크 먼저!
      if (y >= GRID_SIZE || x >= GRID_SIZE) continue

      if (
        !gameState.board[y][x].isWall &&
        ((gameState.board[y - 1][x].isWall &&
          gameState.board[y][x + 1].isWall) ||
          (gameState.board[y - 1][x].isWall &&
            gameState.board[y][x - 1].isWall) ||
          (gameState.board[y + 1][x].isWall &&
            gameState.board[y][x + 1].isWall) ||
          (gameState.board[y + 1][x].isWall &&
            gameState.board[y][x - 1].isWall))
      ) {
        gameState.target.pos = { x, y }
        gameState.target.color =
          colors[Math.floor(Math.random() * colors.length)]
        break
      }
    }
  }

  const showHighlights = (color: string, x: number, y: number) => {
    const highlights: { x: number; y: number; color: string }[] = []

    const directions = [
      { dx: 0, dy: -2 }, // up
      { dx: 0, dy: 2 }, // down
      { dx: -2, dy: 0 }, // left
      { dx: 2, dy: 0 }, // right
    ]

    directions.forEach(({ dx, dy }) => {
      let nx = x
      let ny = y

      while (true) {
        const tx = nx + dx
        const ty = ny + dy
        if (tx < 0 || ty < 0 || tx >= GRID_SIZE || ty >= GRID_SIZE) break
        const wx = (nx + tx) / 2
        const wy = (ny + ty) / 2
        if (gameState.board[wy][wx].isWall) break
        if (
          Object.values(gameState.robots).some(
            (r) => r.pos.x === tx && r.pos.y === ty
          )
        )
          break

        highlights.push({ x: tx, y: ty, color })
        nx = tx
        ny = ty
      }
    })

    setHighlightedCells(highlights)
  }

  const handleRobotClick = (color: string, x: number, y: number) => {
    if (selectedRobot === color && highlightedCells.length > 0) {
      setSelectedRobot(null)
      setHighlightedCells([])
      return
    }
    setSelectedRobot(color)
    showHighlights(color, x, y)
  }

  const handleMoveToCell = (x: number, y: number) => {
    if (!selectedRobot) return
    const robot = gameState.robots[selectedRobot]
    let { x: rx, y: ry } = robot.pos

    let dx = 0,
      dy = 0
    let dir: "up" | "down" | "left" | "right" = "up" // 기본값 할당 (초
    // 클릭한 셀 위치와 현재 로봇 위치로 방향 계산
    if (x > rx) {
      dx = 2
      dir = "right"
    } else if (x < rx) {
      dx = -2
      dir = "left"
    } else if (y > ry) {
      dy = 2
      dir = "down"
    } else if (y < ry) {
      dy = -2
      dir = "up"
    }

    setRobotMoveLog((prev) => [...prev, { color: robot.color, direction: dir }])

    // 끝까지 이동
    while (true) {
      const nx = rx + dx
      const ny = ry + dy
      if (nx < 0 || ny < 0 || nx >= GRID_SIZE || ny >= GRID_SIZE) break
      const wx = (rx + nx) / 2
      const wy = (ry + ny) / 2
      if (gameState.board[wy][wx].isWall) break
      if (
        Object.values(gameState.robots).some(
          (r) => r.pos.x === nx && r.pos.y === ny
        )
      )
        break
      rx = nx
      ry = ny
    }

    // // 이동 후 초기화
    robot.pos = { x: rx, y: ry }

    setMoveCount((prev) => prev + 1)

    // 목표와 같은 위치 & 같은 색상 로봇일 경우
    if (
      robot.color === gameState.target.color &&
      robot.pos.x === gameState.target.pos.x &&
      robot.pos.y === gameState.target.pos.y
    ) {
      // 기록 저장
      setRobotHistory((prev) => {
        // 마지막 기록의 count만 업데이트
        const updatedHistory = [...prev]
        if (updatedHistory.length > 0) {
          updatedHistory[updatedHistory.length - 1].count = moveCount + 1
        }

        // 새 기록 추가 (초기 count는 0)
        updatedHistory.push({
          robots: Object.keys(gameState.robots).reduce((acc, color) => {
            acc[color] = { ...gameState.robots[color].pos }
            return acc
          }, {} as { [color: string]: { x: number; y: number } }),
          target: {
            color: gameState.target.color, // 여기서 복사
            pos: gameState.target.pos, // pos도 복사
          },
          count: 0,
        })

        return updatedHistory
      })

      // 새 target 설정
      while (true) {
        const tx = Math.floor(Math.random() * (GRID_SIZE / 2)) * 2 + 1
        const ty = Math.floor(Math.random() * (GRID_SIZE / 2)) * 2 + 1

        // 범위 체크 먼저!
        if (ty >= GRID_SIZE || tx >= GRID_SIZE) continue

        if (
          !gameState.board[ty][tx].isWall &&
          ((gameState.board[ty - 1][tx].isWall &&
            gameState.board[ty][tx + 1].isWall) ||
            (gameState.board[ty - 1][tx].isWall &&
              gameState.board[ty][tx - 1].isWall) ||
            (gameState.board[ty + 1][tx].isWall &&
              gameState.board[ty][tx + 1].isWall) ||
            (gameState.board[ty + 1][tx].isWall &&
              gameState.board[ty][tx - 1].isWall))
        ) {
          gameState.target.pos = { x: tx, y: ty }
          gameState.target.color =
            colors[Math.floor(Math.random() * colors.length)]
          break
        }
      }
      // count 리셋
      setMoveCount(0)
      setSelectedRobot(null)
      setHighlightedCells([])
      setRobotMoveLog([])
    } else {
      // 이동 후 자동으로 새 위치에서 하이라이트 다시 생성
      setTimeout(() => {
        setSelectedRobot(selectedRobot)
        showHighlights(selectedRobot, rx, ry)
      }, 100)
    }
  }

  const handleReset = () => {
    Object.entries(robotHistory[robotHistory.length - 1].robots).forEach(
      ([color, pos]) => {
        gameState.robots[color].pos = pos
      }
    )
    setMoveCount(0)
    setSelectedRobot(null)
    setHighlightedCells([])
    setRobotMoveLog([])
  }

  const handleHistoryClick = (entry: any) => {
    Object.entries(entry.robots).forEach(([color, pos]: any) => {
      gameState.robots[color].pos = pos
    })
    gameState.target = entry.target
    setMoveCount(0)
    setSelectedRobot(null)
    setHighlightedCells([])
    setRobotMoveLog([])
  }

  useEffect(() => {
    shuffleQuadrants()
  }, [])

  useEffect(() => {
    const positions: { [key: string]: { x: number; y: number } } = {}

    // 바깥 벽 추가 (0, GRID_SIZE-1에 벽)
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (x === 0 || x === GRID_SIZE - 1 || y === 0 || y === GRID_SIZE - 1) {
          gameState.board[y][x].isWall = true
        }
      }
    }

    // 로봇 초기 배치

    colors.forEach((color) => {
      while (true) {
        const x = Math.floor(Math.random() * (GRID_SIZE / 2)) * 2 + 1
        const y = Math.floor(Math.random() * (GRID_SIZE / 2)) * 2 + 1

        // 범위 체크 먼저!
        if (y >= GRID_SIZE || x >= GRID_SIZE) continue

        if (
          !gameState.board[y][x].isWall &&
          !Object.values(gameState.robots).some(
            (r) => r.pos.x === x && r.pos.y === y
          )
        ) {
          gameState.robots[color].pos = { x, y }

          positions[color] = { x, y }
          break
        }
      }
    })

    makeTarget()
    setRobotHistory([
      {
        robots: Object.keys(gameState.robots).reduce((acc, color) => {
          acc[color] = { ...gameState.robots[color].pos }
          return acc
        }, {} as { [color: string]: { x: number; y: number } }),
        target: {
          color: gameState.target.color,
          pos: { ...gameState.target.pos },
        },
        count: 0,
      },
    ])
  }, [gameState])

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          backgroundColor: "#111",
          flexDirection: "column",
        }}
      >
        <div style={{ color: "white", marginBottom: "20px", fontSize: "20px" }}>
          Move Count: {moveCount}
        </div>
        <div
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
                gameState.target.pos.x === realX &&
                gameState.target.pos.y === realY

              return (
                <div
                  key={`${gridX}-${gridY}`}
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: isHighlighted
                      ? getHighlightColor(highlightColor || "")
                      : "#f7f1d0",
                    border: "1px solid #aaa",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    cursor: robot || isResetButton ? "pointer" : "default",
                  }}
                  onClick={() => {
                    if (isResetButton) {
                      handleReset()
                    } else if (isHighlighted) handleMoveToCell(realX, realY)
                    else if (robot) handleRobotClick(robot[0], realX, realY)
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
                        style={{ fontSize: "18px", color: getColor(robot[0]) }}
                      >
                        ●
                      </span>
                    </motion.div>
                  )}

                  {isResetButton && !robot && !isTarget && (
                    <span style={{ color: "white", fontSize: "20px" }}>⟳</span>
                  )}

                  {isTarget && !robot && (
                    <span
                      style={{
                        fontSize: "16px",
                        color: gameState.target.color,
                      }}
                    >
                      ★
                    </span>
                  )}

                  {/* 벽 렌더링 */}
                  {gameState.board[realY][realX + 1]?.isWall && (
                    <Wall position="right" />
                  )}
                  {gameState.board[realY + 1]?.[realX]?.isWall && (
                    <Wall position="bottom" />
                  )}
                  {realY === 1 && <Wall position="top" />}
                  {realX === 1 && <Wall position="left" />}
                </div>
              )
            })
          )}
        </div>
      </div>
      <RobotMoveLog moves={robotMoveLog} />
      <HistoryPanel history={robotHistory} onSelect={handleHistoryClick} />
    </>
  )
}

export default Board
