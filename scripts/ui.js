import { highlight } from './search.js';

export function switchView(targetViewId) {
    // 1. Hide all application sections safely
    document.querySelectorAll('.app-section').forEach(section => {
        section.classList.add('hidden');
    });

    // 2. Unhide the target section view panel container
    const targetSection = document.getElementById(targetViewId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // 3. Update active highlight states on visual button tabs
    document.querySelectorAll('.nav-link').forEach(btn => {
        const isSelected = btn.getAttribute('data-target') === targetViewId;
        btn.setAttribute('aria-selected', isSelected ? "true" : "false");
    });
}

export function renderDashboardMetrics(books) {
    const totalBooks = books.length;
    const totalPages = books.reduce((sum, book) => sum + parseInt(book.pages || 0, 10), 0);

    const tagCounts = {};
    books.forEach(book => {
        (book.tags || []).forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    if (document.getElementById('stat-total-books')) {
        document.getElementById('stat-total-books').textContent = totalBooks;
    }
    if (document.getElementById('stat-total-pages')) {
        document.getElementById('stat-total-pages').textContent = totalPages;
    }
    if (document.getElementById('stat-top-tag')) {
        document.getElementById('stat-top-tag').textContent = topTag;
    }

    const chartContainer = document.getElementById('chart-container');
    if (!chartContainer) return;
    chartContainer.innerHTML = '';
    
    const visualSample = books.slice(-5);
    const maxPageValue = Math.max(...visualSample.map(b => parseInt(b.pages || 0, 10)), 1);

    visualSample.forEach(book => {
        const column = document.createElement('div');
        column.style.cssText = "display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; width: 60px;";
        const calculatedHeight = (parseInt(book.pages, 10) / maxPageValue) * 100;
        
        column.innerHTML = `
            <div style="background: #d61f69; width: 30px; height: ${calculatedHeight}%; border-radius: 4px 4px 0 0;" title="${book.pages} pages"></div>
            <div style="font-size: 0.75rem; text-align: center; margin-top: 8px; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${book.title}</div>
        `;
        chartContainer.appendChild(column);
    });
}

export function renderCatalogTable(books, regexPattern = null) {
    // Left empty for now, we will add catalog tracking next!
}

export function displayFormErrors(errors) {
    // Left empty for now
}