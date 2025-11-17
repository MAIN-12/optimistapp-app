'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Lock, Globe, Plus, X, Heart, Award } from 'lucide-react';
import { Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import type { JournalEntry } from '@/payload-types';

interface JournalEntryEditFormProps {
  entry: JournalEntry;
  userId: string;
}

const moods = [
  { value: 'very_happy', label: 'Very Happy', emoji: '😊' },
  { value: 'happy', label: 'Happy', emoji: '🙂' },
  { value: 'neutral', label: 'Neutral', emoji: '😐' },
  { value: 'sad', label: 'Sad', emoji: '😔' },
  { value: 'very_sad', label: 'Very Sad', emoji: '😢' },
  { value: 'anxious', label: 'Anxious', emoji: '😰' },
  { value: 'peaceful', label: 'Peaceful', emoji: '😌' },
  { value: 'grateful', label: 'Grateful', emoji: '🙏' },
  { value: 'excited', label: 'Excited', emoji: '🎉' },
  { value: 'reflective', label: 'Reflective', emoji: '🤔' },
];

export function JournalEntryEditForm({ entry, userId }: JournalEntryEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [formData, setFormData] = useState({
    title: entry.title || '',
    content: entry.content,
    mood: entry.mood || '',
    isPrivate: entry.isPrivate ?? true,
    gratefulItems: entry.gratefulFor?.map(item => item.item) || [''],
    dailyWins: entry.dailyWins?.map(win => win.win) || [''],
  });
  
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showGratefulSection, setShowGratefulSection] = useState((entry.gratefulFor?.length || 0) > 0);
  const [showWinsSection, setShowWinsSection] = useState((entry.dailyWins?.length || 0) > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const gratefulFor = formData.gratefulItems
        .filter(item => item.trim())
        .map(item => ({ item }));
      const dailyWins = formData.dailyWins
        .filter(win => win.trim())
        .map(win => ({ win }));

      const payload = {
        title: formData.title || entry.title,
        content: formData.content,
        mood: formData.mood || undefined,
        isPrivate: formData.isPrivate,
        gratefulFor: gratefulFor.length > 0 ? gratefulFor : undefined,
        dailyWins: dailyWins.length > 0 ? dailyWins : undefined,
      };

      const response = await fetch(`/api/v1/journal-entries/${entry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update entry');
      }

      router.push(`/journal/${entry.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update entry');
      setIsSubmitting(false);
    }
  };

  const handlePrivacyToggle = () => {
    setShowPrivacyModal(true);
  };

  const confirmPrivacyChange = () => {
    setFormData({ ...formData, isPrivate: !formData.isPrivate });
    setShowPrivacyModal(false);
  };

  const addGratefulItem = () => {
    setFormData(prev => ({
      ...prev,
      gratefulItems: [...prev.gratefulItems, ''],
    }));
  };

  const removeGratefulItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gratefulItems: prev.gratefulItems.filter((_, i) => i !== index),
    }));
  };

  const updateGratefulItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      gratefulItems: prev.gratefulItems.map((item, i) => i === index ? value : item),
    }));
  };

  const addDailyWin = () => {
    setFormData(prev => ({
      ...prev,
      dailyWins: [...prev.dailyWins, ''],
    }));
  };

  const removeDailyWin = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dailyWins: prev.dailyWins.filter((_, i) => i !== index),
    }));
  };

  const updateDailyWin = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      dailyWins: prev.dailyWins.map((win, i) => i === index ? value : win),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title with Back Button and Mood */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push(`/journal/${entry.id}`)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          aria-label="Back to entry"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex-1 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
              className="w-full text-3xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent px-2"
            />
          ) : (
            <h1
              onClick={() => setIsEditingTitle(true)}
              className="text-3xl font-bold text-gray-900 cursor-text hover:text-blue-600 transition-colors truncate px-2"
              title="Click to edit title"
            >
              {formData.title || 'Untitled'}
            </h1>
          )}
        </div>
        
        <Button
          type="button"
          onPress={() => setShowMoodModal(true)}
          variant="bordered"
          className="flex items-center gap-2 flex-shrink-0"
          title="Select mood"
        >
          {formData.mood ? (
            <>
              <span className="text-2xl">{moods.find(m => m.value === formData.mood)?.emoji}</span>
              <span className="text-sm hidden sm:inline">{moods.find(m => m.value === formData.mood)?.label}</span>
            </>
          ) : (
            <>
              <span className="text-xl">😊</span>
              <span className="text-sm hidden sm:inline">Mood</span>
            </>
          )}
        </Button>
        
        <Button
          type="button"
          onPress={handlePrivacyToggle}
          variant="bordered"
          className={`flex items-center gap-2 flex-shrink-0 ${
            formData.isPrivate
              ? 'border-green-500 text-green-700'
              : 'border-blue-500 text-blue-700'
          }`}
          title={formData.isPrivate ? 'Private - Only you can see this' : 'Public - Others can view this'}
        >
          {formData.isPrivate ? (
            <>
              <Lock className="w-5 h-5" />
              <span className="text-sm hidden sm:inline">Private</span>
            </>
          ) : (
            <>
              <Globe className="w-5 h-5" />
              <span className="text-sm hidden sm:inline">Public</span>
            </>
          )}
        </Button>
      </div>

      <p className="text-gray-600 -mt-2">Edit your journal entry</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Mood Selector Modal */}
      <Modal 
        isOpen={showMoodModal} 
        onClose={() => setShowMoodModal(false)}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            How are you feeling?
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, mood: mood.value });
                    setShowMoodModal(false);
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    formData.mood === mood.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-sm text-gray-700 text-center">{mood.label}</span>
                </button>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            {formData.mood && (
              <Button
                color="default"
                variant="light"
                onPress={() => {
                  setFormData({ ...formData, mood: '' });
                  setShowMoodModal(false);
                }}
              >
                Clear selection
              </Button>
            )}
            <Button color="primary" onPress={() => setShowMoodModal(false)}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Privacy Change Confirmation Modal */}
      <Modal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)}
        size="sm"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Change Privacy Setting
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700">
              Do you want to change this entry to{' '}
              <strong className={formData.isPrivate ? 'text-blue-600' : 'text-green-600'}>
                {formData.isPrivate ? 'Public' : 'Private'}
              </strong>?
            </p>
            {formData.isPrivate ? (
              <p className="text-sm text-gray-600 mt-2">
                Others will be able to view this entry.
              </p>
            ) : (
              <p className="text-sm text-gray-600 mt-2">
                Only you will be able to see this entry.
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={() => setShowPrivacyModal(false)}>
              No
            </Button>
            <Button 
              color="primary" 
              onPress={confirmPrivacyChange}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Content */}
      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Your Thoughts <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="content"
          required
          value={formData.content}
          onValueChange={(value) => setFormData({ ...formData, content: value })}
          placeholder="What's on your mind? Write freely..."
          minRows={8}
          maxRows={30}
          variant="bordered"
          classNames={{
            input: 'text-base resize-none',
            inputWrapper: 'border-gray-300 hover:border-gray-400 data-[hover=true]:border-gray-400',
          }}
        />
        <p className="text-xs text-gray-500">{formData.content.length} characters</p>
      </div>

      {/* Grateful For - Collapsible */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowGratefulSection(!showGratefulSection)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium text-gray-700">
              What are you grateful for today? (Optional)
            </span>
          </div>
          <span className="text-gray-500">
            {showGratefulSection ? '−' : '+'}
          </span>
        </button>
        {showGratefulSection && (
          <div className="p-4 space-y-3 border-t border-gray-200">
            {formData.gratefulItems.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateGratefulItem(index, e.target.value)}
                  placeholder="Something you're grateful for..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.gratefulItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGratefulItem(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addGratefulItem}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add another
            </button>
          </div>
        )}
      </div>

      {/* Daily Wins - Collapsible */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowWinsSection(!showWinsSection)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              Today's wins - big or small (Optional)
            </span>
          </div>
          <span className="text-gray-500">
            {showWinsSection ? '−' : '+'}
          </span>
        </button>
        {showWinsSection && (
          <div className="p-4 space-y-3 border-t border-gray-200">
            {formData.dailyWins.map((win, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={win}
                  onChange={(e) => updateDailyWin(index, e.target.value)}
                  placeholder="An accomplishment or positive moment..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.dailyWins.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDailyWin(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDailyWin}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add another
            </button>
          </div>
        )}
      </div>

      {/* Submit Button - Fixed on mobile, above mobile menu */}
      <div className="fixed bottom-20 left-0 right-0 p-4 md:relative md:bottom-0 md:border-0 md:bg-transparent md:p-0 z-40">
        <Button
          type="submit"
          color="primary"
          size="lg"
          isDisabled={isSubmitting || !formData.content.trim()}
          isLoading={isSubmitting}
          fullWidth
        >
          {isSubmitting ? 'Updating...' : 'Update Entry'}
        </Button>
      </div>
      
      {/* Spacer for fixed button on mobile */}
      <div className="h-28 md:hidden" />
    </form>
  );
}
