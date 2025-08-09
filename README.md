# Weather App Monorepo

This project contains:
- `frontend`: Next.js (TypeScript) app, Auth0 OIDC/SAML ready, fetches weather data from backend
- `backend`: .NET 8 Web API, exposes weather endpoints, Auth0 OIDC/SAML ready
- `infra`: Docker Compose and infra scripts

## Getting Started

### Prerequisites
- Node.js (with pnpm)
- .NET 8 SDK
- Docker

### Development

1. Install dependencies in `frontend`:
   ```sh
   cd frontend
   pnpm install
   ```
2. Build and run backend:
   ```sh
   cd ../backend
   dotnet build
   dotnet run
   ```
3. Use Docker Compose for full stack:
   ```sh
   cd ../infra
   docker-compose up --build
   ```

### Auth0 Setup
- Configure OIDC & SAML connections in Auth0 dashboard
- Add environment variables for Auth0 domain, client ID, etc. in both apps

### Folder Structure
- `/frontend` - Next.js app
- `/backend` - .NET 8 Web API
- `/infra` - Docker Compose, env files, infra scripts

---

Replace this README with more details as you build out the project.
