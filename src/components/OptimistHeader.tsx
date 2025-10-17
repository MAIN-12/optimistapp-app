'use client';

import { Music, Bell, Settings } from 'lucide-react';
import UserDropdown from './UserDropdown';

export default function OptimistHeader() {

    return (
        <div className="flex items-center justify-between mb-6">
            {/* Left side - Title and User */}
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-blue-600">Optimist</h1>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Music className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-gray-600" />
                </button>
                <UserDropdown />
            </div>
        </div>
    );
}