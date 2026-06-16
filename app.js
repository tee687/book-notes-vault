// LYNN Book & Notes Vault - Main Dynamic Navigation Engine
import { loadLibraryData } from './scripts/storage.js';
import { getLibraryState, setLibraryState } from './scripts/state.js';
import { switchView, renderDashboardMetrics } from './scripts/ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 System connected and listening!");

    // 1. Initial State Load from Local Storage or Backup
    const loadedData = await loadLibraryData();
    setLibraryState(loadedData);

    // 2. Setup Event Handlers for Navigation Bar Elements
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetViewId = e.target.getAttribute('data-target');
            if (targetViewId) {
                switchView(targetViewId);
                
                if (targetViewId === 'dashboard-view') {
                    renderDashboardMetrics(getLibraryState());
                }
            }
        });
    });

    // 3. Set the initial clean landing view
    switchView('about-view');
});