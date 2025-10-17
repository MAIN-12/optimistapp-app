'use client';

import { Search, Play, Smile } from 'lucide-react';
import messagesData from './message-dummy-data.json';

export default function DailyMessage() {
  const { dailyMessage, userMood } = messagesData;

  return (
    <div className="space-y-6 mb-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Daily Message Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{dailyMessage.icon}</span>
            <span className="text-lg font-semibold text-gray-800">Daily Message</span>
          </div>
          <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
            <Play className="w-5 h-5 text-purple-600 fill-current" />
          </button>
        </div>
        <p className="mt-4 text-gray-700 text-lg leading-relaxed">
          {dailyMessage.text}
        </p>
      </div>

      {/* Mood Tracker */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <Smile className="w-6 h-6 text-gray-600" />
          <span className="text-gray-700 font-medium">{userMood.question}</span>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>📊</span>
            <span>{userMood.averageRating} avg</span>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          {userMood.buttonText}
        </button>
      </div>
    </div>
  );
}