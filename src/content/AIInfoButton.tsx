import React, { useState } from "react"
import ReactDOM from "react-dom"

const AIInfoButton = ({ aiInfo, avatarContainer }) => {
  const [isHovered, setIsHovered] = useState(false)

  return ReactDOM.createPortal(
    <div
      className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 bg-blue-500 text-white rounded-full w-5 h-5 flex justify-center items-center text-xs cursor-pointer z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      AI
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-center rounded-md p-2 w-48 text-xs z-50">
          {aiInfo || "No AI info available"}
        </div>
      )}
    </div>,
    avatarContainer
  )
}

export default AIInfoButton
