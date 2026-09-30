# AI Resume Builder

> A full-stack AI-powered resume builder web application built with **Java + Spring Boot**, **MongoDB**, and **HTML5/CSS3/Vanilla JavaScript**.

---

## 🌟 Overview

**AI Resume Builder** is an end-to-end web application that enables job seekers to create, edit, customize, and analyze professional resumes with AI assistance. It features real-time live preview across 10 distinct resume templates, automated ATS compatibility scoring with keyword gap analysis, debounce-driven auto-saving with localStorage draft recovery, and server-side PDF generation.

---

## 🚀 Key Features

- **Real-Time Live Preview**: Dual-pane builder that renders changes instantly without page reload.
- **10 Professional Resume Templates**:
  1. *Classic Professional* (Traditional serif header & structured sections)
  2. *Modern Minimal* (Sleek blue layout with clean typography)
  3. *Corporate* (Navy executive styling)
  4. *Elegant* (Purple theme for senior & creative roles)
  5. *Tech Developer* (Monospace code & tech stack highlights)
  6. *Creative* (Orange modern gradient accent)
  7. *Executive* (Prestigious dark slate luxury header)
  8. *Student / Freshers* (Education-first highlighted layout)
  9. *ATS Simple* (Single column pure text layout for maximum ATS parsing)
  10. *Modern Two Column* (Two-column layout maximizing vertical density)
- **AI-Powered Capabilities**:
  - 📝 **AI Summary Generator**: Tailored professional summaries based on role, skills, and experience.
  - 💼 **AI Experience Improver**: Converts raw descriptions into high-impact, quantifiable bullet points.
  - 🚀 **AI Project Improver**: Formats project highlights and technical stack impact.
  - ⚡ **AI Skill Suggestions**: Recommends in-demand technical & soft skills for your target role.
  - 📊 **AI Resume Improver**: Provides 5 actionable improvement points.
- **ATS Compatibility Analyzer**:
  - Compares resume text with job descriptions.
  - Calculates an **Estimated ATS Compatibility Score** (0–100%).
  - Identifies **Matched Keywords** and **Missing Keywords**.
  - Highlights resume strengths and concrete suggestions.
- **Debounced Auto-Save & Local Draft Recovery**:
  - Auto-saves changes with a 1.2s debounce to avoid unnecessary network traffic.
  - Backs up unsaved edits into `localStorage` with a recovery prompt upon next visit.
- **PDF Generation & Print**:
  - Server-side PDF generation using Flying Saucer XHTML-to-PDF renderer.
  - Direct browser printing mode.
- **Spring Security & JWT Authentication**:
  - BCrypt password hashing, stateless JWT authentication filter, and route authorization.
  - Pre-seeded Demo Account for testing (`arjun@demo.com` / `demo123`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java 25, Spring Boot 3.5, Spring Web, Spring Data MongoDB, Spring Security, JWT (JJWT 0.12), Bean Validation, Flying Saucer PDF / iText |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+), Fetch API |
| **Database** | MongoDB |
| **AI Integration** | Groq / OpenAI-compatible API (Llama-3-8b / GPT) |
| **Build Tool** | Apache Maven |

---

## 📁 Project Structure

```
ai-resume-builder/
├── .env.example
├── README.md
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/airesumebuilder/
│       │   │   ├── AIResumeBuilderApplication.java
│       │   │   ├── config/
│       │   │   │   ├── CorsConfig.java
│       │   │   │   ├── MongoConfig.java
│       │   │   │   └── SecurityConfig.java
│       │   │   ├── controller/
│       │   │   │   ├── AIController.java
│       │   │   │   ├── ATSController.java
│       │   │   │   ├── AuthController.java
│       │   │   │   ├── PdfController.java
│       │   │   │   └── ResumeController.java
│       │   │   ├── dto/
│       │   │   │   ├── AIRequest.java
│       │   │   │   ├── AIResponse.java
│       │   │   │   ├── ATSRequest.java
│       │   │   │   ├── ATSResponse.java
│       │   │   │   ├── AuthResponse.java
│       │   │   │   ├── LoginRequest.java
│       │   │   │   ├── RegisterRequest.java
│       │   │   │   └── ResumeRequest.java
│       │   │   ├── exception/
│       │   │   │   └── GlobalExceptionHandler.java
│       │   │   ├── model/
│       │   │   │   ├── Resume.java
│       │   │   │   └── User.java
│       │   │   ├── repository/
│       │   │   │   ├── ResumeRepository.java
│       │   │   │   └── UserRepository.java
│       │   │   ├── security/
│       │   │   │   ├── CustomUserDetailsService.java
│       │   │   │   ├── JwtAuthenticationFilter.java
│       │   │   │   └── JwtService.java
│       │   │   └── service/
│       │   │       ├── AIService.java
│       │   │       ├── ATSService.java
│       │   │       ├── AuthService.java
│       │   │       ├── PdfService.java
│       │   │       └── ResumeService.java
│       │   └── resources/
│       │       └── application.properties
└── frontend/
    ├── index.html
    ├── login.html
    ├── register.html
    ├── dashboard.html
    ├── builder.html
    ├── templates.html
    ├── analyzer.html
    ├── profile.html
    ├── help.html
    ├── css/
    │   ├── analyzer.css
    │   ├── auth.css
    │   ├── builder.css
    │   ├── dashboard.css
    │   ├── responsive.css
    │   ├── style.css
    │   └── templates.css
    └── js/
        ├── analyzer.js
        ├── api.js
        ├── auth.js
        ├── builder.js
        ├── dashboard.js
        ├── main.js
        ├── templates.js
        └── utils.js
```

---

## ⚙️ Environment Configuration

Create a `.env` file or export the required environment variables:

```properties
MONGODB_URI=mongodb://localhost:27017/airesumebuilder
JWT_SECRET=mySecretKeyForJWTTokenGenerationThatIsLongEnough12345678
AI_API_KEY=your-groq-or-openai-api-key-here
```

Default configuration in `backend/src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=${MONGODB_URI:mongodb://localhost:27017/airesumebuilder}
server.port=8080
jwt.secret=${JWT_SECRET:mySecretKeyForJWTTokenGenerationThatIsLongEnough12345678}
jwt.expiration=86400000
ai.api.key=${AI_API_KEY:your-groq-api-key-here}
ai.api.url=https://api.groq.com/openai/v1/chat/completions
ai.model=llama3-8b-8192
```

---

## 🏃 Getting Started

### Prerequisites
1. **Java 25 or higher** (`java -version`)
2. **Apache Maven 3.8+** (`mvn -v`)
3. **MongoDB** (Local instance on port 27017 or MongoDB Atlas URI)

### 1. Run the Spring Boot Backend
```bash
cd backend
mvn clean spring-boot:run
```
The server will start at `http://localhost:8080`.

### 2. Open the Frontend
Open `frontend/index.html` directly in any modern web browser or serve via any static file server:
```bash
# Example with Python:
cd frontend
python -m http.server 3000
```
Open `http://localhost:3000` (or `file:///.../frontend/index.html`).

---

## 🎯 Demo Account

You can click **"🎯 Use Demo Account"** on `login.html`:
- **Email:** `arjun@demo.com`
- **Password:** `demo123`

The application automatically seeds a comprehensive Software Developer resume for Arjun Singh.

---

## 📡 REST API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Create account with Name, Email, Password
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Fetch authenticated user profile

### Resume CRUD Endpoints *(Requires Bearer Token)*
- `POST /api/resumes` - Create new resume
- `GET /api/resumes` - Fetch all resumes belonging to user
- `GET /api/resumes/{id}` - Fetch single resume by ID
- `PUT /api/resumes/{id}` - Update resume
- `DELETE /api/resumes/{id}` - Delete resume

### AI Endpoints *(Requires Bearer Token)*
- `POST /api/ai/summary` - Generate professional summary
- `POST /api/ai/experience` - Improve job description bullet points
- `POST /api/ai/project` - Enhance project summary & impact
- `POST /api/ai/skills` - Suggest role-relevant skills
- `POST /api/ai/improve-resume` - Comprehensive resume critique

### ATS Analyzer Endpoint
- `POST /api/ats/analyze` - Calculate ATS compatibility score & keyword match

### PDF Generation Endpoint
- `GET /api/resumes/{id}/pdf` - Download styled resume PDF

---

## 🛡️ Security & Quality

- **BCrypt Hashing**: Passwords stored securely as salted BCrypt hashes.
- **Stateless JWT**: Standard token validation filter on protected `/api/**` routes.
- **User Isolation**: Resumes are strictly scoped by `userId`.
- **Resilient AI Fallback**: If external AI APIs are unreachable, clean error responses are returned without breaking the application or crashing the server.
#   A i - r e s u m e - b u i l d e r - w e b s i t e 
 
 #   A i - r e s u m e - b u i l d e r - w e b s i t e 
 
 