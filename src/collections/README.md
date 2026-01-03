# Collections Architecture

This directory contains all Payload CMS collections for the Optimist App. The collections are organized following Payload CMS best practices with dedicated folders for complex collections.

## Collection Overview

### Core Collections

#### **Users** (`users`)
Enhanced user management with profile fields:
- Authentication (email/password via Payload Auth)
- Profile fields: name, nickname, bio, location, website, picture
- Role-based access control (admin, user)
- Relations: circles, messages, comments, journal entries, mood logs

#### **Categories** (`categories`)
Categorization system for circles and messages:
- Visual styling: icon (emoji), gradient, background color
- Used to organize content thematically
- Public read access, authenticated write access

---

### Social Features

#### **Circles** (`circles`)
Community groups and discussion spaces:
- **Types**: Public, Private, Invite-Only
- **Embedded Members Array**: Optimized structure with user references and roles (owner, admin, moderator, member)
- **Customization**: icon, gradient, bgColor, rules, tags
- **Smart Access Control**: Users see public circles + circles they're members of
- Relations: owner, category, members (embedded)

#### **Messages** (`messages`)
Positive messages and posts within circles or globally:
- **Types**: positive, prayer, encouragement, gratitude, motivation, support, announcement
- **Embedded Reactions**: 👍 Like, ❤️ Love, 🙏 Pray, 🙌 Grateful, ✨ Inspire, 🤝 Support
- **Embedded Favorites**: Track users who favorited a message
- **Flags**: isAnonymous, isDaily (inspirational), isPinned
- Relations: author, circle (optional for global), category
- **Optimization**: Reactions stored as embedded array instead of separate collection for better performance

#### **Comments** (`comments`)
User comments on messages:
- **Embedded Reactions**: Same reaction types as messages
- Relations: author, message
- Nested conversation support

---

### Journaling & Wellness

#### **JournalEntries** (`journal-entries`)
Private journaling for personal reflection:
- **Privacy First**: Users can only read/write their own entries
- **Mood Tracking**: 10 mood options (very_happy, happy, neutral, sad, very_sad, anxious, peaceful, grateful, excited, reflective)
- **Gratitude & Wins**: Arrays for daily gratitude items and accomplishments
- **Tagging**: Categorization with custom tags
- Relations: author, reflectionPrompt (optional)

#### **JournalPrompts** (`journal-prompts`)
Writing prompts to inspire journaling:
- **Categories**: reflection, gratitude, goals, relationships, growth, mindfulness, creativity, challenges, success, spirituality
- **Difficulty Levels**: beginner, intermediate, advanced
- **Active Flag**: Control which prompts are shown to users
- Public read access for all users

#### **MoodLogs** (`mood-logs`)
Simple mood tracking over time:
- **Rating**: 1-5 scale
- **Optional Note**: Context about the mood
- **Privacy**: Users can only see their own logs
- Enables mood trends and analytics

---

### System Features

#### **Notifications** (`notifications`)
User notification system:
- **Types**: message_like, message_comment, circle_invitation, circle_join_request, daily_reminder, weekly_summary, system_announcement
- **Status Tracking**: pending, delivered, read, failed
- **Entity References**: Link to related messages, circles, comments, etc.
- **Timestamps**: createdAt, deliveredAt, readAt
- Relations: recipient, sender (optional)

---

## Key Optimizations

### 1. **Embedded Reactions** (vs. Separate Collections)
**Before (traditional ORM approach):**
```
MessageReact (separate table)
├── id
├── type
├── userId
├── messageId
└── createdAt
```

**After (Payload optimized):**
```
Messages
└── reactions (embedded array)
    ├── user (relationship)
    ├── type
    └── createdAt
```

**Benefits:**
- Fewer database queries (no JOIN needed)
- Faster read performance
- Simpler data model
- Easier to manage in Payload Admin UI

### 2. **Embedded Circle Members**
Instead of a separate CircleMember collection, members are stored as an array within the Circle document:
- Reduces complexity
- Better performance for member lists
- Easier to manage permissions

### 3. **Embedded Favorites**
Favorite tracking is embedded in the Message document as an array of user references.

---

## Access Control Patterns

### Public Read, Authenticated Write
- Categories
- Journal Prompts

### Owner-Only Access
- Journal Entries (ultra-private)
- Mood Logs

### Relationship-Based Access
- Circles (owner, members, or public based on type)
- Messages (based on circle membership)
- Comments (follows message access)

### Recipient-Based Access
- Notifications (users see only their notifications)

---

## Folder Structure

Collections with hooks or complex logic use folder structure:
```
Collections/
├── Circles/
│   ├── index.ts
│   └── hooks/
├── Messages/
│   ├── index.ts
│   └── hooks/
├── JournalEntries/
│   └── index.ts
├── (etc.)
```

Simple collections remain as single files:
- `Categories.ts`

---

## Reference Collections (Not Used in App)

The following collections are kept for reference but not used in the actual Optimist App:
- **Pages** - Blog/CMS pages from template
- **Posts** - Blog posts from template

These use the old Payload template structure and serve as examples of advanced Payload features.

---

## Future Enhancements

Potential additions to consider:
1. **CircleInvitations** - Dedicated collection for tracking pending circle invites
2. **Reports** - User-generated content reports for moderation
3. **Badges/Achievements** - Gamification elements
4. **Streaks** - Track daily journaling or mood logging streaks
5. **AI Insights** - Generated wellness insights based on journals/moods

---

## Collection Structure Reference

This Payload CMS structure provides optimized data relationships:

| Collection | Description |
|------------|----------|
| Users | Enhanced with profile fields |
| Circles | Support groups with embedded members |
| Categories | Content categorization |
| Messages | Community messages with embedded reactions |
| Comments | Message comments with embedded reactions |
| JournalEntries | Private journaling |
| JournalPrompts | Guided prompts |
| MoodLogs | Mood tracking |
| Notifications | User notifications |

---

Built with ❤️ for the Optimist App community.
