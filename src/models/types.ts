export interface Position {
  x: number
  y: number
}

export interface Robot {
  color: string
  pos: Position
}

export interface Cell {
  isWall: boolean
}

export interface Target {
  color: string
  pos: Position
}

export interface HistoryEntry {
  robots: { [color: string]: { x: number; y: number } }
  target: Target
  count: number
}

export interface GameState {
  board: Cell[][]
  robots: Record<string, Robot>
  target: Target
}
