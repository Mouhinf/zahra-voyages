# AI Rules for Zahra Voyages Explorer

This document outlines the core technologies and best practices for developing the Zahra Voyages Explorer application.

## Tech Stack

*   **React**: The primary JavaScript library for building user interfaces.
*   **Next.js**: The React framework used for server-side rendering, routing, and API routes, providing a robust foundation for the application.
*   **TypeScript**: The superset of JavaScript that adds static typing, enhancing code quality and maintainability.
*   **Tailwind CSS**: A utility-first CSS framework used for all styling, enabling rapid and consistent UI development.
*   **shadcn/ui**: A collection of reusable components built on Radix UI and styled with Tailwind CSS, providing accessible and customizable UI elements.
*   **Radix UI**: A low-level component library providing unstyled, accessible primitives for building high-quality design systems.
*   **Lucide React**: An extensive icon library used for all graphical icons within the application.
*   **React Hook Form & Zod**: Libraries for efficient form management and robust schema-based validation.
*   **date-fns**: A modern JavaScript date utility library for parsing, validating, manipulating, and formatting dates.
*   **Genkit AI**: The framework used for integrating AI functionalities into the application.
*   **Firebase App Hosting**: The platform for deploying and hosting the application.

## Library Usage Rules

To maintain consistency and efficiency, please adhere to the following guidelines when using libraries:

*   **UI Components**:
    *   Always prioritize `shadcn/ui` components for building the user interface.
    *   If a specific component is not available in `shadcn/ui` or requires significant customization, create a new, small, and focused component in `src/components/` and style it using Tailwind CSS.
    *   **Do NOT modify `shadcn/ui` component files directly.**
*   **Styling**:
    *   Exclusively use **Tailwind CSS** for all styling.
    *   Avoid inline styles or separate CSS files (other than `src/app/globals.css` for global styles).
*   **Icons**:
    *   Use `lucide-react` for all icons throughout the application.
*   **Forms**:
    *   Use `react-hook-form` for managing form state and submissions.
    *   Use `zod` for defining form schemas and performing validation.
*   **Date Handling**:
    *   Use `date-fns` for any date parsing, formatting, or manipulation tasks.
*   **Routing**:
    *   Utilize the **Next.js App Router** for all page-based navigation and routing. Keep routes in `src/app/`.
*   **State Management**:
    *   For local component state, use React's built-in `useState` and `useReducer` hooks.
    *   For global state, if necessary, use the React Context API, keeping implementations as simple as possible.
*   **AI Integration**:
    *   All AI-related functionalities must be implemented using **Genkit AI**.