# StickerValley Client

The frontend application for StickerValley, built with modern web technologies to provide a fast and responsive e-commerce experience.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **State Management**: React Context & Hooks
- **HTTP Client**: [Axios](https://axios-http.com/)

[← Back to Root](../../README.md)

## 🚀 Scripts

Run these commands from the root of the monorepo or inside `apps/client`:

- `npm run dev`: Start the development server
- `npm run build`: Build for production
- `npm run lint`: Lint the codebase
- `npm run format`: Format the codebase using Prettier
- `npm run format:check`: Check code formatting
- `npm run preview`: Preview the production build locally

## 🔐 Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_BASE_URL=http://localhost:5000
```

## 📂 Key Directories

- `src/components`: Reusable UI components (including shadcn/ui primitives)
- `src/pages`: Main application pages (Home, StickerDetails, Cart, etc.)
- `src/context`: React Context providers (CartContext, etc.)
- `src/hooks`: Custom React hooks
- `src/service`: API service layers
- `src/lib`: Utility functions and helpers
