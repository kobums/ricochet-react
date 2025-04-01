import React from "react"
import Board from "../components/Board"
// import RobotMoveLog from "./RobotMoveLog"
// import HistoryPanel from "./HistoryPanel"

const RicochetPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 space-y-6">
      <Board />
    </div>
  )
}

export default RicochetPage
