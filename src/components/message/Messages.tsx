'use client';

import { Heart, Star, Share2, Trash2 } from 'lucide-react';
import messagesData from './message-dummy-data.json';

export default function Messages() {
  const { messages } = messagesData;

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex gap-4">
            {/* Avatar */}
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
              style={{ backgroundColor: message.avatar.backgroundColor }}
            >
              {message.authorInitial}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{message.authorName}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                    <span>{message.category}</span>
                    <span>{message.categoryName}</span>
                  </span>
                </div>
                <span className="text-sm text-gray-500">{message.timestamp}</span>
              </div>

              <p className="text-gray-800 mb-4 leading-relaxed">
                {message.content}
              </p>

              {/* Interaction Buttons */}
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                  <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                </button>
                <button className="flex items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                  <Star className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                </button>
                <button className="flex items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                  <Share2 className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </button>
                {message.authorName === "Juan Botero" && (
                  <button className="flex items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group ml-auto">
                    <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}