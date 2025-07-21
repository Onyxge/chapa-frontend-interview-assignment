# React RBAC Admin Dashboard

This project is a Single Page Application (SPA) built with React that demonstrates a complete Role-Based Access Control (RBAC) system. It features distinct user roles (Super Admin, Admin, User), each with a unique dashboard and specific permissions. The application is built entirely on the frontend and uses **Mock Service Worker (MSW)** to simulate a complete backend API for development and testing.

## ✨ Key Features

* **Role-Based Access Control (RBAC):** Three pre-configured user roles with different levels of access:
    * **Super Admin:** Can view all users and manage other admins.
    * **Admin:** Can view and manage regular users (activate/deactivate).
    * **User:** Can only view their own dashboard and transaction history. Show Wallet Balance, List of recent transactions, and a Form to initiate Transactions.
* **Mock Backend API:** Utilizes **Mock Service Worker (MSW)** to intercept client-side requests and provide a realistic, simulated backend environment without needing a live server.
* **Global State Management:** Manages global application state using React's built-in **Context API and `useReducer` hook**, providing a scalable and predictable state solution without external libraries.
* **Dynamic Dashboards:** The UI dynamically renders the appropriate dashboard and functionality based on the logged-in user's role.
* **User Management:** Admins and Super Admins have interfaces to manage other users, including changing their status (active/inactive) or role.

---

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Mock API:** Mock Service Worker (MSW)
* **State Management:** React Context API with `useReducer`
* **Styling:** CSS

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and pnpm installed on your machine.
* [Node.js](https://nodejs.org/) (which includes npm)
* [pnpm](https://pnpm.io/) (package manager)
* [MSW](https://mswjs.io/) (mock service worker)

---

### Installation

1.  **Clone the repository:**
    ```bash
    git@github.com:Onyxge/chapa-frontend-interview-assignment.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd chapa-frontend-interview-assignment
    ```
3.  **Install dependencies:**
    ```bash
    pnpm install
    ```
4.  **Run the development server:**
    ```bash
    pnpm run dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if specified).

---

## 🧑‍💻 Available User Credentials

You can use the following credentials to log in and test the different roles. The password for all users is **`testpassword`**.

| Role          | Email                    | Password       |
|---------------|--------------------------|----------------|
| Super Admin   | `superadmin@bestfin.com` | `testpassword` |
| Admin         | `admin@bestfin.com`      | `testpassword` |
| Active User   | `jimi@bestfin.com`       | `testpassword` |
| Inactive User | `dani@bestfin.com`       | `testpassword` |
| Active User   | `lili@bestfin.com`       | `testpassword` |

---

## 🛑 Important Note on Deployment

This project uses **Mock Service Worker (MSW)**, which is a **development-only tool**. It is configured to be disabled in a production build.

To deploy this application, you would need to build a **real backend server** (e.g., using Node.js/Express, Python/Django, etc.) with a database that implements the same API endpoints found in the `src/mocks/handlers.js` file.
**Debug** if you incounter any issues with the mock service worker. or API not fecting properly ? try to delete the local storage on your browser and reload the page ctrl + shift + r.

---
---
