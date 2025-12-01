# AV Pro CRM

A comprehensive CRM for Audio Visual professionals, built with React, TypeScript, and Tailwind CSS.

## 🚀 How to Run Locally

### Prerequisites
1.  Install **Node.js** (LTS version) from [nodejs.org](https://nodejs.org).
2.  Get a **Google Gemini API Key** from [aistudio.google.com](https://aistudio.google.com).

### Installation Steps

1.  **Open Terminal**: Navigate to this project folder.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment Variables**:
    *   Create a new file named `.env` in this root folder.
    *   Add your API key inside it:
        ```env
        API_KEY=your_actual_api_key_here
        ```
4.  **Run the App**:
    ```bash
    npm run dev
    ```
5.  **Open Browser**: Click the link shown in the terminal (usually `http://localhost:5173`).

## 📱 Features
*   **Executive Dashboard**: Real-time sales and tasks overview.
*   **Sales Pipeline**: Kanban board for opportunity management.
*   **Project Coordination**: Post-sales tracking (Delivery -> Installation -> Handover).
*   **Price Intelligence**: Track historical product pricing.
*   **Finance**: Invoice and PO management.
*   **AI Assistant**: Powered by Google Gemini for drafting emails and scopes.

## 💾 Data
All data is saved locally to your browser's **Local Storage**. It will persist even if you close the browser, but clearing your browser cache will remove it. Use the **Settings > Data & Export** tab to back up your data to JSON.
