# TaskTracker - Full Stack MERN Application

A modern, responsive, and feature-rich Task Management application built using the **MERN Stack** (MongoDB, Express.js, React, Node.js). 

This project was developed as a technical assignment for the **Full Stack Developer Intern** position at **COLL-EDGE CONNECT**. It goes beyond the basic requirements by implementing an advanced analytics dashboard, framer-motion animations, search capabilities, and a highly polished glassmorphism user interface.

---

## 🚀 Live Demo

- **Frontend Deployment (Vercel):** [Insert Frontend URL Here]
- **Backend Deployment (Render):** [Insert Backend URL Here]

*(Note: Please allow up to 30 seconds for the backend to spin up if it has been idle, as it is hosted on a free Render tier).*

---

## 💻 Tech Stack

### Frontend
- **React.js (Vite)** - Fast, modern UI library.
- **Framer Motion** - Fluid layout animations and page transitions.
- **Recharts** - Data visualization (Pie and Bar charts).
- **React Router** - Single Page Application (SPA) navigation.
- **Axios** - HTTP client for API requests.
- **Vanilla CSS** - Custom premium glassmorphism styling and fully responsive grid/flexbox layouts.

### Backend
- **Node.js & Express.js** - Robust REST API architecture.
- **MongoDB & Mongoose** - Database and Object Data Modeling (ODM).
- **MongoDB Aggregation Pipeline** - Complex data processing for dashboard statistics.
- **Cors & Dotenv** - Middleware and environment variable management.

---

## ✨ Features

### Mandatory Features Implemented
- **Full CRUD Operations**: Create, Read, Update, and Delete tasks.
- **Form Validation**: Strict schema validation on the backend and UX validation on the frontend.
- **RESTful API**: Structured endpoints using MVC principles.
- **MongoDB Integration**: Hosted on MongoDB Atlas.
- **Responsive UI**: Custom layouts that adapt flawlessly to mobile, tablet, and desktop screens.
- **Dynamic Updates**: Client-side state management ensures UI updates instantly without page reloads.

### Bonus & Premium Features Implemented
- 📊 **Analytics Dashboard**: Real-time Pie and Bar charts calculating task status and priority distributions using advanced MongoDB Aggregations.
- 🔍 **Search-as-you-type**: Instant filtering through task titles and descriptions using backend Regex queries.
- 🎭 **Smooth Animations**: Integrated `framer-motion` for a premium, app-like feel.
- 📱 **Mobile-First UX**: Specialized tab-switching interface designed specifically for mobile screens.
- 🔔 **Toast Notifications**: Interactive feedback loops for user actions (`react-toastify`).
- 📁 **Pagination/Limits**: Dedicated view for recent tasks and a separate page for viewing all historical tasks.

---

## 🛠️ Local Development Setup

To run this project locally, you will need **Node.js** and a **MongoDB** connection string.

### 1. Clone the Repository
```bash
git clone <your-github-repo-link>
cd "task tracker"
```

### 2. Backend Setup
```bash
cd server
npm install
```
- Create a `.env` file in the `server` directory.
- Add the following variables:
  ```env
  PORT=5000
  MONGODB_URI=your_mongodb_atlas_connection_string
  ```
- Start the server:
  ```bash
  npm run dev
  ```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
- Create a `.env` file in the `client` directory.
- Add the following variable:
  ```env
  VITE_API_BASE_URL=http://localhost:5000/api
  ```
- Start the client:
  ```bash
  npm run dev
  ```
- Visit `http://localhost:5173` in your browser.

---

## 🗂️ API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks (supports `search`, `status`, `priority`, `sortBy` queries) |
| GET | `/api/tasks/stats` | Get aggregated task statistics |
| GET | `/api/tasks/:id` | Get a specific task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task's details or status |
| DELETE | `/api/tasks/:id` | Delete a task |

---
*Designed & Developed by Sayan Paul*
