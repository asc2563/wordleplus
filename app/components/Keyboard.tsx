interface KeyboardProps {
    usedLetters: { [key: string]: string };
    onKeyPress: (key: string) => void;
}

const KEYS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

export default function Keyboard({ usedLetters, onKeyPress }: KeyboardProps) {
    const getKeyClass = (key: string) => {
        const baseClass =
            "px-3 py-4 rounded font-bold m-0.5 text-sm cursor-pointer ";
        if (key === "Enter" || key === "Backspace") {
            return baseClass + "bg-gray-300 hover:bg-gray-400 px-4 text-black";
        }
        switch (usedLetters[key]) {
            case "bg-green-500":
                return baseClass + "bg-green-500 text-white";
            case "bg-yellow-500":
                return baseClass + "bg-yellow-500 text-white";
            case "bg-gray-500":
                return baseClass + "bg-gray-500 text-white";
            default:
                return baseClass + "bg-gray-200 hover:bg-gray-300 text-black";
        }
    };

    return (
        <div className="mt-8">
            {KEYS.map((row, i) => (
                <div key={i} className="flex justify-center mb-2">
                    {row.map((key) => (
                        <button
                            key={key}
                            onClick={() => onKeyPress(key)}
                            className={getKeyClass(key)}
                        >
                            {key === "Backspace" ? "←" : key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}
