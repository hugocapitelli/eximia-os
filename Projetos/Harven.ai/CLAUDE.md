# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Harven.ai is an educational platform with a React frontend and FastAPI backend, using Supabase as the database. The platform supports three user roles: Student, Instructor, and Admin.

## Development Commands

### Frontend (harven.ai-platform-mockup/)
```bash
cd harven.ai-platform-mockup
npm install          # Install dependencies
npm run dev          # Run development server (Vite)
npm run build        # Production build
npm run preview      # Preview production build
```

### Backend (backend/)
```bash
cd backend
python -m venv venv                    # Create virtual environment
venv\Scripts\activate                  # Windows activation
pip install -r requirements.txt        # Install dependencies
uvicorn main:app --reload --port 8000  # Run development server
```

### Environment Setup
- Frontend: Copy `.env.local` and set `GEMINI_API_KEY`
- Backend: Copy `.env.example` to `.env` and set `SUPABASE_URL` and `SUPABASE_KEY`

## Architecture

### Frontend Structure (React + TypeScript + Vite)
- **App.tsx**: Main router using state-based navigation (no React Router). Manages `ViewType` state and history stack for back navigation.
- **views/**: Page components for each view (StudentDashboard, InstructorList, AdminConsole, etc.)
- **components/**: Reusable UI components (Sidebar, Header, ui/ folder with design system)
- **contexts/SettingsContext.tsx**: Global settings provider (fetches from `/admin/settings`)
- **types.ts**: TypeScript types including `ViewType`, `UserRole`, and data models
- **lib/supabase.ts**: Supabase client configuration

### Backend Structure (FastAPI + Supabase)
- **main.py**: Single-file API with all routes. Uses lifespan context for Supabase client initialization.

### Navigation Pattern
The frontend uses a custom state-based navigation system:
```typescript
handleNavigate(view: ViewType, data?: any)  // Navigate to view with optional data
handleBack()                                 // Pop from history stack
```
Views receive `onNavigate` prop and `activeResourceId` for passing data between views.

### API Routes (backend/main.py)
- `POST /auth/login`: Authentication via RA (student ID)
- `GET/POST /disciplines`: Discipline (class) management
- `GET/POST /disciplines/{id}/teachers|students`: Assignment management
- `GET/POST /courses`, `GET/PUT/DELETE /courses/{id}`: Course CRUD
- `GET/POST /courses/{id}/chapters`: Chapter management
- `GET/POST /chapters/{id}/contents`: Content management
- `GET/POST /contents/{id}/questions`: Question management
- `GET/POST /admin/settings`: System configuration
- `GET /admin/stats`, `GET /admin/logs`: Admin dashboard

### Database Schema (Supabase)
Key tables: `users`, `disciplines`, `discipline_students`, `discipline_teachers`, `courses`, `chapters`, `contents`, `questions`, `system_settings`, `system_logs`

### User Roles
- **STUDENT**: Dashboard, course viewing, achievements
- **INSTRUCTOR**: Discipline management, course creation, content editing
- **ADMIN**: Console, user management, system settings, class management

### CORS Configuration
Backend allows origins: `localhost:3000`, `localhost:3001`, `127.0.0.1:3000`, `127.0.0.1:3001`

## Key Conventions
- Role normalization: Backend converts `TEACHER` to `INSTRUCTOR` for frontend compatibility
- Auth tokens stored in `localStorage` as `sb-access-token` and `user-data`
- Settings context provides platform customization (logo, colors, modules enabled)
