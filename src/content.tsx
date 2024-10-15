import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useState } from "react"

// Configuration for PlasmoCS
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// Function to create a style element with the CSS text
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  return <div className="bg-red-500 top-5 fixed right-5">red</div>
}

export default PlasmoOverlay
