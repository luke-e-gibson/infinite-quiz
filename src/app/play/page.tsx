"use client"

import Link from "next/link";
import { useState } from "react";
import { api } from "@/trpc/react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

export default function PlayPage() {
    const { data: question, refetch } = api.ai.createNewQuestion.useQuery();
    const checkAnswer = api.ai.checkQuestion.useMutation();

    const [questionsCompleted, setQuestionsCompleted] = useState<number>(0);
    const [answers, setAnswers] = useState<string>("");
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [endRession, setEndRession] = useState<string>("");
    const [thinking, setThinking] = useState<boolean>(false);

    async function checkQuestion() {
        if (!question) return;

        setThinking(true);
        try {
            const res = await checkAnswer.mutateAsync({
                answer: answers,
                question: question.question
            });

            if (res.correct === true) {
                setQuestionsCompleted(prev => prev + 1);
                setAnswers("");
                await refetch();
            } else {
                setAnswers("");
                setGameOver(true);
                setEndRession(res.reasoning);
            }
        } catch (error) {
            console.error("Error checking question", error);
        } finally {
            setThinking(false);
        }
    }

    if (!question) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container max-w-4xl mx-auto py-12">
            <div className="w-full flex justify-between">
                <label htmlFor="answer" className="font-bold">
                    {question.question}
                </label>
                <p>Question Completed Correctly: {questionsCompleted}</p>
            </div>
            <div className="py-5 flex">
                <input
                    type="text"
                    name="answer"
                    id="answer"
                    disabled={thinking}
                    className="border w-full py-2 px-2 rounded-l-lg"
                    value={answers}
                    onChange={(e) => setAnswers(e.target.value)}
                />
                <button
                    className="py-2 px-2 border-r border-t border-b rounded-r-lg"
                    disabled={thinking}
                    onClick={checkQuestion}
                >
                    {thinking ? "Thinking" : "Submit"}
                </button>
            </div>

            <Dialog open={gameOver}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Game Over</DialogTitle>
                        <DialogDescription>
                            You have completed {questionsCompleted} questions.
                            You failed on {question.question}.
                            The reason being: {endRession}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Link href="/">
                            <Button variant="default" type="submit">Retry</Button>
                        </Link>
                        <Button variant="outline" type="submit">Share</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}