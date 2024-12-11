import { createGroq } from '@ai-sdk/groq';
import { env } from "@/env"

export const groq = createGroq({
    apiKey: env.GROQ_API_KEY,
})

export const models = {
    questionModel: groq("gemma-7b-it"),
    answerCheckModel: groq("mixtral-8x7b-32768"),
}