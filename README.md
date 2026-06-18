# 🦋 LYNN Book & Notes Vault

A clean, modern Single Page Application (SPA) designed to catalog textbooks, managing reading notes, and track library tag statistics.

---

## ✨ Features Built
* **🎨 Pink & Modern Theme**: Responsive layout styled with an aesthetic, modern library backdrop.
* **🧠 Live RegEx Search**: Real-time catalog filtering that safely highlights matching terms without page reloads.
* **💿 Auto-Saving Storage**: Connects directly to browser `localStorage` to save, update, and delete entries persistently.
* **📊 Analytics Chart**: A dynamic dashboard chart that tracks and displays page weights visually.
* **♿ Accessibility Ready**: Built with keyboard skip-links and screen-reader optimizations.

---

## 📂 File Architecture

* `index.html` - Main app interface and view structures.
* `app.js` - Main controller brain connecting all modules together.
* `seed.json` - Default library database containing 10 starting books.
* `tests.html` - Automated test suite running regex constraint validations.
* `styles/main.css` - Custom styling rules and aesthetic design properties.
* `scripts/`
  * `search.js` - Compiles search input patterns and handles text highlighting.
  * `state.js` - Manages adding, editing, and deleting records in active memory.
  * `storage.js` - Coordinates saving and loading cache data from local storage.
  * `ui.js` - Manages single-page view transitions and renders dynamic interface assets.
  * `validators.js` - Houses regular expressions for form entry checking.

---

## 🚀 How to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone [https://github.com/Lynn/book-notes-vault.git](https://github.com/Lynn/book-notes-vault.git)
   