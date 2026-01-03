# 🌟 Optimist App - Positive Community & Personal Wellness Platform

A comprehensive mental wellness and positive community platform built with Next.js 15, featuring **community circles**, **positive messaging**, **personal journaling**, **mood tracking**, and **real-time engagement** to foster mental health and meaningful connections.

## ✨ Key Features

### 🏠 Community Engagement
- 🔗 **Circles** - Create and join supportive community groups (Public/Private/Invite-Only)
- 💬 **Positive Messaging** - Share encouragement, gratitude, prayers, and motivation
- ⚡ **Real-time Reactions** - Express support with 6 positive reaction types (LIKE, LOVE, PRAY, GRATEFUL, INSPIRE, SUPPORT)
- � **Comments & Discussions** - Build meaningful conversations around positive content

### 📝 Personal Wellness
- � **Private Journaling** - Secure, encrypted personal reflection space with auto-save
- 🎯 **Guided Prompts** - 10 categories of reflective writing prompts (Gratitude, Growth, Mindfulness, etc.)
- 😊 **Mood Tracking** - 10-point mood scale with correlation to journal entries
- 🏆 **Wellness Streaks** - Track journaling habits and celebrate milestones

### 🔔 Smart Notifications
- 📱 **Real-time Updates** - Live notifications for community engagement
- ⏰ **Wellness Reminders** - Gentle prompts for journaling and mood check-ins
- � **Milestone Celebrations** - Achievement notifications for positive reinforcement

### 🛡️ Safety & Moderation
- � **Community Moderation** - Role-based content management (Owner/Admin/Moderator/Member)
- 🚫 **Content Filtering** - Automated and human moderation for positive environment
- 🔒 **Privacy Controls** - Granular privacy settings for personal content

## 🛠️ Technology Stack

### Core Framework
- [Next.js 15](https://nextjs.org/docs/getting-started) – React framework with App Router and Turbopack
- [TypeScript](https://www.typescriptlang.org/) – Type-safe development
- [React 18](https://reactjs.org/) – Latest React features with Suspense

### UI & Styling
- [HeroUI v2](https://heroui.com/) – Modern React UI components optimized for wellness apps
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework with custom theme
- [Framer Motion](https://www.framer.com/motion/) – Smooth animations for positive UX
- [Material-UI Icons](https://mui.com/material-ui/material-icons/) & [Lucide React](https://lucide.dev/) – Comprehensive icon libraries

### Authentication & Security
- [Auth0](https://auth0.com/) – Enterprise-grade authentication with social logins
- JWT-based session management
- Protected routes with middleware
- Privacy-first user data handling

### Database Architecture (Hybrid)
- [Payload CMS](https://payloadcms.com/) – Headless CMS with type-safe database operations
- [PostgreSQL](https://postgresql.org/) – Primary database for persistent data
- [Redis](https://redis.io/) – High-performance caching and real-time features
- Hybrid data strategy for optimal performance

### Real-time Features
- WebSocket integration for live messaging
- Redis-powered real-time notifications
- Live presence indicators
- Auto-save functionality for journaling

### Internationalization
- [next-intl](https://next-intl-docs.vercel.app/) – Type-safe internationalization
- Multi-language support for global wellness community
- RTL language support

### Developer Experience
- [Swagger UI](https://swagger.io/tools/swagger-ui/) – Comprehensive API documentation
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) – Code quality and formatting
- [Husky](https://typicode.github.io/husky/) – Git hooks for quality assurance
- TypeScript strict mode for type safety

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (18.x or later)
- [pnpm](https://pnpm.io/) (recommended package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MAIN-12/optimistapp-app.git
   cd optimistapp-app
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
   - **Auth0 credentials** (AUTH0_SECRET, AUTH0_BASE_URL, AUTH0_ISSUER_BASE_URL, etc.)
   - **PostgreSQL connection** (DATABASE_URL)
   - **Redis connection** (REDIS_URL) for caching and real-time features
   - **VAPID keys** for push notifications (wellness reminders)
   - **Encryption keys** for secure journaling (JOURNAL_ENCRYPTION_KEY)

4. **Set up the database**
   ```bash
   # Run Payload migrations
   pnpm payload migrate
   ```

5. **Set up Redis (for real-time features)**
   ```bash
   # Local Redis installation (macOS)
   brew install redis
   redis-server
   
   # Or use Redis Cloud/Docker for development
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
├── docs/                   # Project documentation
│   ├── business-rules-and-functionality.md
│   └── hybrid-architecture-guidelines.md
├── public/                 # Static assets and PWA files
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (admin)/       # Admin routes (circle management)
│   │   ├── (public)/      # Public routes (circles, messages, journaling)
│   │   │   ├── circles/   # Circle discovery and management
│   │   │   ├── messages/  # Message feeds and interactions
│   │   │   ├── journal/   # Personal journaling interface
│   │   │   └── profile/   # User profile and settings
│   │   ├── api/           # API routes
│   │   │   ├── circles/   # Circle management APIs
│   │   │   ├── messages/  # Message CRUD and reactions
│   │   │   ├── journal/   # Journaling and mood tracking
│   │   │   └── notifications/ # Real-time notification system
│   │   └── ...            # Layout, providers, middleware
│   ├── components/        # Reusable UI components
│   │   ├── Auth/          # Authentication components
│   │   ├── circles/       # Circle-related components
│   │   ├── message/       # Message display and interaction
│   │   ├── journal/       # Journaling interface components
│   │   ├── SideBar/       # Navigation with wellness focus
│   │   └── ui/            # Base UI components
│   ├── config/            # Configuration files
│   ├── i18n/              # Internationalization
│   ├── lib/               # Utility libraries
│   │   ├── redis.ts       # Cache client
│   │   └── auth.ts        # Auth configuration
│   ├── styles/            # Global styles and themes
│   ├── types/             # TypeScript definitions
│   └── utils/             # Helper functions
├── messages/              # Translation files (EN/ES)
└── ...configuration files
```

## 🔗 API Routes

The application includes comprehensive API endpoints following RESTful principles:

### Authentication & Users
- `/api/auth/[auth0]` - Auth0 authentication handlers
- `/api/users` - User profile management
- `/api/users/[id]/circles` - User's joined circles
- `/api/users/[id]/mood` - Mood tracking endpoints

### Community Features
- `/api/circles` - Circle discovery and management
- `/api/circles/[id]/members` - Circle membership management
- `/api/circles/[id]/messages` - Circle message feeds
- `/api/messages` - Global positive message feed
- `/api/messages/[id]/reactions` - Message reaction system
- `/api/comments` - Comment system for messages

### Personal Wellness
- `/api/journal/entries` - Private journaling system
- `/api/journal/prompts` - Guided prompt delivery
- `/api/mood` - Mood tracking and analytics
- `/api/wellness/streaks` - Habit tracking

### Real-time & Notifications
- `/api/notifications` - Notification management
- `/api/websocket` - Real-time communication
- `/api/push` - Push notification registration

### System
- `/api/swagger-spec` - Comprehensive API documentation
- `/api/health` - System health checks

Access the interactive API documentation at `/api-doc` (requires authentication).

## 🌐 Internationalization

The application supports multiple languages for global wellness community:
- **English (en)** - Primary language
- **Spanish (es)** - Full Spanish localization
- **Expandable** - Ready for additional languages

### Wellness-Focused Localization
- Culturally sensitive wellness terminology
- Region-appropriate mental health resources
- Localized journaling prompts and categories
- Time zone aware features (mood tracking, reminders)

Add new languages by:
1. Creating translation files in `/messages/[locale].json`
2. Adding wellness-specific terminology
3. Updating locale configuration in `i18n/request.ts`

## 🔐 Authentication & Privacy

Optimist App uses Auth0 for secure, privacy-focused authentication:

### Authentication Features
- **Social & Email Login** - Multiple authentication options
- **Secure Sessions** - JWT-based with automatic refresh
- **Privacy Controls** - Granular user data visibility settings
- **Safe Onboarding** - Guided setup for wellness features

### Privacy & Security
- **Journal Encryption** - End-to-end encryption for personal content
- **Anonymous Posting** - Option to share messages anonymously
- **Data Minimization** - Collect only essential wellness data
- **GDPR Compliance** - Full data export and deletion rights

### Protected Routes
All wellness features require authentication for safety:
- `/circles/*` - Community circle access
- `/messages/*` - Positive messaging features
- `/journal/*` - Private journaling interface
- `/profile/*` - Personal wellness dashboard
- `/admin/*` - Circle moderation tools
- `/api/*` - All API endpoints (except health checks)

## 🗄️ Database Architecture

Optimist App uses a **hybrid database approach** for optimal performance and user experience:

### PostgreSQL (Primary Storage)
- **User profiles** and authentication data
- **Circles** and community membership
- **Messages** and persistent content
- **Journal entries** with encryption
- **Mood tracking** and wellness analytics
- **Notifications** for audit and history

### Redis (Performance Layer)
- **Real-time features** (live reactions, presence)
- **Caching** frequently accessed data
- **Session management** and temporary data
- **Rate limiting** for spam prevention
- **Draft auto-save** for journaling

### Database Commands
```bash
# Run Payload migrations
pnpm payload migrate

# Generate Payload types
pnpm payload generate:types

# Open Payload admin panel for data management
# Available at /admin after starting the dev server
```

### Schema Highlights
- **13 comprehensive models** for wellness features
- **UUID primary keys** for security and scalability
- **Soft deletes** for data recovery and audit trails
- **Optimized indexes** for real-time queries
- **Privacy-first design** with encryption support

## 🔧 Available Scripts

### Development
- `pnpm dev` - Start development server with Turbopack and Redis
- `pnpm dev:db` - Start with database seeding for wellness data
- `pnpm dev:clean` - Clean development with fresh Redis cache

### Production
- `pnpm build` - Build optimized production bundle
- `pnpm start` - Start production server
- `pnpm preview` - Preview production build locally

### Database Management
- `pnpm payload migrate` - Run Payload migrations
- `pnpm payload generate:types` - Generate Payload types

### Code Quality
- `pnpm lint` - Run ESLint with wellness-focused rules
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm type-check` - TypeScript type checking
- `pnpm test` - Run test suite (unit + integration)

### Deployment
- `pnpm build:analyze` - Analyze bundle size
- `pnpm build:docker` - Build Docker container

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms (Railway, DigitalOcean, AWS)

Ensure you set all required environment variables:
- **Auth0 configuration** - Authentication and user management
- **PostgreSQL & Redis URLs** - Database and caching connections  
- **Encryption keys** - Journal content security
- **VAPID keys** - Push notification system
- **Monitoring keys** - Performance and error tracking

### Performance Considerations
- Enable Redis for optimal real-time features
- Configure CDN for static assets
- Set up database connection pooling
- Enable compression and caching headers

## 🔔 Wellness-Focused Notifications

Smart notification system designed to support mental wellness without overwhelming users:

### Notification Types
- **🎉 Positive Reinforcement** - Celebrate streaks and achievements
- **💭 Gentle Reminders** - Optional journaling and mood check-ins
- **🤗 Community Support** - New reactions and supportive comments
- **📅 Wellness Milestones** - Weekly reflections and progress
- **⚡ Real-time Engagement** - Live circle activity (if enabled)

### User Control & Wellness
- **Smart Scheduling** - Respect quiet hours and user preferences
- **Frequency Limits** - Prevent notification overwhelm
- **Positive Focus** - Only uplifting and supportive notifications
- **Easy Opt-out** - Granular control over notification types

### Setup
```bash
# Generate VAPID keys for push notifications
npx web-push generate-vapid-keys

# Set environment variables
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

### Implementation
- Use `PushNotificationManager` component for registration
- Wellness-focused notification scheduling
- Offline notification queuing with Redis

## � Wellness Analytics & Insights

Comprehensive analytics focused on user wellness and positive community impact:

### Personal Wellness Metrics
- **📈 Mood Trends** - Track emotional patterns over time
- **📝 Journaling Insights** - Writing frequency and reflection patterns  
- **🎯 Goal Progress** - Achievement tracking and milestone celebration
- **🔗 Social Impact** - Positive interactions given and received

### Community Health Metrics
- **💝 Positivity Metrics** - Measure supportive interactions
- **🌱 Growth Tracking** - Circle engagement and member retention
- **🛡️ Safety Monitoring** - Content moderation effectiveness
- **🌍 Global Impact** - Aggregate wellness improvements

### Privacy-First Analytics
- **Anonymized Data** - Personal insights without privacy compromise
- **Opt-in Sharing** - Users choose what to share for research
- **Transparent Reporting** - Clear data usage policies
- **User Control** - Export or delete analytics data anytime

### Research Partnerships
- **Academic Collaboration** - Mental health research (anonymized)
- **Wellness Organizations** - Community impact studies
- **Open Source Insights** - Contribute to wellness tech research

## 🤝 Contributing to Mental Wellness

We welcome contributions that enhance the positive impact of our platform:

### Ways to Contribute
1. **🐛 Bug Fixes** - Help maintain a stable wellness platform
2. **✨ Feature Development** - Add new wellness-focused features
3. **🌍 Localization** - Translate for global mental health access
4. **📚 Documentation** - Improve setup and usage guides
5. **🧪 Testing** - Ensure reliability for users' mental health tools
6. **🎨 Design** - Enhance UI/UX for better wellness experience

### Contribution Guidelines
1. Fork the repository and create a feature branch
2. Follow our wellness-focused coding standards
3. Add tests for new functionality
4. Update documentation for wellness features
5. Ensure accessibility compliance
6. Submit pull request with detailed description

### Code of Conduct
- **Positive Communication** - Maintain supportive, encouraging interactions
- **Inclusive Environment** - Welcome contributors from all backgrounds
- **Mental Health Awareness** - Consider wellness impact in all decisions
- **Privacy Respect** - Prioritize user data protection and privacy

## 📖 Documentation

- **[Business Rules & Functionality](docs/business-rules-and-functionality.md)** - Complete feature specification
- **[Hybrid Architecture Guidelines](docs/hybrid-architecture-guidelines.md)** - Technical implementation guide
- **[API Documentation](https://app.example.com/api-doc)** - Interactive API reference
- **[Deployment Guide](docs/deployment.md)** - Production setup instructions

## 🌟 Mission Statement

**Optimist App exists to create a safer, more supportive digital space where individuals can:**
- Build meaningful connections through positive messaging
- Develop sustainable mental wellness habits through guided journaling
- Find community support during challenging times
- Celebrate personal growth and achievements
- Access mental health resources and professional support when needed

*Together, we're building a platform that prioritizes mental wellness, genuine human connection, and positive social impact.*

## 📜 License  

This project is licensed under the [MIT License](LICENSE).

---

**Built with ❤️ for mental wellness and positive community impact.**