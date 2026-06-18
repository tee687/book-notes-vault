import { fetchStoredBooks, persistBooksCollection, validateBackupSchema } from './scripts/storage.js';
import { runFormValidationPipeline } from './scripts/validators.js';
import { executeRegexQueryFilter } from './scripts/search.js';
import { transitionActiveView, populateDashboardMetrics, populateCatalogRecordsTable } from './scripts/ui.js';

let appStateBooks = fetchStoredBooks();
let activeEditingReferenceId = null;

function commitStateAndSyncUI() {
    persistBooksCollection(appStateBooks);
    executeUIRenderWorkflowLoop();
}

function executeUIRenderWorkflowLoop() {
    const rawPatternString = document.getElementById('search-input')?.value || '';
    const sortingConditionMode = document.getElementById('sort-select')?.value || 'dateAdded-desc';
    
    const searchFilteredCollection = executeRegexQueryFilter(appStateBooks, rawPatternString);
    
    populateDashboardMetrics(appStateBooks);
    populateCatalogRecordsTable(searchFilteredCollection, rawPatternString, sortingConditionMode, handleInlineEditRequest, handleRecordDeletionExecution);
}

function handleInlineEditRequest(bookObj) {
    activeEditingReferenceId = bookObj.id;
    transitionActiveView('form-view');
    
    document.getElementById('form-section-heading').textContent = `✏️ Edit Book Entry (${bookObj.id})`;
    document.getElementById('form-title').value = bookObj.title;
    document.getElementById('form-author').value = bookObj.author;
    document.getElementById('form-pages').value = bookObj.pages;
    document.getElementById('form-cover').value = bookObj.cover || '';
    document.getElementById('form-tags').value = Array.isArray(bookObj.tags) ? bookObj.tags.join(', ') : bookObj.tags;
}

function handleRecordDeletionExecution(id) {
    if (confirm("Are you sure you want to permanently delete this book entry from your local vault storage?")) {
        appStateBooks = appStateBooks.filter(item => item.id !== id);
        commitStateAndSyncUI();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Navigation routing listeners
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.addEventListener('click', () => {
            const viewTargetId = btn.getAttribute('data-target');
            transitionActiveView(viewTargetId);
            
            if (viewTargetId === 'form-view' && !activeEditingReferenceId) {
                document.getElementById('form-section-heading').textContent = "Add a New Book to the Vault";
                document.getElementById('add-book-form').reset();
            }
        });
    });

    // Form submit listener
    const submissionForm = document.getElementById('add-book-form');
    submissionForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const title = document.getElementById('form-title').value.trim();
        const author = document.getElementById('form-author').value.trim();
        const pagesStr = document.getElementById('form-pages').value.trim();
        const cover = document.getElementById('form-cover').value.trim();
        const tagsStr = document.getElementById('form-tags').value.trim();

        const errorsDetectedList = runFormValidationPipeline(title, author, pagesStr);
        const feedbackErrorBox = document.getElementById('form-errors');
        const feedbackSuccessBox = document.getElementById('form-success');

        if (errorsDetectedList.length > 0) {
            feedbackSuccessBox.style.display = 'none';
            feedbackErrorBox.style.display = 'block';
            feedbackErrorBox.innerHTML = `<strong>Form errors detected:</strong><ul>${errorsDetectedList.map(e => `<li>${e}</li>`).join('')}</ul>`;
            return;
        }

        feedbackErrorBox.style.display = 'none';
        const parsedPageInt = parseInt(pagesStr, 10);
        const arrayTags = tagsStr ? tagsStr.split(',').map(item => item.trim()).filter(Boolean) : [];

        if (activeEditingReferenceId) {
            appStateBooks = appStateBooks.map(item => item.id === activeEditingReferenceId ? {
                ...item, title, author, pages: parsedPageInt, cover, tags: arrayTags, updatedAt: new Date().toISOString()
            } : item);
            activeEditingReferenceId = null;
        } else {
            const appendedNewRecordItem = {
                id: `rec_${Date.now().toString().slice(-4)}`,
                title, author, pages: parsedPageInt, cover, tags: arrayTags,
                dateAdded: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            appStateBooks.push(appendedNewRecordItem);
        }

        submissionForm.reset();
        commitStateAndSyncUI();
        
        feedbackSuccessBox.textContent = "🚀 Vault catalog states updated successfully!";
        feedbackSuccessBox.style.display = 'block';
    });

    // Filtering, sorting and configuration change listeners
    document.getElementById('search-input')?.addEventListener('input', executeUIRenderWorkflowLoop);
    document.getElementById('sort-select')?.addEventListener('change', executeUIRenderWorkflowLoop);
    document.getElementById('settings-page-cap')?.addEventListener('input', executeUIRenderWorkflowLoop);

    // Backup actions loop logic
    document.getElementById('btn-export')?.addEventListener('click', () => {
        const systemBlobInstance = new Blob([JSON.stringify(appStateBooks, null, 2)], { type: 'application/json' });
        const temporaryDownloadAnchor = document.createElement('a');
        temporaryDownloadAnchor.href = URL.createObjectURL(systemBlobInstance);
        temporaryDownloadAnchor.download = `lynn_vault_backup.json`;
        temporaryDownloadAnchor.click();
    });

    document.getElementById('btn-import')?.addEventListener('change', (evt) => {
        const standardTargetFile = evt.target.files[0];
        if (!standardTargetFile) return;

        const uploadFileReader = new FileReader();
        uploadFileReader.onload = (readEvent) => {
            try {
                const parsedObjectDump = JSON.parse(readEvent.target.result);
                if (validateBackupSchema(parsedObjectDump)) {
                    appStateBooks = parsedObjectDump;
                    commitStateAndSyncUI();
                    alert("📂 Vault backup data populated perfectly!");
                } else {
                    alert("ValidationError: Upload data schema layout mismatch properties.");
                }
            } catch (err) {
                alert("ParseError: Malformed file data structures could not compile.");
            }
        };
        uploadFileReader.readAsText(standardTargetFile);
    });

    // Run first initialization render pass
    executeUIRenderWorkflowLoop();
});