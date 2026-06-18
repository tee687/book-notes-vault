export function runFormValidationPipeline(title, author, pagesStr) {
    const errorLogList = [];

    // Rule 1: No leading/trailing spaces for title
    if (!/^\S+(?:.*\S+)?$/.test(title)) {
        errorLogList.push("The Book Title must not contain leading or trailing whitespace components.");
    }

    // Rule 2: Positive whole number check for page fields
    if (!/^\d+$/.test(pagesStr) || parseInt(pagesStr, 10) <= 0) {
        errorLogList.push("Page fields accept clean positive whole numeric configurations.");
    }

    // Rule 3: No leading/trailing spaces for author name
    if (!/^\S+(?:.*\S+)?$/.test(author)) {
        errorLogList.push("The Author field must not contain leading or trailing whitespaces.");
    }

    // Rule 4 (Advanced Back-reference Check): Detect consecutive repeating author names (e.g., "John John")
    const repeatPatternCheck = /\b(\w+)\s+\1\b/i;
    if (repeatPatternCheck.test(author)) {
        errorLogList.push("Advanced Rule Flagged: Detected duplicated contiguous author names via regex engine checks.");
    }

    return errorLogList;
}