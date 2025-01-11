interface GridProps {
    guesses: string[];
    currentGuess: string;
    solution: string;
    maxTurns: number;
}

export default function Grid({
    guesses,
    currentGuess,
    solution,
    maxTurns,
}: GridProps) {
    // Calculate empties only if game is still ongoing and we haven't filled all rows
    const remainingSpaces = Math.max(
        0,
        maxTurns - guesses.length - (currentGuess ? 1 : 0)
    );
    const empties = Array(remainingSpaces).fill("");

    function checkLetter(word: string, pos: number): string {
        const letter = word[pos];
        if (letter === solution[pos]) return "bg-green-500";
        if (solution.includes(letter)) return "bg-yellow-500";
        return "bg-gray-500";
    }

    return (
        <div
            className="grid gap-2"
            style={{ gridTemplateRows: `repeat(${maxTurns}, minmax(0, 1fr))` }}
        >
            {guesses.map((guess, i) => (
                <div key={i} className="grid grid-cols-5 gap-2">
                    {guess.split("").map((letter, j) => (
                        <div
                            key={j}
                            className={`w-14 h-14 flex items-center justify-center text-white font-bold text-2xl ${checkLetter(
                                guess,
                                j
                            )}`}
                        >
                            {letter}
                        </div>
                    ))}
                </div>
            ))}
            {guesses.length < maxTurns && currentGuess !== "" && (
                <div className="grid grid-cols-5 gap-2">
                    {currentGuess.split("").map((letter, i) => (
                        <div
                            key={i}
                            className="w-14 h-14 flex items-center justify-center border-2 font-bold text-2xl"
                        >
                            {letter}
                        </div>
                    ))}
                    {Array(5 - currentGuess.length)
                        .fill("")
                        .map((_, i) => (
                            <div key={i} className="w-14 h-14 border-2" />
                        ))}
                </div>
            )}
            {empties.map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-2">
                    {Array(5)
                        .fill("")
                        .map((_, j) => (
                            <div key={j} className="w-14 h-14 border-2" />
                        ))}
                </div>
            ))}
        </div>
    );
}
