'use client';

import { Calendar, Lock, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { JournalEntry as JournalEntryType } from '@/payload-types';

interface JournalEntryListProps {
  entries: JournalEntryType[];
}

const moodEmojis: Record<string, string> = {
  very_happy: '😊',
  happy: '🙂',
  neutral: '😐',
  sad: '😔',
  very_sad: '😢',
  anxious: '😰',
  peaceful: '😌',
  grateful: '🙏',
  excited: '🎉',
  reflective: '🤔',
};

export function JournalEntryList({ entries }: JournalEntryListProps) {
  const router = useRouter();

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No entries yet</h3>
        <p className="text-gray-600 text-sm max-w-sm mx-auto">
          Start your journaling journey by creating your first entry
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <button
          key={entry.id}
          onClick={() => router.push(`/journal/${entry.id}`)}
          className="w-full text-left bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-4 transition-all active:scale-98 transform shadow-sm"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {entry.title && (
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {entry.title}
                  </h3>
                )}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {truncateContent(entry.content)}
                </p>
              </div>
              {entry.mood && (
                <span className="text-2xl flex-shrink-0">
                  {moodEmojis[entry.mood] || '😊'}
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(entry.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                {entry.isPrivate ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Globe className="w-3.5 h-3.5" />
                )}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
