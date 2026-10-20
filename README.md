# Skill-Verse — Student Skill Exchange Platform

Skill-Verse is a full-stack peer-to-peer student skill exchange web application. It connects college students who want to learn skills (e.g., React, UI/UX, Cloud) with peers who can teach them (e.g., Java, Python, Machine Learning), featuring intelligent complementary skill matching, direct connection requests, interactive chat, and a reputation badge system.

---

## Tech Stack

### Backend
- **Language / Runtime:** Java 17 (OpenJDK Temurin)
- **Framework:** Spring Boot 3.3.4 (REST API, Spring Security 6)
- **Database:** MongoDB Atlas via Spring Data MongoDB & GridFS (profile photo storage)
- **Authentication:** Stateless JWT (io.jsonwebtoken 0.12.6, HMAC-SHA512) & BCrypt password hashing
- **Build Tool:** Apache Maven 3.9+ (includes `mvnw.cmd` wrapper)

### Frontend
- **Framework:** TanStack Start & Nitro SSR
- **Core:** React 19, TypeScript 5.8
- **Styling & UI:** Tailwind CSS v4, Radix UI primitives, Lucide React icons
- **State & Data Fetching:** TanStack React Query v5
- **Tooling:** Vite 8.1.5, ESLint 9, Prettier

---

## Key Features

- **Intelligent Complementary Skill Matching:** A weighted matching algorithm (60% learning interest coverage, 40% teaching capability coverage, +10 points for two-way swaps, and reputation bonuses) calculates real-time match percentages between students.
- **Student Discovery & Filtering:** Live search and filtering by student name, college, branch, or specific skills.
- **Connection Management:** Send, accept, or reject peer connection requests.
- **Peer-to-Peer Messaging:** Real-time chat history between connected students.
- **Skill Points & Badges:** Students earn points through peer reviews and accepted connections, unlocking badges (*Helpful Mentor*, *Active Learner*, *Great Collaborator*).
- **Profile Photo Storage:** Profile photos stored directly in MongoDB GridFS with max 5MB limits and image compression/streaming.
- **Password Reset Flow:** Secure token-based password reset with single-use expiring links.

---

## Project Structure

```text
skill-verse/
├── backend/                   # Spring Boot Java Application
│   ├── src/main/java/com/skillverse/
│   │   ├── config/            # Data seeder and database configuration
│   │   ├── controller/        # REST controllers (Auth, User, Matches, Messages, etc.)
│   │   ├── dto/               # Request & response records (DTOs)
│   │   ├── model/             # MongoDB document models (User, Skill, Review, Connection)
│   │   ├── repository/        # Spring Data MongoDB repositories
│   │   ├── security/          # JWT filter, token service, Spring Security config
│   │   └── service/           # Business logic & match calculation engine
│   ├── src/test/java/         # Automated unit and regression tests (JUnit 5, Mockito)
│   ├── pom.xml                # Maven configuration
│   └── mvnw.cmd               # Maven wrapper script
├── src/                       # Frontend React / TanStack Start Application
│   ├── components/            # Reusable UI components & navigation layouts
│   ├── context/               # React Context (AuthContext)
│   ├── lib/                   # API client, utility functions, badges configuration
│   ├── routes/                # File-based routes (Dashboard, Find Students, Messages, etc.)
│   └── services/              # Frontend API client services
├── package.json               # Node.js dependencies and scripts
└── vite.config.ts             # Vite & TanStack Start configuration
```

---

## Getting Started

### Prerequisites

- **Java JDK 17+** (`java -version`)
- **Maven 3.9+** (`mvn -version`) or use the included `backend/mvnw.cmd`
- **Node.js 18+ and npm** (`node -v`, `npm -v`)
- **MongoDB Atlas** cluster connection string

---

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd skill-verse
```

---

### Step 2: Configure Environment Variables

1. **Backend Environment Variables (`backend/.env`):**
   Copy `backend/.env.example` to `backend/.env` (this file is excluded by `.gitignore` and will never be committed):
   ```powershell
   Copy-Item backend/.env.example backend/.env
   ```
   Open `backend/.env` and configure your credentials:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
     > **Note:** If your database username or password includes special characters (`@`, `:`, `/`, `?`, `#`, `%`), ensure they are URL-encoded (e.g., replace `@` with `%40`).
   - `JWT_SECRET`: A secure random secret string of at least 32 characters (64 characters recommended).
     > **Note:** Rotating the JWT secret will invalidate existing sessions, requiring users to log in again. Password hashes are stored securely with BCrypt and remain unaffected.

2. **Frontend Environment Variables (`.env` — Optional):**
   Copy `.env.example` to `.env` if you wish to override the backend API base URL:
   ```powershell
   Copy-Item .env.example .env
   ```
   *(Defaults to `http://localhost:8081/api` if omitted).*

---

### Step 3: Run the Application

You will need **two terminal tabs**.

#### Terminal 1 — Start Backend (Spring Boot)

Navigate to the `backend` folder and run the startup script:

```powershell
cd backend
.\run.ps1
```

*(Alternatively, set the environment variables in your terminal session and start manually:)*
```powershell
$env:MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/skillverse?retryWrites=true&w=majority"
$env:JWT_SECRET="your-64-character-secret"
mvn spring-boot:run
```

Wait until you see:
```text
Tomcat started on port 8081 (http) with context path '/api'
Started SkillVerseApplication in ... seconds
```

#### Terminal 2 — Start Frontend (Vite)

In the project root directory (`d:\skill-verse`):

```powershell
npm install
npm run dev
```

Wait until you see:
```text
VITE ready in ... ms
➜  Local:   http://localhost:8080/
```

Open your browser to **`http://localhost:8080`**.

---

### Step 4: Stopping and Restarting

- **To Stop:** Press `Ctrl + C` in each terminal window (enter `Y` if prompted).
- **To Restart:** Simply rerun `.\run.ps1` in the backend terminal and `npm run dev` in the frontend terminal.

---

## Seeded Demo Accounts

On initial startup with an empty database, the backend automatically seeds 24 skills and 10 student profiles.

All demo accounts share the password: **`password123`**

| Student Name | Email | Teaching Skills |
| :--- | :--- | :--- |
| **Krish Patel** | `krish@skillverse.com` | Java, C++, Python, Machine Learning |
| **Aman Sharma** | `aman@skillverse.com` | React, JavaScript, HTML/CSS, UI/UX Design |
| **Priya Nair** | `priya@skillverse.com` | Cloud Computing, DevOps, Python, MongoDB |
| **Sneha Iyer** | `sneha@skillverse.com` | UI/UX Design, Figma, HTML/CSS, Digital Marketing |
| **Mohit Gupta** | `mohit@skillverse.com` | Node.js, Express, SQL, Docker |

---

## REST API Overview

Base URL: `http://localhost:8081/api`

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | Backend health check |
| `POST` | `/auth/login` | Public | Authenticate user, returns JWT and user profile |
| `POST` | `/auth/register` | Public | Create new student account |
| `POST` | `/auth/forgot-password` | Public | Request password reset token |
| `POST` | `/auth/reset-password` | Public | Reset password using one-time token |
| `GET` | `/users` | JWT | List all registered students |
| `GET` | `/users/{id}` | JWT | Get single student details |
| `PUT` | `/users/{id}` | JWT | Update student bio, college, year, skills |
| `POST` | `/users/{id}/skills` | JWT | Add teach or learn skill to profile |
| `POST` | `/users/{id}/photo` | JWT | Upload profile photo (stored in GridFS) |
| `GET` | `/files/{fileId}` | Public | Stream uploaded profile image |
| `GET` | `/skills` | JWT | Catalogue of available skills |
| `GET` | `/matches/{userId}` | JWT | Ranked match recommendations for student |
| `GET` | `/connections?userId={id}` | JWT | List incoming/outgoing connection requests |
| `POST` | `/connections` | JWT | Send connection request |
| `PUT` | `/connections/{id}` | JWT | Accept or reject connection request |
| `GET` | `/messages/{userId}` | JWT | Conversation history with connected peer |
| `POST` | `/messages` | JWT | Send message to connected peer |
| `GET` | `/reviews/{userId}` | JWT | Reviews for a student |
| `POST` | `/reviews` | JWT | Submit a review and rating (1–5 stars) |

---

## Running Tests

### Backend Tests
```powershell
cd backend
mvn clean test
```

### Frontend Tests & Lint
```powershell
npm run lint
npm run build
```
