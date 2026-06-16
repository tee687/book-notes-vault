// LYNN Book & Notes Vault - RegEx Search Engine

// Safely compiles a text string into a Regular Expression object
export function compileRegex(input, flags = 'i') {
    if (!input) return null;
    try {
        return new RegExp(input, flags); //
    } catch (error) {
        return null; // Prevents crashing on invalid regex syntax
    }
}

// Wraps matching text patterns inside semantic HTML highlight tags
export function highlight(text, regex) {
    if (!regex || !text) return text;
    const stringText = String(text);
    return stringText.replace(regex, match => `<mark>${match}</mark>`); //
}