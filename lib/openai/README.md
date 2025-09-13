# OpenAI Module Structure

This directory contains the refactored OpenAI utilities for landing page generation, organized into logical modules for better maintainability.

## File Structure

```
lib/openai/
├── README.md                    # This documentation
├── index.ts                     # Centralized exports
├── client.ts                    # OpenAI client initialization and API calls
├── jsonRepair.ts                # JSON parsing and repair utilities
├── promptTemplates.ts           # Prompt templates for generation and regeneration
└── validationAndFallbacks.ts    # Configuration validation and fallback logic
```

## Module Responsibilities

### `client.ts`
- **Purpose**: Handles OpenAI client initialization and API requests
- **Exports**: `getOpenAI()`, `makeOpenAIRequest()`
- **Dependencies**: `openai` package

### `jsonRepair.ts`
- **Purpose**: Repairs common JSON parsing issues in AI-generated content
- **Exports**: `repairJson()`, `extractJsonFromContent()`
- **Dependencies**: None

### `promptTemplates.ts`
- **Purpose**: Contains all OpenAI prompt templates
- **Exports**: `createNewGenerationPrompt()`, `createRegenerationPrompt()`
- **Dependencies**: None (pure functions)

### `validationAndFallbacks.ts`
- **Purpose**: Validates configurations and provides fallback values
- **Exports**: `validateConfigStructure()`, `createFallbackConfig()`, `applyFallbacks()`
- **Dependencies**: `../landingPageSchema`

### `index.ts`
- **Purpose**: Centralized exports for clean imports
- **Exports**: All public functions from the module
- **Dependencies**: All other modules

## Main Entry Point

The main `lib/openai.ts` file now serves as a clean orchestrator that:
1. Imports utilities from the modular structure
2. Maintains the exact same public API (`generatePageConfig`)
3. Preserves all existing functionality and behavior
4. Is much more maintainable and readable

## Benefits of This Structure

1. **Separation of Concerns**: Each module has a single responsibility
2. **Maintainability**: Easier to find and modify specific functionality
3. **Testability**: Individual modules can be tested in isolation
4. **Readability**: Smaller, focused files are easier to understand
5. **Reusability**: Modules can be imported individually if needed
6. **Preservation**: Exact same functionality and API as before

## Usage

The refactored module maintains the exact same public API:

```typescript
import { generatePageConfig } from '@/lib/openai';

// New generation
const config = await generatePageConfig("Create a landing page for my SaaS");

// Regeneration
const improvedConfig = await generatePageConfig("Improve this page", existingConfig);
```

## Migration Notes

- **No breaking changes**: All existing imports continue to work
- **Same functionality**: All prompts, validation, and fallback logic preserved
- **Better organization**: Code is now logically separated and easier to maintain
- **Backup created**: Original file saved as `lib/openai.ts.backup`
