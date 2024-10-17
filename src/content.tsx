import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useState } from "react"

import { Marker } from "./content/marker"

// Configuration for PlasmoCS
export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/"]
}

// Function to create a style element with the CSS text
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const [videoData, setVideoData] = useState<
    {
      element: Element
      videoInfo: {
        title: string
        channel: string
        views: string
        timeAgo: string
      }
      relevanceScore?: number // Store relevance score
    }[]
  >([])

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const videoItems = Array.from(
        document.querySelectorAll("ytd-rich-item-renderer")
      ).filter((element) => {
        // Filter out shorts
        return !element.closest("ytd-rich-section-renderer")
      })

      const newVideoData = Array.from(videoItems).map((element) => {
        const videoInfo = extractVideoInfo(element)
        const relevanceScore = getRelevanceScore(videoInfo)

        return {
          element,
          videoInfo,
          relevanceScore
        }
      })

      console.log(newVideoData, "new vidoe data")
      setVideoData(newVideoData)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [])

  // Mock function - replace with your actual AI call
  function getRelevanceScore(videoInfo: {
    title: string
    channel: string
    views: string
    timeAgo: string
  }): number {
    // Send videoInfo to your AI service and get a relevance score
    // Example:
    return Math.random() * 100
  }

  function extractVideoInfo(element: Element) {
    const titleElement = element.querySelector("#video-title")
    const channelElement = element.querySelector("#text.ytd-channel-name")
    const viewsElement = element.querySelector("span.ytd-video-meta-block")
    const timeElement = element.querySelectorAll("span.ytd-video-meta-block")[1]

    return {
      title: titleElement?.textContent?.trim() || "",
      channel: channelElement?.textContent?.trim() || "",
      views: viewsElement?.textContent?.trim() || "",
      timeAgo: timeElement?.textContent?.trim() || ""
    }
  }

  return <Marker />
}

export default PlasmoOverlay
