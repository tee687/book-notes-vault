export function transitionActiveView(viewSectionId) {
    document.querySelectorAll('.app-section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(viewSectionId)?.classList.remove('hidden');

    document.querySelectorAll('.nav-link').forEach(link => {
        const matchesTarget = link.getAttribute('data-target') === viewSectionId;
        link.setAttribute('aria-selected', matchesTarget ? "true" : "false");
    });
}

export function populateDashboardMetrics(booksCollection) {
    const totalBooks = booksCollection.length;
    const computedTotalPages = booksCollection.reduce((sum, current) => sum + parseInt(current.pages || 0, 10), 0);

    // Compute top frequent tags
    const distributionMap = {};
    booksCollection.forEach(entry => {
        const parsingSource = Array.isArray(entry.tags) ? entry.tags : (entry.tags ? entry.tags.split(',') : []);
        parsingSource.map(tag => tag.trim()).filter(Boolean).forEach(t => distributionMap[t] = (distributionMap[t] || 0) + 1);
    });
    const highestRankedTag = Object.entries(distributionMap).sort((x, y) => y[1] - x[1])[0]?.[0] || 'None';

    document.getElementById('stat-total-books').textContent = totalBooks;
    document.getElementById('stat-total-pages').textContent = computedTotalPages.toLocaleString();
    document.getElementById('stat-top-tag').textContent = highestRankedTag;

    // Evaluate Milestone Limit Overage Target Restrictions
    const ceilingThresholdInput = document.getElementById('settings-page-cap');
    const metricLimitCap = parseInt(ceilingThresholdInput ? ceilingThresholdInput.value : 2000, 10) || 2000;
    const alertStatusBar = document.getElementById('target-cap-status');
    const liveAriaRegion = document.getElementById('aria-announcer');

    if (alertStatusBar) {
        if (computedTotalPages <= metricLimitCap) {
            const spacesLeft = metricLimitCap - computedTotalPages;
            alertStatusBar.innerHTML = `🟢 Safe: Within target limit. You have <span style="color:#db2777;">${spacesLeft.toLocaleString()}</span> pages remaining before reaching your milestone cap.`;
            if (liveAriaRegion) liveAriaRegion.textContent = `Safe milestone metrics state. ${spacesLeft} pages remaining.`;
        } else {
            const pagesOverage = computedTotalPages - metricLimitCap;
            alertStatusBar.innerHTML = `⚠️ Overage: milestone ceiling exceeded! You are <span style="color:#ef4444; font-weight:800;">${pagesOverage.toLocaleString()}</span> pages over your limit.`;
            if (liveAriaRegion) liveAriaRegion.textContent = `Alert: milestone ceiling exceeded by ${pagesOverage} pages!`;
        }
    }

    // Build Last-7-days reading trends graph chart array outputs
    const windowPlotterBox = document.getElementById('chart-container');
    if (!windowPlotterBox) return;
    windowPlotterBox.innerHTML = '';

    const historicalDaysList = [];
    for (let currentOffset = 6; currentOffset >= 0; currentOffset--) {
        const contextDate = new Date();
        contextDate.setDate(contextDate.getDate() - currentOffset);
        historicalDaysList.push(contextDate.toISOString().split('T')[0]);
    }

    const calculatedPagesDailyArray = historicalDaysList.map(dateKey => {
        return booksCollection
            .filter(item => item.dateAdded === dateKey)
            .reduce((aggregate, item) => aggregate + parseInt(item.pages || 0, 10), 0);
    });

    const maximalDailySum = Math.max(...calculatedPagesDailyArray, 1);

    historicalDaysList.forEach((dayLabel, indexIdx) => {
        const trackingSumValue = calculatedPagesDailyArray[indexIdx];
        const displayPercentHeight = (trackingSumValue / maximalDailySum) * 100;
        const abbreviatedMonthDay = dayLabel.substring(5);

        const pillarElement = document.createElement('div');
        pillarElement.style.cssText = "display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end; width:40px;";
        pillarElement.innerHTML = `
            <div style="background:#db2777; width:20px; height:${Math.max(displayPercentHeight, 5)}%; border-radius:4px 4px 0 0;" title="${trackingSumValue} pages added on ${dayLabel}"></div>
            <div style="font-size:0.7rem; font-weight:600; color:#4c0519; margin-top:5px;">${abbreviatedMonthDay}</div>
        `;
        windowPlotterBox.appendChild(pillarElement);
    });
}

export function populateCatalogRecordsTable(filteredBooks, activePattern, sortKey, triggerEditCall, triggerDeleteCall) {
    const targetBody = document.getElementById('catalog-table-body');
    if (!targetBody) return;
    targetBody.innerHTML = '';

    const viewBuffer = [...filteredBooks];

    // Evaluate sorting options
    const [attribute, sortingDirectionOrder] = sortKey.split('-');
    viewBuffer.sort((valX, valY) => {
        let alpha = attribute === 'pages' ? parseInt(valX[attribute] || 0, 10) : (valX[attribute] || '').toString().toLowerCase();
        let beta = attribute === 'pages' ? parseInt(valY[attribute] || 0, 10) : (valY[attribute] || '').toString().toLowerCase();

        if (alpha < beta) return sortingDirectionOrder === 'asc' ? -1 : 1;
        if (alpha > beta) return sortingDirectionOrder === 'asc' ? 1 : -1;
        return 0;
    });

    if (viewBuffer.length === 0) {
        targetBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#6b7280;">📭 No books match your active catalog filters or queries.</td></tr>`;
        return;
    }

    viewBuffer.forEach(bookItem => {
        const gridRow = document.createElement('tr');
        const labelsString = Array.isArray(bookItem.tags) ? bookItem.tags.join(', ') : (bookItem.tags || 'None');
        
        let matchingTitleContent = bookItem.title || 'Untitled';
        let matchingAuthorContent = bookItem.author || 'Unknown';

        // Apply HTML highlighting tags if a search query is active
        if (activePattern.trim()) {
            try {
                const isolationCompiler = new RegExp(`(${activePattern})`, 'gi');
                matchingTitleContent = matchingTitleContent.replace(isolationCompiler, '<mark style="background:#fbcfe8; color:#9d174d; padding:0 2px; border-radius:2px;">$1</mark>');
                matchingAuthorContent = matchingAuthorContent.replace(isolationCompiler, '<mark style="background:#fbcfe8; color:#9d174d; padding:0 2px; border-radius:2px;">$1</mark>');
            } catch (ex) {}
        }

        gridRow.innerHTML = `
            <td style="font-family:monospace; font-size:0.8rem;">${bookItem.id}</td>
            <td><img src="${bookItem.cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=80'}" alt="Cover" style="width:35px; height:50px; object-fit:cover; border-radius:3px;"></td>
            <td><strong>${matchingTitleContent}</strong></td>
            <td>${matchingAuthorContent}</td>
            <td><strong>${bookItem.pages}</strong></td>
            <td><span style="background:#fff5f7; border:1px solid #fbcfe8; color:#9d174d; padding:2px 6px; border-radius:10px; font-size:0.75rem;">${labelsString}</span></td>
            <td>
                <button class="btn-row-edit" style="padding:4px 8px; cursor:pointer; background:#f3f4f6; border:1px solid #ccc; border-radius:4px;">✍️ Edit</button>
                <button class="btn-row-delete" style="padding:4px 8px; cursor:pointer; background:#fff5f7; border:1px solid #fbcfe8; color:red; border-radius:4px;">🗑️ Delete</button>
            </td>
        `;

        gridRow.querySelector('.btn-row-edit').addEventListener('click', () => triggerEditCall(bookItem));
        gridRow.querySelector('.btn-row-delete').addEventListener('click', () => triggerDeleteCall(bookItem.id));

        targetBody.appendChild(gridRow);
    });
}