# Optimist App: Business Rules & Functionality Specification

## 🌟 Application Overview

**Vision**: Create a positive, supportive digital community where users can share encouragement, build meaningful connections, and maintain personal wellness through journaling and mood tracking.

**Mission**: Foster mental wellness and positive social interactions through structured community engagement and personal reflection tools.

---

## 👥 User Management & Authentication

### User Registration & Profile
**Business Rules:**
- Users authenticate via Auth0 integration (OAuth/Social Login)
- Each user has a unique `sub` (Auth0 ID) and `email`
- Profile completion is optional but encouraged
- Users can set display name, bio, location, and website
- Profile pictures are managed through Auth0 or uploaded separately

**Privacy & Security:**
- Email addresses are private by default
- Users control visibility of profile information
- All user-generated content is tied to authenticated accounts
- Anonymous posting is allowed in messages with `isAnonymous` flag

### Account Lifecycle
- **Active**: Normal app usage with full features
- **Suspended**: Temporary restriction due to policy violations
- **Deleted**: Soft delete with data retention for legal compliance
- **Data Export**: Users can request full data export before deletion

---

## 🔄 Circles (Community Groups)

### Circle Types & Access Control
**Public Circles:**
- Open to all users
- Visible in discovery feeds
- Anyone can join immediately
- Searchable by name and tags

**Private Circles:**
- Invite-only access
- Hidden from public discovery
- Owner/Admin approval required for membership
- Enhanced privacy controls

**Invite-Only Circles:**
- Visible to users with invite links
- Moderated joining process
- Semi-private visibility

### Circle Management
**Ownership & Roles:**
- **Owner**: Full administrative control, can transfer ownership
- **Admin**: Moderate content, manage members, cannot delete circle
- **Moderator**: Remove inappropriate content, temporary user restrictions
- **Member**: Standard participation rights

**Circle Settings:**
- Custom rules (max 10 rules per circle)
- Visual customization (icon, gradient, background color)
- Category association for discovery
- Tagging system for improved searchability

### Membership Rules
- Users can join unlimited public circles
- Maximum 50 circle memberships per user (prevent spam)
- Circle owners can set member limits (default: unlimited)
- Leaving a circle removes all user-generated content visibility
- Circle deletion requires 7-day waiting period for owner confirmation

---

## 💬 Messaging System

### Message Types & Categories
**Message Types:**
- **POSITIVE**: General uplifting content
- **PRAYER**: Spiritual support and prayer requests
- **ENCOURAGEMENT**: Motivational and supportive messages
- **GRATITUDE**: Expressions of thankfulness
- **MOTIVATION**: Goal-oriented and inspirational content
- **SUPPORT**: Help-seeking and assistance offers
- **ANNOUNCEMENT**: Important circle updates (Admin/Owner only)

**Message Categories:**
- Pre-defined categories with emoji icons (Motivation ⭐, Gratitude 🙏, etc.)
- Optional categorization to improve content discovery
- Category-based filtering in feeds

### Content Guidelines
**Message Rules:**
- Maximum 2,000 characters per message
- Rich text formatting supported (bold, italic, links)
- Image attachments allowed (max 5MB per image)
- Audio messages supported (max 2 minutes)
- No explicit content, harassment, or spam

**Moderation:**
- Community-driven reporting system
- Automatic content filtering for inappropriate material
- Moderator review queue for flagged content
- Progressive enforcement (warning → temporary restriction → ban)

### Message Interactions
**Reactions:**
- 6 reaction types: LIKE, LOVE, PRAY, GRATEFUL, INSPIRE, SUPPORT
- One reaction per user per message
- Reaction counts visible to all users
- Real-time reaction updates

**Comments:**
- Nested conversation threads
- Same content rules as messages apply
- Comment reactions with same system as messages
- Maximum 500 characters per comment

**Favorites:**
- Personal bookmark system
- Private to each user
- Unlimited favorites allowed
- Organized by date added

### Daily Messages
**Special Features:**
- Admin-curated daily inspirational messages
- Marked with `isDaily: true` flag
- Featured prominently in app interface
- Higher visibility in feeds
- Push notification delivery (if user opted in)

---

## 📝 Journaling & Personal Wellness

### Journal Entry System
**Entry Structure:**
- Optional title (max 200 characters)
- Main content (unlimited length, recommended 50-2000 words)
- Privacy setting (private by default)
- Mood association from predefined mood scale
- Tag system for personal organization
- Gratitude lists and daily wins tracking

**Privacy & Security:**
- All journal entries are private by default
- Users can choose to share specific entries as messages
- End-to-end encryption for sensitive content
- Local auto-save every 30 seconds
- Cloud backup with user consent

### Guided Prompts
**Prompt Categories:**
- **REFLECTION**: Self-awareness and introspection
- **GRATITUDE**: Thankfulness and appreciation exercises
- **GOALS**: Future planning and aspiration setting
- **RELATIONSHIPS**: Connection and social reflection
- **GROWTH**: Personal development focus
- **MINDFULNESS**: Present-moment awareness
- **CREATIVITY**: Artistic and innovative thinking
- **CHALLENGES**: Problem-solving and resilience
- **SUCCESS**: Achievement recognition and celebration
- **SPIRITUALITY**: Faith and meaning exploration

**Prompt Delivery:**
- Daily prompt suggestions based on user preferences
- Difficulty progression (Beginner → Intermediate → Advanced)
- Seasonal and themed prompt collections
- User can skip or request different prompts

### Mood Tracking
**Mood System:**
- 10-point mood scale with descriptive labels
- Optional correlation with journal entries
- Daily mood logging encouragement
- Weekly/monthly mood trend visualization
- Integration with journal content for insights

---

## 🔔 Notification System

### Notification Types
**Social Notifications:**
- New reactions on user's messages/comments
- Replies to user's comments
- New messages in joined circles
- Circle invitation received

**Engagement Notifications:**
- Daily journaling reminders
- Weekly wellness summary
- Circle activity highlights
- Milestone celebrations (streak achievements)

**System Notifications:**
- Account security alerts
- Feature announcements
- Maintenance notifications
- Policy updates

### Delivery Preferences
**Channel Options:**
- In-app notifications (always enabled)
- Push notifications (user configurable)
- Email summaries (daily/weekly/off)
- SMS alerts (emergency only)

**Timing Controls:**
- Quiet hours settings (no notifications)
- Frequency limits (max notifications per hour)
- Priority classification (high/medium/low)
- Instant vs. batched delivery options

### Notification Lifecycle
**Status Tracking:**
- PENDING: Created but not yet delivered
- DELIVERED: Successfully sent to user device
- READ: User has viewed the notification
- FAILED: Delivery attempt unsuccessful

---

## 📊 Analytics & Engagement

### User Engagement Metrics
**Community Participation:**
- Messages posted per circle
- Reactions given/received ratios
- Comment engagement levels
- Circle join/leave patterns

**Personal Wellness Tracking:**
- Journaling streak counters
- Mood trend analysis
- Goal achievement tracking
- Reflection pattern insights

**Content Performance:**
- Most engaging message types
- Popular reaction patterns
- Circle growth metrics
- Category preference analysis

### Gamification Elements
**Achievement System:**
- Posting streaks (daily/weekly/monthly)
- Kindness badges (reactions given)
- Community builder (circle engagement)
- Wellness warrior (journaling consistency)

**Progress Tracking:**
- Personal dashboards with key metrics
- Milestone celebrations and notifications
- Social sharing of achievements (optional)
- Leaderboards for friendly competition

---

## 🛡️ Safety & Moderation

### Content Moderation
**Automated Systems:**
- Profanity filtering with severity levels
- Spam detection algorithms
- Image content analysis
- Link safety verification

**Human Moderation:**
- Community reporting system
- Moderator review queues
- Appeal process for content decisions
- Escalation procedures for serious violations

### User Safety
**Harassment Prevention:**
- Block and report functionality
- Pattern detection for problematic behavior
- Temporary cooling-off periods
- Safe space maintenance protocols

**Crisis Intervention:**
- Mental health resource integration
- Crisis text line partnerships
- Professional referral system
- Emergency contact protocols

---

## 💰 Business Model & Monetization

### Freemium Structure
**Free Tier:**
- Unlimited circle participation
- Basic journaling features
- Standard notification limits
- Community-generated content access

**Premium Tier:**
- Advanced journaling analytics
- Priority customer support
- Enhanced privacy controls
- Custom circle themes and branding
- Increased storage limits

### Revenue Streams
- Premium subscriptions ($9.99/month)
- Corporate wellness partnerships
- Sponsored positive content (ethically curated)
- White-label licensing for organizations

---

## 🔧 Technical Requirements

### Performance Standards
- Sub-200ms response times for core features
- 99.9% uptime availability
- Real-time updates within 1 second
- Mobile-first responsive design

### Scalability Considerations
- Horizontal scaling for user growth
- Geographic content distribution
- Progressive web app capabilities
- Offline functionality for journaling

### Integration Requirements
- Auth0 for authentication
- Push notification services
- Image/file storage solutions
- Analytics and monitoring tools

---

## 📱 User Experience Principles

### Design Philosophy
**Positivity-First Design:**
- Warm, encouraging color schemes
- Uplifting micro-interactions
- Progress celebration animations
- Stress-reducing interface elements

**Accessibility Standards:**
- WCAG 2.1 AA compliance
- Screen reader optimization
- Keyboard navigation support
- High contrast mode availability

### Mobile Experience
**Core Features:**
- Native app performance through PWA
- Offline journaling capabilities
- Voice-to-text for journal entries
- Photo integration for visual journaling

---

## 🎯 Success Metrics

### User Engagement KPIs
- Daily/Monthly Active Users (DAU/MAU)
- Average session duration
- Journal entry frequency
- Circle participation rates
- Message reaction rates

### Wellness Impact Metrics
- User-reported mood improvements
- Journaling streak achievements
- Community support interaction levels
- Crisis intervention success rates

### Business Performance
- User retention rates (7-day, 30-day, 90-day)
- Premium conversion rates
- Customer satisfaction scores
- Net Promoter Score (NPS)

---

## 🚀 Roadmap & Future Features

### Phase 1: Core Platform (Months 1-3)
- User authentication and profiles
- Basic circle functionality
- Message posting and reactions
- Simple journaling system

### Phase 2: Enhanced Engagement (Months 4-6)
- Advanced notification system
- Guided prompting system
- Mood tracking integration
- Mobile app optimization

### Phase 3: AI & Intelligence (Months 7-12)
- Personalized content recommendations
- AI-powered journal insights
- Predictive wellness analytics
- Smart prompt generation

### Phase 4: Scale & Growth (Year 2)
- Enterprise partnerships
- International expansion
- Advanced moderation tools
- Comprehensive wellness ecosystem

---

*This document serves as the authoritative source for business logic implementation and feature development decisions.*