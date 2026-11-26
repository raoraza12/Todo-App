# ⚡ Zenith Todo App — Premium AI-Powered Workspace

A high-performance, responsive, and aesthetically stunning dark-themed Todo application built with React, Vite, and custom CSS. Equipped with a modular **offline NLP parser** and an **online Gemini AI assistant** to help users organize, schedule, and analyze their tasks.

🖥️ **Live Demo Link:** [https://razas-todo-app.vercel.app](https://razas-todo-app.vercel.app)

---

## ✨ Features

- **🔐 Local Sessions & Auth:** Full Sign-in, Sign-up, and Guest Mode fallback, saving all account configurations locally.
- **📊 Productivity Analytics:** Detailed metrics with an interactive SVG progress ring, task stats (pending, completed, overdue), and priority volume tracking.
- **🛠️ Checklist Subtasks:** Break down primary goals into separate micro-checklists, each equipped with its own progress tracker.
- **🔥 Task Prioritization & Categorization:** Customize categories using HSL color pickers, set task priority levels (high, medium, low) with styled glow borders.
- **📅 Smart Dates:** Automatic tracking for overdue tasks, with friendly labels (*Today, Tomorrow, Overdue*) and built-in calendar scheduling.
- **🔍 Advanced Search & Filters:** Filter tasks seamlessly by category tabs, completion status, priority, and text search simultaneously.
- **🤖 Zenith AI Sidebar:** 
  - **Offline Mode:** Text command parsing (e.g., typing *"Add high priority homework tomorrow"* drafts the task instantly).
  - **Online Mode:** Full integration with Gemini 1.5 Flash (via user API key) for creating checklists, analyzing productivity patterns, and coaching.
- **💾 Backup & Portability:** Import and export your tasks and categories directly as local JSON files.

---

## 🛠️ Technology Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Vanilla CSS (Glassmorphism & Flexbox Grid)
- **Icons:** Lucide React
- **Hosting:** Vercel

---

## 🚀 Getting Started Locally

To run the application locally on your machine, follow these instructions:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) installed.

### Installation & Run

1. Clone this repository:
   ```bash
   git clone https://github.com/raoraza12/Todo-App.git
   ```
2. Navigate into the project folder:
   ```bash
   cd "Todo-App"
   ```
3. Install the packages:
   ```bash
   npm install
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 Production Build

To compile a production bundle:
```bash
npm run build
```
This builds static assets into the `dist/` directory, which is ready for hosting.
