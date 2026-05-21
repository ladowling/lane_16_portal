# Inventory Lane

This repository is structured as a monorepo with separate frontend and backend applications.

## Structure

- `frontend/` — React + Vite single-page application
- `backend/` — Node.js Express API server

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the backend:
   ```bash
   npm run dev:backend
   ```

3. Run the frontend:
   ```bash
   npm run dev:frontend
   ```

4. Or run both together:
   ```bash
   npm run dev
   ```

## Notes

- The frontend is configured to call backend APIs at `http://localhost:4000`.
- The backend exposes a sample API route at `/api/ping`.
