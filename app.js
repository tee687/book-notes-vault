// LYNN Book & Notes Vault - Navigation & Dashboard Orchestrator
import { loadLibraryData } from './scripts/storage.js';
import { getLibraryState, setLibraryState } from './scripts/state.js';
import { switchView, renderDashboardMetrics } from './scripts/ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 System connected! Fetching cache seed datasets...");

    // 1. Core State initialization: load records from storage pipeline
    const loadedData = await loadLibraryData();
    setLibraryState(loadedData);

    // 2. Setup event monitors across navigation button rows
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetViewId = e.target.getAttribute('data-target');
            if (targetViewId) {
                switchView(targetViewId);
            }
        });
    });

    // 3. Set initial view and safely render metrics
    switchView('about-view');
    
    try {
        renderDashboardMetrics(getLibraryState());
    } catch (error) {
        console.warn("Dashboard rendering postponed until view selection:", error);
    }
});
