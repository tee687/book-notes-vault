const KEY = 'lynn_vault_books';

export function fetchStoredBooks() {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error("Storage parse fail structural error:", e);
        return [];
    }
}

export function persistBooksCollection(booksArray) {
    localStorage.setItem(KEY, JSON.stringify(booksArray));
}


export function validateBackupSchema(data) {
    if (!Array.isArray(data)) return false;
    return data.every(item => item && typeof item === 'object' && 'title' in item && 'author' in item && 'pages' in item);
}