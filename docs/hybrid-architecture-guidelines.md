# Hybrid Architecture Guidelines: PostgreSQL + Redis
## Optimist App Data Management Strategy

### Overview
This document outlines the strategic approach for managing data across PostgreSQL and Redis in the Optimist app, focusing on business rules and architectural decisions to guide API development.

---

## 📊 Data Storage Strategy

### PostgreSQL: Source of Truth
**Purpose**: Persistent, reliable storage for core business data

**Business Rules**:
- All data that requires ACID compliance
- Data with complex relationships between entities
- Information that must survive system restarts
- Data requiring complex queries and analytics
- Audit trails and compliance data

**Entities Managed**:
- User profiles and authentication data
- Circles (communities) and memberships
- Messages and comments
- Reactions and favorites (persistent)
- Notifications (for historical tracking)
- Categories and metadata
- Mood logs and wellness data

### Redis: Performance & Real-time Layer
**Purpose**: High-speed caching, real-time features, and temporary data

**Business Rules**:
- Data that changes frequently (live counters, presence)
- Temporary data with natural expiration
- Real-time communication features
- Performance optimization through caching
- Rate limiting and anti-spam measures

---

## 🔄 Data Flow Patterns

### 1. Write-Through Pattern
**When to Use**: Critical data that needs immediate persistence
**Flow**: Write to PostgreSQL → Update Redis cache
**Examples**: User profile updates, new messages, circle memberships

### 2. Cache-Aside Pattern
**When to Use**: Frequently accessed read-heavy data
**Flow**: Check Redis → If miss, fetch from PostgreSQL → Update Redis
**Examples**: Popular messages, user profiles, circle statistics

### 3. Write-Behind Pattern
**When to Use**: High-frequency updates that can be batched
**Flow**: Write to Redis → Async batch write to PostgreSQL
**Examples**: Live reaction counts, user activity tracking

### 4. Redis-Only Pattern
**When to Use**: Ephemeral data that doesn't need persistence
**Flow**: Redis only with TTL
**Examples**: Session data, typing indicators, temporary locks

### 5. Auto-Save Pattern (Journaling Specific)
**When to Use**: Protecting user content from loss during creation
**Flow**: Write to Redis on every change → Periodic batch to PostgreSQL → Clear Redis on final save
**Examples**: Journal draft auto-save, mood entry drafts, prompt responses

---

## 📋 Detailed Entity Guidelines

### User Management
```
PostgreSQL:
- Core user profile (id, email, name, bio, etc.)
- Authentication tokens (refresh tokens)
- User preferences and settings
- Account status and verification data

Redis:
- Active session data (30min TTL)
- Recently viewed content (24h TTL)
- User presence status (5min TTL)
- Login attempt tracking (rate limiting)
```

### Circle & Community Features
```
PostgreSQL:
- Circle definitions and metadata
- Membership records and roles
- Circle rules and descriptions
- Historical member activity

Redis:
- Live member count and online status
- Recent activity feed (1h TTL)
- Circle discovery cache (15min TTL)
- Join request queues (temporary)
```

### Messaging System
```
PostgreSQL:
- Message content and metadata
- Comment threads
- Persistent reaction counts
- Message history and archives

Redis:
- Real-time message delivery queues
- Live typing indicators (30sec TTL)
- Draft messages (1h TTL)
- Recent message cache per circle (30min TTL)
```

### Notifications
```
PostgreSQL:
- Notification records for audit
- User notification preferences
- Historical notification data
- Delivery status tracking

Redis:
- Real-time notification queue
- Push notification tokens cache
- Notification rate limiting
- Unread count cache (sync with PG)
```

### Analytics & Engagement
```
PostgreSQL:
- Long-term engagement metrics
- User mood logs and trends
- Circle growth statistics
- Content popularity over time

Redis:
- Real-time engagement counters
- Trending topics (1h sliding window)
- Activity heat maps (24h TTL)
- Live user interaction tracking
```

### Journaling & Personal Wellness
```
PostgreSQL:
- Complete journal entries with content and metadata
- Journal prompts and categories
- User journaling streaks and statistics
- Mood correlations and historical data
- Private content encryption keys

Redis:
- Auto-save draft journal entries (1h TTL)
- Daily prompt cache (24h TTL)
- Journaling streak counters
- Recently used tags and mood patterns
- Writing session analytics (30min TTL)
```

---

## ⚡ Performance Optimization Rules

### Caching Strategy
1. **Cache Popular Content**: Messages with high engagement, trending circles
2. **User Context Caching**: Recently accessed circles, favorite categories
3. **Computed Results**: Circle member counts, engagement statistics
4. **Search Results**: Popular search queries and results (15min TTL)

### Real-time Features
1. **Presence Management**: User online status, active circles
2. **Live Updates**: New message notifications, circle activity
3. **Interactive Features**: Typing indicators, live reactions
4. **Push Notifications**: Real-time delivery queue management

---

## 🛡️ Data Consistency & Integrity

### Consistency Models
- **Strong Consistency**: PostgreSQL for all persistent data
- **Eventual Consistency**: Redis caches sync asynchronously
- **Session Consistency**: User sees their own changes immediately

### Conflict Resolution
1. **PostgreSQL as Authority**: Always defer to PostgreSQL data
2. **Cache Invalidation**: Aggressive invalidation on conflicts
3. **Graceful Degradation**: Continue serving from PostgreSQL if Redis fails

### Data Synchronization
- **Scheduled Sync Jobs**: Hourly cache refresh for critical data
- **Event-Driven Updates**: Real-time cache updates on data changes
- **Health Checks**: Regular consistency validation between stores

---

## 🚦 Rate Limiting & Anti-Spam

### Message Posting Limits
```
Redis Keys Pattern: rate_limit:messages:{userId}
- 10 messages per minute
- 100 messages per hour
- 500 messages per day
```

### Reaction Limits
```
Redis Keys Pattern: rate_limit:reactions:{userId}
- 50 reactions per minute
- No daily limit (encourage positivity)
```

### Circle Operations
```
Redis Keys Pattern: rate_limit:circles:{userId}
- 5 circle joins per hour
- 2 circle creations per day
```

### Journaling Operations
```
Redis Keys Pattern: rate_limit:journal:{userId}
- 10 journal entries per day (encourage regular writing)
- 50 auto-saves per hour (prevent spam)
- 20 mood log entries per day
```

---

## 🔧 API Development Guidelines

### Read Operations
1. **Check Redis first** for cached data
2. **Fallback to PostgreSQL** if cache miss
3. **Update cache** with PostgreSQL result
4. **Set appropriate TTL** based on data type

### Write Operations
1. **Validate input** and check rate limits (Redis)
2. **Write to PostgreSQL** for persistence
3. **Update relevant caches** in Redis
4. **Trigger real-time notifications** if needed

### Error Handling
1. **Redis failures**: Continue with PostgreSQL only
2. **PostgreSQL failures**: Return cached data with warnings
3. **Partial failures**: Log for investigation, serve best available data

### Monitoring Points
- Cache hit ratios per data type
- Response times for hybrid queries
- Data synchronization lag
- Rate limiting trigger frequency

---

## 📈 Scalability Considerations

### Horizontal Scaling
- **PostgreSQL**: Read replicas for analytics queries
- **Redis**: Clustering for high-availability caching
- **API Layer**: Stateless design for easy horizontal scaling

### Data Partitioning
- **Time-based**: Archive old messages and notifications
- **User-based**: Shard large datasets by user ID
- **Geographic**: Consider regional data centers for global users

### Background Jobs
- Cache warming jobs
- Data synchronization tasks
- Analytics computation
- Cleanup and archival processes

---

## 🎯 Implementation Priorities

### Phase 1: Core Functionality
1. User authentication and sessions (Redis)
2. Basic message CRUD (PostgreSQL + Redis cache)
3. Simple notifications (PostgreSQL)
4. Basic journaling functionality (PostgreSQL + Redis drafts)

### Phase 2: Real-time Features
1. Live messaging and reactions
2. Presence and typing indicators
3. Real-time notifications
4. Auto-save journaling and mood tracking

### Phase 3: Advanced Features
1. Analytics and trending content
2. Advanced caching strategies
3. Performance optimizations
4. AI-powered journal insights and prompt suggestions

### Phase 4: Scale Optimization
1. Advanced partitioning
2. Multi-region deployment
3. Advanced monitoring and alerting

---

## 🔍 Monitoring & Alerting

### Key Metrics
- **Cache Performance**: Hit rates, response times
- **Data Consistency**: Sync lag, conflict frequency  
- **User Experience**: API response times, error rates
- **Resource Usage**: Memory, CPU, storage growth

### Alert Thresholds
- Cache hit rate below 80%
- Data sync lag over 5 minutes
- API response time over 200ms
- Error rate above 1%

---

*This document serves as the foundation for API development decisions. Each API endpoint should reference these guidelines to determine the appropriate data management strategy.*