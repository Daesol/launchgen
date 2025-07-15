"use client";
import React from "react";
import EditorSection from "./EditorSection";

interface Question {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faq: {
    title: string;
    subtitle: string;
    questions: Question[];
  };
  onFAQChange: (field: string, value: any) => void;
  onQuestionsChange: (idx: number, value: any) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (idx: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export default function FAQSection({
  faq,
  onFAQChange,
  onQuestionsChange,
  onAddQuestion,
  onRemoveQuestion,
  isExpanded,
  onToggle,
  isVisible,
  onToggleVisibility,
}: FAQSectionProps) {
  // Provide default values if faq is undefined
  const safeFAQ = faq || {
    title: '',
    subtitle: '',
    questions: []
  };
  return (
    <EditorSection
      title="FAQ"
      isExpanded={isExpanded}
      onToggle={onToggle}
      isVisible={isVisible}
      onToggleVisibility={onToggleVisibility}
      showVisibilityToggle={true}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Title
          </label>
          <input
            type="text"
            value={safeFAQ.title}
            onChange={(e) => onFAQChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Frequently Asked Questions"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Subtitle
          </label>
          <textarea
            value={safeFAQ.subtitle}
            onChange={(e) => onFAQChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            placeholder="Describe your FAQ section"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-700">Questions</h4>
            <button
              onClick={onAddQuestion}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Question
            </button>
          </div>
          
          {safeFAQ.questions.map((question, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-600">Question {idx + 1}</h5>
                <button
                  onClick={() => onRemoveQuestion(idx)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => onQuestionsChange(idx, { ...question, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the question"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer
                </label>
                <textarea
                  value={question.answer}
                  onChange={(e) => onQuestionsChange(idx, { ...question, answer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Enter the answer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditorSection>
  );
} 