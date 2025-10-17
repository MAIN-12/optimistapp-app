'use client';

import { Heart, Star, Share2, Trash2 } from 'lucide-react';
import messagesData from './message-dummy-data.json';

export default function FavoriteMessages() {
  const { messages } = messagesData;
  
  // Filter messages to show only favorites
  const favoriteMessages = messages.filter(message => message.interactions.favorites === true);

  if (favoriteMessages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <Star className="w-16 h-16 text-gray-300 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-600 mb-2">No Favorite Messages Yet</h2>
        <p className="text-gray-500">Start favoriting messages to see them here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Star className="w-8 h-8 text-yellow-500 fill-current" />
          <h1 className="text-3xl font-bold text-gray-900">Your Favorites</h1>
        </div>
        <p className="text-gray-600">
          {favoriteMessages.length} message{favoriteMessages.length !== 1 ? 's' : ''} you've saved for inspiration
        </p>
      </div>

      {/* Favorite Messages List */}
      <div className="space-y-4">
        {favoriteMessages.map((message) => (
          <div key={message.id} className="bg-white rounded-2xl p-6 border border-yellow-100 shadow-sm hover:shadow-md transition-shadow relative">
            {/* Favorite indicator */}
            <div className="absolute top-4 right-4">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            </div>

            <div className="flex gap-4">
              {/* Avatar */}
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
                style={{ backgroundColor: message.avatar.backgroundColor }}
              >
                {message.authorInitial}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0 pr-8">
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
                    {message.interactions.likes > 0 && (
                      <span className="text-sm text-gray-500">{message.interactions.likes}</span>
                    )}
                  </button>
                  <button className="flex items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
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

      {/* Footer note */}
      <div className="text-center pt-8 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Tap the ⭐ icon on any message to add it to your favorites
        </p>
      </div>
    </div>
  );
}