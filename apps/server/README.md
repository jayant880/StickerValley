# StickerValley Server

The backend API for StickerValley, built with Express and Node.js. It handles business logic, database interactions, and secure authentication flows.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: PostgreSQL (via [NeonDB](https://neon.tech/))
- **Authentication**: [Clerk](https://clerk.com/)
- **Security**: [Helmet](https://helmetjs.github.io/)
- **Logging**: [Morgan](https://www.npmjs.com/package/morgan)

## 🚀 Scripts

Run these commands from the root of the monorepo or inside `apps/server`:

- `npm run dev`: Start the server in watch mode
- `npm run build`: Compile TypeScript to JavaScript
- `npm run start`: Run the compiled production server
- `npm run db:push`: Push schema changes to the database
- `npm run db:generate`: Generate migration files
- `npm run db:studio`: Open Drizzle Studio to manage the database UI
- `npm run db:seed`: Seed the database with initial data

## 📂 Key Directories

- `src/controllers`: Request handlers for API endpoints
- `src/router`: API route definitions
- `src/db`: Database configuration, schema definitions, and seed scripts
- `src/middleware`: Custom Express middleware (auth, error handling, etc.)
- `src/service`: Business logic layer
- `src/types`: TypeScript type definitions

## 🔐 Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Ensure your `.env` file contains the following:

```env
DATABASE_URL=your_database_url
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
# Add other necessary variables
```
