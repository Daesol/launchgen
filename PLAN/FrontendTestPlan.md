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
- [x] Dashboard navigation bar height is optimized for better space utilization
- [x] Auto-resizing textareas in landing page editor adjust to content height
- [x] Preview header remains sticky during scrolling in landing page editor
- [x] Sidebar remains always expanded for consistent navigation experience
- [x] No duplicate UI elements in collapsed edit panel

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
- [x] Signed-in users are automatically redirected to /dashboard when visiting the main landing page.
- [x] Loading spinner shows while checking authentication status on landing page.
- [x] Authentication state changes are properly handled (sign-in/sign-out scenarios).
- [x] Landing page content only shows for non-authenticated users.

## Recent UI/UX Test Results
- [x] **Dashboard Sidebar**: Sticky positioning works correctly, user's pages list loads and navigates properly
- [x] **Landing Page Editor**: Full-width preview with collapsible side panel functions as expected
- [x] **Mobile/Desktop Toggle**: Responsive preview switching works correctly for design testing
- [x] **Page Generation Flow**: Loading animation, auto-save, and navigation to edit page work seamlessly
- [x] **Navigation Optimization**: Reduced top bar height improves space utilization without affecting functionality
- [x] **Auto-resizing Textareas**: Textareas adjust height based on content for better editing experience
- [x] **Sticky Preview Header**: Header remains visible during scrolling for persistent editing controls
- [x] **Always-expanded Sidebar**: Consistent navigation experience without toggle complexity
- [x] **Page Regeneration**: Regenerate button works without errors, handles API response structure correctly
- [x] **Null Safety**: Component handles undefined or incomplete data gracefully without crashes
- [x] **Error Recovery**: Component recovers from malformed data and provides fallback values
- [x] **Save Functionality**: Save button properly saves changes to database via API
- [x] **Auto-save**: Changes are automatically saved after 3 seconds of inactivity
- [x] **Save Status Indicators**: Visual indicators show current save status (saved, saving, unsaved)
- [x] **Save Button Feedback**: Save button changes appearance when there are unsaved changes
- [x] **Regeneration Error Handling**: Regeneration failures preserve original content and show clear error messages
- [x] **Content Backup System**: Original content is backed up before regeneration and restored on failure
- [x] **Error Toast UI**: Error messages display clearly with instructions and longer duration
- [x] **Content Validation**: Regenerated content is validated before being applied
- [x] **Fallback Prevention**: No placeholder content is created during regeneration failures
- [x] **PageEditor Mobile Responsiveness**: Edit panel overlays from bottom on mobile devices
- [x] **Mobile Header Layout**: Header wraps into two columns when space is limited
- [x] **Desktop View Hiding**: Desktop view button is hidden on mobile screens
- [x] **Mobile Preview Optimization**: Preview container has appropriate padding and border styling for mobile
- [x] **Touch-Friendly Edit Panel**: Mobile edit panel has proper close button and touch-optimized scrolling
- [x] **Responsive Error Toast**: Error notifications are properly positioned for mobile devices
- [x] **Dashboard Chatbot**: Floating chatbot appears in bottom-right corner of dashboard
- [x] **Chatbot Message Interface**: Users can type and send messages through the chat interface
- [x] **Chatbot Webhook Integration**: Messages are successfully sent to the specified webhook URL
- [x] **Chatbot User Data**: User information (ID, email, timestamp) is included in webhook payload
- [x] **Chatbot Error Handling**: Graceful error handling when webhook fails
- [x] **Chatbot Responsive Design**: Chatbot works properly on mobile and desktop devices
- [x] **AI Background Image Generation**: DALL-E API generates appropriate background images based on hero content
- [x] **Background Image Toggle**: Users can enable/disable background images in hero section
- [x] **Background Image Opacity Control**: Opacity slider works correctly and updates in real-time
- [x] **Background Image Preview**: Image preview displays correctly in the editor
- [x] **Background Image Rendering**: Background images display properly on landing pages with opacity overlay
- [x] **Manual Image URL Input**: Users can enter custom image URLs as alternative to AI generation
- [x] **Image Generation Error Handling**: Proper error messages display when image generation fails
- [x] **Business Name Integration**: Business name is included in image generation prompts for context
- [x] **Template Selection**: Users can switch between Classic and Image-Rich templates
- [x] **Template Preview**: Template selector shows visual previews and feature descriptions
- [x] **Template Persistence**: Template selection is saved and restored correctly
- [x] **Image-Rich Template Rendering**: Image-rich template displays with all image elements
- [x] **Hero Images**: Hero section images display correctly in image-rich template
- [x] **Section Background Images**: Background images render properly for all sections
- [x] **Card Images**: Feature, testimonial, and guarantee card images display correctly
- [x] **User Avatars**: Testimonial user avatars render properly
- [x] **Public Page Template Rendering**: Public pages use correct template based on template_id
- [x] **Template Switching**: Users can switch templates and see immediate preview changes

## Admin System & Analytics Tests
- [ ] **Admin Authentication**: Admin login page loads correctly at `/admin/auth`
- [ ] **Admin Credential Validation**: Correct admin credentials authenticate successfully
- [ ] **Admin Route Protection**: Unauthorized users are redirected to login when accessing admin routes
- [ ] **Admin Dashboard Access**: Authenticated admin can access dashboard at `/admin/dashboard`
- [ ] **Admin Metrics Display**: Dashboard shows total users, active users, pages generated, and conversion rates
- [ ] **Time Range Selection**: Daily, weekly, monthly, and yearly metrics filters work correctly
- [ ] **Metrics API Integration**: `/api/admin/metrics` endpoint returns accurate data from database
- [ ] **Growth Rate Calculation**: User growth rates are calculated and displayed correctly
- [ ] **Conversion Rate Display**: Lead conversion rates are calculated and shown accurately
- [ ] **Admin Logout**: Logout button clears session and redirects to login page
- [ ] **JWT Token Validation**: Admin tokens are properly validated and expire after 24 hours
- [ ] **Middleware Protection**: All admin routes except `/admin/auth` require authentication
- [ ] **Error Handling**: Invalid credentials show appropriate error messages
- [ ] **Responsive Dashboard**: Admin dashboard displays correctly on mobile and desktop devices 