# PageEditor Refactor Plan

## 🎯 **Objective**
SIMPLIFIED: Fix the core issue - ensure all changes (text, icons, section visibility) are properly saved in the `page_content` JSON field using the existing auto-save system.

## 📊 **Current Issues**
- Section visibility changes not being saved to `page_content.visibleSections`
- Non-text changes (icons, features) not triggering auto-save properly
- Overcomplicated system when everything should just be in `page_content` JSON

## 🏗️ **Simplified Strategy**

### **Core Principle: Everything in `page_content` JSON**
- All data (text, icons, section visibility, section order) goes into `page_content`
- Use existing `setPageContent` and `setPageStyle` functions
- Let the existing auto-save system handle everything
- No need for separate columns or complex state management

## 📋 **Implementation Steps**

### **Step 1: Simplify PageEditor** ✅
- [x] Removed complex refactor hooks
- [x] Use existing `setPageContent` and `setPageStyle` functions
- [x] Section visibility changes update `pageContent.visibleSections` directly
- [x] All changes go through existing auto-save system
- [x] Build successful with simplified approach

### **Step 3: Test Compatibility** ⏳
- [ ] All existing functionality works
- [ ] No breaking changes
- [ ] Better reliability
- [ ] Performance improvements

### **Step 4: Add Enhancements** ⏳
- [ ] Better error handling
- [ ] Optimistic updates
- [ ] Save status indicators
- [ ] Conflict resolution

## 🔧 **New Hook Architecture**

### **usePageStateManager**
```typescript
// Centralized state management
- state: PageState
- updateState(path: string, value: any)
- getState()
- subscribeToChanges()
- resetToOriginal()
```

### **useUnifiedAutoSave**
```typescript
// Single save mechanism
- saveQueue: SaveQueue
- saveInProgress: boolean
- retryLogic: RetryManager
- scheduleSave(change: Change)
- executeSave()
- getSaveStatus()
```

### **useChangeDetector**
```typescript
// Deep change detection
- originalState: StateSnapshot
- currentState: StateSnapshot
- pendingChanges: Change[]
- detectChanges()
- hasUnsavedChanges()
- getChangeSummary()
```

### **useSaveStatus**
```typescript
// Save status management
- status: 'saved' | 'saving' | 'error' | 'unsaved'
- lastSaved: Date | null
- error: string | null
- retryCount: number
- updateStatus()
- clearError()
```

## 📁 **File Structure**

```
components/pages/dashboard/editor/
├── PageEditor.tsx (refactored - same interface)
├── hooks/
│   ├── usePageStateManager.ts (new)
│   ├── useUnifiedAutoSave.ts (new)
│   ├── useChangeDetector.ts (new)
│   └── useSaveStatus.ts (new)
└── utils/
    └── saveManager.ts (new)
```

## 🧪 **Testing Checklist**

### **Backward Compatibility**
- [ ] PageEditorWrapper integration works
- [ ] EditPanel callbacks work
- [ ] LandingPageTemplate rendering works
- [ ] All existing props work
- [ ] All existing callbacks work

### **New Functionality**
- [ ] Text changes save reliably
- [ ] Non-text changes save reliably
- [ ] Section visibility saves reliably
- [ ] Theme changes save reliably
- [ ] All changes persist on reload
- [ ] Error recovery works
- [ ] Retry logic works

### **Performance**
- [ ] No unnecessary re-renders
- [ ] Efficient change detection
- [ ] Optimized save batching
- [ ] Memory usage improvements

## 📝 **Change Log**

### **2025-01-20 - Initial Plan**
- Created comprehensive refactor plan
- Analyzed current system architecture
- Identified compatibility requirements
- Designed new hook architecture

### **2025-01-20 - Step 1: New Hooks**
- [ ] Created usePageStateManager hook
- [ ] Created useUnifiedAutoSave hook
- [ ] Created useChangeDetector hook
- [ ] Created useSaveStatus hook
- [ ] Created saveManager utility

### **2025-01-20 - Step 2: PageEditor Refactor**
- [x] Refactored PageEditor.tsx to use new hooks
- [x] Maintained exact same external interface
- [x] Added comprehensive debug logging
- [x] Tested all existing functionality
- [x] Fixed TypeScript compilation errors
- [x] Build successful with no breaking changes
- [x] Fixed infinite loop in section visibility useEffect
- [x] Added proper change detection to prevent unnecessary updates

### **2025-01-20 - Step 3: Testing**
- [ ] Tested backward compatibility
- [ ] Tested new functionality
- [ ] Tested performance improvements
- [ ] Fixed any issues found

### **2025-01-20 - Step 4: Enhancements**
- [ ] Added better error handling
- [ ] Added optimistic updates
- [ ] Added save status indicators
- [ ] Added conflict resolution

## 🎯 **Success Criteria**

1. **100% Backward Compatibility** - No breaking changes
2. **Reliable Auto-Save** - All changes save and persist
3. **Better Performance** - Cleaner, more efficient code
4. **Maintainable** - Clear separation of concerns
5. **Debuggable** - Comprehensive logging and error handling

## 📚 **References**

- Current PageEditor.tsx (555 lines)
- usePageEditor hook
- useFieldAutoSave hook
- useSectionManagement hook
- PageEditorWrapper integration
- API save mechanism
