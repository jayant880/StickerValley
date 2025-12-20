# 🚀 StickerValley Server

The backend API for StickerValley, built with **Express** and **TypeScript**. This server handles all business logic, database management via Drizzle ORM, and secure authentication through Clerk.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: PostgreSQL (via [NeonDB](https://neon.tech/))
- **Authentication**: [Clerk](https://clerk.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Formatting**: [Prettier](https://prettier.io/)
- **Security**: [Helmet](https://helmetjs.github.io/) & [CORS](https://www.npmjs.com/package/cors)

## 🏗️ Architecture & Features

### 1. Global Error Handling

We use a centralized error handling system to eliminate boilerplate and ensure consistent error responses.

- **`AppError`**: Custom error class for operational errors.
- **`asyncHandler`**: A wrapper to catch errors in async routes and pass them to the global handler.
- **Middleware**: A global error middleware located in `src/middleware/errorMiddleware.ts`.

### 2. Standardized Response Format

Every API response follows a consistent structure, making it easy for the frontend to consume:

**Success Response:**

```json
{
    "success": true,
    "message": "Human readable message",
    "data": { ... } | [ ... ] | null,
    "pagination": { "page": 1, "limit": 10, "hasMore": true } // Optional
}
```

**Error Response:**

```json
{
    "success": false,
    "status": "fail" | "error",
    "message": "Detailed error message"
}
```

### 3. Automatic Code Formatting

We use **Prettier** to maintain a consistent code style across the project. It is configured to run automatically on save if your editor is set up correctly.

## 🚀 Scripts

- `npm run dev`: Start the server in development mode (tsx watch)
- `npm run build`: Compile TypeScript to JavaScript
- `npm run start`: Run the compiled production server
- `npm run format`: Standardize code formatting using Prettier
- `npm run db:push`: Sync schema directly to the database
- `npm run db:generate`: Generate database migrations
- `npm run db:studio`: Open Drizzle Studio UI
- `npm run db:seed`: Seed the database with sample data

## 📂 Project Structure

- `src/controllers`: Standardized request handlers.
- `src/routes`: API route definitions.
- `src/db`: Database config, schemas, and seeding.
- `src/middleware`: Custom middleware (auth, validation, error handling).
- `src/services`: Business logic and external service integrations.
- `src/utils`: Reusable utility functions (`AppError`, `asyncHandler`).
- `src/validationSchema`: Zod schemas for request validation.

## 🔐 Configuration

Copy `.env.example` to `.env` and configure the following variables:

- `DATABASE_URL`: Your PostgreSQL connection string.
- `CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`: From your Clerk Dashboard.
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins.
- `PORT`: Server port (defaults to 5000).
