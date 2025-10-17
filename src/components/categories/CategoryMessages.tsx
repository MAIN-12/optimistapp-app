'use client';

import { Heart, Star, Share2, Trash2 } from 'lucide-react';
import categoriesData from './categories-data.json';

interface CategoryMessagesProps {
  categoryId: string;
}

export default function CategoryMessages({ categoryId }: CategoryMessagesProps) {
  const { categories } = categoriesData;
  const category = categories.find(cat => cat.id === categoryId);

  if (!category) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Category not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className={`rounded-2xl p-6 bg-gradient-to-br ${category.gradient} text-white`}>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">{category.icon}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <p className="text-white/80">{category.description}</p>
          </div>
        </div>
        <p className="text-white/90 text-sm">{category.messageCount} inspiring messages</p>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {category.messages.map((message) => (
          <div key={message.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              {/* Avatar */}
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
                style={{ backgroundColor: category.bgColor }}
              >
                {message.author.charAt(0)}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{message.author}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
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
                    {message.likes > 0 && (
                      <span className="text-sm text-gray-500">{message.likes}</span>
                    )}
                  </button>
                  <button className="flex items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                    <Star className={`w-5 h-5 transition-colors ${
                      message.favorited 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-gray-400 group-hover:text-yellow-500'
                    }`} />
                  </button>
                  <button className="flex items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                    <Share2 className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </button>
                  {message.author === "Juan Botero" && (
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
    </div>
  );
}