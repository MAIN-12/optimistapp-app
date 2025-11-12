'use client';

import { Music, Bell, Settings } from 'lucide-react';
import UserDropdown from './UserDropdown';
import PWAInstallButton from './PWAInstallButton';
import { Button } from '@heroui/button';

export default function OptimistHeader() {

    return (
        <div className="flex items-center justify-between mb-6">
            {/* Left side - Title and User */}
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-blue-600">Optimist</h1>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex items-center gap-4">
                <PWAInstallButton />
                <Button
                    startContent={<Music className="w-5 h-5 text-gray-600" />}
                    variant='light'
                    isIconOnly
                    radius='full'
                />
                <Button
                    startContent={<Bell className="w-5 h-5 text-gray-600" />}
                    variant='light'
                    isIconOnly
                    radius='full'
                />
                <UserDropdown />
            </div>
        </div>
    );
}