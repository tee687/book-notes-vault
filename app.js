import { loadLibraryData, saveLibraryData } from './scripts/storage.js';
import { getLibraryState, setLibraryState } from './scripts/state.js';
import { switchView, renderDashboardMetrics, renderCatalogTable, displayFormErrors } from './scripts/ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 System connected and listening!");

    // 1. Initial State Load
    const loadedData = await loadLibraryData();
    setLibraryState(loadedData);

    // 2. Initial background rendering
    renderDashboardMetrics(getLibraryState());
    renderCatalogTable(getLibraryState());

    // 3. Navigation View Switch Router Logic
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetViewId = e.target.getAttribute('data-target');
            if (targetViewId) {
                switchView(targetViewId);
                if (targetViewId === 'dashboard-view') {
                    renderDashboardMetrics(getLibraryState());
                } else if (targetViewId === 'catalog-view') {
                    renderCatalogTable(getLibraryState());
                }
            }
        });
    });

    // 4. Instant Live Filter Engine (Regex Powered)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            const allBooks = getLibraryState();
            if (!searchTerm) {
                renderCatalogTable(allBooks);
                return;
            }
            try {
                const regex = new RegExp(searchTerm, 'i');
                const filteredBooks = allBooks.filter(book => 
                    regex.test(book.title || '') || regex.test(book.author || '')
                );
                renderCatalogTable(filteredBooks);
            } catch (err) {
                console.log("Typing expressions...");
            }
        });
    }

    // 5. Form Submission & Input Validation Handler
    const addBookForm = document.getElementById('add-book-form');
    if (addBookForm) {
        addBookForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('form-title').value.trim();
            const author = document.getElementById('form-author').value.trim();
            const pages = document.getElementById('form-pages').value.trim();
            const cover = document.getElementById('form-cover').value.trim();
            const tagsRaw = document.getElementById('form-tags').value.trim();

            // Verification Engine Checking Fields
            const errors = [];
            if (!title) errors.push("Book title is required.");
            if (!author) errors.push("Author name is required.");
            if (!pages || parseInt(pages, 10) <= 0) errors.push("Valid page count must be greater than 0.");

            if (errors.length > 0) {
                displayFormErrors(errors);
                return;
            }

            displayFormErrors([]);

            // Trigger success message box feedback
            const successBox = document.getElementById('form-success');
            if (successBox) {
                successBox.style.display = 'block';
                successBox.textContent = `🎉 "${title}" saved successfully!`;
            }

            const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];
            const currentLibrary = getLibraryState();
            const nextIdNumber = currentLibrary.length + 1;
            
            const newBook = {
                id: `rec_${String(nextIdNumber).padStart(4, '0')}`,
                title: title,
                author: author,
                pages: pages,
                cover: cover,
                tags: tags,
                dateAdded: new Date().toISOString().split('T')[0]
            };

            const updatedLibrary = [...currentLibrary, newBook];
            setLibraryState(updatedLibrary);
            saveLibraryData(updatedLibrary);

            addBookForm.reset();
            renderCatalogTable(updatedLibrary);

            // Delay view switch so user can visually witness success alert banner
            setTimeout(() => {
                switchView('catalog-view');
            }, 2000);
        });
    }

    // 6. Default view placement hook placement
    switchView('about-view');
});