'use client';

import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { JournalPrompt } from '@/payload-types';

interface JournalPromptCardProps {
  prompt: JournalPrompt;
}

export function JournalPromptCard({ prompt }: JournalPromptCardProps) {
  const router = useRouter();

  const categoryColors: Record<string, string> = {
    reflection: 'bg-purple-100 text-purple-700',
    gratitude: 'bg-green-100 text-green-700',
    goals: 'bg-blue-100 text-blue-700',
    creativity: 'bg-orange-100 text-orange-700',
    mindfulness: 'bg-pink-100 text-pink-700',
  };

  const colorClass = prompt.category ? categoryColors[prompt.category] || 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700';

  return (
    <button
      onClick={() => router.push(`/journal/new?prompt=${prompt.id}`)}
      className="w-full text-left bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200 rounded-2xl p-5 transition-all active:scale-98 transform"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white rounded-xl shadow-sm">
          <Sparkles className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{prompt.title}</h3>
            {prompt.category && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${colorClass}`}>
                {prompt.category}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{prompt.content}</p>
        </div>
      </div>
    </button>
  );
}
