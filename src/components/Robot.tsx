import React from "react"
import { Position, Robot as RobotType } from "../models/types"

interface RobotProps {
  robot: RobotType
}

const Robot: React.FC<RobotProps> = ({ robot }) => {
  return (
    <div
      className="absolute flex items-center justify-center w-6 h-6 rounded-full text-white font-bold"
      style={{
        left: `${robot.pos.x * 20}px`, // 보드 크기에 맞게 조정
        top: `${robot.pos.y * 20}px`,
        backgroundColor: robot.color,
      }}
    >
      🤖
    </div>
  )
}

export default Robot
