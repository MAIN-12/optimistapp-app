'use client';

import { useState } from 'react';
import { ArrowLeft, Mic, Send } from 'lucide-react';
import { Select, SelectItem, Textarea, Button } from '@heroui/react';
import { useRouter } from 'next/navigation';

export default function SendPositiveVibesForm() {
  const [sendTo, setSendTo] = useState('everyone');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const sendToOptions = [
    { key: 'everyone', label: 'Everyone' },
    { key: 'friends', label: 'Friends' },
    { key: 'family', label: 'Family' },
    { key: 'specific', label: 'Specific Person' },
  ];

  const categoryOptions = [
    { key: 'motivation', label: 'Motivation', icon: '💡' },
    { key: 'gratitude', label: 'Gratitude', icon: '🙏' },
    { key: 'love', label: 'Love & Care', icon: '💝' },
    { key: 'celebration', label: 'Celebration', icon: '🎉' },
    { key: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
    { key: 'spiritual', label: 'Spiritual', icon: '🙏' },
  ];

  const handleSubmit = async () => {
    if (!message.trim() || !category) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form
    setMessage('');
    setCategory('');
    setIsSubmitting(false);
    
    // Navigate back to previous page instead of messages
    router.back();
  };

  const handleVoiceMessage = () => {
    // Placeholder for voice message functionality
    alert('Voice message feature coming soon!');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-purple-600">Send Positive Vibes</h1>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Send To and Category Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Send To Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send to
            </label>
            <Select
              selectedKeys={[sendTo]}
              onSelectionChange={(keys) => setSendTo(Array.from(keys)[0] as string)}
              className="w-full"
              variant="bordered"
              startContent={<span className="text-gray-500">👥</span>}
            >
              {sendToOptions.map((option) => (
                <SelectItem key={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select
              selectedKeys={category ? [category] : []}
              onSelectionChange={(keys) => setCategory(Array.from(keys)[0] as string)}
              className="w-full"
              variant="bordered"
              placeholder="Pick one"
            >
              {categoryOptions.map((option) => (
                <SelectItem 
                  key={option.key}
                  startContent={<span>{option.icon}</span>}
                >
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {/* Message Textarea */}
        <div>
          <Textarea
            value={message}
            onValueChange={setMessage}
            placeholder="Type your positive message here..."
            minRows={6}
            maxRows={8}
            variant="bordered"
            className="w-full"
            classNames={{
              input: "text-gray-700 placeholder:text-gray-400",
              inputWrapper: "border-gray-200 focus-within:border-purple-500"
            }}
          />
        </div>

        {/* Voice Message Button */}
        <Button
          onClick={handleVoiceMessage}
          variant="bordered"
          className="w-full border-2 border-teal-500 text-teal-600 hover:bg-teal-50 py-3"
          startContent={<Mic className="w-5 h-5" />}
        >
          Add Voice Message
        </Button>

        {/* Send Button */}
        <Button
          onClick={handleSubmit}
          isDisabled={!message.trim() || !category || isSubmitting}
          isLoading={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-500 to-teal-500 text-white py-3 font-semibold"
          startContent={!isSubmitting ? <Send className="w-5 h-5" /> : null}
        >
          {isSubmitting ? 'Sending...' : 'Send Positive Vibes'}
        </Button>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-gray-500 text-center mt-6">
        Your message will spread positivity to the community ✨
      </p>
    </div>
  );
}