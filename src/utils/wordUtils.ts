// This is a small list of words for demonstration purposes
// In a real app, you would have a larger dictionary or fetch from an API
const wordList = [
  "AMCIK", // Initial word as specified
  //"APPLE",
  //"BRAIN",
  //"CHART",
  //"DANCE",
  //"EARTH",
  //"FANCY",
  //"GLOBE",
  //"HOUSE",
  //"ITEMP",
  //"JUMPY",
  //"KNIFE",
  //"LEMON",
  //"MUSIC",
  //"NEVER",
  //"OCEAN",
  //"PLANE",
  //"QUEEN",
  //"RIVER",
  //"SMART",
  //"TOWER",
  //"UMBRA",
  //"VOCAL",
  //"WATER",
  //"XENON",
  //"YIELD",
  //"ZEBRA"
];

// Function to get the word of the day
export const getWordOfTheDay = (): string => {
  // Set a date seed for getting a consistent word for each day
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  
  // Use the day of the year to pick a word (cycle through the list)
  return wordList[day % wordList.length];
};

// Check if the word is in the valid word list
export const isValidWord = (word: string): boolean => {
  return wordList.includes(word.toUpperCase());
};

// Utility to get today's date as string for display
export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}; 