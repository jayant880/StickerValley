# StickerValley

StickerValley is a modern e-commerce platform for purchasing unique stickers. It features a responsive user interface, secure authentication, and a streamlined checkout process.

**[Live Demo](https://sticker-valley-client.vercel.app/)**


## 🚀 Tech Stack

### Frontend (`apps/client`)
- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Built with [shadcn/ui](https://ui.shadcn.com/) and [Lucide React](https://lucide.dev/) icons
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Authentication**: [Clerk](https://clerk.com/)

### Backend (`apps/server`)
- **Runtime**: Node.js
- **Framework**: [Express](https://expressjs.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: [NeonDB](https://neon.tech/) (PostgreSQL)
- **Authentication**: [Clerk](https://clerk.com/)
- **Security**: [Helmet](https://helmetjs.github.io/)

### Monorepo
- Managed via **npm workspaces**
- Shared types in `packages/shared-types`

## 🛠️ Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm
- NeonDB (PostgreSQL)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/jayant880/StickerValley.git
    cd StickerValley
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Environment Setup:
    - Create a `.env` file in `apps/server` and configure your database URL and Clerk keys.
    - Create a `.env` file in `apps/client` for Clerk public keys.

### Running the Application

To run both the client and server concurrently in development mode:

```bash
npm run dev
```

This will start:
- Client at `http://localhost:5173` (default Vite port)
- Server at `http://localhost:5000` (or your configured port)

### Database Management

The project uses Drizzle ORM for database management. You can run these commands from the root or inside `apps/server`:

*   **Push schema changes**: `npm run db:push`
*   **Generate migrations**: `npm run db:generate`
*   **Open Drizzle Studio**: `npm run db:studio`

## 📦 Project Structure

```
StickerValley/
├── apps/
│   ├── client/       # React frontend application
│   └── server/       # Express backend application
├── packages/
│   └── shared-types/ # Shared TypeScript definitions
└── ...
```

## ✨ Features

- **Storefront**: Browse a collection of cool stickers.
- **User Accounts**: Sign up and login seamlessly with Clerk.
- **Cart & Checkout**: Add items to cart and proceed to checkout.
- **Order History**: View past purchases (Dashboard).
