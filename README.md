
# Manasooth - Your Mental Wellness Companion

Manasooth ("मनः सूथ" - where "मनः" means mind and "सूथ" implies soothing or comfort) is a web application designed to be a compassionate and insightful partner in an individual's journey towards better mental wellbeing. It offers a comprehensive suite of tools, including standardized mental health assessments, AI-powered analysis and recommendations, progress tracking capabilities, an empathetic AI chatbot, a (simulated) professional consultation booking system, wellbeing goal setting, mood tracking, and local support resources. The platform is built with user privacy and accessibility in mind, catering to both anonymous users and those who wish to create an account for a more personalized and persistent experience.

## Table of Contents

- [Overview](#overview)
  - [Target Audience](#target-audience)
  - [Core Philosophy](#core-philosophy)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation and Running](#installation-and-running)
- [Firebase Setup](#firebase-setup)
  - [Creating a Firebase Project](#creating-a-firebase-project)
  - [Enabling Services](#enabling-services)
  - [Security Rules](#security-rules)
- [Genkit AI Flows](#genkit-ai-flows)
  - [`analyzeAssessmentFlow`](#analyzeassessmentflow)
  - [`aiChatbotFlow`](#aichatbotflow)
  - [`bookConsultationFlow`](#bookconsultationflow)
- [Future Improvements & Roadmap](#future-improvements--roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

Manasooth aims to empower users in India and beyond to proactively manage their mental health. It provides a secure and non-judgmental space for self-reflection, learning, and seeking support. The application emphasizes early awareness and personalized guidance, leveraging technology to make mental wellness tools more accessible with a focus on the Indian context.

### Target Audience

- Individuals seeking to understand and improve their mental wellbeing.
- Users curious about their mental state through standardized assessments.
- People looking for a safe space to express thoughts and receive supportive feedback.
- Those interested in tracking their mental health trends over time.
- Individuals who might benefit from initial guidance before seeking professional help.
- Users who prefer interacting with an AI for assessments or support.

### Core Philosophy

- **Accessibility:** Providing mental wellness tools to a broad audience, with multi-language support (English, Hindi).
- **Empowerment:** Giving users insights and actionable steps to take control of their mental health.
- **Privacy:** Ensuring user data is handled securely and offering anonymous usage options.
- **Personalization:** Tailoring feedback, recommendations, and experiences to individual needs.
- **Support:** Offering a compassionate and understanding digital environment.
- **Holistic View:** Providing a diverse range of assessments to cover various aspects of mental health.

## Key Features

1.  **Comprehensive Guided Mental Health Assessments:**
    *   Users can take a wide array of internationally recognized questionnaires through standard forms or an AI conversational interface.
    *   **Core Wellbeing:**
        *   **WHO-5 Well-being Index:** Measures current mental well-being.
    *   **Anxiety & Depression:**
        *   **GAD-7 Anxiety Assessment:** Screens for and measures the severity of generalized anxiety disorder.
        *   **PHQ-9 Depression Screening:** Screens for and measures the severity of depression.
        *   **BDI-II (Beck Depression Inventory):** Assesses depressive symptom severity. (Illustrative version)
        *   **BAI (Beck Anxiety Inventory):** Quantifies common anxiety symptoms. (Illustrative version)
    *   **Stress & General Distress:**
        *   **PSS (Perceived Stress Scale):** Measures how unpredictable, uncontrollable, and overloaded respondents find their lives. (Illustrative version)
        *   **GHQ-12 (General Health Questionnaire):** Screens for general psychiatric distress and social dysfunction. (Illustrative version)
    *   **Mood Disorders:**
        *   **MDQ (Mood Disorder Questionnaire):** Screens for bipolar spectrum disorders. (Illustrative version)
    *   **Sleep Quality:**
        *   **PSQI (Pittsburgh Sleep Quality Index):** Assesses sleep quality and disturbances. (Illustrative version)
        *   **ESS (Epworth Sleepiness Scale):** Gauges daytime sleepiness. (Illustrative version)
    *   **Social Anxiety:**
        *   **SPIN (Social Phobia Inventory):** Self-rating scale for social anxiety. (Illustrative version)
        *   **LSAS (Liebowitz Social Anxiety Scale):** Quantifies fear and avoidance in social situations. (Illustrative version)
    *   **Substance Use:**
        *   **AUDIT (Alcohol Use Disorders Identification Test):** Screens for hazardous alcohol consumption. (Illustrative version)
        *   **CAGE Questionnaire:** Rapid screen for potential alcohol dependency. (Illustrative version)
    *   Assessments are presented in a user-friendly, step-by-step format with clear instructions and progress indicators.
    *   Users can select specific assessments they wish to take.
    *   Scoring is automated based on established guidelines for each assessment.

2.  **AI-Powered Analysis & Personalized Insights:**
    *   Upon completion of assessments, users receive immediate, AI-generated feedback through the `analyzeAssessmentFlow`.
    *   The analysis interprets scores, provides context-aware insights, and offers actionable recommendations.
    *   Recommendations can range from lifestyle adjustments (e.g., mindfulness exercises, physical activity) to suggestions for seeking professional help if scores indicate moderate to severe concerns.
    *   The AI considers user-provided context, preferred recommendation types, and active goals to tailor its output.
    *   If results suggest a need, users are prompted about the professional consultation feature.

3.  **Progress Tracking & Visualization:**
    *   Assessment scores and AI-generated feedback are saved (locally in the browser for anonymous users, or in Firebase Firestore for authenticated users).
    *   A dedicated "Progress" page allows users to view their historical assessment scores over time using interactive line charts.
    *   This visual representation helps users identify trends, patterns, and improvements in their mental wellbeing.

4.  **Wellbeing Goal Setting & Tracking:**
    *   Users can set specific, measurable, achievable, relevant, and time-bound (SMART) goals related to their assessment scores or general wellbeing.
    *   Goals can be to reach a specific score or improve by a certain number of points.
    *   The system tracks progress towards these goals based on subsequent assessment results and updates goal status (active, achieved, missed).

5.  **Mood Tracker:**
    *   A daily mood logging feature allows users to record their mood (e.g., Great, Good, Okay, Bad, Awful).
    *   Users can optionally add notes and relevant activities/tags (e.g., "work stress," "exercise," "socializing") associated with their mood.
    *   Helps in identifying patterns and triggers affecting daily mood fluctuations.

6.  **Empathetic AI Chatbot:**
    *   The `aiChatbotFlow` provides a conversational AI for users to express their thoughts and feelings.
    *   The chatbot aims to provide supportive, empathetic, and personalized messages.
    *   Users can select a preferred tone for the chatbot (e.g., empathetic, motivational, calm, neutral, direct).
    *   The chatbot is designed to recognize distress and, if necessary, gently guide users towards professional help or crisis helplines.
    *   Utilizes ARIA live regions for enhanced accessibility.

7.  **Professional Consultation Booking (Simulated & Real Potential):**
    *   A feature to book a (currently simulated) video consultation with a mental health professional.
    *   Users can select an available date and time slot from an interactive calendar.
    *   The `bookConsultationFlow` handles the booking request and provides a confirmation.
    *   The page includes a basic video call interface (simulated) demonstrating how users could connect with professionals. This can be extended to integrate with actual video conferencing APIs.

8.  **Local Support & Helplines (India-Focused):**
    *   A dedicated page providing a curated list of mental health helplines and support resources available in India, including government-run and NGO/private foundation lines.
    *   Includes contact details, descriptions, and availability.
    *   Emphasizes immediate help options for users in crisis.

9.  **User Authentication (Optional):**
    *   Secure email/password authentication using Firebase Authentication.
    *   Authenticated users have their assessment history, goals, and progress data synced to Firebase Firestore, enabling access across multiple devices.
    *   Anonymous users can still use most features, with data stored locally in their browser's localStorage.
    *   Login prompts are strategically placed (e.g., on results page to save progress).

10. **Multi-Language Support:**
    *   The application interface and content can be switched between English and Hindi, catering to a wider audience in India.

11. **Responsive and Accessible Design:**
    *   The UI is built with Tailwind CSS and ShadCN/UI components, ensuring responsiveness across desktops, tablets, and mobile devices.
    *   Focus on clear typography, intuitive navigation, accessible components (ARIA labels, high contrast considerations), and fluid animations.
    *   Neumorphic and glassmorphic UI elements enhance visual appeal.

12. **Settings & Data Management:**
    *   Users can manage application settings, including clearing locally stored data.
    *   Placeholders for future notification preferences and theme customization.
    *   Placeholders for integrations (Spotify, Fitness Trackers).

## Technology Stack

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) (v15+ with App Router, React Server Components, TypeScript)
    *   [React](https://reactjs.org/) (v18+)
    *   [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
    *   [ShadCN/UI](https://ui.shadcn.com/) for pre-built, accessible, and customizable UI components.
    *   `lucide-react` for icons.
    *   `recharts` for creating interactive charts for progress tracking.
    *   `react-hook-form` for efficient and scalable form management.
    *   `zod` for schema declaration and validation.
    *   `date-fns` for date formatting and manipulation.
*   **Backend & Database (Serverless):**
    *   [Firebase](https://firebase.google.com/)
        *   **Firebase Authentication:** For user sign-up, login, and session management.
        *   **Firebase Firestore:** A NoSQL cloud database for storing authenticated user data (assessment history, goals, progress).
*   **AI Integration:**
    *   [Genkit (by Google)](https://firebase.google.com/docs/genkit) (v1.x)
        *   Utilizes Google AI models (e.g., Gemini series like `gemini-2.0-flash`) for:
            *   Analyzing assessment results and generating personalized feedback/recommendations.
            *   Powering the AI chatbot's conversational abilities.
            *   Simulating the consultation booking logic.
        *   AI flows are defined in the `src/ai/flows/` directory.
*   **Development & Build Tools:**
    *   Node.js (latest LTS recommended)
    *   npm (or yarn)
    *   TypeScript
    *   ESLint & Prettier (assumed for code quality)
*   **Deployment (Assumed):**
    *   The application is structured for easy deployment on platforms like Vercel, Firebase Hosting, or Google Cloud Run.

## Project Structure

The project follows a standard Next.js App Router structure with clear separation of concerns:

```
manasooth/
├── .env                   # Environment variables (API keys, Firebase config) - IMPORTANT: Keep this file private.
├── .vscode/               # VSCode specific settings
├── components/            # Reusable UI components
│   ├── assessment/        # Components for assessment forms, questions (e.g., AssessmentForm.tsx)
│   ├── auth/              # AuthGuard component for protecting routes
│   ├── goals/             # Components for goal setting and display (e.g., GoalForm.tsx, GoalCard.tsx)
│   ├── integrations/      # Components for third-party service integrations (e.g., Integrations.tsx)
│   ├── layout/            # Core layout components (AppLayout.tsx, AppProviders.tsx, SidebarNav.tsx, LanguageSwitcher.tsx)
│   ├── mood/              # Components for mood tracking (e.g., MoodLogForm.tsx)
│   └── ui/                # ShadCN/UI components (button, card, dialog, etc.) - Pre-built and customized
├── contexts/              # React Context API providers
│   ├── AuthContext.tsx    # Manages Firebase authentication state and functions
│   └── LanguageContext.tsx# Manages application language state and translation
├── hooks/                 # Custom React hooks
│   ├── use-mobile.tsx     # Detects if the viewport is mobile-sized
│   └── use-toast.ts       # Custom hook for displaying toast notifications
├── lib/                   # Utility functions, constants, type definitions, and Firebase setup
│   ├── assessment-questions.ts # Definitions for all assessment questions, options, and scoring logic
│   ├── constants.ts       # App-wide constants (assessment types, localStorage keys, etc.)
│   ├── firebase.ts        # Firebase app initialization and service configuration
│   ├── navigation.ts      # Configuration for sidebar and header navigation items
│   ├── types.ts           # Core TypeScript type definitions for the application
│   └── utils.ts           # General utility functions (e.g., cn for Tailwind class merging)
├── public/                # Static assets (e.g., favicon.ico, images) - Served from the root
├── src/
│   ├── ai/                # Genkit AI related files
│   │   ├── flows/         # Genkit AI flow definitions
│   │   │   ├── ai-chatbot.ts          # Logic for the AI support chatbot
│   │   │   ├── analyze-assessment.ts  # Logic for analyzing assessment results
│   │   │   └── book-consultation.ts   # Logic for (simulated) consultation booking
│   │   ├── dev.ts         # Entry point for running the Genkit development server
│   │   └── genkit.ts      # Global Genkit AI object configuration (model selection, plugins)
│   ├── app/               # Next.js App Router directory
│   │   ├── (main)/        # Main application routes group (requires layout with sidebar/header)
│   │   │   ├── assessment/      # Assessment-related pages
│   │   │   │   ├── [type]/page.tsx # Dynamic page for individual assessments
│   │   │   │   ├── ai-conversational/page.tsx # Page for AI guided assessments
│   │   │   │   ├── page.tsx        # Landing page for starting assessments
│   │   │   │   ├── report/page.tsx # Page for displaying/downloading a detailed assessment report
│   │   │   │   └── results/page.tsx# Page displaying assessment results and AI analysis
│   │   │   ├── chatbot/page.tsx     # AI Chatbot interface page
│   │   │   ├── consultation/page.tsx# Professional consultation booking and (simulated) call page
│   │   │   ├── goals/page.tsx       # Wellbeing goal setting and tracking page
│   │   │   ├── local-support/page.tsx# Page listing local support helplines
│   │   │   ├── mood-tracker/page.tsx# Mood logging and history page
│   │   │   ├── progress/page.tsx    # User progress visualization page
│   │   │   ├── settings/page.tsx    # Application settings page
│   │   │   ├── layout.tsx         # Layout for the main application section (includes sidebar, header)
│   │   │   └── page.tsx           # Home/Dashboard page of the application
│   │   ├── auth/            # Authentication routes group (login, signup)
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx     # Layout specific to authentication pages
│   │   ├── globals.css      # Global styles, Tailwind CSS base, and ShadCN/UI theme variables
│   │   └── layout.tsx       # Root layout for the entire application
├── .gitignore             # Specifies intentionally untracked files that Git should ignore
├── components.json        # ShadCN/UI configuration file
├── next.config.ts         # Next.js configuration file
├── package.json           # Project dependencies and scripts
├── tailwind.config.ts     # Tailwind CSS configuration file
└── tsconfig.json          # TypeScript configuration file
```

## Getting Started

Follow these instructions to set up and run the Manasooth project locally on your development machine.

### Prerequisites

*   **Node.js:** Version 18.x or later (latest LTS is recommended). You can download it from [nodejs.org](https://nodejs.org/).
*   **npm (or yarn):** Comes bundled with Node.js.
*   **Git:** For version control. Download from [git-scm.com](https://git-scm.com/).
*   **A Firebase Project:** You'll need to create a Firebase project to use Firebase Authentication and Firestore. See the [Firebase Setup](#firebase-setup) section for details.
*   **(Optional but Recommended) Google Cloud Account & Google AI Studio API Key:** For Genkit to use Google AI models (like Gemini), you might need to set up a Google Cloud project and enable the Vertex AI API, or get an API key from Google AI Studio. Refer to [Genkit documentation](https://firebase.google.com/docs/genkit/get-started) for the latest authentication methods.

### Environment Variables

Create a `.env` file in the root directory of your project. This file will store your Firebase configuration and any other sensitive keys. **Do not commit this file to version control.**

Example `.env` file:

```env
# Firebase Configuration (Obtain these from your Firebase project settings)
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID" # Optional, for Firebase Analytics

# Firebase Emulators (Optional - for local development without hitting live Firebase services)
# Set to "true" to enable emulators, "false" or remove to use live services.
# NEXT_PUBLIC_USE_FIREBASE_EMULATOR="true"
# NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST="http://127.0.0.1:9099" # Default auth emulator URL
# NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"          # Default Firestore emulator host and port

# Genkit / Google AI Configuration
# If your Genkit setup with googleAI() plugin requires an API key directly:
# GOOGLE_API_KEY="YOUR_GOOGLE_AI_STUDIO_API_KEY"
# Alternatively, ensure your environment is authenticated with Google Cloud CLI (gcloud auth application-default login)
# if the googleAI() plugin is configured to use application-default credentials.
```

**Important:** Replace placeholder values like `"YOUR_FIREBASE_API_KEY"` with your actual credentials from your Firebase project. If these are not set correctly, Firebase services will not initialize, and authentication will fail.

### Installation and Running

1.  **Clone the Repository (if you haven't already):**
    ```bash
    git clone <your-repository-url>
    cd manasooth
    ```

2.  **Install Dependencies:**
    Navigate to the project root and install the necessary npm packages:
    ```bash
    npm install
    ```
    *(or `yarn install` if you prefer yarn)*

3.  **Set Up Environment Variables:**
    Create the `.env` file as described in the [Environment Variables](#environment-variables) section and populate it with your Firebase credentials and any other required keys.

4.  **Run the Next.js Development Server:**
    This command starts the main web application.
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:9002`. The port is configured in `package.json`.

5.  **Run the Genkit Development Server (in a separate terminal):**
    This server is required for the AI-powered features (assessment analysis, chatbot) to function.
    ```bash
    npm run genkit:dev
    ```
    Or, for automatic reloading on file changes:
    ```bash
    npm run genkit:watch
    ```
    Genkit usually starts its development UI on `http://localhost:4000`, where you can inspect and test your AI flows.

You should now have both the Next.js frontend and the Genkit AI backend running locally.

## Firebase Setup

Manasooth uses Firebase for authentication and database storage.

### Creating a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click on "Add project" and follow the on-screen instructions to create a new Firebase project.
3.  Once your project is created, navigate to your Project settings (click the gear icon next to "Project Overview").

### Enabling Services

1.  **Register Your Web App:**
    *   In your Firebase project settings, scroll down to "Your apps."
    *   Click on the Web icon (`</>`) to add a new web app.
    *   Give your app a nickname (e.g., "Manasooth Web").
    *   **Do NOT** check the box for "Also set up Firebase Hosting for this app" unless you plan to deploy directly to Firebase Hosting using Firebase CLI tools (Vercel deployment is also a common choice for Next.js).
    *   Click "Register app."
    *   Firebase will provide you with a `firebaseConfig` object. Copy these values into your `.env` file as shown in the [Environment Variables](#environment-variables) section.

2.  **Enable Firebase Authentication:**
    *   In the Firebase console, go to "Build" > "Authentication" from the left sidebar.
    *   Click on the "Sign-in method" tab.
    *   Enable the "Email/Password" provider. You can also enable other providers like Google, Facebook, etc., if you wish to add them later.

3.  **Enable Firebase Firestore:**
    *   In the Firebase console, go to "Build" > "Firestore Database" from the left sidebar.
    *   Click "Create database."
    *   Choose to start in **Production mode** or **Test mode**.
        *   **Test mode** allows open access for a limited time, suitable for initial development.
        *   **Production mode** starts with locked-down rules, which you'll need to configure.
    *   Select a Firestore location (choose one geographically close to your users).
    *   Click "Enable."

### Security Rules

For Firestore, you need to set up security rules to control access to your data. Here's an example to get started. **Refine these rules for production to ensure data privacy and security.**

Navigate to "Firestore Database" > "Rules" tab in the Firebase console.

```firestore-rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection: stores user-specific data that is not assessment history
    // Example: user preferences, profile information (if any)
    match /users/{userId}/{document=**} {
      // Allow users to read and write their own documents
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // assessmentHistory collection: stores completed assessment sets for authenticated users
    // Each user has their own subcollection of assessments
    match /assessmentHistory/{userId}/assessments/{assessmentId} {
        // Allow authenticated users to create, read, update, and delete their own assessment records.
        allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // userGoals collection: stores user-defined goals for authenticated users
    match /userGoals/{userId}/goals/{goalId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // moodEntries collection: stores mood entries for authenticated users
    match /moodEntries/{userId}/entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Explanation of Rules:**

*   `request.auth != null`: Ensures the user is authenticated.
*   `request.auth.uid == userId`: Ensures a user can only access data under their own `userId`.
*   These rules provide a basic level of security where users can only manage their own data. For more complex scenarios (e.g., admin access, shared data), you'll need more sophisticated rules.

## Genkit AI Flows

Manasooth leverages Genkit for its AI capabilities. The core AI logic is encapsulated in "flows" located in `src/ai/flows/`.

*   **`src/ai/genkit.ts`:** This file configures the global Genkit `ai` object. It specifies the AI model to be used (e.g., `googleai/gemini-2.0-flash`) and any necessary plugins (like `@genkit-ai/googleai`).

### `analyzeAssessmentFlow`

*   **File:** `src/ai/flows/analyze-assessment.ts`
*   **Purpose:** Takes the user's scores from potentially multiple assessments (WHO-5, GAD-7, PHQ-9, PSS, GHQ-12, BDI-II, BAI, MDQ, PSQI, ESS, SPIN, LSAS, AUDIT, CAGE) as input. It then analyzes these scores, potentially considering user-provided context, preferred recommendation types, and active goals.
*   **Input (`AnalyzeAssessmentInput`):**
    *   Scores for all relevant assessments (e.g., `who5Score`, `gad7Score`, `pssScore`, etc.).
    *   `userContext` (optional): String for additional user notes.
    *   `preferredRecommendationTypes` (optional): Array of strings (e.g., "mindfulness", "physical activity").
    *   `activeGoals` (optional): Array of objects describing the user's active wellbeing goals.
*   **Output (`AnalyzeAssessmentOutput`):**
    *   `feedback`: String containing personalized feedback based on the scores.
    *   `recommendations`: String with actionable recommendations.
    *   `requiresConsultation`: Boolean indicating if the AI suggests a professional consultation.
*   **Usage:** Called from the `/assessment/results` page after assessments are completed.
    *   **Note:** The current AI prompt in `analyze-assessment.ts` has been updated to *accept* all new assessment scores in its input schema, but the prompt's detailed interpretation logic for *all* these new scales is a significant future enhancement. It currently provides more detailed feedback on WHO-5, GAD-7, and PHQ-9.

### `aiChatbotFlow`

*   **File:** `src/ai/flows/ai-chatbot.ts`
*   **Purpose:** Powers the AI chatbot, providing personalized and supportive messages. It can consider the user's current message, preferred tone, and recent chat history.
*   **Input (`AIChatbotInput`):**
    *   `message`: String (user's current message).
    *   `preferredTone` (optional): Enum (e.g., 'empathetic', 'motivational', 'calm', 'neutral', 'direct').
    *   `chatHistory` (optional): Array of previous messages for context.
*   **Output (`AIChatbotOutput`):**
    *   `response`: String (the AI's supportive response).
*   **Usage:** Used in the `/chatbot` page for interactive conversations.

### `bookConsultationFlow`

*   **File:** `src/ai/flows/book-consultation.ts`
*   **Purpose:** Simulates the process of booking a consultation. In a real application, this flow would interact with a calendar API or a database to manage actual bookings.
*   **Input (`BookConsultationInput`):**
    *   `date`: String (YYYY-MM-DD).
    *   `time`: String (HH:mm AM/PM).
    *   `userName` (optional): String.
*   **Output (`BookConsultationOutput`):**
    *   `success`: Boolean indicating if the (simulated) booking was successful.
    *   `message`: String with a confirmation or error message.
    *   `bookingId` (optional): String, a unique ID for the booking if successful.
*   **Usage:** Called from the `/consultation` page when a user attempts to book an appointment.

Running `npm run genkit:dev` (or `genkit:watch`) starts the Genkit development server, making these flows accessible to the Next.js application.

## Future Improvements & Roadmap

Manasooth is an evolving platform. Potential future enhancements include:

*   **Enhanced AI Capabilities:**
    *   **Detailed AI Analysis for All Assessments:** Expand the `analyzeAssessmentFlow` prompt to provide deep, nuanced interpretations and recommendations for *all* integrated assessment scales (PSS, GHQ-12, BDI-II, BAI, MDQ, PSQI, ESS, SPIN, LSAS, AUDIT, CAGE).
    *   Deeper sentiment analysis in the chatbot.
    *   More nuanced and adaptive recommendations based on long-term progress and combined assessment profiles.
    *   Proactive suggestions or check-ins based on user patterns.
*   **Real Professional Network Integration:**
    *   Transitioning the simulated consultation booking to a real system for connecting users with licensed therapists (requires significant legal, ethical, and logistical considerations).
*   **Firebase Data Sync for Authenticated Users:**
    *   Implement Firestore data synchronization for authenticated users for assessment history, goals, and mood entries. Currently, these are primarily stored in localStorage.
*   **Content Modules:**
    *   Educational articles, guided meditation audio/video, mindfulness exercises integrated into the platform.
*   **Gamification:**
    *   Points, badges, or streaks for completing assessments, achieving goals, or engaging with content.
*   **Advanced Data Export & Reporting:**
    *   More detailed and customizable report generation beyond the current "Print to PDF" functionality.
*   **Wearable Device Integration:**
    *   Actual integration for syncing data like sleep patterns or activity levels (with user consent) to enrich insights beyond the current placeholder UI.
*   **Native Mobile Applications:**
    *   Dedicated iOS and Android apps for a more integrated mobile experience.
*   **Push Notifications:**
    *   Implement actual push notification system for reminders.
*   **Customizable Themes:**
    *   Allow users to select different color themes.
*   **Community Features:**
    *   Secure and moderated forums or support groups (with strong emphasis on safety and privacy).
*   **A/B Testing Platform Integration:**
    *   Integrate tools for A/B testing UI/UX changes.
*   **Enhanced Accessibility:**
    *   Continuous accessibility audits and improvements beyond ARIA roles.
*   **Voice-Activated Navigation and VUI Design.**
*   **Context-Aware UI & Predictive Content Flow (Advanced AI).**
*   **Interactive 3D Components & Advanced Visual Styles (WebGL/Three.js).**

## Contributing

Currently, Manasooth is a project developed by individuals. If you are interested in contributing, please reach out to the maintainers. We may open up for community contributions in the future.

Potential areas for contribution:
*   Bug fixes and performance improvements.
*   Accessibility enhancements.
*   New feature development (aligned with the project roadmap).
*   Translation and localization for more languages.
*   Improving documentation.
*   Developing the detailed AI logic for new assessment types.

## License

This project is currently under a proprietary license. Please contact the authors for more information.
(If you plan to make it open source, choose a license like MIT, Apache 2.0, or GPL and update this section accordingly.)

---

This README provides a comprehensive guide to understanding, setting up, and running the Manasooth application. For more specific details on Next.js, Firebase, or Genkit, please refer to their respective official documentations.
Remember to replace placeholder Firebase and Genkit API keys in your `.env` file with actual credentials for the application to function correctly.
**Disclaimer:** The assessment questions for newly added scales (BDI-II, BAI, PSS, GHQ-12, MDQ, PSQI, ESS, SPIN, LSAS, AUDIT, CAGE) in this project are illustrative examples for development purposes and are NOT the official clinical instruments. For actual clinical use, the official versions of these scales must be obtained and used according to their licensing and guidelines.
