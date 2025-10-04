# Project: Adonomics - Creative Genome Performance Insights Dashboard

## Project Overview

Adonomics is an AI-powered dashboard designed to analyze video ad creatives and provide data-backed insights into their performance. The goal is to move beyond subjective creative decisions and A/B testing by dissecting video ads to understand their "emotional DNA." The tool will analyze scenes for emotional arcs, objects, and pacing, then correlate these elements with performance metrics like persuasion, conversion rates, and CTR.

This project is being developed for the **Generative AI in Advertising Hackathon**, specifically addressing **"The Creative Intelligence Lab"** challenge. The objective is to build a system that analyzes quantitative and qualitative feedback from creative pre-testing, along with video creative details, to generate specific recommendations for improving ad creatives.

**Key Technologies:**

*   **Video AI:** Twelve Labs for scene detection and object recognition.
*   **Sentiment & Emotion AI:** Hume, OpenAI for tone and expression analysis.
*   **Data & Performance:** Swayable for persuasion metrics.
*   **Infrastructure:** Cloud-based SaaS application.
*   **Data Backend:** Snowflake, PowerBI for data warehousing and visualization.

## Building and Running

Currently, there are no source code files or build scripts available. The project is in the planning and design phase.

**TODO:**

*   Set up the project structure.
*   Initialize a `package.json` or equivalent for managing dependencies.
*   Create a build and run script.

## Development Conventions

The project has a strong emphasis on a high-quality user interface, with a detailed design system documented in `docs/dev_rules/ui_rules.md`.

**UI/UX Guidelines:**

*   **Color System:** Use the OKLCH color space with semantic color variables for light and dark modes.
*   **Typography:** A modern sans-serif font stack (Geist Sans, Inter) with a clear type scale.
*   **Layout & Spacing:** A consistent spacing system and responsive grid layouts.
*   **Components:** Detailed specifications for buttons, cards, inputs, and other UI components.
*   **Animations:** A motion system with defined timing functions, durations, and patterns.
*   **Accessibility:** A focus on focus management, color contrast, ARIA attributes, and semantic HTML.

**Development Workflow:**

1.  **Adherence to UI Rules:** All UI development must follow the guidelines in `docs/dev_rules/ui_rules.md`.
2.  **Component-Based Architecture:** Build small, reusable components.
3.  **Mobile-First Responsive Design:** Ensure the application is usable across all screen sizes.
4.  **Performance Optimization:** Prioritize fast loading times and smooth animations.

## AI Interaction Protocol

To ensure clarity and collaboration between the AI and human developers, the following protocol will be followed:

1.  **Folder Exploration:** When exploring a new folder, always read the available `README.md` file first, if it exists, to understand the context of the folder.
2.  **Code Comments:** The AI will add relevant comments to any code it generates. This is to ensure that a human developer can easily understand the code's purpose, logic, and how it uses any third-party tools or SDKs. The comments should be short and precise to give just enough information without making the codebase messy with a lot of comments.
3.  **Pull Request-Style Reporting:** After every task completion, the AI will generate a short summary formatted like a pull request description. This structured report allows developers to understand not just what was changed, but also how and why.

    **Title:** A concise, one-line summary of the completed task.

    **Description:**

    *   **The Plan:** The high-level steps the AI intended to take to accomplish the requested task.
    *   **The Approach:** The reasoning and methodology behind the chosen plan. It explains why this specific solution was implemented over other alternatives.
    *   **The Action:** A clear log of the concrete changes made. This section will list all created or modified files and summarize the key code changes for each.
