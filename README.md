# 🏛️ CivicFix — Crowdsourced Civic Issue Reporting and Resolution System

> **Report. Track. Resolve.**

[![SIH 2025](https://img.shields.io/badge/SIH-2025-blue?style=flat-square)](https://www.sih.gov.in/)
[![Problem ID](https://img.shields.io/badge/Problem%20ID-SIH25031-orange?style=flat-square)]()
[![Java](https://img.shields.io/badge/Java-17%2B-red?style=flat-square)]()
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen?style=flat-square)]()
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square)]()
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)]()

---

## 📋 SIH Problem Statement

| Field | Value |
|-------|-------|
| **Problem Statement ID** | SIH25031 |
| **Title** | Crowdsourced Civic Issue Reporting and Resolution System |
| **Event** | Smart India Hackathon 2025 |

---

## 🎯 Problem Description

Citizens face difficulty reporting civic problems — potholes, overflowing garbage, broken streetlights, water leaks, drainage issues — to the right authorities. There is no unified, transparent platform for reporting, tracking, and resolving these issues. Problems remain unaddressed due to lack of accountability and communication between citizens and local government departments.

---

## 💡 Our Solution

**CivicFix** is a full-stack web application that bridges the gap between citizens and civic authorities:

- Citizens report issues with photos, GPS location, and descriptions
- Each complaint gets a unique **Complaint ID** (format: `CF-YYYYMMDD-XXXX`)
- Authorities review, assign to departments, and update status
- Citizens track progress in real time: `REPORTED → IN PROGRESS → RESOLVED`

---

## ✨ Features

### 👤 Citizen Features
- Register and login securely (JWT + BCrypt)
- Report civic issues with:
  - Title and detailed description
  - Category selection (Road, Garbage, Streetlight, Water, Drainage, etc.)
  - Photo upload (JPEG/PNG/GIF/WEBP, max 5MB)
  - GPS auto-detection or manual address entry
- Receive a unique Complaint ID after submission
- Dashboard with personal issue statistics
- View all submitted issues with search and status filter
- Full issue detail view with:
  - Status timeline (Reported → In Progress → Resolved)
  - Location map (OpenStreetMap via Leaflet — no API key needed)
  - Admin remarks and resolution notes

### 🔧 Admin / Authority Features
- Secure admin login
- Dashboard with platform-wide statistics and resolution rate
- View all issues with search, category filter, and status filter
- Manage each issue:
  - Assign to a department (Road Maintenance, Sanitation, Water Supply, etc.)
  - Update status (Reported / In Progress / Resolved / Rejected)
  - Add resolution remarks
  - View uploaded photos (with zoom)
  - View issue location on map

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, Axios |
| **Backend** | Java 17+, Spring Boot 3.2.5, Spring Web, Spring Security |
| **Database** | MySQL 8.0, Spring Data JPA, Hibernate |
| **Authentication** | JWT (jjwt 0.11.5), BCrypt password hashing |
| **Maps** | Leaflet + OpenStreetMap (no API key required) |
| **Build Tools** | Maven 3.8+ (backend), npm (frontend) |

---

## 🏗️ Architecture

```
Browser (React SPA — Vite)
        │
        │  HTTPS + JWT Bearer token
        ▼
Spring Boot REST API  (:8080)
        │
        ├── Spring Security (JWT filter chain)
        ├── REST Controllers (Auth, Issues, Admin)
        ├── Service Layer (business logic)
        ├── JPA Repositories
        │
        ├── MySQL 8.0 Database
        └── Local File Storage  (uploads/)
```

---

## 🗄️ Database Design

### Tables

| Table | Purpose |
|-------|---------|
| `users` | Citizens and admins |
| `issues` | Reported civic issues |
| `departments` | Government departments |
| `issue_status_history` | Full audit trail of status changes |

### Key Relationships
```
users ──< issues (reported_by)
departments ──< issues (assigned_department_id)
issues ──< issue_status_history
```

---

## 📡 API Reference

### Authentication (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a citizen account |
| `POST` | `/api/auth/login` | Login — returns JWT token |

### Citizen APIs (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/issues` | Report a new issue (multipart/form-data) |
| `GET` | `/api/issues/my` | Get all my issues |
| `GET` | `/api/issues/{id}` | Get issue detail |

### Admin APIs (JWT + ADMIN role required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/dashboard` | Platform statistics |
| `GET` | `/api/admin/issues` | All issues (`?status=` `?category=`) |
| `GET` | `/api/admin/issues/{id}` | Issue detail |
| `PUT` | `/api/admin/issues/{id}/status` | Update status |
| `PUT` | `/api/admin/issues/{id}/assign` | Assign department |
| `PUT` | `/api/admin/issues/{id}/remarks` | Add/update remarks |
| `GET` | `/api/admin/departments` | List departments |

---

## 📁 Project Structure

```
civicfix/
├── backend/                                   # Spring Boot application
│   ├── src/main/java/com/civicfix/backend/
│   │   ├── CivicFixApplication.java
│   │   ├── config/
│   │   │   ├── DataSeeder.java                # Seeds demo data on startup
│   │   │   ├── SecurityConfig.java
│   │   │   └── WebMvcConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── IssueController.java
│   │   │   └── AdminController.java
│   │   ├── dto/                               # Request/Response objects
│   │   ├── entity/                            # JPA entities
│   │   ├── exception/                         # Global error handling
│   │   ├── repository/                        # Spring Data repositories
│   │   ├── security/                          # JWT filter, UserDetails
│   │   └── service/                           # Business logic
│   ├── src/main/resources/
│   │   ├── application.properties             # Committed — no secrets
│   │   └── application-local.properties       # Gitignored — your DB password
│   ├── uploads/                               # Uploaded images (gitignored)
│   └── pom.xml
│
├── frontend/                                  # React + Vite application
│   ├── src/
│   │   ├── api/           (axios.js, auth.js, issues.js)
│   │   ├── components/    (layout, ui components)
│   │   ├── context/       (AuthContext.jsx)
│   │   ├── pages/
│   │   │   ├── public/    (LandingPage, LoginPage, RegisterPage)
│   │   │   ├── citizen/   (Dashboard, ReportIssue, MyIssues, IssueDetail)
│   │   │   └── admin/     (Dashboard, AllIssues, ManageIssue)
│   │   └── utils/
│   ├── .env                                   # Gitignored — local config
│   ├── .env.example                           # Committed — safe placeholder
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── database/
│   └── schema.sql                             # SQL schema reference
│
├── screenshots/                               # Project screenshots
├── .env.example                               # Committed — safe placeholder
├── .gitignore
└── README.md
```

---

## 🚀 Local Setup Guide

### Prerequisites
- Java 17 or higher
- Maven 3.8+
- Node.js 18+ and npm
- MySQL 8.0+

---

### Step 1 — MySQL Setup

```sql
-- Connect to MySQL and create the database:
CREATE DATABASE IF NOT EXISTS civicfix
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

> Spring Boot will auto-create the tables on first startup via `ddl-auto=update`.

---

### Step 2 — Backend Configuration

Create your local configuration file (this file is **gitignored** — never committed):

```bash
# In backend/src/main/resources/
cp application-local.properties.example application-local.properties
```

Edit `application-local.properties` and add your MySQL password:

```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
```

---

### Step 3 — Start the Backend

```bash
cd backend

# Run with the local profile (picks up application-local.properties)
mvn spring-boot:run -Dspring-boot.run.profiles=local

# OR set DB_PASSWORD as an environment variable instead:
# Windows PowerShell:
$env:DB_PASSWORD="your_password"; mvn spring-boot:run

# Linux / macOS:
DB_PASSWORD=your_password mvn spring-boot:run
```

Backend starts at: **http://localhost:8080**

On first startup, `DataSeeder` automatically creates:
- 6 departments (Road Maintenance, Sanitation, Water Supply, etc.)
- 1 demo admin account
- 1 demo citizen account

---

### Step 4 — Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# .env already has: VITE_API_URL=http://localhost:8080

# Start dev server
npm run dev
```

Frontend starts at: **http://localhost:5173**

The Vite dev server automatically proxies `/api` and `/uploads` to the backend.

---

## 🔐 Demo Credentials

> These accounts are created automatically when the backend first starts.

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@civicfix.com` | `Admin@123` |
| **Citizen** | `citizen@civicfix.com` | `Citizen@123` |

On the Login page, use the **"Citizen Demo"** or **"Admin Demo"** buttons to auto-fill credentials.

> **Note:** The MySQL database password is NOT listed here. Set it in `application-local.properties` (gitignored).

---

## 🔄 Citizen Workflow

```
Register / Login
      ↓
Report Issue
  • Enter title and description
  • Select category (Road, Garbage, Streetlight, etc.)
  • Upload photo (optional)
  • Share GPS location or type address
      ↓
Receive Complaint ID  (e.g., CF-20250928-4782)
      ↓
Track in "My Issues"
  • REPORTED → IN_PROGRESS → RESOLVED
      ↓
View Admin Remarks on resolved issue
```

---

## 🔧 Admin Workflow

```
Admin Login
      ↓
Admin Dashboard
  • Total, Reported, In Progress, Resolved, Rejected counts
  • Resolution rate
  • Recent issues table
      ↓
All Issues (search + filter by status/category)
      ↓
Manage Issue
  • View details, photo, location map
  • Assign to department
  • Update status
  • Add remarks
      ↓
Citizen sees updated status and remarks
```

---

## ⚙️ Environment Variables Reference

### Backend

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `DB_PASSWORD` | — | **Yes** | MySQL password (no default — must be set) |
| `DB_URL` | `jdbc:mysql://localhost:3306/civicfix?...` | No | MySQL JDBC URL |
| `DB_USERNAME` | `root` | No | MySQL username |
| `JWT_SECRET` | *(dev default)* | No — change in prod | JWT signing key (32+ chars) |
| `JWT_EXPIRATION` | `86400000` | No | Token validity in ms (24h) |
| `UPLOAD_DIR` | `uploads` | No | Image upload directory |
| `CORS_ORIGINS` | `http://localhost:5173,...` | No | Comma-separated allowed origins |
| `PORT` | `8080` | No | Server port |

### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080` | Backend API base URL |

---

## 🌐 Deployment Notes

### Backend (e.g., Railway, Render, AWS EC2)
1. Set all environment variables in your platform's config panel — especially `DB_PASSWORD` and `JWT_SECRET`
2. Build the JAR: `mvn clean package -DskipTests`
3. Run: `java -jar target/backend-1.0.0.jar`
4. Set `CORS_ORIGINS` to your deployed frontend URL
5. For persistent image storage, point `UPLOAD_DIR` to a persistent volume or swap to cloud storage (S3, Cloudinary)

### Frontend (e.g., Vercel, Netlify)
1. Set `VITE_API_URL` to your deployed backend URL in the platform's environment settings
2. Build: `npm run build`
3. Deploy the `dist/` folder

### Database (e.g., PlanetScale, Railway MySQL, AWS RDS)
1. Create a MySQL 8.0 database
2. Update `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` environment variables
3. Spring Boot will auto-create all tables on first start

---

## 🔮 Future Enhancements

- [ ] Email/SMS notifications on status change
- [ ] Cloud image storage (AWS S3 / Cloudinary)
- [ ] Citizen upvoting of issues
- [ ] Heatmap / cluster view of issues on map
- [ ] Mobile app (React Native)
- [ ] AI-based category detection from uploaded photo
- [ ] Multi-language support (Hindi, regional languages)
- [ ] SLA tracking and automatic escalation
- [ ] Export reports to PDF/CSV
- [ ] Docker Compose for one-command local setup

---

## 🐙 GitHub Setup

```bash
# If you haven't initialized git yet:
git init
git add .
git commit -m "feat: CivicFix MVP — SIH25031 crowdsourced civic issue reporting system"

# Add your remote:
git remote add origin https://github.com/YOUR_USERNAME/civicfix.git

# Push:
git branch -M main
git push -u origin main
```

> Before pushing, double-check: `git status` should not show `.env`, `application-local.properties`, or `target/`.

---

## 📸 Screenshots

*(Add screenshots to the `screenshots/` folder)*

---

## 📝 Issue Categories

| Category | Icon | Description |
|----------|------|-------------|
| `ROAD_POTHOLE` | 🛣️ | Road damage, potholes, surface issues |
| `GARBAGE` | 🗑️ | Overflowing bins, illegal dumping |
| `STREETLIGHT` | 💡 | Broken or missing street lights |
| `WATER` | 💧 | Water leakage, supply disruption |
| `DRAINAGE` | 🚿 | Blocked drains, flooding, sewage |
| `PUBLIC_PROPERTY` | 🏛️ | Damaged benches, parks, public buildings |
| `OTHER` | 📋 | Any other civic issue |

---

*Built for Smart India Hackathon 2025 — Problem Statement SIH25031*

*CivicFix — Empowering citizens. Improving cities.*
