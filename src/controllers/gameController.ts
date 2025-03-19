import { GameState, Position } from "../models/types"
import { GRID_SIZE, initialGameState } from "../models/gameState"

// 게임 상태
let gameState = { ...initialGameState }

// 기본 벽 좌표
export const oneBoard: Position[] = [
  { x: 12, y: 1 },
  { x: 6, y: 5 },
  { x: 10, y: 7 },
  { x: 6, y: 9 },
  { x: 10, y: 11 },
  { x: 7, y: 4 },
  { x: 1, y: 8 },
  { x: 5, y: 8 },
  { x: 11, y: 8 },
  { x: 9, y: 12 },
]

export const twoBoard: Position[] = [
  { x: 1, y: 12 },
  { x: 3, y: 4 },
  { x: 5, y: 10 },
  { x: 13, y: 4 },
  { x: 15, y: 10 },
  { x: 2, y: 3 },
  { x: 6, y: 9 },
  { x: 8, y: 1 },
  { x: 14, y: 5 },
  { x: 14, y: 11 },
]

export const threeBoard: Position[] = [
  { x: 12, y: 1 },
  { x: 6, y: 5 },
  { x: 10, y: 7 },
  { x: 6, y: 9 },
  { x: 10, y: 11 },
  { x: 7, y: 4 },
  { x: 1, y: 8 },
  { x: 5, y: 8 },
  { x: 11, y: 8 },
  { x: 9, y: 12 },
]

export const fourBoard: Position[] = [
  { x: 4, y: 1 },
  { x: 6, y: 3 },
  { x: 2, y: 9 },
  { x: 10, y: 13 },
  { x: 14, y: 7 },
  { x: 1, y: 12 },
  { x: 3, y: 10 },
  { x: 7, y: 2 },
  { x: 9, y: 12 },
  { x: 13, y: 8 },
]

export const centerWall: Position[] = [
  { x: 14, y: 15 },
  { x: 14, y: 17 },
  { x: 18, y: 15 },
  { x: 18, y: 17 },
  { x: 15, y: 14 },
  { x: 17, y: 14 },
  { x: 15, y: 18 },
  { x: 17, y: 18 },
]

export const centerBoard: Position[] = [
  { x: 15, y: 15 },
  { x: 15, y: 17 },
  { x: 17, y: 15 },
  { x: 17, y: 17 },
]

// 이동 함수
export const moveRobot = (robotColor: string, direction: string) => {
  const robot = gameState.robots[robotColor]
  if (!robot) return

  let { x, y } = robot.pos
  let dx = 0,
    dy = 0

  switch (direction) {
    case "up":
      dy = -2
      break
    case "down":
      dy = 2
      break
    case "left":
      dx = -2
      break
    case "right":
      dx = 2
      break
  }

  while (true) {
    let nx = x + dx,
      ny = y + dy

    // 보드 밖으로 나가는 경우 멈춤
    if (nx < 0 || ny < 0 || nx >= GRID_SIZE || ny >= GRID_SIZE) break

    // 벽 충돌 체크
    let wx = (x + nx) / 2,
      wy = (y + ny) / 2
    if (gameState.board[wy][wx].isWall) break

    // 다른 로봇과 충돌 체크
    if (
      Object.values(gameState.robots).some(
        (r) => r.pos.x === nx && r.pos.y === ny
      )
    ) {
      break
    }

    // 이동
    x = nx
    y = ny
  }

  gameState.robots[robotColor].pos = { x, y }
}

// ✅ 사분면 변환 함수 (Go 코드 변환)
const transformPosition = (p: Position, index: number): Position => {
  switch (index) {
    case 1:
      return p // 1사분면 그대로 유지
    case 2:
      return { x: GRID_SIZE - p.y - 1, y: p.x } // 2사분면
    case 3:
      return { x: p.y, y: GRID_SIZE - p.x - 1 } // 3사분면
    case 4:
      return { x: GRID_SIZE - p.x - 1, y: GRID_SIZE - p.y - 1 } // 4사분면
    default:
      return p
  }
}

// ✅ 사분면을 랜덤하게 섞는 함수
export const shuffleQuadrants = () => {
  const quadrantOrder = [1, 2, 3, 4]
  quadrantOrder.sort(() => Math.random() - 0.5)

  const newWalls: Position[] = []

  quadrantOrder.forEach((newQ, i) => {
    let boardToUse: Position[]

    // 각 사분면의 벽 데이터를 선택
    switch (newQ) {
      case 1:
        boardToUse = oneBoard
        break
      case 2:
        boardToUse = twoBoard
        break
      case 3:
        boardToUse = threeBoard
        break
      case 4:
        boardToUse = fourBoard
        break
      default:
        return
    }

    // 변환된 벽 좌표 추가
    boardToUse.forEach((p) => {
      newWalls.push(transformPosition(p, i + 1))
    })
  })

  // 기존 보드를 초기화 후 새로운 벽 설정
  gameState.board = initialGameState.board.map((row) =>
    row.map((cell) => ({ isWall: false }))
  )
  newWalls.forEach(({ x, y }) => {
    gameState.board[y][x].isWall = true
  })
  centerWall.forEach(({ x, y }) => {
    gameState.board[y][x].isWall = true
  })

  centerBoard.forEach(({ x, y }) => {
    gameState.board[y][x].isWall = true
  })
}

// 게임 초기화 함수
export const resetGame = () => {
  gameState = { ...initialGameState }
}

// 현재 게임 상태 반환
export const getGameState = () => {
  // shuffleQuadrants()
  return gameState
}
