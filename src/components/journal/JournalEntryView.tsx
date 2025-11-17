'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { JournalEntry } from '@/payload-types';
import {
  ArrowLeft,
  Calendar,
  Lock,
  Globe,
  Edit,
  Trash2,
  Loader2,
  Heart,
  Award,
  Sparkles,
} from 'lucide-react';

interface JournalEntryViewProps {
  entry: JournalEntry;
  userId: string;
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

const moodLabels: Record<string, string> = {
  very_happy: 'Very Happy',
  happy: 'Happy',
  neutral: 'Neutral',
  sad: 'Sad',
  very_sad: 'Very Sad',
  anxious: 'Anxious',
  peaceful: 'Peaceful',
  grateful: 'Grateful',
  excited: 'Excited',
  reflective: 'Reflective',
};

export function JournalEntryView({ entry, userId }: JournalEntryViewProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/v1/journal-entries/${entry.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      router.push('/journal');
    } catch (error) {
      console.error('Error deleting entry:', error);
      setIsDeleting(false);
      alert('Failed to delete entry. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/journal')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Back to journal entries"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>All Entries</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/journal/${entry.id}/edit`)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            aria-label="Edit entry"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            aria-label="Delete entry"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Delete Entry?</h3>
            <p className="text-gray-600">
              Are you sure you want to delete this journal entry? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entry Content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          {/* Date and Privacy */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(entry.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              {entry.isPrivate ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Private</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Public</span>
                </>
              )}
            </div>
          </div>

          {/* Title and Mood */}
          <div className="space-y-3">
            {entry.title && (
              <h1 className="text-2xl font-bold text-gray-900">{entry.title}</h1>
            )}
            {entry.mood && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                <span className="text-sm font-medium text-gray-700">
                  Feeling {moodLabels[entry.mood]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          <div className="prose prose-gray max-w-none">
            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {entry.content}
            </p>
          </div>

          {/* Grateful For Section */}
          {entry.gratefulFor && entry.gratefulFor.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <Heart className="w-5 h-5 text-pink-500" />
                <h3>Grateful For</h3>
              </div>
              <ul className="space-y-2">
                {entry.gratefulFor.map((item: any, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>{item.item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Daily Wins Section */}
          {entry.dailyWins && entry.dailyWins.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <Award className="w-5 h-5 text-yellow-500" />
                <h3>Daily Wins</h3>
              </div>
              <ul className="space-y-2">
                {entry.dailyWins.map((win: any, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-yellow-500 mt-1">✓</span>
                    <span>{win.win}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reflection Prompt */}
          {entry.reflectionPrompt && (
            <div className="space-y-2 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="font-medium">Inspired by a prompt</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tags Section (if implemented) */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tagItem: any, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              #{tagItem.tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
