# 🚀 Main 12 - Next.js Boilerplate  

A comprehensive and production-ready Next.js 15 boilerplate featuring **authentication**, **internationalization**, **database integration**, **API documentation**, **real-time chat**, and **modern UI components** for rapid full-stack development.

## ✨ Key Features

- 🔐 **Authentication** - Complete Auth0 integration with protected routes
- 🌍 **Internationalization** - Multi-language support with next-intl
- 📊 **Database Ready** - Prisma ORM with PostgreSQL/Supabase integration
- 💬 **Real-time Chat** - Built-in chat functionality
- 📚 **API Documentation** - Swagger/OpenAPI integration
- � **Modern UI** - HeroUI v2 components with Tailwind CSS
- 🔔 **Push Notifications** - Web push notifications support
- 📝 **Feedback System** - Integrated feedback collection
- 🎭 **Theme Support** - Dark/light mode switching
- 📱 **Responsive Design** - Mobile-first approach with sidebar navigation

## 🛠️ Technology Stack

### Core Framework
- [Next.js 15](https://nextjs.org/docs/getting-started) – React framework with App Router and Turbopack
- [TypeScript](https://www.typescriptlang.org/) – Type-safe development
- [React 18](https://reactjs.org/) – Latest React features

### UI & Styling
- [HeroUI v2](https://heroui.com/) – Modern React UI components
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework
- [Tailwind Variants](https://tailwind-variants.org) – Component variants
- [Framer Motion](https://www.framer.com/motion/) – Smooth animations
- [Material-UI Icons](https://mui.com/material-ui/material-icons/) & [Lucide React](https://lucide.dev/) – Icon libraries

### Authentication & Security
- [Auth0](https://auth0.com/) – Complete authentication solution
- Protected routes with middleware

### Database & Backend
- [Prisma](https://prisma.io/) – Next-generation ORM
- [PostgreSQL](https://postgresql.org/) – Robust relational database
- [Supabase](https://supabase.com/) – Open source Firebase alternative

### Internationalization
- [next-intl](https://next-intl-docs.vercel.app/) – Type-safe internationalization
- Support for multiple languages (EN/ES included)

### Additional Features
- [Swagger UI](https://swagger.io/tools/swagger-ui/) – API documentation
- [Web Push](https://web-push-libs.github.io/web-push/) – Push notifications
- ESLint & Prettier – Code quality and formatting

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (18.x or later)
- [pnpm](https://pnpm.io/) (recommended package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MAIN-12/next-boilerplate.git
   cd next-boilerplate
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.sample .env.local
   ```
   
   Edit `.env.local` and fill in your configuration values:
   - Auth0 credentials
   - Database connection strings
   - Supabase keys
   - VAPID keys for push notifications
   - Monday.com API key (for feedback system)

4. **Set up the database**
   ```bash
   pnpm dlx prisma generate
   pnpm dlx prisma db push
   ```

### Development

Start the development server with Turbopack:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (admin)/       # Admin routes (protected)
│   │   ├── (public)/      # Public routes
│   │   ├── api/           # API routes
│   │   └── ...            # Layout, providers, etc.
│   ├── components/        # Reusable UI components
│   │   ├── Auth/          # Authentication components
│   │   ├── chat/          # Chat components
│   │   ├── feedback/      # Feedback system
│   │   ├── SideBar/       # Navigation components
│   │   └── ui/            # Base UI components
│   ├── config/            # Configuration files
│   ├── i18n/              # Internationalization
│   ├── lib/               # Utility libraries
│   ├── styles/            # Global styles
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Helper functions
├── messages/              # Translation files
└── ...configuration files
```

## 🔗 API Routes

The application includes several API endpoints:

- `/api/auth/[auth0]` - Auth0 authentication handlers
- `/api/chat` - Chat functionality
- `/api/user` - User management
- `/api/swagger-spec` - API documentation

Access the API documentation at `/api-doc` (requires authentication).

## 🌐 Internationalization

The application supports multiple languages:
- English (en)
- Spanish (es)

Add new languages by:
1. Creating translation files in `/messages/`
2. Updating the locale configuration

## 🔐 Authentication

This boilerplate uses Auth0 for authentication with the following features:
- Login/logout functionality
- Protected routes via middleware
- User profile management
- Role-based access control

Protected routes are defined in `src/middleware.ts` and include:
- `/admin/*` - Admin dashboard
- `/chat/*` - Chat functionality
- `/api/chat/*` - Chat API
- `/api-doc/*` - API documentation

## 🗄️ Database

The application uses Prisma ORM with PostgreSQL:

```bash
# Generate Prisma client
pnpm dlx prisma generate

# Push schema changes to database
pnpm dlx prisma db push

# Open Prisma Studio
pnpm dlx prisma studio
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint with auto-fix

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

Ensure you set all required environment variables:
- Auth0 configuration
- Database connection strings
- API keys for external services

## 🔔 Push Notifications

The application includes web push notification support:

1. Generate VAPID keys
2. Set `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`
3. Use the `PushNotificationManager` component

## 📝 Feedback System

Integrated feedback collection using Monday.com:
- Bug reports
- Feature requests
- General feedback

Configure Monday.com integration in your environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📜 License  

This project is licensed under the [MIT License](LICENSE).