'use client';

import { useState, useCallback } from 'react';
import {
  ArrowLeft, Users, Lock, Heart, Settings, UserPlus, ShieldCheck,
  CheckCircle, XCircle, Trash2, Crown, Shield, UserCog, Globe, EyeOff, Mail,
  Edit3, Save, X, Plus, Minus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Button, Chip, Tabs, Tab, Avatar, Input, Textarea, Select, SelectItem,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from '@heroui/react';
import type { Circle, User as PayloadUser, Category } from '@/payload-types';

interface CircleDetailProps {
  circle: Circle;
  userId?: number;
}

export default function CircleDetail({ circle: initialCircle, userId }: CircleDetailProps) {
  const [circle, setCircle] = useState(initialCircle);
  const [activeTab, setActiveTab] = useState('about');
  const [isJoining, setIsJoining] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();
  const settingsModal = useDisclosure();

  // Settings form state
  const [editName, setEditName] = useState(circle.name);
  const [editDescription, setEditDescription] = useState(circle.description || '');
  const [editAbout, setEditAbout] = useState(circle.about || '');
  const [editType, setEditType] = useState(circle.type);
  const [editRules, setEditRules] = useState<string[]>(
    circle.rules?.map((r) => r.rule) || []
  );
  const [editTags, setEditTags] = useState<string[]>(
    circle.tags?.map((t) => t.tag) || []
  );
  const [editIcon, setEditIcon] = useState(circle.icon || '');

  // Derive ownership & membership info
  const ownerId = typeof circle.owner === 'number' ? circle.owner : circle.owner?.id;
  const ownerUser = typeof circle.owner === 'object' ? circle.owner : null;
  const isOwner = ownerId === userId;

  const userMembership = circle.members?.find((member) => {
    const memberId = typeof member.user === 'number' ? member.user : member.user?.id;
    return memberId === userId;
  });

  const isUserMember = userMembership?.status === 'active';
  const hasPendingRequest = userMembership?.status === 'pending';
  const userRole = userMembership?.role;
  const isAdminOrOwner = isOwner || userRole === 'admin' || userRole === 'owner';
  const canManage = isAdminOrOwner;

  // Member lists
  const activeMembers = circle.members?.filter((m) => m.status === 'active') || [];
  const pendingMembers = circle.members?.filter((m) => m.status === 'pending') || [];
  const activeMemberCount = activeMembers.length;

  // ── Join ──
  const handleJoinRequest = async () => {
    setIsJoining(true);
    try {
      const response = await fetch(`/api/v1/circles/${circle.id}/join`, {
        method: 'POST',
      });
      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to join circle');
      }
    } catch {
      alert('Failed to join circle. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  // ── Settings save ──
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/v1/circles/${circle.id}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          about: editAbout,
          type: editType,
          icon: editIcon,
          rules: editRules.filter(Boolean).map((rule) => ({ rule })),
          tags: editTags.filter(Boolean).map((tag) => ({ tag })),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        settingsModal.onClose();
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update settings');
      }
    } catch {
      alert('Failed to update settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Member management ──
  const handleMemberAction = async (
    action: 'approve' | 'reject' | 'remove' | 'changeRole',
    memberId: string,
    role?: string
  ) => {
    setActionLoading(memberId);
    try {
      const response = await fetch(`/api/v1/circles/${circle.id}/members`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, memberId, role }),
      });
      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.message || 'Action failed');
      }
    } catch {
      alert('Action failed. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Helpers ──
  const formatMemberCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const getCategoryName = () => {
    if (!circle.category) return 'General';
    return typeof circle.category === 'object' ? circle.category.name : 'General';
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'danger';
      case 'admin': return 'warning';
      case 'moderator': return 'primary';
      default: return 'default';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-3 h-3" />;
      case 'admin': return <ShieldCheck className="w-3 h-3" />;
      case 'moderator': return <Shield className="w-3 h-3" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'private': return <Lock className="w-4 h-4" />;
      case 'invite_only': return <Mail className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'private': return 'Private';
      case 'invite_only': return 'Invite Only';
      default: return 'Public';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getJoinButtonText = () => {
    if (circle.type === 'private' || circle.type === 'invite_only') return 'Request to Join';
    return 'Join Circle';
  };

  return (
    <div className="space-y-6 mb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/circles')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                circle.gradient
                  ? `bg-gradient-to-br ${circle.gradient}`
                  : circle.bgColor
                    ? ''
                    : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}
              style={circle.bgColor && !circle.gradient ? { backgroundColor: circle.bgColor } : undefined}
            >
              <span className="text-2xl">{circle.icon || '👥'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{circle.name}</h1>
                {getTypeIcon(circle.type)}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                {circle.description || 'No description available'}
              </p>
            </div>
          </div>
        </div>
        {/* Settings gear for owners/admins */}
        {canManage && (
          <button
            onClick={settingsModal.onOpen}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Circle Settings"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </div>

      {/* Circle Stats Card */}
      <div
        className={`rounded-2xl p-6 text-white ${
          circle.gradient
            ? `bg-gradient-to-br ${circle.gradient}`
            : 'bg-gradient-to-br from-blue-500 to-purple-600'
        }`}
        style={circle.bgColor && !circle.gradient ? { backgroundColor: circle.bgColor } : undefined}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="font-semibold">{formatMemberCount(activeMemberCount)} members</span>
          </div>
          <div className="flex items-center gap-2">
            <Chip size="sm" variant="solid" className="bg-white/20 text-white">
              {getTypeLabel(circle.type)}
            </Chip>
            <Chip size="sm" variant="solid" className="bg-white/20 text-white">
              {getCategoryName()}
            </Chip>
          </div>
        </div>

        {/* Owner */}
        {ownerUser && (
          <div className="flex items-center gap-2 mb-3 text-white/80 text-sm">
            <Crown className="w-4 h-4" />
            <span>Created by <strong>{ownerUser.name || 'Unknown'}</strong></span>
          </div>
        )}

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

        {/* Join Button — only for non-members with no pending request */}
        {userId && !isUserMember && !hasPendingRequest && !isOwner && (
          <Button
            onClick={handleJoinRequest}
            isLoading={isJoining}
            color="primary"
            variant="solid"
            className="w-full"
            startContent={!isJoining ? <UserPlus className="w-4 h-4" /> : undefined}
          >
            {getJoinButtonText()}
          </Button>
        )}

        {/* Not logged in */}
        {!userId && (
          <p className="text-center text-white/70 text-sm py-2">Log in to join this circle</p>
        )}

        {/* Pending badge */}
        {hasPendingRequest && (
          <div className="flex items-center justify-center gap-2 py-2 bg-yellow-500/20 rounded-xl">
            <span className="font-semibold">⏳ Request Pending Approval</span>
          </div>
        )}

        {/* Already a member */}
        {isUserMember && (
          <div className="flex items-center justify-center gap-2 py-2">
            <Heart className="w-5 h-5 fill-current" />
            <span className="font-semibold">You&apos;re a member</span>
            {userRole && userRole !== 'member' && (
              <Chip size="sm" variant="solid" className="bg-white/20 text-white capitalize">
                {getRoleIcon(userRole)} {userRole}
              </Chip>
            )}
          </div>
        )}

        {/* Owner badge (if owner but not in members list) */}
        {isOwner && !isUserMember && !hasPendingRequest && (
          <div className="flex items-center justify-center gap-2 py-2">
            <Crown className="w-5 h-5 fill-current" />
            <span className="font-semibold">You own this circle</span>
          </div>
        )}
      </div>

      {/* Pending Requests Banner for Admins */}
      {canManage && pendingMembers.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <UserCog className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">
              {pendingMembers.length} Pending Request{pendingMembers.length > 1 ? 's' : ''}
            </h3>
          </div>
          <div className="space-y-2">
            {pendingMembers.map((member) => {
              const user = typeof member.user === 'object' ? member.user : null;
              if (!user) return null;
              return (
                <div key={member.id} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-3">
                  <Avatar name={user.name?.charAt(0) || 'U'} className="w-9 h-9" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {user.name || 'Unknown User'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      color="success"
                      variant="flat"
                      isIconOnly
                      isLoading={actionLoading === member.id}
                      onClick={() => handleMemberAction('approve', member.id!)}
                      title="Approve"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      isIconOnly
                      isLoading={actionLoading === member.id}
                      onClick={() => handleMemberAction('reject', member.id!)}
                      title="Reject"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        variant="underlined"
      >
        <Tab key="about" title="About">
          <div className="space-y-6 mt-4">
            {/* About */}
            {circle.about && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">About this Circle</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {circle.about}
                </p>
              </div>
            )}

            {/* Circle Info */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Circle Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Type</span>
                  <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                    {getTypeIcon(circle.type)}
                    <span>{getTypeLabel(circle.type)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Category</span>
                  <span className="text-gray-900 dark:text-white">{getCategoryName()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Members</span>
                  <span className="text-gray-900 dark:text-white">{activeMemberCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Created</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(circle.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Rules */}
            {circle.rules && circle.rules.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Community Rules</h3>
                <ul className="space-y-2">
                  {circle.rules.map((ruleObj, idx) => (
                    <li key={ruleObj.id || idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <span className="text-purple-500 font-bold mt-0.5">{idx + 1}.</span>
                      <span>{ruleObj.rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!circle.about && (!circle.rules || circle.rules.length === 0) && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No additional information available
              </div>
            )}
          </div>
        </Tab>

        <Tab key="members" title={`Members (${activeMemberCount})`}>
          <div className="space-y-3 mt-4">
            {activeMembers.length > 0 ? (
              activeMembers.map((member) => {
                const user = typeof member.user === 'object' ? member.user : null;
                if (!user) return null;
                const memberUserId = user.id;
                const isSelf = memberUserId === userId;
                const isMemberOwner =
                  memberUserId === ownerId || member.role === 'owner';

                return (
                  <div
                    key={member.id}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3"
                  >
                    <Avatar name={user.name?.charAt(0) || 'U'} className="w-10 h-10" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {user.name || 'Unknown User'}
                        </h4>
                        {isSelf && (
                          <Chip size="sm" variant="flat" color="primary" className="text-xs">
                            You
                          </Chip>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Joined {formatDate(member.joinedAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Chip
                        size="sm"
                        variant="flat"
                        color={getRoleBadgeColor(member.role)}
                        className="capitalize"
                        startContent={getRoleIcon(member.role)}
                      >
                        {member.role}
                      </Chip>

                      {/* Admin actions on members (not self, not the circle owner) */}
                      {canManage && !isSelf && !isMemberOwner && (
                        <Dropdown>
                          <DropdownTrigger>
                            <Button size="sm" variant="light" isIconOnly>
                              <UserCog className="w-4 h-4" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Member actions">
                            {isOwner && member.role !== 'admin' ? (
                              <DropdownItem
                                key="promote-admin"
                                startContent={<ShieldCheck className="w-4 h-4" />}
                                onClick={() => handleMemberAction('changeRole', member.id!, 'admin')}
                              >
                                Promote to Admin
                              </DropdownItem>
                            ) : isOwner && member.role === 'admin' ? (
                              <DropdownItem
                                key="demote-member"
                                startContent={<Users className="w-4 h-4" />}
                                onClick={() => handleMemberAction('changeRole', member.id!, 'member')}
                              >
                                Demote to Member
                              </DropdownItem>
                            ) : (
                              <DropdownItem key="noop" className="hidden">
                                {null}
                              </DropdownItem>
                            )}
                            {member.role !== 'moderator' ? (
                              <DropdownItem
                                key="make-mod"
                                startContent={<Shield className="w-4 h-4" />}
                                onClick={() => handleMemberAction('changeRole', member.id!, 'moderator')}
                              >
                                Make Moderator
                              </DropdownItem>
                            ) : (
                              <DropdownItem
                                key="remove-mod"
                                startContent={<Users className="w-4 h-4" />}
                                onClick={() => handleMemberAction('changeRole', member.id!, 'member')}
                              >
                                Remove Moderator
                              </DropdownItem>
                            )}
                            <DropdownItem
                              key="remove"
                              className="text-danger"
                              color="danger"
                              startContent={<Trash2 className="w-4 h-4" />}
                              onClick={() => handleMemberAction('remove', member.id!)}
                            >
                              Remove from Circle
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No members yet
              </div>
            )}
          </div>
        </Tab>
      </Tabs>

      {/* ── Settings Modal (owner / admin only) ── */}
      <Modal
        isOpen={settingsModal.isOpen}
        onOpenChange={settingsModal.onOpenChange}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Circle Settings
              </ModalHeader>
              <ModalBody className="space-y-5">
                {/* Name */}
                <Input
                  label="Circle Name"
                  value={editName}
                  onValueChange={setEditName}
                  isRequired
                  variant="bordered"
                />

                {/* Icon */}
                <Input
                  label="Icon (emoji)"
                  value={editIcon}
                  onValueChange={setEditIcon}
                  placeholder="e.g. 🧘"
                  variant="bordered"
                />

                {/* Description */}
                <Textarea
                  label="Short Description"
                  value={editDescription}
                  onValueChange={setEditDescription}
                  maxLength={500}
                  variant="bordered"
                />

                {/* About */}
                <Textarea
                  label="About (extended)"
                  value={editAbout}
                  onValueChange={setEditAbout}
                  maxLength={2000}
                  minRows={3}
                  variant="bordered"
                />

                {/* Type */}
                <Select
                  label="Circle Type"
                  selectedKeys={new Set([editType])}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0] as string;
                    if (val) setEditType(val as Circle['type']);
                  }}
                  variant="bordered"
                >
                  <SelectItem key="public" startContent={<Globe className="w-4 h-4" />}>
                    Public
                  </SelectItem>
                  <SelectItem key="private" startContent={<Lock className="w-4 h-4" />}>
                    Private
                  </SelectItem>
                  <SelectItem key="invite_only" startContent={<Mail className="w-4 h-4" />}>
                    Invite Only
                  </SelectItem>
                </Select>

                {/* Rules */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rules
                    </label>
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      startContent={<Plus className="w-3 h-3" />}
                      onClick={() => setEditRules([...editRules, ''])}
                    >
                      Add Rule
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {editRules.map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 w-6">{idx + 1}.</span>
                        <Input
                          size="sm"
                          value={rule}
                          onValueChange={(val) => {
                            const updated = [...editRules];
                            updated[idx] = val;
                            setEditRules(updated);
                          }}
                          variant="bordered"
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          isIconOnly
                          onClick={() => setEditRules(editRules.filter((_, i) => i !== idx))}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tags
                    </label>
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      startContent={<Plus className="w-3 h-3" />}
                      onClick={() => setEditTags([...editTags, ''])}
                    >
                      Add Tag
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editTags.map((tag, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <Input
                          size="sm"
                          value={tag}
                          onValueChange={(val) => {
                            const updated = [...editTags];
                            updated[idx] = val;
                            setEditTags(updated);
                          }}
                          variant="bordered"
                          className="w-32"
                          startContent={<span className="text-gray-400">#</span>}
                        />
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          isIconOnly
                          onClick={() => setEditTags(editTags.filter((_, i) => i !== idx))}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSaveSettings}
                  isLoading={isSaving}
                  startContent={!isSaving ? <Save className="w-4 h-4" /> : undefined}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}