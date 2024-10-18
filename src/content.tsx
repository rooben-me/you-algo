import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { ai } from "utils/ai"

import AIInfoButton from "./content/AIInfoButton"
import { Marker } from "./content/marker"

// Configuration for PlasmoCS
export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
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
      aiInfo?: string // Store AI info
      relevanceScore?: number
      removed?: boolean
    }[]
  >([])
  const [prevVideoItemCount, setPrevVideoItemCount] = useState(0)
  const [processing, setProcessing] = useState(false)

  console.log(videoData, "videoData")

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const videoItems = Array.from(
        document.querySelectorAll("ytd-rich-item-renderer")
      ).filter((element) => {
        return !element.closest("ytd-rich-section-renderer")
      })

      if (
        videoItems.length !== prevVideoItemCount &&
        !processing // Prevent multiple calls
      ) {
        setProcessing(true) // Set processing flag

        const newVideoInfos = videoItems
          .map((element) => {
            const videoInfo = extractVideoInfo(element)
            if (videoInfo.title === null) {
              return null
            }
            return videoInfo
          })
          .filter(Boolean) // Filter out null values (videos without titles)

        try {
          // Batch AI call:

          const aiResponses = await ai(newVideoInfos)

          const newVideoData = newVideoInfos.map((videoInfo, index) => {
            // Handle potential index mismatch if aiResponses is shorter
            const aiResponse = aiResponses[index] || {
              relevance_score: 0,
              info: ""
            }

            console.log(aiResponse)

            // Parse the relevance_score as a float and multiply by 100
            const relevanceScore =
              parseFloat(aiResponse?.relevance_score) * 100 || 0
            const removed = relevanceScore < 30

            return {
              element: videoItems[index], // Get element from videoItems
              videoInfo,
              aiInfo: aiResponse.info,
              relevanceScore,
              removed
            }
          })

          setVideoData(newVideoData)
        } catch (error) {
          console.error("Error during AI processing:", error)
        } finally {
          setProcessing(false) // Reset processing flag in finally
          setPrevVideoItemCount(videoItems.length)
        }
      }
    }, 250)

    return () => clearInterval(intervalId)
  }, [videoData, prevVideoItemCount, processing]) // Add processing to dependencies

  useEffect(() => {
    videoData.forEach((item) => {
      if (item.element) {
        const avatarContainer = item.element.querySelector("#dismissible")
        if (avatarContainer) {
          // Create a new container for the AI button
          let aiButtonContainer = avatarContainer.querySelector(
            ".ai-button-container"
          )

          if (!aiButtonContainer) {
            aiButtonContainer = document.createElement("div")
            aiButtonContainer.className = "ai-button-container relative"
            avatarContainer.appendChild(aiButtonContainer)
          }

          // Render AIInfoButton in the new container
          ReactDOM.render(
            <AIInfoButton aiInfo={item.aiInfo} removed={item.removed} />,
            aiButtonContainer
          )
        }

        // if (item.removed) {
        //   // @ts-ignore
        //   item.element.style.border = "2px solid red"
        // } else {
        //   // @ts-ignore
        //   item.element.style.border = "2px solid green"
        // }
      }
    })

    // Cleanup function to unmount React components
    return () => {
      videoData.forEach((item) => {
        if (item.element) {
          const avatarContainer =
            item.element.querySelector("#avatar-container")
          if (avatarContainer) {
            const aiButtonContainer = avatarContainer.querySelector(
              ".ai-button-container"
            )
            if (aiButtonContainer) {
              ReactDOM.unmountComponentAtNode(aiButtonContainer)
              aiButtonContainer.remove()
            }
          }
        }
      })
    }
  }, [videoData])

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
