# Component Structure Documentation

## Overview
This document describes the organized component structure of the LaunchGen application after the comprehensive refactoring completed in September 2025. The structure follows a modular, scalable approach with clear separation of concerns.

## Directory Structure

```
components/
├── ui/                     # Shadcn UI Components (Base Design System)
├── layout/                 # Layout & Navigation Components
├── pages/                  # Page-Level Components
├── features/               # Feature-Specific Components
├── widgets/                # Reusable UI Widgets
├── marketing/              # Marketing Page Components
└── demo/                   # Demo & Development Components
```

---

## 📁 Detailed Component Organization

### 🎨 `ui/` - Design System Components
**Purpose**: Base UI components from Shadcn/ui library
**Usage**: Imported throughout the application for consistent design

```
ui/
├── button.tsx
├── card.tsx
├── badge.tsx
└── input.tsx
```

**Import Example**:
```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

---

### 🏗️ `layout/` - Layout & Navigation
**Purpose**: Components that define the application's layout and navigation structure
**Scope**: Used across multiple pages for consistent layout

```
layout/
├── Navigation.tsx          # Main navigation component
└── Footer.tsx             # Application footer
```

**Key Components**:
- **Navigation**: Main navigation menu for marketing pages
- **Footer**: Standard footer used across landing pages

**Import Example**:
```typescript
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
```

---

### 📄 `pages/` - Page-Level Components
**Purpose**: Complete page components and their immediate dependencies
**Structure**: Organized by application area (dashboard, landing)

#### `pages/dashboard/` - Dashboard Pages
```
pages/dashboard/
├── DashboardLayout.tsx        # Main dashboard wrapper with sidebar
├── DashboardClient.tsx        # Main dashboard page content
├── DashboardSessionGate.tsx   # Authentication wrapper for dashboard
└── PageEditor.tsx            # Landing page editor (formerly PageEditorRefactored)
```

**Component Details**:
- **DashboardLayout**: Main dashboard wrapper with sidebar
  - Provides sidebar navigation, theme toggle, and chatbot
  - Used by all dashboard pages for consistent layout
  
- **PageEditor**: Main editing interface for landing pages
  - Integrates editor hooks (`usePageEditor`, `useFieldAutoSave`, etc.)
  - Manages page content and style state
  - Provides real-time preview functionality
  
- **DashboardSessionGate**: Authentication boundary component
  - Checks user session with Supabase
  - Redirects to login if not authenticated
  - Renders DashboardClient when authenticated

- **DashboardClient**: Main dashboard interface
  - Displays user's landing pages
  - Provides page management functionality

#### `pages/landing/` - Landing Page Components
```
pages/landing/
├── LandingPageTemplate.tsx    # Main landing page template
├── SectionRenderer.tsx        # Orchestrates section rendering
├── index.ts                  # Export declarations
└── sections/                 # Individual landing page sections
    ├── HeroSection.tsx
    ├── ProblemSection.tsx
    ├── FeaturesSection.tsx
    ├── SocialProofSection.tsx
    ├── GuaranteesSection.tsx
    ├── FAQSection.tsx
    └── CTASection.tsx
```

**Component Flow**:
```
LandingPageTemplate
    ├── Navigation (dynamic, based on sections)
    ├── SectionRenderer
    │   ├── HeroSection (always rendered)
    │   ├── ProblemSection (conditional)
    │   ├── FeaturesSection (conditional)
    │   ├── SocialProofSection (conditional)
    │   ├── GuaranteesSection (conditional)
    │   ├── FAQSection (conditional)
    │   └── CTASection (conditional)
    └── Footer
```

**Import Example**:
```typescript
import LandingPageTemplate from "@/components/pages/landing/LandingPageTemplate";
import DashboardLayout from "@/components/pages/dashboard/DashboardLayout";
```

---

### ⚙️ `features/` - Feature-Specific Components
**Purpose**: Components that implement specific business logic or complex functionality
**Organization**: Grouped by feature domain

#### `features/editor/` - Page Editor Feature
```
features/editor/
├── panels/                # Editor panel components
│   ├── EditPanel.tsx     # Main panel router
│   ├── ThemePanel.tsx    # Theme customization
│   ├── BusinessPanel.tsx # Business information editing
│   ├── SectionPanel.tsx  # Individual section editing
│   └── LayoutPanel.tsx   # Section ordering/visibility
├── hooks/                # Editor-specific hooks
│   ├── usePageEditor.ts
│   ├── useFieldAutoSave.ts
│   ├── useSectionManagement.ts
│   └── useEventHandlers.ts
├── common/               # Shared editor components
│   ├── AddItemButton.tsx
│   ├── DeleteButton.tsx
│   └── IconSelector.tsx
├── utils/                # Editor utilities
│   └── fieldHandlers.ts
└── types/                # Editor type definitions
    └── editor.types.ts
```


#### `features/forms/` - Form Components
```
features/forms/
└── LeadForm.tsx          # Lead capture form component
```

**Import Examples**:
```typescript
import { usePageEditor } from "@/components/features/editor/hooks/usePageEditor";
import LeadForm from "@/components/features/forms/LeadForm";
```

---

### 🧩 `widgets/` - Reusable UI Widgets
**Purpose**: Small, reusable UI components that can be used across the application
**Characteristics**: Self-contained, minimal dependencies, highly reusable

```
widgets/
├── Chatbot.tsx           # Floating chatbot widget
├── DraggableSection.tsx  # Drag-and-drop section component
├── HighlightedText.tsx   # Text highlighting widget
├── MobilePreviewQR.tsx   # QR code generation for mobile preview
└── ThemeToggle.tsx       # Global theme switcher
```

**Widget Descriptions**:
- **Chatbot**: Floating chatbot interface with Intercom integration
- **DraggableSection**: Enables drag-and-drop reordering in the layout panel
- **HighlightedText**: Renders text with customizable highlighting
- **MobilePreviewQR**: QR code generation for mobile preview functionality
- **ThemeToggle**: Global theme switcher (separate from page theme)

**Import Example**:
```typescript
import { ThemeToggle } from "@/components/widgets/ThemeToggle";
import HighlightedText from "@/components/widgets/HighlightedText";
import MobilePreviewQR from "@/components/widgets/MobilePreviewQR";
```

---

### 📢 `marketing/` - Marketing Page Components
**Purpose**: Components specifically for marketing/landing pages (separate from generated landing pages)
**Usage**: Static marketing content, homepage, pricing page, etc.

```
marketing/
├── HeroSection.tsx
├── FeaturesSection.tsx
├── HowItWorksSection.tsx
├── TestimonialsSection.tsx
└── FinalCTASection.tsx
```

---

### 🧪 `demo/` - Demo & Development Components
**Purpose**: Components used for demonstrations, development, and testing
**Usage**: Not part of production application flow

```
demo/
├── DemoComponent.tsx
├── DemoHeader.tsx
├── DemoOverlay.tsx
├── TerminalInput.tsx
├── GenerationProgress.tsx
├── LandingPagePreview.tsx
├── LeadsCollection.tsx
├── AnalyticsDashboard.tsx
└── index.ts
```

---

## 🔄 Component Relationships & Data Flow

### Page Editor Flow
```
PageEditor (pages/dashboard/)
    ├── usePageEditor (features/editor/hooks/)
    ├── EditPanel (features/editor/panels/)
    │   ├── ThemePanel → Theme changes
    │   ├── BusinessPanel → Business info
    │   ├── SectionPanel → Section content
    │   └── LayoutPanel → Section ordering
    └── LandingPageTemplate (pages/landing/)
        └── SectionRenderer
            └── Individual Sections
```

### Theme System Flow
```
ThemePanel (features/editor/panels/)
    ↓ onThemeChange
PageEditor (pages/dashboard/)
    ↓ pageStyle state
LandingPageTemplate (pages/landing/)
    ↓ theme prop
SectionRenderer + Individual Sections
    ↓ CSS classes applied
```

### Landing Page Rendering Flow
```
Public Route (/page/[slug])
    ↓
LandingPageTemplate (pages/landing/)
    ├── Dynamic Navigation (based on visible sections)
    ├── SectionRenderer
    │   └── Renders sections based on:
    │       ├── sectionOrder (array)
    │       └── visibleSections (boolean flags)
    └── Footer
```

---

## 📦 Import Patterns

### Absolute Imports (Recommended)
```typescript
// Pages
import PageEditor from "@/components/pages/dashboard/PageEditor";
import LandingPageTemplate from "@/components/pages/landing/LandingPageTemplate";

// Features
import { usePageEditor } from "@/components/features/editor/hooks/usePageEditor";
import EditPanel from "@/components/features/editor/panels/EditPanel";

// Widgets
import { ThemeToggle } from "@/components/widgets/ThemeToggle";
import Chatbot from "@/components/widgets/Chatbot";

// Layout
import DashboardLayout from "@/components/layout/DashboardLayout";

// UI
import { Button } from "@/components/ui/button";
```

### Relative Imports (Within same directory)
```typescript
// Within pages/landing/
import SectionRenderer from "./SectionRenderer";

// Within features/editor/panels/
import { fieldHandlers } from "../utils/fieldHandlers";
```

---

## 🎯 Design Principles

### 1. **Separation of Concerns**
- **Pages**: Complete page implementations
- **Features**: Business logic and complex functionality
- **Widgets**: Reusable UI components
- **Layout**: Application structure

### 2. **Discoverability**
- Intuitive naming and organization
- Clear directory purposes
- Logical component grouping

### 3. **Scalability**
- Easy to add new pages (`pages/billing/`)
- Clear place for new features (`features/notifications/`)
- Consistent patterns across directories

### 4. **Maintainability**
- Related components grouped together
- Minimal import path complexity
- Self-contained feature directories

---

## 🚀 Adding New Components

### Adding a New Page
```
1. Create directory: pages/[page-name]/
2. Add main component: pages/[page-name]/PageName.tsx
3. Add any page-specific components in the same directory
4. Update app router to import from new location
```

### Adding a New Widget
```
1. Create: widgets/WidgetName.tsx
2. Ensure it's self-contained and reusable
3. Import where needed using absolute path
```

### Adding a New Feature
```
1. Create directory: features/[feature-name]/
2. Add main components, hooks, utils as needed
3. Follow the editor pattern for complex features
4. Export from feature directory
```

---

## 🔍 Migration Notes

This structure was implemented in September 2025 as a comprehensive refactoring of the original flat component structure. Key changes:

### Before (Issues)
- All components in `/components` root directory
- Inconsistent grouping
- Complex relative import paths
- Difficult to locate related components

### After (Solutions)
- Clear hierarchical organization
- Logical component grouping
- Predictable import paths
- Easy component discovery

### Breaking Changes
- `PageEditorRefactored` → `PageEditor`
- `DashboardLayout` moved from `layout/` to `pages/dashboard/`
- `MobilePreviewQR` moved from `features/analytics/` to `widgets/`
- `editor/` directory consolidated into `features/editor/`
- All import paths updated to new structure
- Component locations moved to appropriate directories

---

## 📚 Related Documentation

- **Theme System**: See `THEME_MIGRATION_ISSUE.md` for theme implementation details
- **Editor Hooks**: Individual hook documentation in `features/editor/hooks/`
- **Landing Page Types**: Type definitions in `/types/landing-page.types.ts`

---

## 🤝 Contributing Guidelines

When adding new components:

1. **Choose the right directory** based on component purpose
2. **Follow existing naming conventions** (PascalCase for components)
3. **Use absolute imports** when importing from other directories
4. **Keep related components together** in the same directory
5. **Update this documentation** when adding new directories or major components

---

*Last updated: September 2025*
*Structure version: 2.1*