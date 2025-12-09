# 📌 PLAN.md: Quiz Management System

## 🎯 Objective
Build a full-stack Quiz Management System that facilitates:
* **Public users** to browse and attempt quizzes.
* **Admin users** to create, edit, delete, and manage quizzes.
* **Secure authentication** ensuring the admin panel is protected from unauthorized access.

---

## 🧩 Assumptions
*These assumptions were made to simplify the initial MVP.*

### 1. User Roles
* **Admins Only:** Only administrators can create or manage quizzes.
* **Public Access:** Regular users can only attempt quizzes and view their immediate results.
* **Single Role:** There is currently one predefined admin role (no hierarchy or editable permissions in MVP).

### 2. Authentication
* **Mechanism:** JSON Web Tokens (JWT).
* **Storage:** Token stored in HTTP-only cookies or localStorage (requires client-side route protection).

### 3. Quiz Structure
* **Categorization:** Each quiz belongs to one category/genre (e.g., JS, GK, DSA).
* **Question Types:** Supports `mcq`, `truefalse`, and `text`.
* **Scoring:** Each question is worth **10 points** (total is computed automatically).
* **Logic:** Results are calculated client-side by comparing submissions against backend answers.

---

## 🛠️ Scope (MVP)

### ✔️ In Scope
| Feature | Description |
| :--- | :--- |
| **Authentication** | Admin login + protected admin routes. |
| **Quiz CRUD** | Create, read, update, and delete quizzes. |
| **Quiz Listing** | Public view of all quizzes with genre filtering. |
| **Quiz Attempt** | Interface to play quizzes (MCQ, True/False, Text). |
| **Results** | Instant score calculation and answer review. |
| **Responsive UI** | Optimized for both Mobile and Desktop. |

### ❌ Out of Scope (Future Enhancements)
* **User Registration:** No public user accounts (currently anonymous/seeded).
* **Leaderboard:** No persistent history or global ranking.
* **Quiz Timer:** No countdown limits on questions.
* **Partial Scoring:** Text answers must match exactly.
* **Media Support:** No image or audio questions.

---

## 🧱 Architecture & Approach

### 🗄️ Backend (Node.js + Express + MongoDB)
* **API:** RESTful API with separate routers for `auth` and `quizzes`.
* **Models:**
    * `AdminUser`
    * `Quiz` (contains nested `questions[]` array)
* **Middleware:** `protect` middleware to validate JWT before accessing admin endpoints.
* **Scripts:** Seeding scripts to generate initial quizzes and admin users.

### 🎨 Frontend (React + MUI)
* **UI Library:** Material UI (MUI) for a polished, component-driven design.
* **Routing:** React Router with protected wrappers for admin paths.
* **State/Network:** Axios for API calls (credentials included).
* **UX:** Skeleton loading states and lazy-loaded pages for performance.

### 🔐 Security
* **Route Protection:** Frontend redirects unauthenticated users away from `/admin`.
* **API Security:** Backend validates JWTs on all sensitive routes.
* **Access Control:** Admin panel is inaccessible via manual URL manipulation without a valid token.

---

## 🔄 Scope Changes During Implementation

| Change | Reason | Impact |
| :--- | :--- | :--- |
| **Added reusable `QuizCard`** | Maintain UI consistency between Home & Admin. | Reduced code duplication & easier maintenance. |
| **Dynamic Result Calculation** | Avoid complexity of server-side state. | More scalable and faster user feedback. |
| **Added UI Delete Icon** | allow quick management directly from the grid. | Improved Admin UX and workflow speed. |
| **Introduced Seed Scripts** | Needed consistent test data. | Faster testing, development, and demo setup. |
| **2-Column Grid (Admin)** | Optimized screen real estate. | Better dashboard layout compared to list view. |

---

## 🚀 Final Result
The system has been delivered with:
-  **Secure Admin Management**
-  **Fully Functional Quiz Play Flow**
-  **Production-Level UI** (using Material UI)
-  **Scalable Backend** (ready for future feature expansion)