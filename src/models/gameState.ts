import { GameState, Cell, Position } from "./types"

// 보드 크기 정의
export const GRID_SIZE = 33

// 초기 게임 상태 설정
export const initialGameState: GameState = {
  board: Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE)
        .fill(null)
        .map(() => ({ isWall: false }))
    ),
  robots: {
    R: { color: "red", pos: { x: 1, y: 1 } },
    B: { color: "blue", pos: { x: 3, y: 3 } },
    G: { color: "green", pos: { x: 5, y: 5 } },
    Y: { color: "yellow", pos: { x: 7, y: 7 } },
  },
  target: { color: "red", pos: { x: 15, y: 15 } },
}
