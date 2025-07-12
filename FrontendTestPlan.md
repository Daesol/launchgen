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

### Test Log Template
| Date | Flow | Test | Result | Notes |
|------|------|------|--------|-------|
|      |      |      |        |       |

---

## 🔄 How to Use This Document
- Check off items as they are tested
- Log test results in the tables above
- Update as new features or endpoints are added 