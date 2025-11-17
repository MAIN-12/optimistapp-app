'use client';

import { useState } from 'react';
import { ArrowLeft, Users, Lock, Heart, Share2, Settings, UserPlus, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, Chip, Tabs, Tab, Avatar } from '@heroui/react';
import type { Circle, User as PayloadUser, Category } from '@/payload-types';

interface CircleDetailProps {
  circle: Circle;
  userId?: number;
}

export default function CircleDetail({ circle, userId }: CircleDetailProps) {
  const [activeTab, setActiveTab] = useState('about');
  const [isJoining, setIsJoining] = useState(false);
  const [joinStatus, setJoinStatus] = useState<'none' | 'pending' | 'active'>('none');
  const router = useRouter();
  
  // Check if user is a member or has pending request
  const userMembership = circle.members?.find(member => {
    const memberId = typeof member.user === 'number' ? member.user : member.user?.id;
    return memberId === userId;
  });

  const isUserMember = (userMembership as any)?.status === 'active';
  const hasPendingRequest = (userMembership as any)?.status === 'pending';

  // Get user's role in the circle
  const userRole = userMembership?.role;

  const handleJoinRequest = async () => {
    setIsJoining(true);
    
    try {
      const response = await fetch(`/api/v1/circles/${circle.id}/join`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setJoinStatus(data.status);
        // Refresh the page to show updated data
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to join circle');
      }
    } catch (error) {
      console.error('Failed to join circle:', error);
      alert('Failed to join circle. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const getJoinButtonText = () => {
    if (joinStatus === 'pending' || hasPendingRequest) return 'Request Pending';
    if (joinStatus === 'active' || isUserMember) return 'Joined';
    return circle.type === 'private' || circle.type === 'invite_only' ? 'Request to Join' : 'Join Circle';
  };

  const getJoinButtonColor = () => {
    if (joinStatus === 'active' || isUserMember) return 'success';
    if (joinStatus === 'pending' || hasPendingRequest) return 'warning';
    return 'primary';
  };

  const isJoinDisabled = () => {
    return isUserMember || hasPendingRequest || joinStatus === 'active' || joinStatus === 'pending';
  };

  const formatMemberCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const getMemberCount = () => {
    return circle.members?.length || 0;
  };

  const getCategoryName = () => {
    if (!circle.category) return 'General';
    return typeof circle.category === 'object' ? circle.category.name : 'General';
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'danger';
      case 'admin':
        return 'warning';
      case 'moderator':
        return 'primary';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6 mb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => router.push('/circles')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${circle.gradient ? `bg-gradient-to-br ${circle.gradient}` : 'bg-gradient-to-br from-blue-500 to-purple-600'} flex items-center justify-center`}>
              <span className="text-2xl text-white">{circle.icon || '👥'}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{circle.name}</h1>
                {(circle.type === 'private' || circle.type === 'invite_only') && (
                  <Lock className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <p className="text-gray-600">{circle.description || 'No description available'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Circle Stats */}
      <div className={`rounded-2xl p-6 ${circle.gradient ? `bg-gradient-to-br ${circle.gradient}` : 'bg-gradient-to-br from-blue-500 to-purple-600'} text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="font-semibold">{formatMemberCount(getMemberCount())} members</span>
          </div>
          <Chip size="sm" variant="solid" className="bg-white/20 text-white">
            {getCategoryName()}
          </Chip>
        </div>
        
        {/* Tags */}
        {circle.tags && circle.tags.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {circle.tags.map((tagObj) => (
              <Chip key={tagObj.id} size="sm" variant="solid" className="bg-white/20 text-white">
                #{tagObj.tag}
              </Chip>
            ))}
          </div>
        )}

        {/* Join Button */}
        {!isUserMember && !hasPendingRequest && (
          <Button
            onClick={handleJoinRequest}
            isLoading={isJoining}
            isDisabled={isJoinDisabled()}
            color={getJoinButtonColor()}
            variant="solid"
            className="w-full"
            startContent={!isJoining && <UserPlus className="w-4 h-4" />}
          >
            {getJoinButtonText()}
          </Button>
        )}
        
        {hasPendingRequest && (
          <div className="flex items-center justify-center gap-2 py-2 bg-yellow-500/20 rounded-xl">
            <span className="font-semibold">⏳ Request Pending Approval</span>
          </div>
        )}
        
        {isUserMember && (
          <div className="flex items-center justify-center gap-2 py-2">
            <Heart className="w-5 h-5 fill-current" />
            <span className="font-semibold">You're a member</span>
            {userRole && userRole !== 'member' && (
              <Chip size="sm" variant="solid" className="bg-white/20 text-white capitalize">
                {userRole}
              </Chip>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as string)} variant="underlined">
        <Tab key="about" title="About">
          <div className="space-y-6 mt-4">
            {/* About */}
            {circle.about && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">About this Circle</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{circle.about}</p>
              </div>
            )}

            {/* Rules */}
            {circle.rules && circle.rules.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Community Rules</h3>
                <ul className="space-y-2">
                  {circle.rules.map((ruleObj) => (
                    <li key={ruleObj.id} className="flex items-start gap-2 text-gray-700">
                      <span className="text-purple-500 font-bold">•</span>
                      <span>{ruleObj.rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {!circle.about && (!circle.rules || circle.rules.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No additional information available
              </div>
            )}
          </div>
        </Tab>

        <Tab key="members" title={`Members (${getMemberCount()})`}>
          <div className="space-y-4 mt-4">
            {circle.members && circle.members.length > 0 ? (
              circle.members
                .filter(member => (member as any).status === 'active' || !(member as any).status)
                .map((member) => {
                  const user = typeof member.user === 'object' ? member.user : null;
                  if (!user) return null;
                  
                  return (
                    <div key={member.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
                      <Avatar
                        name={user.name?.charAt(0) || 'U'}
                        className="w-10 h-10"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{user.name || 'Unknown User'}</h4>
                        <p className="text-sm text-gray-500">Joined {formatDate(member.joinedAt)}</p>
                      </div>
                      <Chip 
                        size="sm" 
                        variant="flat" 
                        color={getRoleBadgeColor(member.role)}
                        className="capitalize"
                      >
                        {member.role}
                      </Chip>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-8 text-gray-500">
                No members yet
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}