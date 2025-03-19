import React, { useState } from "react"
import Board from "../components/Board"
import { resetGame } from "../controllers/gameController"

const Home: React.FC = () => {
  const [key, setKey] = useState(0)

  const handleReset = () => {
    resetGame()
    setKey((prev) => prev + 1) // UI 강제 업데이트
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Ricochet Robots</h1>
      <Board key={key} />
      <button className="p-2 bg-red-500 text-white" onClick={handleReset}>
        Reset Game
      </button>
    </div>
  )
}

export default Home
