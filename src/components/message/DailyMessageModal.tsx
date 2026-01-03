'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from '@heroui/react';
import { X, Sparkles } from 'lucide-react';

interface DailyMessageData {
  id: string;
  title: string;
  content: string;
  icon: string;
  category: string;
  author?: string;
  backgroundTheme: 'blue-purple' | 'pink-orange' | 'green-teal' | 'purple-pink';
}

interface FloatingBubble {
  id: number;
  size: number;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
}

const backgroundThemes = {
  'blue-purple': {
    gradient: 'from-blue-600 via-indigo-600 to-purple-700',
    bubbleColors: ['bg-blue-400/30', 'bg-purple-400/30', 'bg-indigo-400/30'],
  },
  'pink-orange': {
    gradient: 'from-pink-500 via-rose-500 to-orange-500',
    bubbleColors: ['bg-pink-400/30', 'bg-rose-400/30', 'bg-orange-400/30'],
  },
  'green-teal': {
    gradient: 'from-green-500 via-emerald-500 to-teal-600',
    bubbleColors: ['bg-green-400/30', 'bg-emerald-400/30', 'bg-teal-400/30'],
  },
  'purple-pink': {
    gradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
    bubbleColors: ['bg-purple-400/30', 'bg-fuchsia-400/30', 'bg-pink-400/30'],
  },
};

// Generate random bubbles
const generateBubbles = (count: number): FloatingBubble[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 40, // 40-140px
    left: Math.random() * 100, // 0-100%
    delay: Math.random() * 5, // 0-5s delay
    duration: Math.random() * 10 + 15, // 15-25s duration
    opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4 opacity
  }));
};

interface DailyMessageModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  message: DailyMessageData | null;
}

export const DailyMessageModal: React.FC<DailyMessageModalProps> = ({
  isOpen,
  onOpenChange,
  message,
}) => {
  const bubbles = useMemo(() => generateBubbles(15), []);
  const theme = message?.backgroundTheme ? backgroundThemes[message.backgroundTheme] : backgroundThemes['blue-purple'];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="full"
      hideCloseButton
      classNames={{
        base: 'bg-transparent',
        body: 'p-0',
        backdrop: 'bg-black/80',
      }}
    >
      <ModalContent className="bg-transparent shadow-none">
        {(onClose) => (
          <ModalBody className="relative overflow-hidden p-0">
            {/* Animated Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} animate-gradient-shift`}
              style={{
                backgroundSize: '400% 400%',
              }}
            />

            {/* Floating Bubbles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {bubbles.map((bubble) => (
                <div
                  key={bubble.id}
                  className={`absolute rounded-full ${theme.bubbleColors[bubble.id % 3]} animate-float-bubble backdrop-blur-sm`}
                  style={{
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    left: `${bubble.left}%`,
                    bottom: '-150px',
                    opacity: bubble.opacity,
                    animationDelay: `${bubble.delay}s`,
                    animationDuration: `${bubble.duration}s`,
                  }}
                />
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 text-white"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16">
              {/* Icon */}
              <div className="mb-8 animate-bounce-slow">
                <span className="text-7xl">{message?.icon || '✨'}</span>
              </div>

              {/* Title */}
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-white/80" />
                <span className="text-white/80 text-sm font-medium tracking-wide uppercase">
                  Daily Message
                </span>
                <Sparkles className="w-5 h-5 text-white/80" />
              </div>

              {/* Message Content */}
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-white text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed tracking-wide">
                  "{message?.content || 'Every day is a new opportunity to grow, learn, and become the best version of yourself.'}"
                </p>
                
                {message?.author && (
                  <p className="mt-6 text-white/70 text-lg italic">
                    — {message.author}
                  </p>
                )}
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DailyMessageModal;
