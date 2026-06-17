export function switchView(targetViewId) {
    document.querySelectorAll('.app-section').forEach(section => {
        section.classList.add('hidden');
    });

    const targetSection = document.getElementById(targetViewId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // Clear old success alert elements safely
    const successBox = document.getElementById('form-success');
    if (successBox) {
        successBox.style.display = 'none';
        successBox.textContent = '';
    }

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

    if (document.getElementById('stat-total-books')) document.getElementById('stat-total-books').textContent = totalBooks;
    if (document.getElementById('stat-total-pages')) document.getElementById('stat-total-pages').textContent = totalPages;
    if (document.getElementById('stat-top-tag')) document.getElementById('stat-top-tag').textContent = topTag;

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

export function renderCatalogTable(books) {
    const tableBody = document.getElementById('catalog-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';

    // Handle Empty Library Collection Scenario Layout
    if (books.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="padding: 30px; text-align: center; color: #6b7280; font-size: 1.1rem;">
                    📭 You haven't added any books to your library vault yet!
                </td>
            </tr>
        `;
        return;
    }

    books.forEach(book => {
        const row = document.createElement('tr');
        row.style.borderBottom = "1px solid #e5e7eb";

        const id = book.id || 'N/A';
        const title = book.title || 'Untitled';
        const author = book.author || 'Unknown';
        const pages = book.pages || '0';
        const tags = Array.isArray(book.tags) ? book.tags.join(', ') : (book.tags || 'None');
        const dateAdded = book.dateAdded || 'N/A';
        
        // Defaults to an aesthetic book artwork placeholder if string field is left empty
        const coverUrl = book.cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&auto=format&fit=crop&q=60';

        row.innerHTML = `
            <td style="padding: 12px 16px; font-family: monospace; font-size: 0.85rem; color: #6b7280;">${id}</td>
            <td style="padding: 8px 16px;">
                <img src="${coverUrl}" alt="${title} cover" style="width: 45px; height: 65px; object-fit: cover; border-radius: 4px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            </td>
            <td style="padding: 12px 16px; font-weight: 500; color: #111827;">${title}</td>
            <td style="padding: 12px 16px; color: #4b5563;">${author}</td>
            <td style="padding: 12px 16px; color: #4b5563;">${pages}</td>
            <td style="padding: 12px 16px;"><span style="background: #fbcfe8; color: #9d174d; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">${tags}</span></td>
            <td style="padding: 12px 16px; color: #6b7280; font-size: 0.9rem;">${dateAdded}</td>
        `;
        tableBody.appendChild(row);
    });
}

export function displayFormErrors(errors) {
    const errorBox = document.getElementById('form-errors');
    if (!errorBox) return;

    if (!errors || errors.length === 0) {
        errorBox.style.display = 'none';
        errorBox.innerHTML = '';
        return;
    }

    errorBox.style.display = 'block';
    errorBox.innerHTML = `
        <strong style="display: block; margin-bottom: 5px;">⚠️ Please fix the following errors:</strong>
        <ul style="margin: 0; padding-left: 20px;">
            ${errors.map(err => `<li>${err}</li>`).join('')}
        </ul>
    `;
}