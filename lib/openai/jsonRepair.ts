/**
 * JSON Repair Utilities
 * 
 * Handles common JSON parsing issues that can occur with AI-generated content.
 * This module contains functions to repair malformed JSON strings.
 */

/**
 * Repairs common JSON issues in AI-generated content
 * @param jsonString - The potentially malformed JSON string
 * @returns The repaired JSON string
 */
export function repairJson(jsonString: string): string {
  let repaired = jsonString;
  
  // Fix unterminated strings by finding the last complete object/array and truncating
  const lastCompleteBrace = repaired.lastIndexOf('}');
  const lastCompleteBracket = repaired.lastIndexOf(']');
  const lastComplete = Math.max(lastCompleteBrace, lastCompleteBracket);
  
  if (lastComplete > 0) {
    // Find the position where the JSON becomes incomplete
    let truncatePosition = lastComplete + 1;
    
    // Look for incomplete objects/arrays after the last complete one
    const remainingText = repaired.substring(lastComplete + 1);
    const incompleteMatch = remainingText.match(/[{\[]/);
    if (incompleteMatch && incompleteMatch.index !== undefined) {
      truncatePosition = lastComplete + 1 + incompleteMatch.index;
    }
    
    repaired = repaired.substring(0, truncatePosition);
  }
  
  // Fix the specific issue we saw: missing commas after property values in objects
  // Pattern: "description": "text" "icon": "value" -> "description": "text", "icon": "value"
  repaired = repaired.replace(/"([^"]+)"\s*"([^"]+)"/g, '"$1", "$2"');
  
  // Fix missing commas between objects in arrays
  // Pattern: } { -> }, {
  repaired = repaired.replace(/\}\s*\{/g, '}, {');
  
  // Fix missing commas after property values before closing braces/brackets
  // Pattern: "value" } -> "value", }
  repaired = repaired.replace(/"([^"]+)"\s*(\}|\])/g, '"$1", $2');
  
  // Fix trailing commas (remove them)
  repaired = repaired.replace(/,(\s*[}\]])/g, '$1');
  
  // Fix missing quotes around property names
  repaired = repaired.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
  
  // Fix empty string values that might be causing issues
  repaired = repaired.replace(/"\s*,\s*"/g, '", "');
  
  // Ensure the JSON ends properly
  if (!repaired.trim().endsWith('}')) {
    // Count braces to see if we need to close objects
    const openBraces = (repaired.match(/\{/g) || []).length;
    const closeBraces = (repaired.match(/\}/g) || []).length;
    const openBrackets = (repaired.match(/\[/g) || []).length;
    const closeBrackets = (repaired.match(/\]/g) || []).length;
    
    // Add missing closing braces/brackets
    for (let i = 0; i < openBraces - closeBraces; i++) {
      repaired += '}';
    }
    for (let i = 0; i < openBrackets - closeBrackets; i++) {
      repaired += ']';
    }
  }
  
  return repaired;
}

/**
 * Extracts JSON content from markdown code blocks
 * @param content - The raw content that may contain markdown formatting
 * @returns The extracted JSON string
 */
export function extractJsonFromContent(content: string): string {
  let jsonString = content.trim();
  
  // Try to extract JSON from markdown code blocks
  const codeBlockMatch = content.match(/```json([\s\S]*?)```/i) || content.match(/```([\s\S]*?)```/i);
  if (codeBlockMatch) {
    jsonString = codeBlockMatch[1].trim();
  }
  
  // Clean up the JSON string
  jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  
  return jsonString;
}
