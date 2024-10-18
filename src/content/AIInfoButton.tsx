import React, { useState } from "react"

const AIInfoButton = ({ aiInfo }) => {
  return (
    <div
      style={{
        backgroundColor: "#1f2937", // Tailwind's gray-800
        color: "white",
        padding: "8px",
        borderRadius: "4px",
        fontSize: "12px",
        width: "200px",
        textAlign: "center"
      }}>
      {aiInfo || "No AI info available"}
    </div>
  )
}

export default AIInfoButton
