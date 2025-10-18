'use client';

import { ArrowLeft, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CircleWelcomeProps {
  circle: {
    name: string;
    description: string;
    icon: string;
    gradient: string;
    about: string;
  };
}

export default function CircleWelcome({ circle }: CircleWelcomeProps) {
  const router = useRouter();

  return (
    <div className="w-full mx-auto bg-gradient-to-br from-purple-50 to-teal-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 p-6">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-purple-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${circle.gradient} flex items-center justify-center`}>
            <span className="text-white text-xl">🙏</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-purple-600">{circle.name}</h1>
            <p className="text-purple-500 text-sm">{circle.description}</p>
          </div>
        </div>
      </div>

      {/* Welcome Content */}
      <div className="px-6 py-8 text-center">
        {/* Heart Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-teal-600 flex items-center justify-center shadow-lg">
            <Heart className="w-12 h-12 text-white fill-current" />
          </div>
        </div>

        {/* Welcome Message */}
        <h2 className="text-2xl font-bold text-purple-600 mb-6">
          Welcome to the Circle
        </h2>

        <p className="text-purple-500 text-lg leading-relaxed px-4">
          {circle.about}
        </p>
      </div>
    </div>
  );
}