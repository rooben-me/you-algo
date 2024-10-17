import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.PLASMO_PUBLIC_GROQ_API_TOKEN,
  baseURL: "https://api.groq.com/openai/v1",
  dangerouslyAllowBrowser: true
})

export async function ai() {
  const completion = await openai.beta.chat.completions.parse({
    model: "llama-3.1-70b-versatile",
    messages: [
      {
        role: "system",
        content: `Extract the event information. using this json schema below :
          z.object({
            name: z.string(),
            date: z.string(),
            participants: z.array(z.string())
          })
          `
      },
      {
        role: "user",
        content: "Alice and Bob are going to a science fair on Friday."
      }
    ],
    response_format: { type: "json_object" }
  })

  const content = completion.choices[0].message.content

  const response = JSON.parse(content)

  console.log(response, "event")

  return response
}
