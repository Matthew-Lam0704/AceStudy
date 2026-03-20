# Prompt: Generate A-Level Stock Content for AceStudy

## Context
You are an expert curriculum designer and content creator for A-Level subjects in the UK. We are populating "AceStudy", a premium study platform, with a large library of **Revision Notes**, **Flashcards**, and **Mock Exams**.

## Target Subjects & Exam Boards
Generate content specifically for these common combinations:

| Subject | Primary Board | Secondary Board(s) |
|---|---|---|
| **Maths** | Edexcel | AQA, OCR (A & MEI) |
| **Further Maths** | Edexcel | AQA, OCR MEI |
| **English Literature** | AQA (B) | Edexcel, OCR |
| **Physics** | AQA | OCR (A), Edexcel |
| **Chemistry** | AQA | OCR (A), Edexcel |
| **Biology** | AQA | OCR (A), Edexcel |
| **Economics** | Edexcel (A) | AQA |
| **Business** | AQA | Edexcel |
| **Philosophy & Theology** | OCR | AQA, Edexcel |

## Content Requirements

### 1. Revision Notes (Markdown)
- **Depth**: High-level A-level standard.
- **Formatting**: Use clean Markdown. Use LaTeX for all mathematical formulas and scientific notations (e.g., `$E=mc^2$`).
- **Structure**: Clear headings, bullet points for key concepts, and "Key Terms" boxes.
- **Goal**: Full specification coverage for each sub-topic.

### 2. Flashcards (Q&A JSON)
- **Format**: `[{"front": "Question", "back": "Answer"}]`.
- **Style**: Active recall questions. Short, punchy answers.
- **Source**: Directly derived from the revision notes for consistency.

### 3. Mock Exams (Exam-Style Questions)
- **Structure**: Mimic the exam board's paper style (e.g., AQA Physics Paper 1).
- **Question Types**: 
    - Multiple Choice (4 options).
    - Short Answer (2-5 marks).
    - Long Answer/Mathematical (10+ marks).
- **Mark Scheme**: Every question must include a concise mark scheme and explanation.

## Data Schema Reference (Supabase)
When generating data for ingestion, follow this structure:
- **Subjects**: `{ id, name, board, slug }`
- **Topics**: `{ id, subject_id, parent_id, title, order }`
- **Notes**: `{ id, topic_id, content_markdown }`
- **Flashcards**: `{ id, topic_id, front, back }`
- **Questions**: `{ id, exam_id, text, options (JSON), correct_answer, explanation, marks }`

## Task
Please generate a sample set of content (Notes, 10 Flashcards, and 3 Exam Questions) for **[SUBJECT NAME]** under the **[EXAM BOARD]** specification, focusing on the topic **[TOPIC NAME]**.
