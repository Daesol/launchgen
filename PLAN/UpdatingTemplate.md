# Updating Landing Page Template System

This document tracks all files and steps needed when updating the landing page template system. Follow this checklist to ensure completeness and prevent errors.

## 📋 **Complete Update Checklist**

### **1. Schema Updates** ✅
- [ ] **File**: `lib/landingPageSchema.ts`
- [ ] Update `landingPageSchema` object
- [ ] Update `LandingPageConfig` type
- [ ] Test `getSchemaString()` function
- [ ] **Example**: Adding new fields like `headlineHighlights: []`

### **2. Template Component Updates** ✅
- [ ] **File**: `components/LandingPageTemplate.tsx`
- [ ] Update `LandingPageTemplateProps` interface
- [ ] Add new fields to destructuring
- [ ] Implement new UI elements
- [ ] Add proper TypeScript types
- [ ] **Example**: Adding `headlineHighlights?: string[]` to hero interface

### **3. Editor Interface Updates** ✅
- [ ] **File**: `components/PageEditor.tsx`
- [ ] Update initial state in `initialContent`
- [ ] Add new input fields/controls
- [ ] Add change handlers for new fields
- [ ] Update save/load logic
- [ ] **Example**: Adding highlight toggle buttons for headline words

### **4. AI Integration Updates** ✅
- [ ] **File**: `lib/openai.ts`
- [ ] Update system prompt to include new fields
- [ ] Add validation for new fields
- [ ] Add fallback values for new fields
- [ ] Test AI response parsing
- [ ] **Example**: Adding `hero.headlineHighlights` to AI prompt requirements

### **5. Generation Flow Updates** ✅
- [ ] **File**: `app/api/generate-page/route.ts`
- [ ] Update request/response handling
- [ ] Add validation for new fields
- [ ] Test generation endpoint
- [ ] **Example**: Ensuring new fields are included in AI generation

### **6. Public Rendering Updates** ✅
- [ ] **File**: `app/page/[slug]/page.tsx`
- [ ] Update data fetching
- [ ] Update props passing
- [ ] Test public page rendering
- [ ] **Example**: Passing new fields to template component

### **7. Migration & Backward Compatibility** ✅
- [ ] **File**: Migration scripts or backward compatibility code
- [ ] Handle old data structure
- [ ] Provide migration path
- [ ] Test with existing data
- [ ] **Example**: Converting old `themeColors` to new `theme` structure

### **8. Documentation Updates** ✅
- [ ] **File**: This document and related docs
- [ ] Update feature descriptions
- [ ] Add usage examples
- [ ] Update screenshots if needed
- [ ] **Example**: Documenting new highlighting feature

## 🎯 **High-Converting Landing Page Structure Implementation**

### **New Sections Added (Based on Copywriting Cheatsheet):**

#### **1. Problem Amplification Section (DIC Framework - Disrupt)**
- **Purpose**: Amplify pain points and create emotional connection
- **Schema**: `problemSection: { title, subtitle, painPoints: [{ text, icon }] }`
- **Template**: Displays pain points in cards with icons
- **Editor**: Full CRUD interface for pain points



#### **4. Social Proof Section**
- **Purpose**: Build trust through testimonials and statistics
- **Schema**: `socialProof: { title, subtitle, testimonials: [{ name, role, company, quote, rating, result }], stats: [{ number, label, description }] }`
- **Template**: Star ratings, customer quotes, and impressive statistics
- **Editor**: Separate interfaces for testimonials and stats

#### **2. Enhanced Features Section**
- **Purpose**: Show features with clear benefits
- **Schema**: `features: [{ title, description, icon, benefit }]` (added benefit field)
- **Template**: "What this means for you" explanations
- **Editor**: Additional benefit field for each feature

#### **5. Risk Reversal Section**
- **Purpose**: Reduce risk and build confidence
- **Schema**: `guarantees: { title, subtitle, guarantees: [{ title, description, icon }] }`
- **Template**: Guarantee cards with icons
- **Editor**: Full CRUD interface for guarantees

#### **6. FAQ Section**
- **Purpose**: Address objections and concerns
- **Schema**: `faq: { title, subtitle, questions: [{ question, answer }] }`
- **Template**: Expandable FAQ cards
- **Editor**: Question/answer pairs with full CRUD

#### **7. Urgency/Scarcity Elements**
- **Purpose**: Create urgency and drive action
- **Schema**: `urgency: { enabled, message, deadline }`
- **Template**: Animated urgency banner in CTA section
- **Editor**: Toggle and text inputs for urgency settings

### **Files Modified:**

#### **Schema & Types:**
- `lib/landingPageSchema.ts` - Added all new section schemas
- `components/LandingPageTemplate.tsx` - Updated interface and template rendering

#### **Editor Interface:**
- `components/PageEditor.tsx` - Added handlers and UI for all new sections
- Added 20+ new handler functions for CRUD operations
- Added comprehensive UI sections for each new feature

#### **AI Integration:**
- `lib/openai.ts` - Updated system prompt with copywriting framework guidance
- Added validation and fallbacks for all new sections
- Enhanced AI to generate high-converting content using DIC/NESB frameworks

### **Key Features:**
1. **Copywriting Framework Integration**: DIC (Disrupt-Intrigue-Click) and NESB (New-Easy-Safe-Big) frameworks
2. **Emotional Connection**: Problem amplification with specific pain points
3. **Social Proof**: Testimonials with specific results and impressive statistics
4. **Risk Reduction**: Multiple guarantees and FAQ section
5. **Urgency Elements**: Configurable urgency banners and deadlines
6. **Enhanced Features**: Benefits-focused feature descriptions

## 🔧 **Common Patterns & Best Practices**

### **Schema Pattern:**
```typescript
// Always include default values and proper types
hero: { 
  headline: "", 
  headlineHighlights: [], // Array for new features
  subheadline: "", 
  // ... other fields
}
```

### **Editor Pattern:**
```typescript
// Add to initial state
hero: { headline: '', headlineHighlights: [], subheadline: '', ... }

// Add change handler
const handleHighlightToggle = (word: string) => {
  setPageContent((prev: any) => ({
    ...prev,
    hero: { ...prev.hero, headlineHighlights: newHighlights },
  }));
};
```

### **AI Prompt Pattern:**
```typescript
// Add to critical requirements
- hero.headlineHighlights: Array of 1-3 key words from the headline that should be highlighted with accent color. Choose words that are most impactful (e.g., "AI", "Smart", "Fast", "Best", "Revolutionary", "Advanced"). Must be an array, even if empty.
```

### **Template Pattern:**
```typescript
// Use new component for rendering
<HighlightedText
  text={hero.headline}
  highlights={hero.headlineHighlights || []}
  accentColor={theme.accentColor}
  className={themeClasses.text}
/>
```

## 🧪 **Testing Checklist**

### **Manual Testing:**
- [ ] Generate new landing page with AI
- [ ] Verify highlights are applied correctly
- [ ] Test user highlight toggling
- [ ] Test save/load functionality
- [ ] Test regeneration preserves highlights
- [ ] Test public page rendering

### **Edge Cases:**
- [ ] Empty headline
- [ ] No highlights selected
- [ ] Special characters in words
- [ ] Case sensitivity
- [ ] Backward compatibility with old data

## 🚀 **Example: Adding a New Section**

### **Step 1: Update Schema**
```typescript
// lib/landingPageSchema.ts
export const landingPageSchema = {
  // ... existing fields
  testimonials: [
    { name: "", quote: "", role: "" }
  ],
  testimonialsTitle: "",
  testimonialsSubtitle: "",
};
```

### **Step 2: Update Template**
```typescript
// components/LandingPageTemplate.tsx
interface LandingPageTemplateProps {
  // ... existing props
  testimonials?: Array<{ name: string; quote: string; role: string }>;
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
}
```

### **Step 3: Update Editor**
```typescript
// components/PageEditor.tsx
const initialContent = {
  // ... existing fields
  testimonials: [],
  testimonialsTitle: "",
  testimonialsSubtitle: "",
};
```

### **Step 4: Update AI**
```typescript
// lib/openai.ts
// Add to system prompt:
- testimonials: Array of 2-3 customer testimonials with name, quote, and role
- testimonialsTitle: Compelling title for testimonials section
- testimonialsSubtitle: Descriptive subtitle for testimonials
```

### **Step 5: Test & Document**
- [ ] Test generation
- [ ] Test editing
- [ ] Test rendering
- [ ] Update documentation

## 📝 **Notes**

- Always maintain backward compatibility
- Use TypeScript for type safety
- Test with real AI responses
- Update this document when adding new features
- Consider user experience and accessibility
- Follow existing code patterns and conventions
- Apply copywriting principles (DIC/NESB frameworks) for high-converting content 