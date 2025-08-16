#### Frontend authentication app instructions

<!-- - create react + nextjs app under folder frontend 
- use pnpm as package manager
- use typescript
- use eslint + prettier for code formatting
- use jest + react testing library for testing
- use storybook for component documentation
- use tailwindcss for styling
- use AppRouter for routing
- install auth0 dependencies (use stable versions only)
- set up auth0 provider
- create login and logout routes
- protected weather page

- create a weather component that fetches data a weather API
- display weather data in the component (city, temperature, conditions)
- ensure the component is only accessible when authenticated

- add a loading state while fetching weather data
- handle errors gracefully if the weather data cannot be fetched
- ensure the component is responsive and works well on different screen sizes
- ensure the component is tested (e.g., using Jest, React Testing Library)
- ensure the component is documented (e.g., using JSDoc, Storybook)
- ensure the component is secure (e.g., using HTTPS, Content Security Policy) -->

- this is a frontend authentication app that uses Next.js, Auth0, and Tailwind CSS.
- it includes a header with navigation links, user information, and a dropdown menu for theme switching
- the app supports dark mode and high-contrast themes
- it includes a weather component that fetches and displays weather data
- the app is styled using Tailwind CSS and includes responsive design features
- the app uses Auth0 for authentication and protects certain routes
- when the user is not authenticated, they are redirected to the login page
- when the user is authenticated, they can access protected routes and view their information
- when the user logs out, they are redirected to the login page
- when the user, already authenticated, opens up a new tab, they are already authenticated
- the app includes a logout button that redirects to the login page after logging out
