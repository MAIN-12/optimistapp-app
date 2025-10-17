'use client';

import { User, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@heroui/react';
import UserAvatar from './Auth/Avatar';

export default function UserDropdown() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const handleAction = (key: string) => {
    switch (key) {
      case 'profile':
        router.push('/profile');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'logout':
        router.push('/api/auth/logout');
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
    );
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <button className="outline-none">
          <UserAvatar className="w-8 h-8" />
        </button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="User menu"
        onAction={(key) => handleAction(key as string)}
      >
        <DropdownSection title={user?.name || 'User'} showDivider>
          <DropdownItem 
            key="email" 
            className="h-14 gap-2"
            textValue={user?.email || ''}
          >
            <p className="text-sm text-gray-500">
              {user?.email}
            </p>
          </DropdownItem>
        </DropdownSection>
        
        <DropdownSection>
          <DropdownItem
            key="profile"
            startContent={<User className="w-4 h-4" />}
          >
            Profile
          </DropdownItem>
          <DropdownItem
            key="settings"
            startContent={<Settings className="w-4 h-4" />}
          >
            Settings
          </DropdownItem>
        </DropdownSection>
        
        <DropdownSection>
          <DropdownItem
            key="logout"
            className="text-danger"
            color="danger"
            startContent={<LogOut className="w-4 h-4" />}
          >
            Logout
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}