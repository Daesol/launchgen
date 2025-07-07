# LaunchGen Implementation Guide
**Complete Technical Specification for 3-Day MVP Build**

---

## 🏗️ System Architecture Overview

LaunchGen is a Next.js TypeScript application that generates landing pages from AI prompts, captures leads, and provides analytics. Here's how the system flows:

1. **User Input Flow**: User enters prompt → AI generates page config → Config stored in DB → Live page rendered
2. **Lead Capture Flow**: Visitor fills form → Data saved to DB → Shows in dashboard
3. **Analytics Flow**: Page views/events tracked → Stored in DB → Displayed in dashboard

---

## 📁 Project Structure

```
launchgen/
├── pages/
│   ├── api/
│   │   ├── generate-page.ts       # AI prompt processing
│   │   ├── capture-lead.ts        # Lead form submission
│   │   └── analytics.ts           # Analytics event tracking
│   ├── auth/
│   │   └── signin.tsx             # Authentication page
│   ├── dashboard/
│   │   ├── index.tsx              # Main dashboard
│   │   └── [pageId].tsx           # Individual page editor
│   ├── site/
│   │   └── [slug].tsx             # Dynamic landing page renderer
│   ├── generate.tsx               # Page generation form
│   └── index.tsx                  # Homepage
├── components/
│   ├── ui/                        # Reusable UI components
│   ├── LandingPageTemplate.tsx    # Main landing page template
│   ├── LeadForm.tsx              # Lead capture form
│   ├── DashboardLayout.tsx       # Dashboard wrapper
│   └── PageEditor.tsx            # Page editing interface
├── lib/
│   ├── supabase.ts               # Supabase client setup
│   ├── openai.ts                 # OpenAI API integration
│   └── types.ts                  # TypeScript interfaces
├── styles/
│   └── globals.css               # Global styles + Tailwind
└── utils/
    ├── analytics.ts              # Analytics helper functions
    └── validation.ts             # Form validation schemas
```

---

## 🗄️ Database Schema (Supabase)

### Table: `users`
```sql
id: uuid (primary key)
email: text
created_at: timestamp
subscription_tier: text (free/pro)
```

### Table: `landing_pages`
```sql
id: uuid (primary key)
slug: text (unique)
title: text
owner_id: uuid (foreign key to users)
config_json: jsonb
analytics_config: jsonb
created_at: timestamp
updated_at: timestamp
```

### Table: `leads`
```sql
id: uuid (primary key)
page_id: uuid (foreign key to landing_pages)
name: text
email: text
source: text (utm_source, referrer, etc.)
metadata: jsonb
created_at: timestamp
```

### Table: `analytics_events`
```sql
id: uuid (primary key)
page_id: uuid (foreign key to landing_pages)
event_type: text (page_view, form_submit, etc.)
metadata: jsonb
created_at: timestamp
```

---

## 🔧 Core Implementation Details

### 1. AI Page Generation (`/api/generate-page.ts`)

**Purpose**: Convert user prompt into landing page configuration

**Input**: User prompt + basic preferences
**Output**: Structured page config JSON

**Key Components**:
```typescript
interface PageConfig {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    backgroundImage?: string;
  };
  features: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
}
```

**Process**:
1. Receive prompt from frontend
2. Send structured prompt to OpenAI API
3. Parse AI response into PageConfig
4. Generate unique slug
5. Save config to `landing_pages` table
6. Return slug and config to frontend

### 2. Dynamic Landing Page Renderer (`/pages/site/[slug].tsx`)

**Purpose**: Render live landing pages from database config

**Key Features**:
- Server-side rendering for SEO
- Dynamic content injection
- Analytics script injection
- Lead capture form integration

**Process**:
1. Extract slug from URL
2. Fetch page config from database
3. Inject analytics scripts in `<head>`
4. Render page using `LandingPageTemplate` component
5. Pass config as props to template

**Critical Files**:
- `LandingPageTemplate.tsx`: Main template component
- `LeadForm.tsx`: Embedded lead capture form

### 3. Lead Capture System (`/api/capture-lead.ts`)

**Purpose**: Process lead form submissions

**Input**: Name, email, page_id, source data
**Output**: Success/error response

**Process**:
1. Validate form data
2. Check for duplicate emails (optional)
3. Save to `leads` table
4. Trigger analytics event
5. Return success response

### 4. Dashboard System (`/pages/dashboard/`)

**Purpose**: User management interface for pages and leads

**Key Features**:
- List all user's landing pages
- View leads per page
- Edit page content/styling
- Export leads as CSV
- Basic analytics display

**Components**:
- `DashboardLayout.tsx`: Wrapper with navigation
- `PageEditor.tsx`: Inline editing interface
- Lead list/export functionality

---

## 🎨 Frontend Component Architecture

### LandingPageTemplate.tsx
**Purpose**: Main landing page layout component

**Props**: `PageConfig` object

**Structure**:
```typescript
interface LandingPageTemplateProps {
  config: PageConfig;
  slug: string;
}

// Component renders:
// - Hero section with headline/subheadline
// - Features grid
// - Lead capture form
// - Footer with branding
```

### LeadForm.tsx
**Purpose**: Reusable lead capture form

**Props**: `pageId`, `onSubmit` callback

**Features**:
- Form validation
- Loading states
- Success/error handling
- Analytics event tracking

### PageEditor.tsx
**Purpose**: Dashboard editing interface

**Features**:
- Inline text editing
- Color picker for theme
- Image upload/replacement
- Real-time preview
- Save/publish functionality

---

## 🔐 Authentication & Authorization

**Implementation**: Supabase Auth

**Key Files**:
- `lib/supabase.ts`: Auth client setup
- `pages/auth/signin.tsx`: Login/signup page
- Middleware for protected routes

**Auth Flow**:
1. User signs up/logs in via Supabase
2. Session stored in cookies
3. Protected pages check auth status
4. User ID used for data association

---

## 📊 Analytics Integration

### Client-Side Tracking
**File**: `utils/analytics.ts`

**Functions**:
- `trackPageView(pageId)`: Track page visits
- `trackFormSubmit(pageId)`: Track lead captures
- `trackCustomEvent(eventType, metadata)`: Custom events

### Script Injection
**Location**: `pages/site/[slug].tsx`

**Process**:
1. Extract analytics IDs from page config
2. Inject Google Analytics script
3. Inject Facebook Pixel script
4. Initialize tracking on page load

---

## 🚀 Day-by-Day Implementation Plan

### Day 1: Core Foundation
**Morning (4 hours)**:
1. Set up Next.js project with TypeScript
2. Configure Supabase connection
3. Create database tables
4. Set up basic authentication

**Afternoon (4 hours)**:
1. Build AI integration (`/api/generate-page.ts`)
2. Create basic landing page template
3. Implement page generation flow
4. Test prompt → page creation

**Evening (2 hours)**:
1. Style landing page template
2. Test dynamic rendering
3. Fix any routing issues

### Day 2: Lead Capture & Dashboard
**Morning (4 hours)**:
1. Build lead capture API (`/api/capture-lead.ts`)
2. Create lead form component
3. Integrate form with landing pages
4. Test lead capture flow

**Afternoon (4 hours)**:
1. Build dashboard layout
2. Create page listing interface
3. Implement lead viewing
4. Add basic analytics display

**Evening (2 hours)**:
1. Add analytics script injection
2. Test tracking functionality
3. Debug any issues

### Day 3: Editing & Polish
**Morning (4 hours)**:
1. Build page editor interface
2. Implement inline editing
3. Add color/theme controls
4. Test editing flow

**Afternoon (4 hours)**:
1. Add CSV export functionality
2. Polish UI/UX
3. Test entire user flow
4. Fix bugs and edge cases

**Evening (2 hours)**:
1. Deploy to Vercel
2. Test production environment
3. Final tweaks and launch

---

## 🔑 Key Integration Points

### OpenAI Integration
**File**: `lib/openai.ts`

**Prompt Structure**:
```typescript
const prompt = `Generate a landing page config for: ${userPrompt}
Return JSON with: hero (headline, subheadline, cta), features array, theme colors.
Make it conversion-focused and professional.`;
```

### Supabase Integration
**File**: `lib/supabase.ts`

**Key Functions**:
- `createClient()`: Initialize Supabase client
- `getPageBySlug()`: Fetch page config
- `savePageConfig()`: Save generated page
- `captureLeads()`: Store lead data

### Vercel Deployment
**Configuration**: `vercel.json`
- Environment variables for API keys
- Build settings for Next.js
- Domain configuration

---

## 🎯 Critical Success Factors

1. **Data Flow**: Ensure clean data flow from prompt → AI → DB → render
2. **Error Handling**: Robust error handling for AI failures and DB issues
3. **Performance**: Optimize page load times for landing pages
4. **SEO**: Proper meta tags and server-side rendering
5. **Analytics**: Accurate tracking and data collection

---

## 🚨 Common Pitfalls to Avoid

1. **Slug Collisions**: Generate unique slugs with timestamp/random suffix
2. **API Rate Limits**: Implement retry logic for OpenAI API
3. **Data Validation**: Validate all inputs before DB operations
4. **Auth Security**: Protect all API routes with proper authentication
5. **Responsive Design**: Ensure landing pages work on all devices

---

## 📋 Launch Checklist

- [ ] All API routes working
- [ ] Page generation flow tested
- [ ] Lead capture functional
- [ ] Dashboard displays data
- [ ] Analytics tracking working
- [ ] Authentication secure
- [ ] Mobile responsive
- [ ] Error handling implemented
- [ ] Production deployment tested
- [ ] SSL certificates configured

---

**Ready to build? Follow this guide step by step, and you'll have LaunchGen MVP running in 3 days!**