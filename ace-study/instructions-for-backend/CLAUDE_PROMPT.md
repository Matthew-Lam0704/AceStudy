# AceStudy Backend Implementation Guide

Hello Claude! We are building **AceStudy**, a premium dark-mode study platform that clones features from SaveMyExams and Medify. The frontend interface has already been designed and built using Next.js 15, Tailwind CSS v3, and React. 

Your task is to build the backend infrastructure to support this frontend.

## Provided Context

In this folder, you will find everything you need to understand the application structure and styling:

1. **`implementation_plan.md`**: The master plan detailing all the features we are cloning, the data structures needed, and the overall tech stack.
2. **`dashboard.tsx`**: The React code for the main Dashboard screen. This shows how the frontend expects to consume user progress data, recent activity, and study statistics.
3. **`payment.tsx`**: The React code for the Payment Method selection screen. This shows the subscription checkout flow and saved card UI.
4. **`tailwind.config.js`**: The design system tokens (colors, custom neumorphic shadows).

## Your Tasks

1. **Review the `implementation_plan.md`** to understand the full scope of the AceStudy application (User Progress, Flashcards, Mock Exams, etc.).
2. **Design the Database Schema**: Based on the features required (users, subjects, topics, flashcard decks, questions, mock exams, and user progress), design a robust relational database schema (e.g., PostgreSQL via Prisma or Drizzle).
3. **Design the API Architecture**: Propose the API routes needed to serve the data to the Next.js frontend frontend (e.g., tRPC, standard Next.js API Routes, or GraphQL).
4. **Implement the Backend**: Begin writing the backend code, starting with the data models for the Dashboard (User stats, recent activity) so we can replace the static mock data in `dashboard.tsx` with live database calls.

Please analyze the provided files and confirm you understand the architecture before beginning the backend implementation.
