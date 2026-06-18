export function switchView(targetViewId) {
    document.querySelectorAll('.app-section').forEach(section => section.classList.add('hidden'));
    const targetSection = document.getElementById(targetViewId);
    if (targetSection) targetSection.classList.remove('hidden');

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

// 📊 Render Dashboard Metrics with 7-Day Trending & ARIA Targets
export function renderDashboardMetrics(books) {
    const safeBooks = Array.isArray(books) ? books : [];
    const totalBooks = safeBooks.length;
    const totalPages = safeBooks.reduce((sum, b) => sum + parseInt(b.pages || 0, 10), 0);

    // Track common tag configurations
    const tagCounts = {};
    safeBooks.forEach(b => {
        const arr = Array.isArray(b.tags) ? b.tags : (typeof b.tags === 'string' ? b.tags.split(',').map(t => t.trim()) : []);
        arr.forEach(t => { if (t) tagCounts[t] = (tagCounts[t] || 0) + 1; });
    });
    const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    if (document.getElementById('stat-total-books')) document.getElementById('stat-total-books').textContent = totalBooks;
    if (document.getElementById('stat-total-pages')) document.getElementById('stat-total-pages').textContent = totalPages.toLocaleString();
    if (document.getElementById('stat-top-tag')) document.getElementById('stat-top-tag').textContent = topTag;

    // 🎯 Rule validation: Capacity Limit Checking Logic
    const targetCapInput = document.getElementById('settings-page-cap');
    const allowedLimit = parseInt(targetCapInput ? targetCapInput.value : 2000, 10) || 2000;
    const capStatusText = document.getElementById('target-cap-status');
    const ariaBox = document.getElementById('aria-announcer');

    if (capStatusText) {
        if (totalPages <= allowedLimit) {
            const left = allowedLimit - totalPages;
            capStatusText.innerHTML = `🟢 Safe: Within target limit. You have <span style="color:#db2777;">${left.toLocaleString()}</span> pages remaining before reaching your milestone cap.`;
            if (ariaBox) ariaBox.textContent = `Safe milestone capacity. ${left} pages remaining.`;
        } else {
            const over = totalPages - allowedLimit;
            capStatusText.innerHTML = `⚠️ Overage: milestone ceiling exceeded! You are <span style="color:#ef4444; font-weight:800;">${over.toLocaleString()}</span> pages over your specified configuration limit.`;
            if (ariaBox) ariaBox.textContent = `Alert: milestone ceiling exceeded by ${over} pages!`;
        }
    }

    // 📈 Build out Last-7-days trend calculation graph chart layout
    const chartContainer = document.getElementById('chart-container');
    if (!chartContainer) return;
    chartContainer.innerHTML = '';

    const daysTracked = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        daysTracked.push(d.toISOString().split('T')[0]);
    }

    const pagesPerDay = daysTracked.map(dateStr => {
        return safeBooks
            .filter(b => b.dateAdded && b.dateAdded.startsWith(dateStr))
            .reduce((sum, b) => sum + parseInt(b.pages || 0, 10), 0);
    });

    const highestDayValue = Math.max(...pagesPerDay, 1);

    daysTracked.forEach((dayLabel, index) => {
        const currentDaySum = pagesPerDay[index];
        const computedHeight = (currentDaySum / highestDayValue) * 100;
        const displayMonthDay = dayLabel.substring(5); // Format tracking window as MM-DD

        const col = document.createElement('div');
        col.style.cssText = "display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; width: 45px;";
        col.innerHTML = `
            <div style="background: #db2777; width: 24px; height: ${Math.max(computedHeight, 4)}%; border-radius: 4px 4px 0 0; box-shadow: 0 2px 4px rgba(219,39,119,0.15);" title="${currentDaySum} pages added on ${dayLabel}"></div>
            <div style="font-size: 0.7rem; font-weight: 600; color: #4c0519; text-align: center; margin-top: 6px;">${displayMonthDay}</div>
        `;
        chartContainer.appendChild(col);
    });
}

// 📚 Render Catalog Table View Layout with Actions and Regex Highlight Supports
export function renderCatalogTable(books, searchQuery = '', sortCriteria = 'dateAdded-desc', onEdit, onDelete) {
    const tableBody = document.getElementById('catalog-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    let records = [...books];

    // 🔍 Match Regular Expression Queries Safely
    if (searchQuery.trim() !== '') {
        try {
            const regex = new RegExp(searchQuery, 'i');
            records = records.filter(b => regex.test(b.title || '') || regex.test(b.author || ''));
        } catch (e) {
            // Graceful processing catch for invalid regex strings while typing
        }
    }

    // ↕️ Apply Sorting Selection Matrix Parameters
    const [field, direction] = sortCriteria.split('-');
    records.sort((a, b) => {
        let valA = field === 'pages' ? parseInt(a[field] || 0, 10) : (a[field] || '').toString().toLowerCase();
        let valB = field === 'pages' ? parseInt(b[field] || 0, 10) : (b[field] || '').toString().toLowerCase();

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    if (records.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="padding: 40px; text-align: center; color: #6b7280;">
                    📭 No books matched your library filters or search criteria.
                </td>
            </tr>
        `;
        return;
    }

    records.forEach(book => {
        const row = document.createElement('tr');
        row.style.borderBottom = "1px solid #f3f4f6";

        const tags = Array.isArray(book.tags) ? book.tags.join(', ') : (book.tags || 'None');
        const fallbackCover = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&auto=format&fit=crop&q=60';
        const coverUrl = book.cover || fallbackCover;

        // Apply HTML highlighting tags if a query is active
        let highlightedTitle = book.title || 'Untitled';
        let highlightedAuthor = book.author || 'Unknown';

        if (searchQuery.trim() !== '') {
            try {
                const regex = new RegExp(`(${searchQuery})`, 'gi');
                highlightedTitle = highlightedTitle.replace(regex, '<mark style="background:#fbcfe8; color:#9d174d; border-radius:2px; padding:0 2px;">$1</mark>');
                highlightedAuthor = highlightedAuthor.replace(regex, '<mark style="background:#fbcfe8; color:#9d174d; border-radius:2px; padding:0 2px;">$1</mark>');
            } catch (e) {}
        }

        row.innerHTML = `
            <td style="padding: 12px 16px; font-family: monospace; font-size: 0.8rem; color: #6b7280;">${book.id}</td>
            <td style="padding: 8px 16px;">
                <img src="${coverUrl}" alt="${book.title} cover" onerror="this.onerror=null; this.src='${fallbackCover}';" style="width: 42px; height: 60px; object-fit: contain; border-radius: 4px; border: 1px solid #e5e7eb;">
            </td>
            <td style="padding: 12px 16px; font-weight: 500; color: #111827;">${highlightedTitle}</td>
            <td style="padding: 12px 16px; color: #4b5563;">${highlightedAuthor}</td>
            <td style="padding: 12px 16px; color: #4b5563; font-weight: 600;">${book.pages}</td>
            <td style="padding: 12px 16px;"><span style="background: #fff5f7; border: 1px solid #fbcfe8; color: #9d174d; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">${tags}</span></td>
            <td style="padding: 12px 16px;">
                <div style="display: flex; gap: 8px;">
                    <button class="btn-edit-action" style="background:#f3f4f6; color:#4b5563; border:1px solid #e5e7eb; padding:4px 8px; border-radius:4px; font-size:0.8rem; cursor:pointer; font-weight:600;">✍️ Edit</button>
                    <button class="btn-delete-action" style="background:#fff5f7; color:#ef4444; border:1px solid #fecdd3; padding:4px 8px; border-radius:4px; font-size:0.8rem; cursor:pointer; font-weight:600;">🗑️ Delete</button>
                </div>
            </td>
        `;

        // Bind interactive inline event loop listeners directly
        row.querySelector('.btn-edit-action').addEventListener('click', () => onEdit(book));
        row.querySelector('.btn-delete-action').addEventListener('click', () => onDelete(book.id));

        tableBody.appendChild(row);
    });
}

export function displayFormErrors(errors) {
    const errorBox = document.getElementById('form-errors');
    if (!errorBox) return;
    if (!errors || errors.length === 0) {
        errorBox.style.display = 'none';
        return;
    }
    errorBox.style.display = 'block';
    errorBox.innerHTML = `<strong style="display:block; margin-bottom:5px;">⚠️ Form Processing Faults:</strong>
        <ul style="margin:0; padding-left:20px;">${errors.map(err => `<li>${err}</li>`).join('')}</ul>`;
}