const STORAGE_KEY = 'lynn_vault_books';

const backupBooks = [
    { "id": "rec_0001", "title": "The Hobbit", "author": "J.R.R. Tolkien", "pages": "310", "cover": "", "tags": ["Fantasy"], "dateAdded": "2026-01-15" },
    { "id": "rec_0002", "title": "Atomic Habits", "author": "James Clear", "pages": "320", "cover": "", "tags": ["Self-Help"], "dateAdded": "2026-02-10" },
    { "id": "rec_0003", "title": "Educated", "author": "Tara Westover", "pages": "352", "cover": "", "tags": ["Biography"], "dateAdded": "2026-03-05" }
];

export async function loadLibraryData() {
    const cachedData = localStorage.getItem(STORAGE_KEY);
    if (cachedData) return JSON.parse(cachedData);

    try {
        const response = await fetch('./seed.json');
        if (response.ok) {
            const seedData = await response.json();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
            return seedData;
        }
    } catch (error) {
        console.warn("Could not find seed.json, shifting to safety array: ", error);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(backupBooks));
    return backupBooks;
}

export function saveLibraryData(libraryArray) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(libraryArray));
}