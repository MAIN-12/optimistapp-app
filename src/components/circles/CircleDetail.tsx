'use client';

import { useState } from 'react';
import { ArrowLeft, Users, Lock, Heart, Share2, Settings, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, Chip, Tabs, Tab, Avatar } from '@heroui/react';
import circlesData from './circles-data.json';

interface CircleDetailProps {
  circleId: string;
}

export default function CircleDetail({ circleId }: CircleDetailProps) {
  const [activeTab, setActiveTab] = useState('about');
  const [isJoining, setIsJoining] = useState(false);
  const [joinStatus, setJoinStatus] = useState<'none' | 'requested' | 'joined'>('none');
  const router = useRouter();
  const { circles } = circlesData;
  
  const circle = circles.find(c => c.id === circleId);

  if (!circle) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Circle not found</p>
      </div>
    );
  }

  const handleJoinRequest = async () => {
    setIsJoining(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (circle.type === 'private') {
      setJoinStatus('requested');
    } else {
      setJoinStatus('joined');
    }
    
    setIsJoining(false);
  };

  const getJoinButtonText = () => {
    if (circle.isJoined || joinStatus === 'joined') return 'Joined';
    if (joinStatus === 'requested') return 'Request Sent';
    return circle.type === 'private' ? 'Request to Join' : 'Join Circle';
  };

  const getJoinButtonColor = () => {
    if (circle.isJoined || joinStatus === 'joined') return 'success';
    if (joinStatus === 'requested') return 'warning';
    return 'primary';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${circle.gradient} flex items-center justify-center`}>
              <span className="text-2xl text-white">{circle.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{circle.name}</h1>
                {circle.type === 'private' && (
                  <Lock className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <p className="text-gray-600">{circle.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Circle Stats */}
      <div className={`rounded-2xl p-6 bg-gradient-to-br ${circle.gradient} text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="font-semibold">{circle.memberCount.toLocaleString()} members</span>
          </div>
          <Chip size="sm" variant="solid" className="bg-white/20 text-white">
            {circle.category}
          </Chip>
        </div>
        
        {/* Tags */}
        <div className="flex gap-2 mb-4">
          {circle.tags.map((tag) => (
            <Chip key={tag} size="sm" variant="solid" className="bg-white/20 text-white">
              #{tag}
            </Chip>
          ))}
        </div>

        {/* Join Button */}
        <Button
          onClick={handleJoinRequest}
          isLoading={isJoining}
          isDisabled={circle.isJoined || joinStatus !== 'none'}
          color={getJoinButtonColor()}
          variant="solid"
          className="w-full"
          startContent={
            !isJoining && (circle.isJoined || joinStatus === 'joined') ? 
            <Heart className="w-4 h-4 fill-current" /> : 
            <UserPlus className="w-4 h-4" />
          }
        >
          {getJoinButtonText()}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as string)}>
        <Tab key="about" title="About">
          <div className="space-y-6">
            {/* About */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">About this Circle</h3>
              <p className="text-gray-700 leading-relaxed">{circle.about}</p>
            </div>

            {/* Rules */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Community Rules</h3>
              <ul className="space-y-2">
                {circle.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-purple-500 font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Tab>

        <Tab key="members" title="Members">
          <div className="space-y-4">
            {circle.members.map((member) => (
              <div key={member.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
                <Avatar
                  name={member.name.charAt(0)}
                  className="w-10 h-10"
                  style={{ backgroundColor: member.avatar }}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-500">Joined {member.joinDate}</p>
                </div>
                <Chip size="sm" variant="flat" color={member.role === 'Admin' ? 'danger' : member.role === 'Moderator' ? 'warning' : 'default'}>
                  {member.role}
                </Chip>
              </div>
            ))}
          </div>
        </Tab>

        <Tab key="activity" title="Activity">
          <div className="space-y-4">
            {circle.recentActivity.map((activity) => (
              <div key={activity.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{activity.author}</span>
                  <span className="text-sm text-gray-500">{activity.timestamp}</span>
                </div>
                <p className="text-gray-700 mb-3">{activity.content}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{activity.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}