import React from "react"
import { motion } from "framer-motion"
import { HistoryEntry } from "../models/types"

interface HistoryPanelProps {
  history: HistoryEntry[]
  onSelect: (entry: HistoryEntry) => void
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect }) => {
  return (
    <div
      style={{
        background: "#ccc",
        padding: "8px",
        display: "flex",
        gap: "16px",
        justifyContent: "flex-start",
        overflowX: "auto",
        borderTop: "2px solid #888",
      }}
    >
      {history
        .slice()
        .reverse()
        .map((entry, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              minWidth: "60px",
              background: "#fff",
              border: "1px solid #999",
              borderRadius: "8px",
              padding: "4px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => onSelect(entry)}
          >
            <div style={{ fontWeight: "bold" }}>{entry.target.color}</div>
            <div style={{ fontSize: "12px", marginTop: "2px" }}>
              {entry.count} steps
            </div>
          </motion.div>
        ))}
    </div>
  )
}

export default HistoryPanel
