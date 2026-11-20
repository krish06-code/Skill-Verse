# Skill-Verse — Student Skill Exchange Platform

Skill-Verse is an enterprise-grade full-stack peer-to-peer student skill exchange application. It connects students across colleges and branches who want to learn new skills (e.g., React, Cloud Computing, UI/UX) with peers capable of teaching them (e.g., Java, Python, Machine Learning). The platform features an intelligent complementary skill-matching engine, real-time connection management, instant peer chat, MongoDB GridFS profile photo streaming, and an automated reputation/badge system.

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Complementary Matching Algorithm](#complementary-matching-algorithm)
- [Gamification & Reputation Engine](#gamification--reputation-engine)
- [Database Schema (MongoDB)](#database-schema-mongodb)
- [Security Architecture](#security-architecture)
- [Project Directory Structure](#project-directory-structure)
- [Environment Configuration](#environment-configuration)
- [Quick Start Guide](#quick-start-guide)
  - [Prerequisites](#prerequisites)
  - [macOS / Linux Setup](#macos--linux-setup)
  - [Windows Setup](#windows-setup)
- [Seeded Demo Accounts](#seeded-demo-accounts)
- [REST API Specification](#rest-api-specification)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Troubleshooting & FAQ](#troubleshooting--faq)

---

## System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│                 (React 19 / TanStack Start)                 │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST (JWT Bearer)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Spring Boot 3.3.4 Backend                   │
│                    (Context Path: /api)                     │
│  ┌───────────────────────┐       ┌───────────────────────┐  │
│  │    Security Filter    │       │    Match Engine       │  │
│  │ (Stateless JWT / Auth)│       │ (Weighted Algorithms) │  │
│  └───────────┬───────────┘       └───────────┬───────────┘  │
│              ▼                               ▼              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               Spring Data Repositories                │  │
│  └───────────────────────────┬───────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────┘
                               │ Mongo Driver / GridFS
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     MongoDB Atlas                           │
│  Collections: users, skills, connections, messages,         │
│               reviews, password_reset_tokens, fs.files      │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Backend
| Technology | Version / Spec | Purpose |
| :--- | :--- | :--- |
| **Java** | 17 / 21 LTS (OpenJDK Temurin) | Server Runtime |
| **Spring Boot** | 3.3.4 | Core Application Framework |
| **Spring Security** | 6.x | Stateless JWT Authentication & BCrypt Password Hashing |
| **Spring Data MongoDB** | 3.3.4 | Object-Document Mapping & Aggregations |
| **MongoDB GridFS** | GridFSBucket | Chunked binary storage for profile images up to 5MB |
| **JWT** | `io.jsonwebtoken:jjwt:0.12.6` | HMAC-SHA512 token creation & cryptographic verification |
| **Validation** | Jakarta Bean Validation 3.0 | Strict request payload constraint enforcement |
| **Build System** | Apache Maven 3.9+ | Dependency management, compilation, and testing |

### Frontend
| Technology | Version / Spec | Purpose |
| :--- | :--- | :--- |
| **Framework** | TanStack Start (v1.168) | Full-stack React SSR & type-safe file-based routing |
| **Core** | React 19, TypeScript 5.8 | Modern reactive UI engine |
| **Styling** | Tailwind CSS v4 | Utility-first responsive styling |
| **UI Primitives** | Radix UI | Accessible headless UI components |
| **Icons** | Lucide React | High-clarity SVG icon set |
| **Server State** | TanStack React Query v5 | Data synchronization, optimistic updates, and caching |
| **Build Tool** | Vite 8.1.5 | Fast Hot Module Replacement (HMR) & bundling |

---

## Key Features

1. **Intelligent Matchmaking:** Dynamically calculates compatibility percentages based on complementary learning/teaching overlaps, related skill category credits, mutual two-way swaps, and student reputation ratings.
2. **Student Directory & Live Filters:** Search students by name, university, branch, year, or specific technical competencies.
3. **Peer Connections Workflow:** Request connection, view incoming/outgoing queues, and accept or reject requests.
4. **Peer Messaging:** 1-on-1 chronological conversation history between connected peers.
5. **Skill Points & Badges:** Gamified progression system where students earn reputation points for active teaching, reviews, and completed connections.
6. **GridFS Image Storage:** Secure profile picture uploads directly backed by MongoDB GridFS with automatic image streaming and type validation.
7. **Secure Password Recovery:** Cryptographically secure single-use expiring token flow with optional SMTP integration (logs to console when SMTP is unconfigured).
8. **Automated Seed Engine:** Seeds 24 skills across 6 categories and 10 realistic student profiles with connections, messages, and reviews upon first launch.

---

## Complementary Matching Algorithm

The matching engine implemented in `MatchService.java` calculates match affinity ($0\% - 100\%$) between student pairs:

$$\text{Match Score} = (0.55 \times \text{Learn Coverage}) + (0.35 \times \text{Teach Coverage}) + \text{Bonuses}$$

### Scoring Components:
- **Learn Coverage (55% weight):** Measures how much of what Student A wants to learn can be taught by Student B. Exact skill match awards `1.0`. Shared category skill (e.g. both in "Frontend Development") awards `0.4` partial credit.
- **Teach Coverage (35% weight):** Measures how much of what Student A can teach is desired by Student B. Exact skill match awards `1.0`; shared category awards `0.4`.
- **Two-Way Mutual Swap (+10% bonus):** Awarded if both students can teach each other at least one required skill.
- **Shared Interest (+3% bonus):** Awarded if both students are concurrently trying to learn the same skill.
- **Reputation Modifier ($\pm 4\%$ nudge):** Based on peer star rating:
  $$\text{Reputation Nudge} = \left(\frac{\text{Rating} - 3.0}{2.0}\right) \times 0.04$$
- The computed total is clamped strictly between **0% and 100%** and sorted in descending order.

---

## Gamification & Reputation Engine

Skill points track student engagement and unlock badges:

| Action | Points Earned | Recipient |
| :--- | :--- | :--- |
| **Connection Accepted** | `+10 Points` | Both Sender and Receiver |
| **Peer Review Received** | `+(Rating × 5) Points` | Reviewed Student (e.g., 5-star review = +25 pts) |

### Badges:
- 🏆 **Helpful Mentor:** Awarded for completing peer teaching sessions.
- ⭐ **Active Learner:** Awarded for expanding learning skills across semesters.
- 🤝 **Great Collaborator:** Awarded for establishing and maintaining verified peer connections.

---

## Database Schema (MongoDB)

### 1. `users` Collection
```json
{
  "_id": "ObjectId",
  "name": "Krish Patel",
  "email": "krish@skillverse.com",
  "password": "$2a$10$... (BCrypt hashed)",
  "college": "Stanford University",
  "branch": "Computer Science",
  "year": "3rd Year",
  "bio": "Passionate about backend systems and distributed algorithms.",
  "profileImage": "gridfs-file-id-or-null",
  "skillPoints": 75,
  "teachSkills": ["Java", "C++", "Python", "Machine Learning"],
  "learnSkills": ["React", "UI/UX Design", "Docker"]
}
```

### 2. `skills` Collection
```json
{
  "_id": "ObjectId",
  "name": "React",
  "category": "Frontend Development"
}
```

### 3. `connections` Collection
```json
{
  "_id": "ObjectId",
  "senderId": "user_id_1",
  "receiverId": "user_id_2",
  "status": "ACCEPTED", // PENDING, ACCEPTED, REJECTED
  "createdAt": "2026-11-20T00:00:00Z"
}
```

### 4. `messages` Collection
```json
{
  "_id": "ObjectId",
  "senderId": "user_id_1",
  "receiverId": "user_id_2",
  "message": "Hey! Would you like to exchange Java for React lessons?",
  "timestamp": "2026-11-20T00:05:00Z"
}
```

### 5. `reviews` Collection
```json
{
  "_id": "ObjectId",
  "reviewerId": "user_id_1",
  "reviewerName": "Aman Sharma",
  "reviewedUserId": "user_id_2",
  "rating": 5, // 1 to 5 integer
  "comment": "Excellent mentor! Explained Spring Boot architecture clearly.",
  "createdAt": "2026-11-20T00:10:00Z"
}
```

### 6. `password_reset_tokens` Collection
```json
{
  "_id": "ObjectId",
  "tokenHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "userId": "user_id_1",
  "expiresAt": "2026-11-20T01:10:00Z",
  "used": false
}
```

---

## Security Architecture

- **Stateless Session Management:** The backend issues an HMAC-SHA512 signed JWT upon authentication. No session state is held in server memory.
- **Salted Password Hashing:** User passwords are never saved in plain text. Spring Security's `BCryptPasswordEncoder` handles hashing and salting.
- **Password Reset Security:** Reset tokens are hashed with SHA-256 before persistence in MongoDB. The plaintext token is delivered once to the user's email (or terminal log) and invalidated immediately upon first use or expiry (1-hour TTL).
- **File Upload Protection:** Handled via MongoDB GridFS with a strict 5MB limit, limiting supported MIME types to `image/jpeg`, `image/png`, `image/webp`, and `image/gif`.
- **CORS Protection:** Configurable origin whitelisting (`CORS_ORIGINS`) to prevent cross-origin request forgery.

---

## Project Directory Structure

```text
Skill-Verse/
├── backend/                               # Spring Boot Application
│   ├── src/main/java/com/skillverse/
│   │   ├── config/                        # DataSeeder & DB configuration
│   │   ├── controller/                    # REST API Controllers
│   │   ├── dto/                           # Dtos.java (Type-safe Request/Response Records)
│   │   ├── model/                         # MongoDB Document Models
│   │   ├── repository/                    # Spring Data Repositories
│   │   ├── security/                      # JwtService, JwtAuthFilter, SecurityConfig
│   │   ├── service/                       # Business Logic (MatchService, ReviewService, etc.)
│   │   └── web/                           # GlobalExceptionHandler & Custom ApiException
│   ├── src/main/resources/
│   │   └── application.properties         # Backend Application Configurations
│   ├── src/test/java/                     # JUnit 5 & Mockito Unit Tests
│   ├── .env.example                       # Backend Environment Template
│   ├── pom.xml                            # Maven Dependencies & Plugins
│   ├── run.sh                             # macOS / Linux Startup Script
│   ├── run.ps1                            # Windows PowerShell Startup Script
│   └── mvnw.cmd                           # Windows Maven Wrapper
│
├── src/                                   # Frontend React Application
│   ├── components/                        # Layouts, SkillTags, StudentCards, UI Primitives
│   ├── context/                           # AuthContext (React Authentication Context)
│   ├── hooks/                             # useRequireAuth, mobile utilities
│   ├── lib/                               # Axios client, badges configuration, utilities
│   ├── routes/                            # TanStack Start File-based Routes
│   │   ├── dashboard.tsx                  # Student Dashboard & Match Suggestions
│   │   ├── find-students.tsx              # Browse & Filter Student Directory
│   │   ├── connections.tsx                # Incoming & Outgoing Connection Requests
│   │   ├── messages.tsx                   # Instant Chat View
│   │   ├── skill-points.tsx               # Gamification & Badges Showcase
│   │   ├── profile.index.tsx              # Current User Profile
│   │   ├── profile.edit.tsx               # Edit Bio, Skills, Photo Upload
│   │   ├── login.tsx / register.tsx       # Auth Pages
│   │   └── forgot-password.tsx            # Password Reset Flow
│   ├── services/                          # API Service Modules (auth, match, review, etc.)
│   └── styles.css                         # Tailwind CSS v4 Styles
│
├── .env.example                           # Frontend Environment Template
├── package.json                           # Frontend Dependencies & Scripts
├── tsconfig.json                          # TypeScript Compiler Options
└── vite.config.ts                         # Vite & TanStack Start Configuration
```

---

## Environment Configuration

### 1. Backend (`Skill-Verse/backend/.env`)
Copy `backend/.env.example` to `backend/.env` and update the parameters:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `8081` | Port on which the Spring Boot application runs |
| `MONGODB_URI` | *Required* | MongoDB Atlas connection string (or local MongoDB URI) |
| `MONGODB_DATABASE` | `skillverse` | Target database name |
| `JWT_SECRET` | *Required* | Secret key for signing JWTs (must be at least 32 characters) |
| `CORS_ORIGINS` | `http://localhost:8080,...` | Comma-separated list of allowed frontend origins |
| `APP_BASE_URL` | `http://localhost:8080` | Frontend URL included in password reset links |
| `MAIL_HOST` | *(Optional)* | SMTP server host (e.g. `smtp.gmail.com`). If blank, reset links print to console |
| `MAIL_PORT` | `587` | SMTP server port |
| `MAIL_USERNAME`| *(Optional)* | SMTP username / email address |
| `MAIL_PASSWORD`| *(Optional)* | SMTP password or App Password |
| `MAIL_FROM` | `no-reply@skillverse.local` | Sender email address for outgoing notifications |

### 2. Frontend (`Skill-Verse/.env`)
Copy `.env.example` to `.env`:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:8081/api` | Base URL pointing to the Spring Boot REST API |

---

## Quick Start Guide

### Prerequisites
1. **Java JDK 17 or 21+** (`java -version`)
2. **Node.js 18+ and npm** (`node -v`, `npm -v`)
3. **Apache Maven 3.9+** (`mvn -version`)
4. **MongoDB Atlas** database URI (or local MongoDB instance)

---

### macOS / Linux Setup

#### 1. Install Maven (if not installed)
```bash
brew install maven
```

#### 2. Configure Backend `.env`
```bash
cd "Skill-Verse/backend"
cp .env.example .env
```
Open `.env` in your editor and configure your `MONGODB_URI` and `JWT_SECRET`:
```bash
# Generate a random 64-char JWT secret
openssl rand -hex 32
```

#### 3. Run the Backend (Terminal 1)
Use the automated runner:
```bash
cd "Skill-Verse/backend"
./run.sh
```
*(Alternatively: `mvn spring-boot:run`)*

Wait until the console displays:
```text
Tomcat started on port 8081 (http) with context path '/api'
Started SkillVerseApplication in ... seconds
```

#### 4. Run the Frontend (Terminal 2)
In a new terminal window:
```bash
cd "Skill-Verse"
cp .env.example .env
npm install
npm run dev
```

The application is now live at **[http://localhost:8080](http://localhost:8080)**.

---

### Windows Setup

#### 1. Configure Backend `.env`
In PowerShell:
```powershell
cd backend
Copy-Item .env.example .env
```
Edit `backend\.env` with your `MONGODB_URI` and `JWT_SECRET`.

#### 2. Run the Backend (Terminal 1)
```powershell
cd backend
.\run.ps1
```
*(Or use `mvn spring-boot:run` directly if Maven is in your PATH).*

#### 3. Run the Frontend (Terminal 2)
In a separate PowerShell window:
```powershell
npm install
npm run dev
```

Visit **[http://localhost:8080](http://localhost:8080)**.

---

## Seeded Demo Accounts

On initial startup with an empty database, the backend automatically seeds 24 skills and 10 student profiles.

> **Master Password for all demo accounts:** `password123`

| Student Name | Email | Primary Teaching Skills | Target Learning Skills |
| :--- | :--- | :--- | :--- |
| **Krish Patel** | `krish@skillverse.com` | Java, C++, Python, Machine Learning | React, UI/UX Design, Docker |
| **Aman Sharma** | `aman@skillverse.com` | React, JavaScript, HTML/CSS, UI/UX | Java, Spring Boot, DevOps |
| **Priya Nair** | `priya@skillverse.com` | Cloud Computing, DevOps, Python, MongoDB | Flutter, GraphQL, React |
| **Sneha Iyer** | `sneha@skillverse.com` | UI/UX Design, Figma, HTML/CSS | Python, Data Science, Machine Learning |
| **Mohit Gupta** | `mohit@skillverse.com` | Node.js, Express, SQL, Docker | Go, Kubernetes, Cloud Computing |
| **Rahul Verma** | `rahul@skillverse.com` | Android Development, Kotlin, Java | Flutter, iOS Development, Swift |
| **Ananya Rao** | `ananya@skillverse.com` | Data Science, R, Statistics, SQL | Machine Learning, Deep Learning |
| **Kabir Singh** | `kabir@skillverse.com` | Cybersecurity, Ethical Hacking, Linux | Networking, Cryptography |
| **Meera Joshi** | `meera@skillverse.com` | Content Writing, SEO, Digital Marketing | Graphic Design, Video Editing |
| **Arjun Menon** | `arjun@skillverse.com` | Blockchain, Solidity, Web3 | Rust, Smart Contracts, Distributed Systems |

*(To disable automatic seeding, set `skillverse.seed.enabled=false` in `application.properties`)*

---

## REST API Specification

**Base URL:** `http://localhost:8081/api`

### 1. Authentication & System
| Method | Endpoint | Auth | Request Body / Params | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | None | Health status check |
| `POST` | `/auth/register` | Public | `{ name, email, password, college, branch, year }` | Creates user, returns JWT and user profile |
| `POST` | `/auth/login` | Public | `{ email, password }` | Authenticates credentials, returns JWT and user profile |
| `POST` | `/auth/forgot-password` | Public | `{ email }` | Generates 1-hour password reset token |
| `POST` | `/auth/reset-password` | Public | `{ token, password }` | Resets password with one-time token |

### 2. Users & Skills
| Method | Endpoint | Auth | Request Body / Params | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/users` | Bearer JWT | None | Lists all registered students |
| `GET` | `/users/{id}` | Bearer JWT | None | Retrieves a student profile |
| `PUT` | `/users/{id}` | Bearer JWT | `{ name, college, branch, year, bio, teachSkills, learnSkills }` | Updates profile details |
| `POST` | `/users/{id}/skills` | Bearer JWT | `{ skillName, type }` (type: `"TEACH"` or `"LEARN"`) | Adds a single skill to profile |
| `POST` | `/users/{id}/photo` | Bearer JWT | Multipart form: `file` | Uploads profile photo to GridFS |
| `GET` | `/files/{fileId}` | Public | None | Streams profile image binary |
| `GET` | `/skills` | Bearer JWT | None | Complete catalog of available skills |

### 3. Matches & Social
| Method | Endpoint | Auth | Request Body / Params | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/matches/{userId}` | Bearer JWT | None | Returns ranked matches with match percentages |
| `GET` | `/connections` | Bearer JWT | `?userId={id}` | Returns user's incoming & outgoing connections |
| `POST` | `/connections` | Bearer JWT | `{ senderId, receiverId }` | Sends a peer connection request |
| `PUT` | `/connections/{id}` | Bearer JWT | `{ status: "ACCEPTED" \| "REJECTED" }` | Responds to a connection request |
| `GET` | `/messages/{userId}` | Bearer JWT | None | Retrieves chat history with peer |
| `POST` | `/messages` | Bearer JWT | `{ senderId, receiverId, message }` | Sends chat message to peer |
| `GET` | `/reviews/{userId}` | Bearer JWT | None | Retrieves all reviews for a student |
| `POST` | `/reviews` | Bearer JWT | `{ reviewerId, reviewerName, reviewedUserId, rating, comment }` | Submits peer review (awards skill points) |

---

## Testing & Quality Assurance

### Running Backend Unit & Integration Tests
The backend test suite covers JWT security validation, review rating calculations, and the complementary match scoring engine:

```bash
cd backend
mvn clean test
```

### Running Frontend Tests & Linting
Validate TypeScript compliance, code formatting, and asset bundling:

```bash
# Run ESLint validation
npm run lint

# Validate TypeScript compilation & production build
npm run build
```

---

## Troubleshooting & FAQ

### 1. `zsh: command not found: mvn`
Maven is not yet installed on your system. Run:
```bash
brew install maven
```

### 2. `Command failed: zsh: command not found: #`
When copying bash command blocks in macOS Zsh, avoid pasting comments starting with `#` if your shell doesn't have `interactivecomments` enabled. Execute the command directly or run:
```bash
setopt interactivecomments
```

### 3. Port `8081` Already in Use
If an orphaned backend instance is occupying port `8081`:
```bash
# macOS / Linux
kill -9 $(lsof -ti:8081)

# Windows PowerShell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8081).OwningProcess -Force
```
*(The provided `./run.sh` script automatically detects and frees the port).*

### 4. Special Characters in MongoDB Password
If your MongoDB Atlas password contains special characters (`@`, `:`, `/`, `?`, `#`, `%`), they must be URL-encoded in `backend/.env`.
For example, replace `@` with `%40`, and `:` with `%3A`.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
