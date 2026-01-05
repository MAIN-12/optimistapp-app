'use client';

import { Heart, Star, Share2, Trash2, MoreHorizontal } from 'lucide-react';
import { Avatar, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react';
import { useAuth } from '@/providers/AuthProvider';
import { Message, User } from '@/payload-types';
import { useMessages } from './MessageContext';

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

export default function Messages() {
  const { user } = useAuth();
  const { messages, isLoading, error, refreshMessages, deleteMessage, updateReaction, toggleFavorite } = useMessages();

  const handleDelete = async (messageId: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    const success = await deleteMessage(messageId);
    if (!success) {
      alert('Failed to delete message');
    }
  };

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

  const isAuthor = (authorId: number) => user?.id === authorId;

  const hasUserReacted = (message: Message, type: string) => {
    if (!user) return false;
    return message.reactions?.some(
      (r) => (typeof r.user === 'object' ? r.user.id : r.user) === user.id && r.type === type
    );
  };

  const hasUserFavorited = (message: Message) => {
    if (!user) return false;
    return message.favorites?.some(
      (f) => (typeof f.user === 'object' ? f.user.id : f.user) === user.id
    );
  };

  const getReactionCount = (message: Message, type: string) => {
    return message.reactions?.filter((r) => r.type === type).length || 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button color="primary" onPress={refreshMessages}>
          Try Again
        </Button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No messages yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const authorInfo = getAuthorInfo(message.author);
        const typeInfo = messageTypeInfo[message.type] || { icon: '✨', label: 'Positive', color: 'bg-yellow-100 text-yellow-700' };
        const userIsAuthor = isAuthor(authorInfo.id);

        return (
          <div
            key={message.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              {/* Avatar */}
              <Avatar
                src={message.isAnonymous ? undefined : authorInfo.picture}
                name={message.isAnonymous ? '?' : authorInfo.initials}
                className="w-12 h-12 flex-shrink-0"
                showFallback
              />

              {/* Message Content */}
              <div className="flex-1 min-w-0">
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTimestamp(message.createdAt)}
                    </span>

                    {/* Author Actions Menu */}
                    {userIsAuthor && (
                      <Dropdown>
                        <DropdownTrigger>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
                          </button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Message actions">
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            startContent={<Trash2 className="w-4 h-4" />}
                            onPress={() => handleDelete(message.id)}
                          >
                            Delete
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    )}
                  </div>
                </div>

                <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>

                {/* Interaction Buttons */}
                <div className="flex items-center gap-4">
                  {/* Love Reaction */}
                  <button
                    onClick={() => updateReaction(message.id, 'love')}
                    className="flex items-center gap-1.5 transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        hasUserReacted(message, 'love')
                          ? 'text-red-500 fill-current'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    />
                    {getReactionCount(message, 'love') > 0 && (
                      <span className={`text-sm ${hasUserReacted(message, 'love') ? 'text-red-500' : 'text-gray-400'}`}>
                        {getReactionCount(message, 'love')}
                      </span>
                    )}
                  </button>

                  {/* Favorite */}
                  <button
                    onClick={() => toggleFavorite(message.id)}
                    className="flex items-center gap-1.5 transition-colors"
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        hasUserFavorited(message)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-400 hover:text-yellow-500'
                      }`}
                    />
                    {(message.favorites?.length || 0) > 0 && (
                      <span className={`text-sm ${hasUserFavorited(message) ? 'text-yellow-500' : 'text-gray-400'}`}>
                        {message.favorites?.length}
                      </span>
                    )}
                  </button>

                  {/* Share */}
                  <button className="flex items-center gap-1.5 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}