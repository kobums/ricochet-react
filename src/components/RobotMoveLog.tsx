import React from "react"

export interface RobotMoveLogProps {
  moves: { color: string; direction: "up" | "down" | "left" | "right" }[]
}

const RobotMoveLog: React.FC<RobotMoveLogProps> = ({ moves }) => {
  const directionIcon: { [key: string]: string } = {
    up: "↑",
    down: "↓",
    left: "←",
    right: "→",
  }

  const lastMove = moves[moves.length - 1]

  return (
    <div
      style={{
        background: "#ccc",
        border: "2px solid #888",
        padding: "10px",
        borderRadius: "10px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          background: "#000",
          color: "#fff",
          padding: "5px",
          marginBottom: "10px",
          fontWeight: "bold",
          height: "40px",
        }}
      >
        {moves.map((move, idx) => (
          <span
            key={idx}
            style={{
              marginRight: "5px",
            }}
          >
            <span
              style={{
                color: move.color,
              }}
            >
              {directionIcon[move.direction]}
            </span>
          </span>
        ))}
      </div>

      {/* {lastMove && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              background: lastMove.color,
              border: "5px solid #555",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: lastMove.color,
              fontSize: "20px",
              marginRight: "10px",
            }}
          >
            ?
          </div>
          <div style={{ fontSize: "18px" }}>
            {robotColorMap[lastMove.color]} solving...
          </div>
        </div>
      )} */}
    </div>
  )
}

export default RobotMoveLog
