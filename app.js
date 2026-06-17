// LYNN Book & Notes Vault - Main Dynamic Navigation & Search Engine
import { loadLibraryData } from './scripts/storage.js';
import { getLibraryState, setLibraryState } from './scripts/state.js';
import { switchView, renderDashboardMetrics, renderCatalogTable } from './scripts/ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 System connected and listening!");

    // 1. Initial State Load from Local Storage or Backup Data
    const loadedData = await loadLibraryData();
    setLibraryState(loadedData);

    // 2. Initial rendering of background components
    renderDashboardMetrics(getLibraryState());
    renderCatalogTable(getLibraryState());

    // 3. Setup Event Handlers for Navigation Bar Elements
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetViewId = e.target.getAttribute('data-target');
            if (targetViewId) {
                switchView(targetViewId);
                
                // Keep UI modules refreshed on visibility switch
                if (targetViewId === 'dashboard-view') {
                    renderDashboardMetrics(getLibraryState());
                } else if (targetViewId === 'catalog-view') {
                    renderCatalogTable(getLibraryState());
                }
            }
        });
    });

    // 4. 🔍 NEW: Add Instant Live Search Listener (No Button Needed!)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            const allBooks = getLibraryState();

            if (!searchTerm) {
                // If search is cleared, render everything
                renderCatalogTable(allBooks);
                return;
            }

            try {
                // Generate case-insensitive regex matching engine
                const regex = new RegExp(searchTerm, 'i');
                
                // Filter items by title or author properties
                const filteredBooks = allBooks.filter(book => 
                    regex.test(book.title || '') || regex.test(book.author || '')
                );
                
                renderCatalogTable(filteredBooks);
            } catch (err) {
                // Gracefully catch incomplete regex structures while typing
                console.log("Typing expressions...");
            }
        });
    }

    // 5. Set the initial clean landing view
    switchView('about-view');
});