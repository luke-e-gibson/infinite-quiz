import Link from "next/link";

export default function HomePage() {
    return (
        <div className="py-12">
            <div className="container mx-auto py-5 border rounded-lg max-w-4xl">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Infinite Quiz</h1>
                    <div className="py-5">
                        <h3>Play a quiz that never ends.</h3>
                        <p>Keep answering questions until you get one wrong</p>
                        <p className="py-3 text-sm">Questions are made by ai and Answers are also checked with ai Expect errors</p>
                    </div>
                    <Link href="/play">
                        <button className="py-2 px-2 border rounded-lg ">Play</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}