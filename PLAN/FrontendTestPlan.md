# 🧪 LaunchGen Frontend & API Test Plan

This document tracks tests for API endpoints, backend logic, and critical frontend flows. Use this to ensure all key features are tested and working as expected.

---

## ✅ API Endpoint Tests
- [x] /api/generate-page returns valid config for prompt
- [x] Auth endpoints (sign up, sign in) work as expected
- [x] Lead capture API stores data correctly
- [x] Analytics API records events
- [x] Leads list per page

### Test Log Template
| Date | Endpoint | Test | Result | Notes |
|------|----------|------|--------|-------|
|      |          |      |        |       |

---

## ✅ Backend Function Tests
- [ ] OpenAI integration returns valid config
- [ ] Supabase client connects and queries
- [ ] DB schema constraints enforced

### Test Log Template
| Date | Function | Test | Result | Notes |
|------|----------|------|--------|-------|
|      |          |      |        |       |

---

## ✅ Frontend Integration Tests
- [x] Page generation form submits and displays result
- [x] Landing page save/publish uses authenticated user as owner_id and enforces sign-in
- [x] Auth flow (sign up/in/out) works end-to-end
- [x] Dashboard loads user data
- [x] Editor saves changes
- [x] Analytics API records page views and form submits
- [x] Dashboard analytics UI displays correct counts and conversion rate
- [x] Landing page delete removes page and associated leads/analytics
- [x] Sidebar navigation is sticky and remains visible when scrolling
- [x] User's generated pages list loads and displays correctly in sidebar
- [x] Clicking on a page in sidebar navigates to the correct edit page
- [x] Sidebar collapse/expand toggle works correctly
- [x] Collapsed sidebar shows only icons with tooltips
- [x] Sidebar state persists during navigation
- [x] Landing page editor side panel collapses and expands correctly
- [x] Mobile/desktop preview toggle switches between responsive views
- [x] Full-width preview provides better editing experience
- [x] Page generation shows loading animation and success feedback
- [x] Generated pages automatically save and appear in sidebar
- [x] Auto-navigation to edit page after successful generation

### Test Log Template
| Date | Flow | Test | Result | Notes |
|------|------|------|--------|-------|
|      |      |      |        |       |

---

## 🔄 How to Use This Document
- Check off items as they are tested
- Log test results in the tables above
- Update as new features or endpoints are added

---

## Dashboard Authentication & Session Management
- [x] User is redirected to /auth/signin if not logged in (client-side check).
- [x] After login (including Google OAuth), user is correctly routed to /dashboard.
- [x] No redirect loop after login or OAuth.
- [x] Dashboard data loads only after session is confirmed.
- [x] All dashboard features work as expected after refactor. 