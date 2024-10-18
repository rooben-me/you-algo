import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.PLASMO_PUBLIC_GROQ_API_TOKEN,
  baseURL: "https://api.groq.com/openai/v1",
  dangerouslyAllowBrowser: true
})

export async function ai(
  youtube_video_info: {
    title: string
    channel: string
    views: string
    timeAgo: string
  }[]
) {
  const youtube_video_infos_string = youtube_video_info
    .map((videoInfo) => {
      const { title, channel, timeAgo, views } = videoInfo

      const youtube_video_info_string = `title : ${title}, channel : ${channel}, timeAgo : ${timeAgo}, views: ${views}`

      return youtube_video_info_string
    })
    .join("\n")

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are given an array of YouTube video metadata. Your job is to analyze each video based on the user's preferences and return a JSON object containing an array of relevance scores and information.  Use the following JSON schema:

            {
              "videos": [
                {
                  "relevance_score": <number between 0 and 1>,
                  "info": <string explaining relevance>
                },
                 // ... more video objects
              ]
            }

            USER_INFO : "ruban likes ai topic and music , and also he likes tamil movies and comedy"
          `
        },
        {
          role: "user",
          content: `Here's the YouTube video metadata:\n${youtube_video_infos_string}`
        }
      ],
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0].message.content
    const response = JSON.parse(content)

    return response.videos // Return the "videos" array
  } catch (error) {
    console.error("Error during AI processing:", error)
    return [] // Return empty array in case of error
  }
}
