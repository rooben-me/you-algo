import React, { useState } from "react"

const AIInfoButton = ({ aiInfo, removed }) => {
  return (
    <div
      style={{
        backgroundColor: removed ? "#450a0a" : "#1a2e05",
        color: removed ? "#fecaca" : "#d9f99d",
        padding: "8px",
        borderRadius: "0px 0px 8px 8px",
        fontSize: "14px",
        marginTop: "8px",
        textAlign: "left"
      }}>
      {aiInfo || "No AI info available"}
    </div>
  )
}

export default AIInfoButton
