# 🦋 LYNN Book & Notes Vault

This is a clean, simple Single Page Application (SPA). It helps you list your books, organize your study notes, and track your reading goals in real-time.

**Live Website Link:** [https://tee687.github.io/book-notes-vault/](https://tee687.github.io/book-notes-vault/)

---

## 🎨 Theme and Colors
The app uses a beautiful **Soft Rose and Pink** look:
* **Backgrounds:** Light pink highlights and clean white blocks (`#fff5f7`).
* **Text and Buttons:** High-contrast hot pink (`#db2777`) and dark red (`#9d174d`) so everything is easy to see and read.
* **Keyboard Focus:** A bright blue box (`#2563eb`) appears around buttons and links when you navigate using a keyboard.

---

## 🚀 Main Features
* **Organized Code:** Written using separate files for storage, data validation, and your user interface layer (`ui.js`).
* **Live Dashboard:** Counts your total books, total pages, and your favorite collection tags instantly.
* **7-Day Graph:** A visual chart that tracks how many book pages you added each day for the last 7 days.
* **Goal Alert System:** Set a custom page target cap. The system displays a polite status message when under target or an assertive alert if exceeded.
* **Smart Search:** Search through your book list instantly using automated text matching. The app highlights matching text using the `<mark>` tag.
* **Edit & Delete:** Change book details or remove entries completely right from your collection table.
* **Save & Load Backups:** Download your entire library database as a clean JSON file, or upload it back later.

---

## 🔍 RegEx Catalog (Search & Validation Rules)

The app utilizes precise validation layouts to keep your book records entirely clean:

| Rule For | Regular Expression Form | Example that works | Example that is blocked | What it does |
| :--- | :--- | :--- | :--- | :--- |
| **Book Title** | `/^\S+(?:.*\S+)?$/` | `The Hobbit` | ` The Hobbit ` | Forbids accidental trailing or leading blank spaces. |
| **Author Name** | `/^\S+(?:.*\S+)?$/` | `J.R.R. Tolkien` | ` Tolkien  ` | Forbids accidental trailing or leading blank spaces. |
| **Page Count** | `/^\d+$/` | `423` | `-12` or `3.5` | Forces a clean, positive whole integer number. |
| **Author Stutter** | `/\b(\w+)\s+\1\b/i` | `John Smith` | `John John` | **Advanced Rule:** Flags an error if the exact same name string is typed twice. |
| **Search Engine**| `new RegExp(input, 'i')` | `^The` | Broken typing | Compiles search inputs safely using try/catch blocks. |

---

## ⌨️ Keyboard Navigation Map

Full mouse-free navigation flows work flawlessly across your layout:

* <kbd>Tab</kbd> : Step sequentially forward through all buttons, form fields, and table entries.
* <kbd>Shift</kbd> + <kbd>Tab</kbd> : Step backward through the same interface items.
* <kbd>Enter</kbd> / <kbd>Space</kbd> : Click buttons, swap tabs, or submit data entries.
* <kbd>Tab</kbd> (Right on page reload) : Activates a clean **"Skip to main content"** link to jump directly over the header nav bars.

---

## ♿ Accessibility (A11y) Notes
* **Semantic Structure:** Implemented using explicit HTML5 structural landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
* **Live Updates:** Uses a dedicated `aria-live` region to instantly read out updates when goals change or cap limits are crossed.
* **High Contrast Text:** Custom color configurations meet clean structural contrast limits for users with low vision.

---

## 🧪 How to Run Local Testing
Because the application uses modern modular browser features, running it locally requires a local server setup.

1. **Open your terminal inside the project folder and run Python:**
   ```bash
   python -m http.server 8000
   