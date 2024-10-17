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

  console.log(videoData, "videoData")

  useEffect(() => {
    const intervalId = setInterval(() => {
      const videoItems = Array.from(
        document.querySelectorAll("ytd-rich-item-renderer")
      ).filter((element) => {
        return !element.closest("ytd-rich-section-renderer")
      })

      const processedVideos: typeof videoData = []

      for (const element of videoItems) {
        const existingVideo = videoData.find((vd) => vd.element === element)

        if (!existingVideo) {
          // Only process new video elements
          const videoInfo = extractVideoInfo(element)
          const relevanceScore = getRelevanceScore(videoInfo)
          const scoreNumber = Number(relevanceScore)

          if (scoreNumber < 30) {
            element.style.border = "2px solid red"
          } else {
            element.style.border = "2px solid green"
          }

          processedVideos.push({
            element,
            videoInfo,
            relevanceScore: scoreNumber
          })
        }
      }
      // Only update state if new videos were processed.
      if (processedVideos.length > 0) {
        setVideoData((prevData) => [...prevData, ...processedVideos])
      }
    }, 500) // Check every 500ms - adjust as needed

    return () => clearInterval(intervalId)
  }, [videoData])

  // Mock function - replace with your actual AI call
  function getRelevanceScore(videoInfo: {
    title: string
    channel: string
    views: string
    timeAgo: string
  }): number {
    // Send videoInfo to your AI service and get a relevance score
    // Example:
    return Math.random() * 40
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
