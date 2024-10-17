import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.PLASMO_PUBLIC_GROQ_API_TOKEN,
  baseURL: "https://api.groq.com/openai/v1",
  dangerouslyAllowBrowser: true
})

export async function ai(youtube_video_info: string) {
  const completion = await openai.beta.chat.completions.parse({
    model: "gemma2-9b-it",
    messages: [
      {
        role: "system",
        content: `Based on the user information and liking your job is it give a relavant score and some info on why you it suits you to the current youtube video based on the meta data using this json schema below :
          z.object({
            relavant_score: z.number(),
            info: z.string(),
          })

          USER_INFO : "ruban likes ai topic and music , and also he likes tamil movies and comedy"
          `
      },
      {
        role: "user",
        content: `${youtube_video_info}`
      }
    ],
    response_format: { type: "json_object" }
  })

  const content = completion.choices[0].message.content

  const response = JSON.parse(content)

  console.log(response, "event")

  return response
}
