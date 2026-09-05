# 🎬 Movie App — React & TypeScript

A modern, responsive movie discovery application built with **React, TypeScript, and Vite**, powered by the **TMDB API**. The application allows users to explore movies, browse detailed movie information, search for titles, and navigate through different movie categories with a clean and responsive interface.

Built as a portfolio project to demonstrate modern React development, API integration, reusable component architecture, responsive UI development, and TypeScript.

---

## ✨ Features

### 🎥 Movie Discovery

* Browse movies fetched dynamically from the **TMDB API**.
* Explore movie information through a clean, responsive interface.
* Display movie posters, titles, ratings, release information, and other movie details.
* Navigate between different movie sections and pages.

### 🔍 Search & Navigation

* Search for movies using the TMDB API.
* Navigate between application pages using **React Router**.
* Dynamic routes for movie-related pages.
* Responsive navigation designed for desktop and mobile devices.

### 🎞️ Movie Details

* View detailed information for individual movies.
* Display movie metadata such as title, overview, rating, release date, genres, and images.
* Dynamic movie pages based on the selected movie.

### 🌐 API Integration

* Integrated with the **TMDB API** to retrieve real-time movie data.
* API requests are handled through a dedicated service layer.
* **Axios** is used for HTTP requests.
* Environment variables are used for API configuration.

### 📱 Responsive Design

* Fully responsive layout for desktop, tablet, and mobile devices.
* Tailwind CSS utilities are used to create responsive layouts.
* Reusable components keep the interface consistent across the application.

### ✨ Animations

* Smooth UI animations and transitions using **Motion**.
* Animated page and component interactions enhance the overall user experience.
* Motion is used selectively to keep interactions visually engaging without overwhelming the interface.

### 🎨 UI & Icons

* Modern movie-focused interface.
* **Poppins** typography.
* Font Awesome icons for navigation and UI actions.
* Tailwind CSS used for responsive and utility-first styling.

---

## 🛠 Tech Stack

* **React 19** — Component-based UI development
* **TypeScript** — Static typing and safer development
* **Vite** — Fast development server and production build tooling
* **Tailwind CSS** — Utility-first responsive styling
* **React Router** — Client-side routing and dynamic routes
* **Axios** — HTTP requests and API communication
* **Motion** — UI animations and transitions
* **Font Awesome** — Icons and interface elements
* **TMDB API** — Movie data and metadata
* **ESLint** — Code quality and linting

---

## 📁 Project Structure

```text
movie-app/
├── public/
│
├── src/
│   ├── Hooks/
│   │   └── # Custom React hooks
│   │
│   ├── Services/
│   │   └── API/
│   │       └── # TMDB API requests and configuration
│   │
│   ├── assets/
│   │   └── # Images and static assets
│   │
│   ├── components/
│   │   └── # Reusable UI components
│   │
│   ├── layouts/
│   │   └── # Application layouts
│   │
│   ├── pages/
│   │   └── # Application pages
│   │
│   ├── routes/
│   │   └── # React Router configuration
│   │
│   ├── styles/
│   │   └── # Application styles
│   │
│   ├── types/
│   │   └── # TypeScript type definitions
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── env.d.ts
│   ├── index.css
│   └── main.tsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔐 Environment Variables

The application uses environment variables for API configuration.

Create a `.env` file in the project root:

```env
VITE_TMDB_KEY=your_tmdb_api_key
VITE_BASE_URL=your_base_url
```

The environment variable types are defined in `src/env.d.ts`:

```ts
interface ImportMetaEnv {
  readonly VITE_TMDB_KEY: string;
  readonly VITE_BASE_URL: string;
}
```

> **Note:** `.env` files containing real credentials should not be committed to the repository.

Because this is a Vite client-side application, variables prefixed with `VITE_` are exposed to the browser during the production build. The TMDB API key should therefore be treated as a client-side API credential rather than a private server secret.

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* npm
* A TMDB API key

### Installation

```bash
# Clone the repository
git clone https://github.com/Abdelraouf3/movie-app.git

# Navigate to the project
cd movie-app

# Install dependencies
npm install

# Create your environment file
# Add your TMDB API key and base URL

# Start the development server
npm run dev
```

Open the local development URL displayed by Vite in your browser.

### Production Build

```bash
# Create a production build
npm run build

# Preview the production build
npm run preview
```

### Lint

```bash
npm run lint
```

---

## 🔄 Application Flow

```text
User
 │
 ▼
React UI
 │
 ├── Browse Movies
 ├── Search Movies
 └── Open Movie Details
 │
 ▼
React Router
 │
 ▼
Page / Component
 │
 ▼
API Service
 │
 ▼
Axios
 │
 ▼
TMDB API
 │
 ▼
Movie Data
 │
 ▼
React Components
 │
 ▼
Rendered UI
```

---

## 🧩 Architecture

The application separates responsibilities into dedicated layers:

```text
Components
    │
    ▼
Pages / Layouts
    │
    ▼
Custom Hooks
    │
    ▼
API Services
    │
    ▼
TMDB API
```

* **Components** handle reusable UI.
* **Pages** represent application-level views.
* **Layouts** organize shared page structures.
* **Hooks** encapsulate reusable React logic.
* **Services/API** centralize communication with TMDB.
* **Types** provide reusable TypeScript definitions.
* **Routes** manage application navigation.

This structure keeps the application easier to maintain and makes individual responsibilities clearer as the project grows.

---

## 📌 Key Technical Highlights

* Built with **React 19 + TypeScript**.
* Designed with a reusable component architecture.
* Integrated a third-party REST API using Axios.
* Implemented client-side routing with React Router.
* Added reusable custom hooks for application logic.
* Organized API communication into a dedicated service layer.
* Used TypeScript types to improve reliability and maintainability.
* Built responsive interfaces with Tailwind CSS.
* Added smooth animations with Motion.
* Used environment variables for API configuration.
* Added ESLint for maintaining code quality.

---

## 🌙 Live Demo

### 👉 [**Movie App**](https://github.com/Abdelraouf3/movie-app)

> Add your deployed Movie App URL here once the application is deployed.

---

## 📄 License

This project was created for educational and portfolio purposes.
