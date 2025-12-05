'use client';

import { useUser } from '@/providers/AuthProvider';
import { Button, Card, CardBody, CardHeader, Avatar, Divider, Skeleton } from "@heroui/react";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { Media } from '@/payload-types';

import { PlusIcon } from "@/components/icons/PlusIcon";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { VerticalDotsIcon } from "@/components/icons/VerticalDotsIcon";

export default function ProfilePage() {
  const { user, isLoading, error } = useUser();
  const t = useTranslations();
  const [showMoreStats, setShowMoreStats] = useState(false);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <p className="text-red-500 text-center mb-4">Error loading profile: {error.message}</p>
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
        <p className="text-gray-600 mb-6 text-center">
          You need to be signed in to view your profile
        </p>
        <Button color="primary" as={Link} href="/login">
          Sign In
        </Button>
      </div>
    );
  }

  // Get picture URL from Payload media relation
  const pictureUrl = user?.picture 
    ? typeof user.picture === 'object' 
      ? (user.picture as Media)?.url 
      : undefined
    : undefined;

  return (
    <div className="w-full space-y-6 px-2 py-6">
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
              >
                <PlusIcon className="w-3 h-3" />
              </Button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.name || 'Anonymous User'}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {user.email}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Member since {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                color="primary"
                size="sm"
                className="font-medium"
              >
                Edit Profile
              </Button>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                aria-label="More options"
              >
                <VerticalDotsIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
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
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-700">24</div>
                  <div className="text-xs text-gray-600">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-700">7</div>
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
            <Button
              variant="light"
              size="lg"
              className="w-full justify-start"
            >
              Notification Preferences
            </Button>
            <Divider />
            <Button
              variant="light"
              size="lg"
              className="w-full justify-start"
            >
              Privacy Settings
            </Button>
            <Divider />
            <Button
              variant="light"
              size="lg"
              className="w-full justify-start"
            >
              Language & Region
            </Button>
            <Divider />
            <Button
              variant="light"
              size="lg"
              className="w-full justify-start"
            >
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
