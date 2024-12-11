import {z} from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateObject } from "ai";
import { models } from "@/server/groq";

const topics = [
    //Basic
    "basic science",
    "basic math",
    "basic history",
    "basic geography",

    //Harder
    "technology",
    "programming",
    "history",
    "geography",
    "science",
    "math",
]


export const aiRouter = createTRPCRouter({
    createNewQuestion: publicProcedure.query(async () => {
        const question = await generateObject({
            model: models.questionModel,
            prompt: `generate a short random question about ${topics[Math.floor(Math.random() * topics.length)]}`,
            temperature: 2,
            schema: z.object({question: z.string()})
        })

        return {
            question: question.object.question
        }
    }),

    checkQuestion: publicProcedure.input(z.object({question: z.string(), answer: z.string()})).mutation(async (opts)=> {
        const answers = await generateObject({
            model: models.answerCheckModel,
            prompt: `I have made a questions: ${opts.input.question} a user have given me this input: ${opts.input.answer} is the input the user have me correct `,
            schema: z.object({correct: z.boolean(), reasoning: z.string()})
        })

        return answers.object
    })
});
