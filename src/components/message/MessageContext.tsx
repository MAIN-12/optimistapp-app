'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Message } from '@/payload-types';

interface MessageContextType {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  refreshMessages: () => void;
  createMessage: (content: string, type: string) => Promise<boolean>;
  deleteMessage: (messageId: number) => Promise<boolean>;
  updateReaction: (messageId: number, reactionType: string) => Promise<void>;
  toggleFavorite: (messageId: number) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

interface MessageProviderProps {
  children: React.ReactNode;
  initialMessages?: Message[];
}

export function MessageProvider({ children, initialMessages = [] }: MessageProviderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Trigger a server-side refresh
  const refreshMessages = useCallback(() => {
    router.refresh();
  }, [router]);

  const createMessage = useCallback(async (content: string, type: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: content.trim(),
          type,
          author: user.id,
        }),
      });

      if (response.ok) {
        // Refresh server data
        refreshMessages();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }, [user, refreshMessages]);

  const deleteMessage = useCallback(async (messageId: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }, []);

  const updateReaction = useCallback(async (messageId: number, reactionType: string) => {
    if (!user) return;

    try {
      const message = messages.find((m) => m.id === messageId);
      if (!message) return;

      const existingReaction = message.reactions?.find(
        (r) => (typeof r.user === 'object' ? r.user.id : r.user) === user.id
      );

      let updatedReactions = [...(message.reactions || [])];

      if (existingReaction) {
        if (existingReaction.type === reactionType) {
          updatedReactions = updatedReactions.filter((r) => r.id !== existingReaction.id);
        } else {
          updatedReactions = updatedReactions.map((r) =>
            r.id === existingReaction.id ? { ...r, type: reactionType as any } : r
          );
        }
      } else {
        updatedReactions.push({
          user: user.id,
          type: reactionType as any,
          createdAt: new Date().toISOString(),
          id: `temp-${Date.now()}`,
        });
      }

      // Optimistic update
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, reactions: updatedReactions } : m))
      );

      // Update on server
      await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reactions: updatedReactions }),
      });
    } catch (err) {
      refreshMessages();
    }
  }, [user, messages, refreshMessages]);

  const toggleFavorite = useCallback(async (messageId: number) => {
    if (!user) return;

    try {
      const message = messages.find((m) => m.id === messageId);
      if (!message) return;

      const isFavorited = message.favorites?.some(
        (f) => (typeof f.user === 'object' ? f.user.id : f.user) === user.id
      );

      let updatedFavorites = [...(message.favorites || [])];

      if (isFavorited) {
        updatedFavorites = updatedFavorites.filter(
          (f) => (typeof f.user === 'object' ? f.user.id : f.user) !== user.id
        );
      } else {
        updatedFavorites.push({
          user: user.id,
          createdAt: new Date().toISOString(),
          id: `temp-${Date.now()}`,
        });
      }

      // Optimistic update
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, favorites: updatedFavorites } : m))
      );

      // Update on server
      await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ favorites: updatedFavorites }),
      });
    } catch (err) {
      refreshMessages();
    }
  }, [user, messages, refreshMessages]);

  return (
    <MessageContext.Provider
      value={{
        messages,
        isLoading,
        error,
        refreshMessages,
        createMessage,
        deleteMessage,
        updateReaction,
        toggleFavorite,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}
