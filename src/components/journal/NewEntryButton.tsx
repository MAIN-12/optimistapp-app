'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function NewEntryButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/journal/new')}
      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-2xl transition-colors shadow-sm active:scale-95 transform duration-150"
    >
      <Plus className="w-5 h-5" />
      New Journal Entry
    </button>
  );
}
