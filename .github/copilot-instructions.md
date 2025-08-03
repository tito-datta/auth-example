# .github/copilot-instructions.md
<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

- This is a monorepo with React & Next.js (frontend) and .NET 8 Web API (backend).
- Both apps are dockerized for local development.
- Auth0 OIDC & SAML login flows are required for both frontend and backend.
- The backend exposes weather information via a REST API.
- The frontend fetches weather data from the backend and handles authentication.
- Use best practices for Auth0 integration in React, Next.js and .NET.
- Proceed with caution when making changes to authentication flows.
- Ensure that the frontend and backend are properly configured to communicate securely.
- use TypeScript for the frontend and C# for the backend.
- Use pnpm for package management in the frontend and NuGet for the backend.