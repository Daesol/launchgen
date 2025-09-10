# 🚀 LaunchGen Roadmap

This document provides a high-level plan and description for building the LaunchGen MVP, based on the SoftwareDoc.md specification. It outlines the major phases, goals, and deliverables to guide development and track progress.

---

## 🎯 Project Vision

LaunchGen is a platform to generate AI-powered landing pages, capture leads, and provide analytics, all managed through a user dashboard. The MVP will be built in 3 days, focusing on core functionality and rapid iteration.

---

## 🏗️ Major Phases & Milestones

### 1. Core Foundation
- Set up Next.js + TypeScript project ✅
- Configure Supabase (DB, Auth) ✅
- Create initial database schema ✅
- Implement authentication flow ✅
- Integrate OpenAI for page generation ✅
- Build basic landing page template ✅
- Make landing page editable, saveable, and publishable ✅
- Supabase integration for saving/publishing ✅
- Dashboard layout & navigation ✅
- Page list & create new page ✅
- Page editor (inline, theme, image) ✅
- Dynamic landing page renderer ✅
- Implement page generation flow ✅

### 2. Lead Capture & Dashboard
- Build lead capture API and form ✅
- Integrate lead form into landing pages ✅
- Test lead capture and storage ✅
- Display leads per page ✅
- Show basic analytics in dashboard ✅
- Build analytics_events table and API ✅
- Track page views and form submits ✅
- Dashboard analytics UI (views, submits, conversion rate) ✅
- Delete landing page with confirmation modal ✅

### 3. Editing & Polish
- Build page editor interface (inline editing, theme controls) ✅
- Add CSV export for leads
- Polish UI/UX and ensure responsiveness ✅
- Add analytics script injection
- Test and debug all flows
- Implement global theme switching (dark/light mode) ✅

### 4. Deployment & Launch
- Prepare for Vercel deployment
- Configure environment variables
- Test production environment
- Final QA and launch

---

## 📋 Key Deliverables
- AI-powered landing page generation
- Dynamic landing page rendering
- Lead capture and storage
- User dashboard with page and lead management
- Analytics tracking and display
- Authentication and authorization
- Production deployment

---

## 🗺️ Roadmap Overview

| Phase                | Key Tasks & Deliverables                | Target Timeframe |
|----------------------|-----------------------------------------|------------------|
| Core Foundation      | Project setup, DB, Auth, AI integration | Day 1            |
| Lead Capture/Dashboard| Lead form, dashboard, analytics         | Day 2            |
| Editing & Polish     | Page editor, export, polish, analytics  | Day 3            |
| Deployment & Launch  | Deploy, test, launch                    | End of Day 3     |

---

## 🔄 How to Use This Roadmap
- Refer to this document for high-level direction and phase goals
- See RoadMapLog.md for detailed action items and progress tracking
- Update both documents as the project evolves

---

## Recent Progress
- Refactored dashboard authentication/session logic to be fully client-side.
- Fixed redirect issues after login and Google OAuth.
- All session and data fetching logic for dashboard now handled in the browser.
- System is robust for all login flows and ready for further features.
- Implemented comprehensive global theme switching system with dark/light mode support.
- Added theme persistence and responsive theme toggle components throughout the application.

### 5. Code Architecture Refactoring ✅ COMPLETED
- **Major Refactoring Initiative**: Completely restructured codebase for scalability and maintainability
- **LandingPageTemplate Decomposition**: Broke down 1,167-line monolith into modular components
  - Created individual section components (Hero, Features, SocialProof, etc.)
  - Implemented SectionRenderer for dynamic section orchestration
  - Reduced main component from 1,167 lines to 200 lines (83% reduction)
- **New Folder Structure**: Implemented domain-driven architecture
  - `src/components/features/` - Feature-specific components organized by domain
  - `src/types/` - Centralized TypeScript definitions
  - `src/utils/` - Shared utility functions
  - `src/components/shared/` - Reusable business components
- **Type System Improvements**: Created comprehensive type definitions
  - Eliminated duplicate type definitions across components
  - Improved type safety and IntelliSense support
  - Clear domain boundaries with dedicated type files
- **Code Quality Metrics**: Achieved significant improvements
  - No component exceeds 300 lines (down from 1,167)
  - Eliminated code duplication in section rendering
  - 100% TypeScript coverage with centralized types
  - Clear separation of concerns throughout codebase 