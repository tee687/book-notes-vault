# 🦋 LYNN Book & Notes Vault 🦋

A clean, responsive, single-page dashboard application built to catalog literary collections, monitor dynamic reading metrics, track threshold goals, and organize structured learning notes.

* **Live Website URL (GitHub Pages Only):** [https://tee687.github.io/book-notes-vault/](https://tee687.github.io/book-notes-vault/)
* **Repository URL:** [https://github.com/tee687/book-notes-vault](https://github.com/tee687/book-notes-vault)
* **Demo Video (Unlisted Link):** [https://youtu.be/otYXyfCthCg](https://youtu.be/otYXyfCthCg)

---

## 🎨 Chosen Theme
The application is built around a **"Soft Whimsical Tech"** aesthetic, using vibrant pinks, hot pink accents, soft gradients, and subtle emoji indicators (`🦋`, `📚`, `📊`). This creates an inviting, accessible environment that balances clean tabular management systems with a deeply personalized user experience.

---

## ✨ Features List
* **Single Page Application Architecture:** Instant, mouse-free tab switching via modern UI element display toggles without hard browser refreshes.
* **Dynamic Analytics Engine:** Real-time summary metrics parsing total counts, cumulative pages read, and top content tags.
* **Target Milestone Tracker:** Configurable maximum goal alerts that calculate page limits and dynamically present status banners if limits are crossed.
* **Data Persistence Layer:** Comprehensive synchronization with browser `localStorage` to ensure client data is securely cached across updates.
* **JSON Data Management:** One-click portable JSON file generation and schema-verified file loaders for effortless database backups and restoration.

---

## 🔍 Regular Expression (RegEx) Catalog

### 1. Title Sanitization Pattern
* **Pattern:** `^[^\s].*[^\s]$`
* **Explanation:** Ensures titles do not begin or end with trailing/leading spaces.
* **Valid Example:** `"The Fellowship of the Ring"`
* **Invalid Example:** `"   The Hobbit"` (Flagged for leading whitespace blocks)

### 2. Advanced Repetitive Surname Filter
* **Pattern:** `\b(\w+)\b\s+\b\1\b`
* **Explanation:** Catches contiguous duplicate token matches to trap input typos in author fields.
* **Valid Example:** `"J.R.R. Tolkien"`
* **Invalid Example:** `"smith smith"` (Flagged for sequential word repetition)

### 3. Whole Positive Numeric Rule
* **Pattern:** `^[1-9]\d*$`
* **Explanation:** Enforces valid page limits by requiring a non-zero, whole positive integer.
* **Valid Example:** `423`
* **Invalid Example:** `-12` or `0`

---

## ⌨️ Keyboard Map

The application maps keyboard navigation directly to system landmarks to eliminate mouse dependency:

| Keystroke | Targeted Interaction / Focus Component |
| :--- | :--- |
| **`Tab`** | Move systematically downward/right through accessible nav-links and interactive input groups. |
| **`Shift + Tab`** | Reverse sequential navigation movement upward/left. |
| **`Enter`** / **`Space`** | Trigger click actions on focused navigation buttons or fire form submission payloads. |
| **`Arrow Keys`** | Seamless drop-down menu navigation inside sorting and selection structures. |

---

## ♿ Accessibility (A11y) Notes
* **Skip Navigation:** A clear `#main-content` skip anchor is positioned at the top of the tree stack to allow screen-readers to immediately bypass header elements.
* **Focus Outlines:** Custom visual focus bounding boxes are applied via high-contrast CSS triggers to guarantee structural visibility during tab routines.
* **ARIA Live Notifications:** An isolated polite announcer container (`role="status"`, `aria-live="polite"`) safely processes background milestone modifications and validation warnings.
* **Landmark Semantics:** Strict adoption of HTML5 structural architecture (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) maps clean outlines for assistive technologies.

---

## 🧪 How to Run Tests
The system uses a vanilla JS testing environment verifying both the collection layout components and state mutation arrays.

1. Clone this repository locally.
2. Ensure you have Node.js installed on your workspace.
3. Open a terminal inside the root project directory and run:
   ```bash
   npm install
   npm test