'use client';

import { useState, useEffect } from 'react';
import { useDisclosure } from '@heroui/react';
import { Search, Play, Smile } from 'lucide-react';
import messagesData from './message-dummy-data.json';
import DailyMessageModal from './DailyMessageModal';

interface DailyMessageData {
  id: string;
  title: string;
  content: string;
  icon: string;
  category: string;
  author?: string;
  backgroundTheme: 'blue-purple' | 'pink-orange' | 'green-teal' | 'purple-pink';
}

export default function DailyMessage() {
  const { dailyMessage, userMood } = messagesData;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [hasSeenToday, setHasSeenToday] = useState(false);

  // Mock daily message data - in production, this would come from the API
  const dailyMessageData: DailyMessageData = {
    id: '1',
    title: 'Daily Inspiration',
    content: dailyMessage.text,
    icon: dailyMessage.icon,
    category: 'motivation',
    backgroundTheme: 'blue-purple',
  };

  // Auto-open modal on first visit of the day
  useEffect(() => {
    const today = new Date().toDateString();
    const lastSeen = localStorage.getItem('dailyMessageLastSeen');
    
    if (lastSeen !== today) {
      // Small delay to ensure smooth page load
      const timer = setTimeout(() => {
        onOpen();
        localStorage.setItem('dailyMessageLastSeen', today);
        setHasSeenToday(true);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setHasSeenToday(true);
    }
  }, [onOpen]);

  const handleCardClick = () => {
    onOpen();
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Daily Message Card - Clickable to open modal */}
      <div 
        onClick={handleCardClick}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl group-hover:scale-110 transition-transform">{dailyMessage.icon}</span>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">Daily Message</span>
          </div>
          <button 
            className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Audio play functionality would go here
            }}
          >
            <Play className="w-5 h-5 text-purple-600 dark:text-purple-400 fill-current" />
          </button>
        </div>
        <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          {dailyMessage.text}
        </p>
        <p className="mt-2 text-sm text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Tap to view full message ✨
        </p>
      </div>

      {/* Mood Tracker */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <Smile className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">{userMood.question}</span>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <span>📊</span>
            <span>{userMood.averageRating} avg</span>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          {userMood.buttonText}
        </button>
      </div>

      {/* Daily Message Modal */}
      <DailyMessageModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        message={dailyMessageData}
      />
    </div>
  );
}