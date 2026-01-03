'use client';

import { useAuth } from '@/providers/AuthProvider';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Divider,
  Skeleton,
  Input,
  Textarea,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
  addToast,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Media, ProfilePicture } from '@/payload-types';

import { PlusIcon } from '@/components/icons/PlusIcon';
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon';
import { VerticalDotsIcon } from '@/components/icons/VerticalDotsIcon';

// Types for form data
interface ProfileFormData {
  name: string;
  lastName: string;
  nickname: string;
  bio: string;
  location: string;
  website: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  gender: string;
}

export default function ProfilePage() {
  const { user, isLoading, error, refreshUser } = useAuth();
  const t = useTranslations();
  const [showMoreStats, setShowMoreStats] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen: isPhotoModalOpen, onOpen: onPhotoModalOpen, onClose: onPhotoModalClose } = useDisclosure();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form state
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    lastName: '',
    nickname: '',
    bio: '',
    location: '',
    website: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    gender: '',
  });

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      // Parse birthday if exists
      let birthDay = '';
      let birthMonth = '';
      let birthYear = '';
      if (user.birthday) {
        const date = new Date(user.birthday);
        birthDay = date.getDate().toString();
        birthMonth = (date.getMonth() + 1).toString();
        birthYear = date.getFullYear().toString();
      }

      setFormData({
        name: user.name || '',
        lastName: user.lastName || '',
        nickname: user.nickname || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        birthDay,
        birthMonth,
        birthYear,
        gender: user.gender || '',
      });
    }
  }, [user]);

  // Generate day, month, year options
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => (i + 1).toString()), []);
  const months = useMemo(
    () => [
      { value: '1', label: t('Onboarding.birthday.months.january') },
      { value: '2', label: t('Onboarding.birthday.months.february') },
      { value: '3', label: t('Onboarding.birthday.months.march') },
      { value: '4', label: t('Onboarding.birthday.months.april') },
      { value: '5', label: t('Onboarding.birthday.months.may') },
      { value: '6', label: t('Onboarding.birthday.months.june') },
      { value: '7', label: t('Onboarding.birthday.months.july') },
      { value: '8', label: t('Onboarding.birthday.months.august') },
      { value: '9', label: t('Onboarding.birthday.months.september') },
      { value: '10', label: t('Onboarding.birthday.months.october') },
      { value: '11', label: t('Onboarding.birthday.months.november') },
      { value: '12', label: t('Onboarding.birthday.months.december') },
    ],
    [t]
  );
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 100 }, (_, i) => (currentYear - i).toString()),
    [currentYear]
  );

  const genderOptions = [
    { value: 'male', label: t('Onboarding.genderOptions.male') },
    { value: 'female', label: t('Onboarding.genderOptions.female') },
    { value: 'non-binary', label: t('Onboarding.genderOptions.nonBinary') },
    { value: 'prefer-not-to-say', label: t('Onboarding.genderOptions.preferNotToSay') },
    { value: 'other', label: t('Onboarding.genderOptions.other') },
  ];

  // Get picture URL from Payload media relation
  const getPictureUrl = () => {
    // Check profilePicture first (from onboarding), then picture
    if (user?.profilePicture && typeof user.profilePicture === 'object') {
      return (user.profilePicture as ProfilePicture)?.url;
    }
    if (user?.picture && typeof user.picture === 'object') {
      return (user.picture as Media)?.url;
    }
    return undefined;
  };

  const pictureUrl = getPictureUrl();

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onPhotoModalOpen();
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploadingPhoto(true);
    try {
      // Upload the photo to profile-pictures collection
      const formDataUpload = new FormData();
      formDataUpload.append('file', selectedFile);
      formDataUpload.append('alt', `${user.name}'s profile picture`);

      const uploadResponse = await fetch('/api/profile-pictures', {
        method: 'POST',
        credentials: 'include',
        body: formDataUpload,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload photo');
      }

      const uploadResult = await uploadResponse.json();

      // Update user with new profile picture
      const updateResponse = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          profilePicture: uploadResult.doc.id,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update profile');
      }

      await refreshUser();
      addToast({
        title: t('Profile.photoUpdated') || 'Profile photo updated successfully!',
        color: 'success',
      });
      onPhotoModalClose();
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (err) {
      console.error('Error uploading photo:', err);
      addToast({
        title: t('Profile.photoError') || 'Failed to upload photo. Please try again.',
        color: 'danger',
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Build birthday date if all parts are provided
      let birthday: string | null = null;
      if (formData.birthDay && formData.birthMonth && formData.birthYear) {
        const date = new Date(
          parseInt(formData.birthYear),
          parseInt(formData.birthMonth) - 1,
          parseInt(formData.birthDay)
        );
        birthday = date.toISOString();
      }

      const updateData: Record<string, unknown> = {
        name: formData.name,
        lastName: formData.lastName || null,
        nickname: formData.nickname || null,
        bio: formData.bio || null,
        location: formData.location || null,
        website: formData.website || null,
        birthday,
        gender: formData.gender || null,
      };

      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await refreshUser();
      setIsEditing(false);
      addToast({
        title: t('Profile.saved') || 'Profile saved successfully!',
        color: 'success',
      });
    } catch (err) {
      console.error('Error saving profile:', err);
      addToast({
        title: t('Profile.saveError') || 'Failed to save profile. Please try again.',
        color: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original user data
    if (user) {
      let birthDay = '';
      let birthMonth = '';
      let birthYear = '';
      if (user.birthday) {
        const date = new Date(user.birthday);
        birthDay = date.getDate().toString();
        birthMonth = (date.getMonth() + 1).toString();
        birthYear = date.getFullYear().toString();
      }

      setFormData({
        name: user.name || '',
        lastName: user.lastName || '',
        nickname: user.nickname || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        birthDay,
        birthMonth,
        birthYear,
        gender: user.gender || '',
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <p className="text-red-500 text-center mb-4">Error loading profile: {error}</p>
        <Button color="primary" as={Link} href="/">
          Go Home
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
        <p className="text-gray-600 mb-6 text-center">You need to be signed in to view your profile</p>
        <Button color="primary" as={Link} href="/login">
          Sign In
        </Button>
      </div>
    );
  }

  // Format display values
  const formatBirthday = () => {
    if (user.birthday) {
      return new Date(user.birthday).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return 'Not set';
  };

  const formatGender = () => {
    const option = genderOptions.find((g) => g.value === user.gender);
    return option?.label || 'Not set';
  };

  return (
    <div className="w-full space-y-6 px-2 py-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handlePhotoSelect}
      />

      {/* Photo Upload Modal */}
      <Modal isOpen={isPhotoModalOpen} onClose={onPhotoModalClose} size="sm">
        <ModalContent>
          <ModalHeader>Update Profile Photo</ModalHeader>
          <ModalBody className="flex flex-col items-center gap-4">
            {previewUrl && (
              <Avatar src={previewUrl} className="w-32 h-32" alt="Preview" />
            )}
            <p className="text-sm text-gray-600 text-center">
              This photo will be visible to other users in the community.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onPhotoModalClose} isDisabled={isUploadingPhoto}>
              Cancel
            </Button>
            <Button color="primary" onPress={handlePhotoUpload} isLoading={isUploadingPhoto}>
              Upload Photo
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Profile Header */}
      <Card className="w-full">
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                src={pictureUrl || undefined}
                alt={`${user.name}'s profile picture`}
                className="w-24 h-24 sm:w-20 sm:h-20"
                showFallback
                name={user.name?.charAt(0) || 'U'}
              />
              <Button
                isIconOnly
                size="sm"
                color="primary"
                className="absolute -bottom-1 -right-1 w-6 h-6 min-w-6"
                aria-label="Edit profile picture"
                onPress={() => fileInputRef.current?.click()}
              >
                <PlusIcon className="w-3 h-3" />
              </Button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    label="Name"
                    value={formData.name}
                    onValueChange={(value) => handleInputChange('name', value)}
                    isRequired
                    size="sm"
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onValueChange={(value) => handleInputChange('lastName', value)}
                    size="sm"
                  />
                  <Input
                    label="Nickname"
                    value={formData.nickname}
                    onValueChange={(value) => handleInputChange('nickname', value)}
                    size="sm"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name} {user.lastName && user.lastName}
                  </h1>
                  {user.nickname && (
                    <p className="text-gray-500 text-sm">@{user.nickname}</p>
                  )}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{user.email}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button color="default" size="sm" variant="flat" onPress={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    className="font-medium"
                    onPress={handleSaveProfile}
                    isLoading={isSaving}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="primary"
                    size="sm"
                    className="font-medium"
                    onPress={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button isIconOnly variant="light" size="sm" aria-label="More options">
                    <VerticalDotsIcon className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Personal Info Section */}
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold">Personal Information</h2>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          {isEditing ? (
            <>
              <Textarea
                label="Bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onValueChange={(value) => handleInputChange('bio', value)}
                maxLength={500}
                description={`${formData.bio.length}/500 characters`}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Location"
                  placeholder="City, Country"
                  value={formData.location}
                  onValueChange={(value) => handleInputChange('location', value)}
                />
                <Input
                  label="Website"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onValueChange={(value) => handleInputChange('website', value)}
                  type="url"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Birthday
                </label>
                <div className="flex gap-2">
                  <Autocomplete
                    placeholder="Day"
                    selectedKey={formData.birthDay}
                    onSelectionChange={(key) => handleInputChange('birthDay', key?.toString() || '')}
                    className="w-24"
                    size="sm"
                  >
                    {days.map((day) => (
                      <AutocompleteItem key={day}>{day}</AutocompleteItem>
                    ))}
                  </Autocomplete>
                  <Autocomplete
                    placeholder="Month"
                    selectedKey={formData.birthMonth}
                    onSelectionChange={(key) => handleInputChange('birthMonth', key?.toString() || '')}
                    className="flex-1"
                    size="sm"
                  >
                    {months.map((month) => (
                      <AutocompleteItem key={month.value}>{month.label}</AutocompleteItem>
                    ))}
                  </Autocomplete>
                  <Autocomplete
                    placeholder="Year"
                    selectedKey={formData.birthYear}
                    onSelectionChange={(key) => handleInputChange('birthYear', key?.toString() || '')}
                    className="w-32"
                    size="sm"
                  >
                    {years.map((year) => (
                      <AutocompleteItem key={year}>{year}</AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </div>
              <Select
                label="Gender"
                selectedKeys={formData.gender ? [formData.gender] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  handleInputChange('gender', selected?.toString() || '');
                }}
              >
                {genderOptions.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </>
          ) : (
            <div className="space-y-4">
              {user.bio && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</p>
                  <p className="text-gray-900 dark:text-white">{user.bio}</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                  <p className="text-gray-900 dark:text-white">{user.location || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</p>
                  {user.website ? (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {user.website}
                    </a>
                  ) : (
                    <p className="text-gray-900 dark:text-white">Not set</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Birthday</p>
                  <p className="text-gray-900 dark:text-white">{formatBirthday()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</p>
                  <p className="text-gray-900 dark:text-white">{formatGender()}</p>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Stats Section */}
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold">Your Activity</h2>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">42</div>
              <div className="text-xs text-gray-600">Messages Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">18</div>
              <div className="text-xs text-gray-600">Favorites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">5</div>
              <div className="text-xs text-gray-600">Circles Joined</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">127</div>
              <div className="text-xs text-gray-600">Positive Vibes</div>
            </div>
          </div>

          {showMoreStats && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-700 dark:text-gray-300">24</div>
                  <div className="text-xs text-gray-600">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-700 dark:text-gray-300">7</div>
                  <div className="text-xs text-gray-600">Streak Days</div>
                </div>
              </div>
            </div>
          )}

          <Button
            variant="light"
            size="sm"
            className="w-full mt-4"
            endContent={
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${showMoreStats ? 'rotate-180' : ''}`}
              />
            }
            onClick={() => setShowMoreStats(!showMoreStats)}
          >
            {showMoreStats ? 'Show Less' : 'Show More Stats'}
          </Button>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              color="primary"
              variant="flat"
              size="lg"
              className="justify-start"
              as={Link}
              href="/send-vives"
            >
              <PlusIcon className="w-4 h-4" />
              Send Positive Vibes
            </Button>
            <Button
              color="success"
              variant="flat"
              size="lg"
              className="justify-start"
              as={Link}
              href="/favorites"
            >
              View Favorites
            </Button>
            <Button
              color="warning"
              variant="flat"
              size="lg"
              className="justify-start"
              as={Link}
              href="/circles"
            >
              Join Circles
            </Button>
            <Button
              color="secondary"
              variant="flat"
              size="lg"
              className="justify-start"
              as={Link}
              href="/messages"
            >
              Browse Messages
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Settings & Preferences */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Settings</h2>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="space-y-3">
            <Button variant="light" size="lg" className="w-full justify-start">
              Notification Preferences
            </Button>
            <Divider />
            <Button variant="light" size="lg" className="w-full justify-start">
              Privacy Settings
            </Button>
            <Divider />
            <Button variant="light" size="lg" className="w-full justify-start">
              Language & Region
            </Button>
            <Divider />
            <Button variant="light" size="lg" className="w-full justify-start">
              Help & Support
            </Button>
            <Divider />
            <Button
              variant="light"
              size="lg"
              className="w-full justify-start text-danger"
              as={Link}
              href="/api/auth/logout"
            >
              Sign Out
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="w-full space-y-6 px-2 py-6">
      {/* Profile Header Skeleton */}
      <Card className="w-full">
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Skeleton className="w-24 h-24 sm:w-20 sm:h-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48 mx-auto sm:mx-0" />
              <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
              <Skeleton className="h-3 w-24 mx-auto sm:mx-0" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Personal Info Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardBody>
      </Card>

      {/* Stats Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center space-y-1">
                <Skeleton className="h-6 w-8 mx-auto" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Quick Actions Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
