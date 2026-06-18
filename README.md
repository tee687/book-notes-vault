# 🦋 LYNN Book & Notes Vault

This is a simple, easy-to-use Single Page Application (SPA). It helps you list your books, organize study notes, and track your reading goals in real-time.

**Live Website Link:** [https://github.com/Lynn/book-notes-vault.git]


---

## 🎨 Theme and Colors
The app uses a beautiful **Soft Rose and Pink** look:
* **Backgrounds:** Light pink and soft white (`#fff5f7`).
* **Text and Buttons:** High-contrast hot pink (`#db2777`) and dark red (`#9d174d`) so everything is easy to see and read.
* **Keyboard Focus:** A bright blue box (`#2563eb`) appears around items when you navigate using a keyboard.

---

## 🚀 Main Features
* **Organized Code:** Written cleanly using separate files for storage, validation, search, and user interface (`ui.js`).
* **Live Dashboard:** Instantly counts your total books, total pages, and your favorite tags.
* **7-Day Graph:** A visual chart that shows how many pages you added each day for the last 7 days.
* **Goal Alert System:** Tell the app your target page limit. It will show a green message if you are safe, or a red alert if you go over your limit.
* **Smart Search:** Search through your books instantly. The app highlights matching text in pink.
* **Edit & Delete:** Change book details or remove a book directly from the collection table.
* **Save & Load Backups:** Download your entire library list as a JSON file, or upload it back later.

---

## 🔍 RegEx (Search & Validation Rules)

The app uses five smart text rules (Regular Expressions) to check data and make search work perfectly:

| Rule For | What it looks like | Example that works | Example that is blocked | What it does |
| :--- | :--- | :--- | :--- | :--- |
| **Book Title** | `/^\S+(?:.*\S+)?$/` | `The Hobbit` | ` The Hobbit ` | Blocks accidental blank spaces at the start or end. |
| **Author Name** | `/^\S+(?:.*\S+)?$/` | `J.R.R. Tolkien` | ` Tolkien  ` | Blocks accidental blank spaces at the start or end. |
| **Page Count** | `/^\d+$/` | `423` | `-12` or `3.5` | Forces the user to type a clean, positive whole number. |
| **Author Stutter** | `/\b(\w+)\s+\1\b/i` | `John Smith` | `John John` | **Advanced Rule:** Flags errors if the same name is typed twice. |
| **Search Engine** | `new RegExp(input, 'i')` | `^The` | Broken typing | Searches your list safely without crashing the app. |

---

## ⌨️ Keyboard Navigation Map

You can control the entire app without using a mouse:

* <kbd>Tab</kbd> : Move forward to the next button, input box, or link.
* <kbd>Shift</kbd> + <kbd>Tab</kbd> : Move backward to the previous button or input box.
* <kbd>Enter</kbd> / <kbd>Space</kbd> : Click buttons, open drop-downs, or submit forms.
* <kbd>Tab</kbd> (Right after page reload) : Focuses the **"Skip to main content"** link to jump straight over the menu bars.

---

## Accessibility (A11y) Notes
* **Built for Screen Readers:** Uses proper HTML parts like `<nav>`, `<main>`, `<section>`, and `<footer>` so screen readers know exactly where things are.
* **Live Voice Announcements:** Uses a hidden `aria-live` status area. Screen readers will speak out loud when your page goals or alert limits change.
* **High Visibility:** Text and background colors have great contrast so they are easy to read for people with low vision.

---

## 🧪 How to Open and Test the App
Because the app uses clean, separate JavaScript files, security rules require it to run on a local server.

1. **Open your terminal inside the project folder and run Python:**
   ```bash
   python -m http.server 8000