# Skill Verse — Java Backend (Spring Boot + MongoDB Atlas)

REST API for the Skill Verse frontend. Real accounts (BCrypt passwords + JWT),
real complementary skill matching, and seeded student data.

## 1. Requirements

- Java 17+
- Maven 3.9+ (or use `./mvnw` from your IDE)
- A free MongoDB Atlas cluster

## 2. MongoDB Atlas setup

1. Create a free cluster at https://cloud.mongodb.com
2. Database Access → add a user (username + password).
3. Network Access → add your IP (or `0.0.0.0/0` while developing).
4. Connect → Drivers → copy the connection string, e.g.
   `mongodb+srv://USER:PASSWORD@cluster0.abcde.mongodb.net/skillverse?retryWrites=true&w=majority`

## 3. Run

```bash
cd backend

export MONGODB_URI="mongodb+srv://USER:PASSWORD@cluster0.abcde.mongodb.net/skillverse?retryWrites=true&w=majority"
export JWT_SECRET="a-long-random-secret-at-least-32-characters"

mvn spring-boot:run
```

The API starts on `http://localhost:8081/api`. Check it with:

```bash
curl http://localhost:8081/api/health
```

On the first start (empty database) it seeds 24 skills and 10 students with
connections, messages and reviews.

### Seeded logins

All seeded students share the password **`password123`**:

| Email                 | Name        |
| --------------------- | ----------- |
| krish@skillverse.com  | Krish Patel |
| aman@skillverse.com   | Aman Sharma |
| priya@skillverse.com  | Priya Nair  |
| rahul@skillverse.com  | Rahul Verma |
| sneha@skillverse.com  | Sneha Iyer  |
| mohit@skillverse.com  | Mohit Gupta |
| ananya@skillverse.com | Ananya Rao  |
| kabir@skillverse.com  | Kabir Singh |
| meera@skillverse.com  | Meera Joshi |
| arjun@skillverse.com  | Arjun Menon |

Set `skillverse.seed.enabled=false` in `application.properties` to disable seeding.

## 4. Endpoints

Base path: `/api`

| Method | Path                   | Auth   | Description                              |
| ------ | ---------------------- | ------ | ---------------------------------------- |
| POST   | `/auth/register`       | public | Create account, returns JWT + user       |
| POST   | `/auth/login`          | public | Login, returns JWT + user                |
| GET    | `/health`              | public | Health check                             |
| GET    | `/users`               | JWT    | All students                             |
| GET    | `/users/{id}`          | JWT    | One student                              |
| PUT    | `/users/{id}`          | JWT    | Update profile / skills                  |
| POST   | `/users/{id}/skills`   | JWT    | Add one TEACH or LEARN skill             |
| GET    | `/skills`              | JWT    | Skill catalogue                          |
| GET    | `/matches/{userId}`    | JWT    | Ranked matches with match %              |
| GET    | `/connections?userId=` | JWT    | Sent + received connections              |
| POST   | `/connections`         | JWT    | Send request                             |
| PUT    | `/connections/{id}`    | JWT    | `{ "status": "ACCEPTED" \| "REJECTED" }` |
| GET    | `/messages/{userId}`   | JWT    | Conversation history                     |
| POST   | `/messages`            | JWT    | Send message                             |
| GET    | `/reviews/{userId}`    | JWT    | Reviews for a student                    |
| POST   | `/reviews`             | JWT    | Leave a 1–5 review                       |

Send the token as `Authorization: Bearer <token>`.

## 5. Match percentage

Calculated in `MatchService` (backend only — the frontend just displays it):

- 60% weight: how much of **what I want to learn** the other student can teach
- 40% weight: how much of **what I can teach** the other student wants to learn
- +10 points when the exchange works in both directions (a true swap)
- +3 points for a shared learning interest

Capped at 100.

## 6. Frontend connection

The frontend reads `VITE_API_BASE_URL` (default `http://localhost:8081/api`).
Keep this backend running while using the app.

## 7. Profile photos

`POST /users/{id}/photo` (multipart field `file`, JWT, own account only) stores the image
in MongoDB GridFS; `GET /files/{fileId}` serves it publicly. Max 5 MB, JPG/PNG/WEBP/GIF.

## 8. Password reset

- `POST /auth/forgot-password` `{ "email": "..." }` — emails a one-hour, single-use link.
- `POST /auth/reset-password` `{ "token": "...", "password": "..." }`

Set `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM` for real email
(e.g. Gmail SMTP with an App Password). Without them, the reset link is printed in the
backend console. `APP_BASE_URL` (default `http://localhost:8080`) is the frontend URL used in the link.
