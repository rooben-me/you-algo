import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useState } from "react"
import { ai } from "utils/ai"

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
          const videoInfo = extractVideoInfo(element)

          if (!videoInfo.title) return

          const existingVideo = videoData.find((vd) => vd.element === element)

          if (!existingVideo) {
            const { relevanceScore, info } = getRelevanceScore(videoInfo)
            const scoreNumber = Number(relevanceScore)
            const removed = scoreNumber < 30

            return {
              element,
              videoInfo,
              aiInfo: info,
              relevanceScore: scoreNumber,
              removed // Set removed status
            }
          } else {
            return existingVideo // Reuse if its existsing
          }
        })

        console.log(videoData, "videodata")

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
  }): { relevanceScore: number; info: string } {
    const { title, channel, timeAgo, views } = videoInfo

    const youtube_video_info = `title : ${title}, channel : ${channel}, timeAgo : ${timeAgo}, views: ${views}`

    const response = ai(youtube_video_info)
    // @ts-ignore
    const relevanceScore = response?.relavant_score * 100
    // @ts-ignore
    const info = response?.info

    console.log(youtube_video_info, "youtube_video_info")

    return { relevanceScore, info }
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
