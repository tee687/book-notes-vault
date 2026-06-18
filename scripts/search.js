export function executeRegexQueryFilter(books, criteriaPattern) {
    if (!criteriaPattern.trim()) return books;

    try {
        const dynamicCompiledRegex = new RegExp(criteriaPattern, 'i'); // Case-insensitive matching
        return books.filter(book => 
            dynamicCompiledRegex.test(book.title || '') || 
            dynamicCompiledRegex.test(book.author || '')
        );
    } catch (invalidRegexFaultException) {
        
        return books; 
    }
}