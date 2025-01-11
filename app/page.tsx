"use client";

import { useEffect, useState, useRef } from "react";
import Grid from "../components/Grid";
import { getDailyWord } from "../utils/word";

export default function Home() {
    const [solution, setSolution] = useState("");
    const [guesses, setGuesses] = useState<string[]>([]);
    const [currentGuess, setCurrentGuess] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const [wordDay, setWordDay] = useState(0);
    const [revealedLetters, setRevealedLetters] = useState<{
        [key: number]: string;
    }>({});
    const [maxTurns, setMaxTurns] = useState(6);
    const gridRef = useRef<HTMLDivElement>(null);

    const handleNextWord = () => {
        setWordDay((prev) => prev + 1);
        setGuesses([]);
        setCurrentGuess("");
        setGameOver(false);
    };

    const handleSolveOneLetter = () => {
        const unrevealedIndices = Array.from({ length: 5 }, (_, i) => i).filter(
            (i) => !revealedLetters[i]
        );
        if (unrevealedIndices.length > 0) {
            const randomIndex =
                unrevealedIndices[
                    Math.floor(Math.random() * unrevealedIndices.length)
                ];
            setRevealedLetters((prev) => ({
                ...prev,
                [randomIndex]: solution[randomIndex],
            }));
        }
    };

    const handleSolveWord = () => {
        setGuesses([...guesses, solution]);
        setGameOver(true);
    };

    const handleResetHacks = () => {
        setRevealedLetters({});
    };

    const handleUndoLastTurn = () => {
        if (guesses.length > 0) {
            setGuesses((prev) => prev.slice(0, -1));
            setGameOver(false);
            setCurrentGuess("");
            // Focus on the grid after undoing
            gridRef.current?.focus();
        }
    };

    const handleAddTurn = () => {
        setMaxTurns((prev) => {
            const newTurns = prev + 1;
            // If game was over due to max turns, un-end it
            if (gameOver && guesses.length < newTurns) {
                setGameOver(false);
            }
            return newTurns;
        });
        gridRef.current?.focus();
    };

    useEffect(() => {
        const loadSolution = async () => {
            const word = await getDailyWord(wordDay);
            setSolution(word);
        };
        loadSolution();
    }, [wordDay]);

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            // Remove the gameOver check since we handle it in individual cases
            if (e.key === "Enter") {
                if (currentGuess.length !== 5) return;

                // Check win condition before adding guess
                if (currentGuess === solution) {
                    setGuesses((prev) => [...prev, currentGuess]);
                    setCurrentGuess("");
                    setGameOver(true);
                    return;
                }

                // Check if this would be the last turn
                if (guesses.length >= maxTurns - 1) {
                    setGuesses((prev) => [...prev, currentGuess]);
                    setCurrentGuess("");
                    setGameOver(true);
                    return;
                }

                // Normal turn
                setGuesses((prev) => [...prev, currentGuess]);
                setCurrentGuess("");
            } else if (!gameOver) {
                // Only check gameOver for typing
                if (e.key === "Backspace") {
                    setCurrentGuess((prev) => prev.slice(0, -1));
                } else if (
                    /^[A-Za-z]$/.test(e.key) &&
                    currentGuess.length < 5
                ) {
                    setCurrentGuess((prev) => prev + e.key.toUpperCase());
                }
            }
        };

        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    }, [currentGuess, guesses, solution, gameOver, maxTurns]);

    return (
        <div className="flex min-h-screen p-8">
            <div className="flex flex-col items-center justify-center flex-1">
                <h1 className="text-4xl font-bold mb-8">Wordle Plus</h1>
                <p id="unselect" className="hidden">
                    Undo last turn unselect.
                </p>
                <div
                    ref={gridRef}
                    tabIndex={0} // Make it focusable
                    className="outline-none" // Hide outline when focused
                >
                    <Grid
                        guesses={guesses}
                        currentGuess={currentGuess}
                        solution={solution}
                        maxTurns={maxTurns}
                    />
                </div>
                {gameOver && (
                    <div className="mt-8 text-xl">
                        {guesses.includes(solution) ? (
                            <div className="flex flex-col items-center gap-4">
                                <div>You won!</div>
                                <button
                                    onClick={handleNextWord}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Next Word
                                </button>
                            </div>
                        ) : (
                            `Game Over! The word was ${solution}`
                        )}
                    </div>
                )}
            </div>

            <div className="w-64 bg-gray-100 p-4 rounded-lg ml-8">
                <h2 className="text-xl font-bold mb-4">Hacks Panel</h2>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleSolveOneLetter}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Reveal One Letter
                    </button>
                    <button
                        onClick={handleSolveWord}
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    >
                        Solve Word
                    </button>
                    <button
                        onClick={handleResetHacks}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Reset Hacks
                    </button>
                    {Object.entries(revealedLetters).length > 0 && (
                        <div className="mt-4 p-3 bg-white rounded">
                            <h3 className="font-bold mb-2">
                                Revealed Letters:
                            </h3>
                            <div className="grid grid-cols-5 gap-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 flex items-center justify-center border"
                                    >
                                        {revealedLetters[i] || ""}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="border-t pt-3 mt-3">
                        <h3 className="font-bold mb-2">Game Modifiers:</h3>
                        <button
                            onClick={handleUndoLastTurn}
                            className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-2"
                        >
                            Undo Last Turn
                        </button>
                        <button
                            onClick={handleAddTurn}
                            className="w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                        >
                            Add Extra Turn
                        </button>
                        <div className="mt-2 text-sm text-gray-600">
                            Turns remaining: {maxTurns - guesses.length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
