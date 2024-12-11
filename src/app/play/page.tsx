"use client"
import Link from "next/link";
import {Suspense, useEffect, useState} from "react";
import {api} from "@/trpc/react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog"
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

export default function PlayPage() {
    const getQuestions = api.ai.createNewQuestion.useQuery();
    const checkAnswer = api.ai.checkQuestion.useMutation();
    const router = useRouter();
    const [question] = api.ai.createNewQuestion.useSuspenseQuery()
    const [questionsCompleted, setQuestionsCompleted] = useState<number>(0);
    const [answers, setAnswers] = useState<string>("");
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [endRession, setEndRession] = useState<string>("");
    const [thinking, setThinking] = useState<boolean>(false);

    async function checkQuestion() {
        void setThinking(true)
        const res = await checkAnswer.mutateAsync({answer: answers, question: question.question})
        if (res.correct === true) {
            console.log("correct")
            void setQuestionsCompleted(questionsCompleted + 1)
            void setAnswers("")
            await getQuestions.refetch()
            void setThinking(false)
        } else {
            void setAnswers("")
            void setGameOver(true)
            setEndRession(res.reasoning)
        }

    }

    return (
        <div className="container max-w-4xl mx-auto py-12">
            <div className="w-full flex justify-between">
                <Suspense fallback={<label htmlFor="answer" className="font-bold">Loading Question</label>}>
                    <label htmlFor="answer" className="font-bold">{question.question}</label>
                </Suspense>
                <p>Question Completed Correctly: {questionsCompleted}</p>
            </div>
            <div className="py-5 flex">
                <input type="text" name="answer" id="answer" disabled={thinking} className="border w-full py-2 px-2 rounded-l-lg"
                       value={answers} onChange={(e) => setAnswers(e.target.value)}/>
                <button className="py-2 px-2 border-r border-t border-b rounded-r-lg" disabled={thinking} onClick={checkQuestion}>{thinking ? "Thinking" : "Submit"}</button>
            </div>

            <Dialog open={gameOver}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Game Over</DialogTitle>
                        <Suspense>
                            <DialogDescription>You have completed {questionsCompleted} questions. You failed on
                                <p className="text-bold">{question.question}</p>. The reason being <p className="text-bold">{endRession}</p></DialogDescription>
                        </Suspense>
                    </DialogHeader>
                    <DialogFooter>
                        <Link href="/"><Button variant="default" type="submit">Retry</Button></Link>

                        <Button variant="outline" type="submit">Share</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
