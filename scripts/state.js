// Application Memory State Layer
let libraryState = [];

export function getLibraryState() {
    return libraryState;
}

export function setLibraryState(newBooksArray) {
    libraryState = Array.isArray(newBooksArray) ? newBooksArray : [];
}

export function saveOrUpdateBook(bookObject) {
    const cleanBook = {
        ...bookObject,
        updatedAt: new Date().toISOString()
    };
    
    const index = libraryState.findIndex(b => b.id === cleanBook.id);
    if (index !== -1) {
        libraryState[index] = { ...libraryState[index], ...cleanBook };
    } else {
        cleanBook.createdAt = new Date().toISOString();
        libraryState.push(cleanBook);
    }
    return libraryState;
}

export function deleteBookFromState(bookId) {
    libraryState = libraryState.filter(b => b.id !== bookId);
    return libraryState;
}