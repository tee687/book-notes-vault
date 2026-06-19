# LYNN Book and Notes Vault

This is a clean, simple Single Page Application (SPA). It helps you list your books, organize your study notes, and track your reading goals in real-time.

Live Website Link: https://tee687.github.io/book-notes-vault/

---

## Theme and Colors

The app uses a soft rose and pink look:
* Backgrounds: Light pink highlights and clean white blocks (#fff5f7).
* Text and Buttons: High-contrast hot pink (#db2777) and dark red (#9d174d) so everything is easy to see and read.
* Keyboard Focus: A bright blue box (#2563eb) appears around buttons and links when you navigate using a keyboard.

---

## Main Features

* Organized Code: Written using separate files for storage, data validation, and your user interface layer (ui.js).
* Live Dashboard: Counts your total books, total pages, and your favorite collection tags instantly.
* 7-Day Graph: A visual chart that tracks how many book pages you added each day for the last 7 days.
* Goal Alert System: Set a custom page target cap. The system displays a polite status message when under target or an assertive alert if exceeded.
* Smart Search: Search through your book list instantly using automated text matching. The app highlights matching text using the mark tag.
* Edit and Delete: Change book details or remove entries completely right from your collection table.
* Save and Load Backups: Download your entire library database as a clean JSON file, or upload it back later.

---

## RegEx Catalog (Search and Validation Rules)

The app utilizes precise validation layouts to keep your book records entirely clean:

| Rule For | Regular Expression Form | Example that works | Example that is blocked | What it does |
| :--- | :--- | :--- | :--- | :--- |
| Book Title | /^\S+(?:.*\S+)?$/ | The Hobbit |  The Hobbit  | Forbids accidental trailing or leading blank spaces. |
| Author Name | /^\S+(?:.*\S+)?$/ | J.R.R. Tolkien |  Tolkien   | Forbids accidental trailing or leading blank spaces. |
| Page Count | /^\d+$/ | 423 | -12 or 3.5 | Forces a clean, positive whole integer number. |
| Author Stutter | /\b(\w+)\s+\1\b/i | John Smith | John John | Flags an error if the exact same name string is typed twice. |
| Search Engine | new RegExp(input, 'i') | ^The | Broken typing | Compiles search inputs safely using try/catch blocks. |

---

## Keyboard Navigation Map

Full mouse-free navigation flows work flawlessly across your layout:

* Tab: Step sequentially forward through all buttons, form fields, and table entries.
* Shift + Tab: Step backward through the same interface items.
* Enter / Space: Click buttons, swap tabs, or submit data entries.
* Tab (Right on page reload): Activates a clean Skip to main content link to jump directly over the header nav bars.

---

## Accessibility Notes

* Semantic Structure: Implemented using explicit HTML5 structural landmarks (header, nav, main, section, footer).
* Live Updates: Uses a dedicated aria-live region to instantly read out updates when goals change or cap limits are crossed.
* High Contrast Text: Custom color configurations meet clean structural contrast limits for users with low vision.

---

## Milestone Development Roadmap Execution

This repository was developed sequentially following the project milestones:

| Milestone Reference | Feature Scope Implemented | Associated Dev Logs / Commits |
| :--- | :--- | :--- |
| M1 and M2 | Architecture, Data Models, Wireframe Grid and Base CSS Layouts | add application files / main file |
| M3 | Form validation handlers, input constraints and structural test pipelines | fix ui explicit module exports / tests.html |
| M4 | Live sorting arrays, catalog table renders, Regex search text highlights | add search engine logic / add catalog view regex |
| M5 | Dashboard live analytics metric counters, progress caps and threshold math | fix dashboard toggle visibility state |
| M6 | LocalStorage state updates, JSON file schema structure import/export tools | refactor core logic into modular modules |
| M7 | Interface polish, dynamic data fallback implementations, deployment checks | update code logic and fix index file paths |

---

## How to Run Local Testing

Because the application uses modern modular browser features, running it locally requires a local server setup.

1. Open your terminal inside the project folder and run Python:
   python -m http.server 8000

2. Or use Live Server:
   live-server

3. Open your browser to: http://localhost:8000

4. Run Assertions: Visit the live URL path /tests.html to review automatic validation check pass markers.

---

## Citations and References

* AI Assistance: Project structure, data validation logic, keyboard navigation flows, and UI rendering workflow loops designed and refactored with assistance from Gemini and Claude AI.
* Accessibility Guidelines: Adapted principles from the WCAG 2.1 Checklist for keyboard focus and semantic landmark structures.
* Keyboard Navigation: Implemented standard skip-link patterns based on the WebAIM Accessibility Checklist.

---

## Developer Profile

* Name: Tendai Lynn Mtakiwa
* Email: t.mtakiwa@alustudent.com
* GitHub Profile: https://github.com/tee687