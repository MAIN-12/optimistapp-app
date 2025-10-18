'use client';

import { useState } from 'react';
import { Users, Lock, Shield, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input, Button, Chip } from '@heroui/react';
import circlesData from './circles-data.json';
import CategoryFilter from './CategoryFilter';

export default function Circles() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const router = useRouter();
    const { circles } = circlesData;

    const categories = ['All', 'Support', 'Wellness', 'Health', 'Arts', 'Family', 'Literature'];

    const filteredCircles = circles.filter(circle => {
        const matchesSearch = circle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            circle.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || circle.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleCircleClick = (circleId: string) => {
        router.push(`/circles/${circleId}`);
    };

    const formatMemberCount = (count: number) => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }
        return count.toString();
    };

    return (
        <div className="w-full space-y-6 hidden-scrollbar mb-10 mt-3">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Communities</h1>
                <p className="text-gray-600">Find your tribe and connect with like-minded people</p>
            </div>

            {/* Search */}
            <div className="mb-6 w-full">
                <Input
                    placeholder="Search communities..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    startContent={<Search className="w-4 h-4 text-gray-400" />}
                    variant="bordered"
                    className="w-full max-w-full"
                />
            </div>

            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
            />

            {/* Circles Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
                {filteredCircles.map((circle) => (
                    <div
                        key={circle.id}
                        onClick={() => handleCircleClick(circle.id)}
                        className={`
              relative overflow-hidden rounded-2xl p-4 sm:p-6 cursor-pointer
              transform transition-all duration-200 hover:scale-101 hover:shadow-lg
              bg-gradient-to-br ${circle.gradient} text-white
              min-h-[180px] sm:min-h-[200px] flex flex-col justify-between
              w-full max-w-full
            `}
                    >
                        {/* Circle Type Indicator */}
                        <div className="absolute top-4 right-4">
                            {circle.type === 'private' ? (
                                <Lock className="w-4 h-4 text-white/80" />
                            ) : (
                                <Users className="w-4 h-4 text-white/80" />
                            )}
                        </div>

                        {/* Circle Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <span className="text-3xl">{circle.icon}</span>
                            </div>
                        </div>

                        {/* Circle Info */}
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2">{circle.name}</h3>
                            <p className="text-white/90 text-sm mb-4 leading-relaxed">
                                {circle.description}
                            </p>

                            {/* Member Count and Join Status */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-white/80 text-sm">
                                    <Users className="w-4 h-4" />
                                    <span>{formatMemberCount(circle.memberCount)} members</span>
                                </div>

                                {circle.isJoined ? (
                                    <Chip
                                        size="sm"
                                        variant="solid"
                                        className="bg-white/20 text-white"
                                    >
                                        Joined
                                    </Chip>
                                ) : (
                                    <Chip
                                        size="sm"
                                        variant="solid"
                                        className="bg-white/20 text-white"
                                    >
                                        {circle.type === 'private' ? 'Request' : 'Join'}
                                    </Chip>
                                )}
                            </div>
                        </div>

                        {/* Decorative elements - positioned to stay within bounds */}
                        <div className="absolute bottom-2 left-2 w-8 h-8 bg-white/10 rounded-full"></div>
                        <div className="absolute top-2 right-8 w-6 h-6 bg-white/10 rounded-full"></div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCircles.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No communities found</h3>
                    <p className="text-gray-500">Try adjusting your search or category filter</p>
                </div>
            )}
        </div>
    );
}