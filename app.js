import { switchView, renderDashboardMetrics, renderCatalogTable, displayFormErrors } from './scripts/ui.js';

// State Architecture Management
let currentLibrary = JSON.parse(localStorage.getItem('lynn_vault_books')) || [];
let activeEditId = null;

function saveStateToStorage() {
    localStorage.setItem('lynn_vault_books', JSON.stringify(currentLibrary));
    refreshUIComponents();
}

function refreshUIComponents() {
    const query = document.getElementById('search-input')?.value || '';
    const sorting = document.getElementById('sort-select')?.value || 'dateAdded-desc';
    
    renderDashboardMetrics(currentLibrary);
    renderCatalogTable(currentLibrary, query, sorting, handleInlineEditTrigger, handleRecordDeletion);
}

// ✍️ Handle Inline Edit Triggers
function handleInlineEditTrigger(book) {
    activeEditId = book.id;
    switchView('form-view');
    
    document.querySelector('#form-view h2').textContent = `✏️ Edit Vault Book (${book.id})`;
    document.getElementById('form-title').value = book.title;
    document.getElementById('form-author').value = book.author;
    document.getElementById('form-pages').value = book.pages;
    document.getElementById('form-cover').value = book.cover || '';
    document.getElementById('form-tags').value = Array.isArray(book.tags) ? book.tags.join(', ') : book.tags;
}

// 🗑️ Handle Record Deletion Flow with Confirm Modals
function handleRecordDeletion(id) {
    if (confirm(`Are you sure you want to permanently erase book record [${id}] from the Vault storage layers?`)) {
        currentLibrary = currentLibrary.filter(b => b.id !== id);
        saveStateToStorage();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Nav Bar Link Switch Route Hook Routing
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.addEventListener('click', () => {
            const path = btn.getAttribute('data-target');
            switchView(path);
            
            if (path === 'form-view' && !activeEditId) {
                document.querySelector('#form-view h2').textContent = "Add a New Book to the Vault";
                document.getElementById('add-book-form').reset();
            }
        });
    });

    // 📝 Add/Edit Form Validation processing pipeline
    const form = document.getElementById('add-book-form');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('form-title').value.trim();
        const author = document.getElementById('form-author').value.trim();
        const pagesStr = document.getElementById('form-pages').value.trim();
        const cover = document.getElementById('form-cover').value.trim();
        const tagsStr = document.getElementById('form-tags').value.trim();

        const errors = [];
        // Regex rules validation checks from Image C
        if (!/^\S+(?:.*\S+)?$/.test(title)) errors.push("Title cannot contain leading/trailing white spaces.");
        if (!/^\S+(?:.*\S+)?$/.test(author)) errors.push("Author cannot contain leading/trailing white spaces.");
        if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(pagesStr)) errors.push("Page count must run as a clean positive numeric value.");

        if (errors.length > 0) {
            displayFormErrors(errors);
            return;
        }
        displayFormErrors([]);

        const parsedPages = parseInt(pagesStr, 10);
        const tagsArr = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

        if (activeEditId) {
            // Update an existing record
            currentLibrary = currentLibrary.map(b => b.id === activeEditId ? {
                ...b, title, author, pages: parsedPages, cover, tags: tagsArr, updatedAt: new Date().toISOString()
            } : b);
            activeEditId = null;
        } else {
            // Append a completely brand new book record
            const newBook = {
                id: `rec_${Math.floor(1000 + Math.random() * 9000)}`,
                title, author, pages: parsedPages, cover, tags: tagsArr,
                dateAdded: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            currentLibrary.push(newBook);
        }

        form.reset();
        saveStateToStorage();
        
        const feedback = document.getElementById('form-success');
        if (feedback) {
            feedback.textContent = "🚀 Vault entry state metrics cataloged successfully!";
            feedback.style.display = 'block';
        }
    });

    // Search input monitoring
    document.getElementById('search-input')?.addEventListener('input', refreshUIComponents);
    document.getElementById('sort-select')?.addEventListener('change', refreshUIComponents);
    document.getElementById('settings-page-cap')?.addEventListener('input', refreshUIComponents);

    // 💾 Import / Export Engine Pipelines (Image B Requirement)
    document.getElementById('btn-export')?.addEventListener('click', () => {
        const fileBlob = new Blob([JSON.stringify(currentLibrary, null, 2)], { type: 'application/json' });
        const downloadUrl = URL.createObjectURL(fileBlob);
        const placeholderLink = document.createElement('a');
        placeholderLink.href = downloadUrl;
        placeholderLink.download = `lynn_vault_backup_${new Date().toISOString().split('T')[0]}.json`;
        placeholderLink.click();
    });

    document.getElementById('btn-import')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsedData = JSON.parse(event.target.result);
                if (Array.isArray(parsedData)) {
                    currentLibrary = parsedData;
                    saveStateToStorage();
                    alert("📂 Vault records imported successfully!");
                } else {
                    alert("ValidationError: Input file structure must form an array.");
                }
            } catch (err) {
                alert("ParseError: Failed to safely compile raw JSON array string entries.");
            }
        };
        reader.readAsText(file);
    });

    // Run primary load rendering matrix sequences
    refreshUIComponents();
});