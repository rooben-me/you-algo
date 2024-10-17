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
      relevanceScore?: number
      removed?: boolean // Track removal status
    }[]
  >([])
  const [prevVideoItemCount, setPrevVideoItemCount] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const videoItems = Array.from(
        document.querySelectorAll("ytd-rich-item-renderer")
      ).filter((element) => {
        return !element.closest("ytd-rich-section-renderer")
      })

      // Check if the number of video items has changed (indicating DOM update)
      if (videoItems.length !== prevVideoItemCount) {
        const newVideoData = videoItems.map((element) => {
          const existingVideo = videoData.find((vd) => vd.element === element)

          if (!existingVideo) {
            const videoInfo = extractVideoInfo(element)
            const relevanceScore = getRelevanceScore(videoInfo)
            const scoreNumber = Number(relevanceScore)
            const removed = scoreNumber < 30

            return {
              element,
              videoInfo,
              relevanceScore: scoreNumber,
              removed // Set removed status
            }
          } else {
            return existingVideo // Reuse if its existsing
          }
        })

        setVideoData(newVideoData)
        setPrevVideoItemCount(videoItems.length)
      }
    }, 250)

    return () => clearInterval(intervalId)
  }, [videoData, prevVideoItemCount])

  useEffect(() => {
    videoData.forEach((item) => {
      if (item.removed && item.element.parentNode) {
        // Hide the content
        item.element.style.border = "2px solid red"
        //  item.element.style.display = "none"
      } else if (!item.removed && item.element) {
        item.element.style.border = "2px solid green"
      }
    })
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
