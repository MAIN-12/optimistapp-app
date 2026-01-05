'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';
import { Select, SelectItem, Button, Avatar } from '@heroui/react';
import { useAuth } from '@/providers/AuthProvider';
import { useMessages } from './MessageContext';

const messageTypes = [
  { key: 'positive', label: 'Positive', icon: '✨' },
  { key: 'prayer', label: 'Prayer', icon: '🙏' },
  { key: 'encouragement', label: 'Encouragement', icon: '💪' },
  { key: 'gratitude', label: 'Gratitude', icon: '🙌' },
  { key: 'motivation', label: 'Motivation', icon: '🔥' },
  { key: 'support', label: 'Support', icon: '🤝' },
];

export default function NewMessage() {
  const { user } = useAuth();
  const { createMessage } = useMessages();
  const [content, setContent] = useState('');
  const [type, setType] = useState<string>('positive');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await createMessage(content, type);
      if (success) {
        setContent('');
        setType('positive');
      } else {
        setError('Failed to create message');
      }
    } catch (err) {
      setError('An error occurred while posting your message');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return '?';
    const name = user.name || '';
    const lastName = user.lastName || '';
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.email?.charAt(0).toUpperCase() || '?';
  };

  // Get profile picture URL
  const getProfilePicture = () => {
    if (!user) return undefined;
    if (typeof user.profilePicture === 'object' && user.profilePicture?.url) {
      return user.profilePicture.url;
    }
    if (typeof user.picture === 'object' && user.picture?.url) {
      return user.picture.url;
    }
    return undefined;
  };

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
        <div className="flex flex-col items-center gap-3">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Please sign in to share your thoughts
          </p>
          <Button
            as={Link}
            href="/login"
            color="primary"
            variant="flat"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
      <div className="flex gap-3">
        {/* User Avatar */}
        <Avatar
          src={getProfilePicture()}
          name={getUserInitials()}
          className="w-10 h-10 flex-shrink-0"
          showFallback
        />

        {/* Input Area */}
        <div className="flex-1 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${user.name || 'friend'}?`}
            className="w-full min-h-[80px] p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border-0 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 placeholder-gray-400"
            maxLength={2000}
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* Actions Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Message Type Selector */}
              <Select
                selectedKeys={[type]}
                onSelectionChange={(keys) => setType(Array.from(keys)[0] as string)}
                className="w-40"
                size="sm"
                variant="flat"
                aria-label="Message type"
              >
                {messageTypes.map((option) => (
                  <SelectItem key={option.key} startContent={<span>{option.icon}</span>}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              color="primary"
              size="sm"
              isLoading={isSubmitting}
              isDisabled={!content.trim()}
              onPress={handleSubmit}
              endContent={!isSubmitting && <Send className="w-4 h-4" />}
            >
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
