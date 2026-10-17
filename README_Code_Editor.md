# Code Editor

A lightweight, browser-based code editor for front-end development. It brings HTML, CSS, and JavaScript into one workspace, with a live preview and an output console to help you test your work directly in the browser.

**Repository:** [Hradhay/Code-Editor](https://github.com/Hradhay/Code-Editor)

## Features

- **Separate HTML, CSS, and JavaScript tabs** to keep front-end code organised.
- **Live preview** to run your code and view the result in an embedded preview.
- **Open preview in a new window** for a larger view of the output.
- **Output console** to display logs and results while testing.
- **Optional JavaScript validation tests** that can be run alongside the code.
- **Save and load work locally** using a JSON file, so you can continue working later.
- **Keyboard shortcuts** for common actions:
  - `Ctrl + S` — save work
  - `Ctrl + Enter` — run code
- **Assignment and notes area** for keeping task instructions beside the editor.

## Built With

- HTML
- CSS
- JavaScript
- [Ace Editor](https://ace.c9.io/) for the code-editing interface

## Getting Started

This project is a static front-end application and does not require a build step or package installation.

### Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Hradhay/Code-Editor.git
   ```

2. Open the project folder:

   ```bash
   cd Code-Editor
   ```

3. Open `index.html` in a modern web browser.

You can also open the repository folder in a code editor and use a local development server if you prefer.

## How to Use

1. Open `index.html` in your browser.
2. Enter your task or assignment in the **Text / Assignment** section.
3. Add your markup in the **HTML** tab, styles in **CSS**, and behaviour in **JS**.
4. Select **Run** to update the preview.
5. Check the **Output** panel for logs.
6. Optionally add JavaScript validation code and select **Run with tests**.
7. Use **Save** to export your work as a JSON file, then **Load** to restore it later.

## Project Structure

```text
Code-Editor/
├── index.html   # Editor layout and interface
├── style.css    # Styling and responsive layout
├── script.js    # Editor interactions, running code, output, and save/load logic
└── README.md    # Project documentation
```

## Notes

- The editor is intended for front-end HTML, CSS, and JavaScript work.
- The live preview runs in a sandboxed browser iframe.
- Ace Editor is loaded from a CDN, so an internet connection is needed for that external script to load.
- This is a browser-based editor, not a full desktop IDE or a general-purpose compiler for every programming language.

## Future Improvements

Possible additions include more language support, improved error reporting, autosave, and a more advanced file/project management workflow.

## Author

**Hradhay Yagnik**

- GitHub: [@Hradhay](https://github.com/Hradhay)
- Project Repository: [Code-Editor](https://github.com/Hradhay/Code-Editor)
