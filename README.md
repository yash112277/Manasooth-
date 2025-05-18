
# Manasooth - Mental Wellness Companion

Manasooth ("मनः सूथ" - where "मनः" means mind and "सूथ" means soothing) is a privacy-focused mental wellness web application designed to empower individuals in their mental health journey. It provides comprehensive assessment tools, AI-powered analysis, and personalized support - all while keeping user data secure and local. 

## Key Features
- Mental health assessments (WHO-5, GAD-7, PHQ-9)
- AI-powered analysis and recommendations
- Mood tracking and goal setting
- Empathetic AI chatbot
- Professional consultation simulation
- Local support resources (India-focused)
- Bilingual support (English/Hindi)

All user data is stored locally in the browser, ensuring maximum privacy as no server-side storage or user accounts are required.

## Table of Contents

- [Overview](#overview)
  - [Target Audience](#target-audience)
  - [Core Philosophy](#core-philosophy)
- [Key Features Detailed](#key-features-detailed)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation and Running](#installation-and-running)
- [Genkit AI Flows Explained](#genkit-ai-flows-explained)
  - [`analyzeAssessmentFlow`](#analyzeassessmentflow)
  - [`aiChatbotFlow`](#aichatbotflow)
  - [`bookConsultationFlow`](#bookconsultationflow)
- [Future Improvements & Detailed Roadmap](#future-improvements--detailed-roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

Manasooth aims to empower individuals, primarily focusing on the Indian context but applicable globally, to proactively manage their mental health and enhance their overall wellbeing. It provides a secure, non-judgmental, and user-friendly digital space for self-reflection, learning, accessing supportive tools, and seeking guidance. The application emphasizes early awareness of mental health states through validated assessments and offers personalized, AI-driven guidance to foster resilience and encourage timely help-seeking when appropriate. **All user data is stored locally in the browser, ensuring maximum privacy as no server-side accounts are required.**

### Target Audience

Manasooth is designed for:
- Individuals seeking to understand and improve their mental wellbeing proactively.
- Users curious about their mental state who wish to take standardized assessments in a private setting.
- People looking for a safe, empathetic space to express thoughts and feelings, and receive supportive, non-clinical feedback.
- Those interested in tracking their mental health trends, mood fluctuations, and goal progress over time (all data stored locally).
- Individuals who might benefit from initial guidance and self-help strategies before or alongside seeking professional help.
- Users who prefer interacting with an AI for initial assessments or for ongoing supportive dialogue.
- Anyone in India looking for a curated list of verified mental health support helplines and resources.

### Core Philosophy

Manasooth is built upon the following guiding principles:
- **Accessibility & Inclusivity:** Providing mental wellness tools to a broad audience, including multi-language support (English, Hindi) and adherence to web accessibility standards (WCAG).
- **Empowerment & Agency:** Giving users actionable insights and evidence-based tools to take control of their mental health journey.
- **Privacy & Confidentiality:** Ensuring user data is handled securely and ethically by storing all data in the browser's local storage. No user accounts or server-side data storage.
- **Personalization & Relevance:** Tailoring feedback, recommendations, and user experiences to individual needs, assessment results, and cultural contexts.
- **Support & Compassion:** Offering a compassionate, understanding, and non-judgmental digital environment that reduces stigma.
- **Holistic View & Evidence-Based Approach:** Providing internationally recognized core assessments to cover various aspects of mental health and basing recommendations on established best practices.

## Key Features Detailed

1.  **Comprehensive Guided Mental Health Assessments:**
    *   Users can take core internationally recognized questionnaires (WHO-5 Well-being Index, GAD-7 Anxiety Assessment, PHQ-9 Depression Screening).
    *   **Assessment Selection:** Users can choose to take individual assessments or select multiple assessments to complete in a single session via a checkbox interface.
    *   Assessments are presented in a clear, step-by-step format with instructions. Scoring is automated based on established guidelines, with interpretations provided.
    *   **AI Conversational Assessment:** Users can opt to take assessments through an AI-guided chat interface.

2.  **AI-Powered Analysis & Personalized Insights:**
    *   Upon completion of assessments, users receive immediate, AI-generated feedback through the `analyzeAssessmentFlow`.
    *   The analysis interprets scores from submitted assessments, provides context-aware insights, and offers actionable recommendations tailored to the user's profile.
    *   Recommendations span lifestyle adjustments (mindfulness, physical activity, sleep hygiene), coping strategies, and suggestions for seeking professional help if scores indicate moderate to severe concerns.
    *   If results suggest a potential need, users are prompted about the professional consultation feature.

3.  **Progress Tracking & Visualization:**
    *   Assessment scores and key AI-generated feedback snippets are saved locally in the browser for all users.
    *   A dedicated "Progress" page allows users to view their historical assessment scores over time using interactive line charts, enabling them to identify trends, patterns, and improvements.

4.  **Wellbeing Goal Setting & Tracking:**
    *   Users can set specific, measurable, achievable, relevant, and time-bound (SMART) goals related to their assessment scores or general wellbeing (e.g., "Reduce GAD-7 score to below 10 within 2 months").
    *   Goals can be defined to reach a specific score or improve by a certain number of points from a baseline.
    *   The system tracks progress towards these goals based on subsequent assessment results and updates goal status (active, achieved, missed, archived). Data is stored locally.

5.  **Daily Mood Tracker:**
    *   A simple yet effective daily mood logging feature allows users to record their mood on a 5-point scale (e.g., Great, Good, Okay, Bad, Awful).
    *   Users can optionally add textual notes and relevant activities/tags (e.g., "work stress," "exercise," "socializing") associated with their mood.
    *   This helps in identifying patterns, triggers, and correlations affecting daily mood fluctuations. Data is stored locally.

6.  **Empathetic AI Chatbot:**
    *   The `aiChatbotFlow` provides a conversational AI for users to express their thoughts and feelings in a safe, non-judgmental environment.
    *   The chatbot aims to provide supportive, empathetic, and contextually relevant messages.
    *   Users can select a preferred conversational tone for the chatbot (e.g., empathetic, motivational, calm, neutral, direct).
    *   The chatbot is designed to recognize expressions of distress and, if necessary, gently guide users towards professional help or provide relevant crisis helpline information.
    *   Utilizes ARIA live regions for enhanced accessibility for screen reader users.

7.  **Professional Consultation Booking (Simulated & Real Potential):**
    *   A feature to book a (currently simulated) video consultation with a mental health professional.
    *   Users can select an available date and time slot from an interactive calendar.
    *   The `bookConsultationFlow` (currently simulated) handles the booking request and provides a confirmation.
    *   The page includes a basic video call interface (simulated, using local camera/mic access for demo) demonstrating how users could connect. This can be extended to integrate with actual video conferencing APIs.

8.  **Local Support & Helplines (India-Focused):**
    *   A dedicated page providing a curated and verified list of mental health helplines and support resources available in India.
    *   Includes government-run national helplines and various NGO/private foundation lines, with contact details, descriptions, availability, and focus areas.
    *   Emphasizes immediate help options for users in crisis or seeking urgent support.

9.  **Multi-Language Support (English & Hindi):**
    *   The application interface and key content can be dynamically switched between English and Hindi, enhancing accessibility for a wider audience in India.
    *   Uses React Context API for managing language state and translations.

10. **Responsive and Accessible Design:**
    *   The UI is built with Tailwind CSS and ShadCN/UI components, ensuring responsiveness across desktops, tablets, and mobile devices.
    *   Focus on clear typography (Geist Sans), intuitive navigation, accessible components (ARIA labels, roles, keyboard navigability, high contrast considerations), and fluid animations (subtle neumorphism, glassmorphism, and load-in effects) to enhance user experience.

11. **Settings & Data Management:**
    *   Users can manage application settings, including clearing locally stored browser data.
    *   Placeholders for future notification preferences (assessment reminders, goal check-ins) and theme customization.
    *   Placeholders for integrations with third-party services (Spotify, Fitness Trackers).

## Technology Stack

*   **Frontend & UI:**
    *   [Next.js](https://nextjs.org/) (v15+ with App Router, React Server Components, TypeScript): For a robust, performant, and modern React framework.
    *   [React](https://reactjs.org/) (v18+): Core library for building user interfaces.
    *   [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework for rapid UI development and styling.
    *   [ShadCN/UI](https://ui.shadcn.com/): A collection of beautifully designed, accessible, and customizable UI components built with Radix UI and Tailwind CSS.
    *   `lucide-react`: For a comprehensive set of clean and consistent icons.
    *   `recharts`: For creating interactive and responsive charts for progress tracking.
    *   `react-hook-form` & `@hookform/resolvers`: For efficient, scalable, and type-safe form management and validation.
    *   `zod`: For schema declaration and data validation, used with `react-hook-form` and Genkit flows.
    *   `date-fns`: For robust date formatting and manipulation.
*   **AI Integration:**
    *   [Genkit (by Google)](https://firebase.google.com/docs/genkit) (v1.x): An open-source framework for building AI-powered features.
        *   Utilizes Google AI models (e.g., Gemini series like `gemini-pro` or `gemini-2.0-flash`) for:
            *   Analyzing assessment results and generating personalized feedback/recommendations.
            *   Powering the AI chatbot's conversational abilities and tone adaptation.
            *   Simulating the consultation booking logic.
        *   AI flows are defined as server-side TypeScript functions in the `src/ai/flows/` directory.
*   **Development & Build Tools:**
    *   Node.js (latest LTS recommended, e.g., v18.x or v20.x).
    *   npm (or yarn) for package management.
    *   TypeScript for static typing and improved code quality.
    *   ESLint & Prettier (assumed for code linting and formatting, configured via IDE or project settings).
*   **Deployment (Assumed):**
    *   The application is structured for easy deployment on modern hosting platforms like Vercel (ideal for Next.js), Firebase Hosting, or Google Cloud Run.

## Project Structure

The project follows a standard Next.js App Router structure with a clear separation of concerns, promoting maintainability and scalability:

```
manasooth/
├── .env                   # Environment variables (API keys) - IMPORTANT: Keep this file private.
├── .vscode/               # VSCode specific settings
├── components/            # Reusable UI components, organized by feature or type
│   ├── assessment/        # Components for assessment forms, questions (e.g., AssessmentForm.tsx)
│   ├── common/            # General-purpose common components (Removed: ScrollAnimatedCube.tsx)
│   ├── goals/             # Components for goal setting, display, and forms (e.g., GoalForm.tsx, GoalCard.tsx)
│   ├── integrations/      # Components for third-party service integrations (e.g., Integrations.tsx)
│   ├── layout/            # Core layout components (AppLayout.tsx, AppProviders.tsx, SidebarNav.tsx, LanguageSwitcher.tsx)
│   ├── mood/              # Components for mood tracking (e.g., MoodLogForm.tsx)
│   └── ui/                # ShadCN/UI components (button, card, dialog, etc.) - Pre-built and customized
├── contexts/              # React Context API providers for global state management
│   ├── AuthContext.tsx    # Manages (now stubbed/disabled) authentication state
│   └── LanguageContext.tsx# Manages application language state (en/hi) and translation utilities
├── hooks/                 # Custom React hooks for reusable logic
│   ├── use-mobile.tsx     # Detects if the viewport is mobile-sized for responsive adjustments
│   └── use-toast.ts       # Custom hook for displaying toast notifications system-wide
├── lib/                   # Utility functions, constants, type definitions, and Firebase setup
│   ├── assessment-questions.ts # Definitions for core assessment questions, options, and scoring logic
│   ├── constants.ts       # App-wide constants (assessment types, localStorage keys, navigation items, etc.)
│   ├── firebase.ts        # Firebase app initialization (Auth part is minimal/disabled)
│   ├── navigation.ts      # Configuration for sidebar and header navigation items, including icons and translations
│   ├── types.ts           # Core TypeScript type definitions for the application (e.g., UserGoal, MoodEntry)
│   └── utils.ts           # General utility functions (e.g., cn for Tailwind class merging)
├── public/                # Static assets (e.g., favicon.ico, images) - Served from the root
├── src/
│   ├── ai/                # Genkit AI related files
│   │   ├── flows/         # Genkit AI flow definitions (server-side TypeScript functions)
│   │   │   ├── ai-chatbot.ts          # Logic for the AI support chatbot, including tone adaptation
│   │   │   ├── analyze-assessment.ts  # Logic for analyzing assessment results and generating insights
│   │   │   └── book-consultation.ts   # Logic for (simulated) professional consultation booking
│   │   ├── dev.ts         # Entry point for running the Genkit development server (`genkit start`)
│   │   └── genkit.ts      # Global Genkit AI object configuration (model selection, plugins like googleAI)
│   ├── app/               # Next.js App Router directory - defines routes and UI structure
│   │   ├── (main)/        # Main application routes group (requires layout with sidebar/header)
│   │   │   ├── assessment/      # Assessment-related pages
│   │   │   │   ├── [type]/page.tsx # Dynamic page for individual standard assessments
│   │   │   │   ├── ai-conversational/page.tsx # Page for AI guided conversational assessments
│   │   │   │   ├── page.tsx        # Landing page for selecting assessments
│   │   │   │   ├── report/page.tsx # Page for displaying/downloading a detailed assessment report
│   │   │   │   └── results/page.tsx# Page displaying assessment results and AI analysis
│   │   │   ├── chatbot/page.tsx     # AI Chatbot interface page
│   │   │   ├── consultation/page.tsx# Professional consultation booking and (simulated) video call page
│   │   │   ├── goals/page.tsx       # Wellbeing goal setting and tracking page
│   │   │   ├── local-support/page.tsx# Page listing local support helplines in India
│   │   │   ├── mood-tracker/page.tsx# Mood logging and history page
│   │   │   ├── progress/page.tsx    # User progress visualization page (charts)
│   │   │   ├── settings/page.tsx    # Application settings page (data management, preferences)
│   │   │   ├── layout.tsx         # Layout for the main application section (includes AppLayout with sidebar, header)
│   │   │   └── page.tsx           # Home/Dashboard page of the application
│   │   ├── auth/            # Authentication routes group (login - now removed/obsolete)
│   │   │   └── (Removed login/page.tsx and its layout.tsx)
│   │   ├── globals.css      # Global styles, Tailwind CSS base directives, and ShadCN/UI theme variables (CSS HSL)
│   │   └── layout.tsx       # Root layout for the entire application (includes AppProviders, Toaster)
├── .gitignore             # Specifies intentionally untracked files that Git should ignore
├── components.json        # ShadCN/UI configuration file (defines paths, style, etc.)
├── next.config.ts         # Next.js configuration file (TypeScript/ESLint settings, image remote patterns)
├── package.json           # Project dependencies (npm packages) and scripts (dev, build, start, lint)
├── tailwind.config.ts     # Tailwind CSS configuration file (custom theme extensions, plugins)
└── tsconfig.json          # TypeScript configuration file (compiler options, paths)
```

## Getting Started

Follow these instructions to set up and run the Manasooth project locally on your development machine.

### Prerequisites

*   **Node.js:** Version 18.x or later (latest LTS, e.g., v20.x, is recommended). Download from [nodejs.org](https://nodejs.org/).
*   **npm (or yarn/pnpm):** Comes bundled with Node.js. This project uses `npm` in its scripts.
*   **Git:** For version control. Download from [git-scm.com](https://git-scm.com/).
*   **(Optional but Recommended) Google Cloud Account & Google AI Studio API Key:** For Genkit to use Google AI models (like Gemini), you might need to set up a Google Cloud project and enable the Vertex AI API, or get an API key from Google AI Studio. Refer to [Genkit documentation](https://firebase.google.com/docs/genkit/get-started) for the latest authentication methods and how to set up the `googleAI()` plugin. Your environment typically needs to be authenticated (e.g., via `gcloud auth application-default login` or by setting `GOOGLE_API_KEY`).

### Environment Setup

1. Create a `.env` file in the root directory:
```env
# Required - Google AI API Key
GOOGLE_API_KEY=your_google_ai_studio_api_key

# Optional - Firebase Config (if using other Firebase services)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
```

**Note:** Firebase configuration is optional since authentication is removed. The Google AI API key is required for assessment analysis and chatbot features.

# Firebase Configuration (Not needed for auth, but keep if using other Firebase services like Firestore in future)
# NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY_IF_NEEDED_FOR_OTHER_SERVICES"
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN_IF_NEEDED_FOR_OTHER_SERVICES"
# NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID_IF_NEEDED_FOR_OTHER_SERVICES"
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET_IF_NEEDED"
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID_IF_NEEDED"
# NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID_IF_NEEDED"
```
**Note:** Since login/signup is removed, Firebase configuration variables are only needed if you plan to use other Firebase services (like Firestore for future cloud sync, though that's not currently implemented). For purely local operation, these might not be strictly necessary.

### Quick Start

1. **Install Dependencies:**
```powershell
# Navigate to project directory
cd c:\Users\91962\Personal Projects\firebase\Manasooth\Manasooth\manasooth

# Install packages
npm install
```

2. **Start Development Servers:**
```powershell
# Terminal 1: Start Next.js frontend
npm run dev

# Terminal 2: Start Genkit AI server
npm run genkit:dev
```

3. **Access the Application:**
- Frontend: http://localhost:9002
- Genkit UI: http://localhost:4000

3.  **Set Up Environment Variables:**
    Create the `.env` file as described in the [Environment Variables](#environment-variables) section and populate it with any required keys (like `GOOGLE_API_KEY` if needed for Genkit).

4.  **Run the Next.js Development Server:**
    This command starts the main web application frontend.
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:9002` (the port is configured in `package.json`).

5.  **Run the Genkit Development Server (in a separate terminal):**
    This server is required for the AI-powered features (assessment analysis, chatbot, consultation booking simulation) to function. It runs your Genkit flows.
    ```bash
    npm run genkit:dev
    ```
    Or, for automatic reloading of flows on file changes during development:
    ```bash
    npm run genkit:watch
    ```
    Genkit usually starts its development UI (Flows UI) on `http://localhost:4000`, where you can inspect, test, and trace your AI flows.

You should now have both the Next.js frontend and the Genkit AI backend running locally. Ensure both are running concurrently to use all features of Manasooth.

## Genkit AI Flows Explained

Manasooth utilizes Genkit to integrate AI capabilities, primarily through Google's Gemini models.

*   **Global Configuration (`src/ai/genkit.ts`):** Initializes the global Genkit `ai` object, model selection, and plugins.
*   **Development Server (`src/ai/dev.ts`):** Entry point for `genkit start`.

### `analyzeAssessmentFlow`

*   **File:** `src/ai/flows/analyze-assessment.ts`
*   **Purpose:** Interprets user assessment results from WHO-5, GAD-7, and PHQ-9, generating personalized feedback and recommendations.
*   **Input (`AnalyzeAssessmentInput`):** Scores for WHO-5, GAD-7, PHQ-9, optional user context, preferred recommendation types, and active goals.
*   **Output (`AnalyzeAssessmentOutput`):** Personalized feedback, actionable recommendations, and a boolean `requiresConsultation` flag.
*   **Usage:** Called from `/assessment/results` page.

### `aiChatbotFlow`

*   **File:** `src/ai/flows/ai-chatbot.ts`
*   **Purpose:** Powers the interactive AI chatbot with empathetic responses.
*   **Input (`AIChatbotInput`):** User message, preferred tone (empathetic, motivational, etc.), and chat history.
*   **Output (`AIChatbotOutput`):** AI's generated response.
*   **Usage:** Used in `/chatbot` page. Instructed to provide crisis info if severe distress is detected.

### `bookConsultationFlow`

*   **File:** `src/ai/flows/book-consultation.ts`
*   **Purpose:** Simulates booking a professional consultation.
*   **Input (`BookConsultationInput`):** Selected date, time, and optional user name.
*   **Output (`BookConsultationOutput`):** Success status, confirmation message, and simulated booking ID.
*   **Usage:** Called from `/consultation` page.

## Future Improvements & Detailed Roadmap

Manasooth is envisioned as an evolving platform. Potential future enhancements include:

*   **Core Enhancements & Stability:**
    *   **Robust Local Data Management:** Enhance resilience and error handling for local storage operations.
    *   **Advanced Error Handling & Logging:** Implement comprehensive error handling across the frontend and backend (Genkit flows).
    *   **Unit & Integration Testing:** Introduce a testing framework (e.g., Jest, React Testing Library).

*   **Feature Expansion:**
    *   **Real Professional Network Integration:** Transition simulated consultation to a real system (database for professionals, secure payments, video conferencing API).
    *   **Guided Content Modules:** Curate educational articles, guided meditations, and mindfulness exercises.
    *   **Enhanced Chatbot Capabilities:** Deeper sentiment analysis, proactive check-ins (with consent), integration of therapeutic techniques.
    *   **Advanced Data Export & Reporting:** Customizable PDF reports, secure sharing with professionals.

*   **Engagement & Personalization:**
    *   **Gamification & Rewards:** Points, badges, streaks for engagement.
    *   **Wearable Device Integration:** Sync data like sleep patterns, activity levels (with consent).
    *   **Push Notifications & Reminders:** For assessments, goals, appointments.
    *   **Customizable Themes & UI Preferences.**
    *   **Personalized Onboarding Experience.**

*   **Community & Advanced Tech:**
    *   **Secure Community Features (Moderated):** Forums or support groups (if user accounts are re-introduced).
    *   **Voice-Activated Navigation and VUI Design.**
    *   **Context-Aware UI & Predictive Content Flow.**
    *   **Ethical AI Monitoring & Bias Detection.**

*   **Ongoing:**
    *   **Continuous Accessibility Audits & Improvements.**
    *   **Performance Optimization.**
    *   **Security Audits & Hardening.**

## Contributing

Currently, Manasooth is primarily a project developed by its initial authors. However, community contributions could be valuable in the future. If you are interested in contributing, please observe standard open-source practices (fork, branch, PR).

## License

This project is currently under a proprietary license.
(If you plan to make it open source in the future, choose an appropriate license like MIT, Apache 2.0, or GPL and update this section accordingly.)

---

This README provides a comprehensive guide to understanding, setting up, and running the Manasooth application.
Remember to set up your `.env` file, especially if using Genkit AI features.

**Disclaimer:** Manasooth is a tool for self-awareness and support; it is NOT a substitute for professional medical advice, diagnosis, or treatment. The assessment questions used in this app for WHO-5, GAD-7, and PHQ-9 are based on publicly available versions of these instruments. For actual clinical use, official versions should always be consulted and used according to their licensing and guidelines.
