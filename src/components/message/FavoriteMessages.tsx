'use client';

import { Heart, Star, Share2, Trash2, MoreHorizontal } from 'lucide-react';
import { Avatar, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { useAuth } from '@/providers/AuthProvider';
import { Message, User } from '@/payload-types';

// Map message types to display info
const messageTypeInfo: Record<string, { icon: string; label: string; color: string }> = {
  positive: { icon: '✨', label: 'Positive', color: 'bg-yellow-100 text-yellow-700' },
  prayer: { icon: '🙏', label: 'Prayer', color: 'bg-purple-100 text-purple-700' },
  encouragement: { icon: '💪', label: 'Encouragement', color: 'bg-blue-100 text-blue-700' },
  gratitude: { icon: '🙌', label: 'Gratitude', color: 'bg-green-100 text-green-700' },
  motivation: { icon: '🔥', label: 'Motivation', color: 'bg-orange-100 text-orange-700' },
  support: { icon: '🤝', label: 'Support', color: 'bg-pink-100 text-pink-700' },
  announcement: { icon: '📢', label: 'Announcement', color: 'bg-red-100 text-red-700' },
};

interface FavoriteMessagesProps {
  initialMessages?: Message[];
}

export default function FavoriteMessages({ initialMessages = [] }: FavoriteMessagesProps) {
  const { user } = useAuth();

  // Filter to only show messages favorited by current user
  const favoriteMessages = initialMessages.filter((message) =>
    message.favorites?.some(
      (f) => (typeof f.user === 'object' ? f.user.id : f.user) === user?.id
    )
  );

  // Helper functions
  const getAuthorInfo = (author: number | User) => {
    if (typeof author === 'object') {
      return {
        name: author.name || 'Anonymous',
        initials: `${author.name?.charAt(0) || ''}${author.lastName?.charAt(0) || ''}`.toUpperCase() || '?',
        picture:
          typeof author.profilePicture === 'object'
            ? author.profilePicture?.url ?? undefined
            : typeof author.picture === 'object'
            ? author.picture?.url ?? undefined
            : undefined,
        id: author.id,
      };
    }
    return { name: 'Anonymous', initials: '?', picture: undefined, id: author };
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getReactionCount = (message: Message, type: string) => {
    return message.reactions?.filter((r) => r.type === type).length || 0;
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <Star className="w-16 h-16 text-gray-300 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Sign in to see your favorites</h2>
        <p className="text-gray-500">Please sign in to view your favorite messages.</p>
      </div>
    );
  }

  if (favoriteMessages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <Star className="w-16 h-16 text-gray-300 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No Favorite Messages Yet</h2>
        <p className="text-gray-500 dark:text-gray-400">Start favoriting messages to see them here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Star className="w-8 h-8 text-yellow-500 fill-current" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Your Favorites</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {favoriteMessages.length} message{favoriteMessages.length !== 1 ? 's' : ''} you've saved for inspiration
        </p>
      </div>

      {/* Favorite Messages List */}
      <div className="space-y-4">
        {favoriteMessages.map((message) => {
          const authorInfo = getAuthorInfo(message.author);
          const typeInfo = messageTypeInfo[message.type] || { icon: '✨', label: 'Positive', color: 'bg-yellow-100 text-yellow-700' };

          return (
            <div
              key={message.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-yellow-100 dark:border-yellow-900/30 shadow-sm hover:shadow-md transition-shadow relative"
            >
              {/* Favorite indicator */}
              <div className="absolute top-4 right-4">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              </div>

              <div className="flex gap-4">
                {/* Avatar */}
                <Avatar
                  src={message.isAnonymous ? undefined : authorInfo.picture}
                  name={message.isAnonymous ? '?' : authorInfo.initials}
                  className="w-12 h-12 flex-shrink-0"
                  showFallback
                />

                {/* Message Content */}
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {message.isAnonymous ? 'Anonymous' : authorInfo.name}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}
                      >
                        <span>{typeInfo.icon}</span>
                        <span>{typeInfo.label}</span>
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTimestamp(message.createdAt)}
                    </span>
                  </div>

                  <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {/* Interaction Buttons */}
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-400">
                      <Heart className="w-5 h-5" />
                      {getReactionCount(message, 'love') > 0 && (
                        <span className="text-sm">{getReactionCount(message, 'love')}</span>
                      )}
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-500 rounded-lg">
                      <Star className="w-5 h-5 fill-current" />
                      {(message.favorites?.length || 0) > 0 && (
                        <span className="text-sm">{message.favorites?.length}</span>
                      )}
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-blue-500">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-400">
                      <span className="text-lg">🙏</span>
                      {getReactionCount(message, 'pray') > 0 && (
                        <span className="text-sm">{getReactionCount(message, 'pray')}</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="text-center pt-8 border-t border-gray-100 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tap the ⭐ icon on any message to add it to your favorites
        </p>
      </div>
    </div>
  );
}