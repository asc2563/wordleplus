import { WordleResponse } from "../types/word";

function GetFomattedDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export async function getDailyWord(dayOffset: number = 0): Promise<string> {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset); // Advance date by offset
    const formattedDate = GetFomattedDate(date);
    const nytUrl = `https://www.nytimes.com/svc/wordle/v2/${formattedDate}.json`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(nytUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        const proxyData = await response.json();
        const data: WordleResponse = JSON.parse(proxyData.contents);
        return data.solution.toUpperCase();
    } catch (error) {
        console.error('Error fetching word:', error);
        throw new Error('Failed to fetch word');
    }
}

// Usage examples:
// getDailyWord() - gets today's word
// getDailyWord(1) - gets tomorrow's word