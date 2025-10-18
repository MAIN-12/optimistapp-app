'use client';

import { useState, useRef, useEffect } from 'react';
import { Chip } from '@heroui/react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategorySelect
}: CategoryFilterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    containerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleChipClick = (category: string) => {
    // Only trigger if we're not dragging
    if (!isDragging) {
      onCategorySelect(category);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent text selection while dragging
    const handleSelectStart = (e: Event) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    document.addEventListener('selectstart', handleSelectStart);
    
    return () => {
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, [isDragging]);

  return (
    <div className="w-0 min-w-full overflow-hidden">
      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide cursor-grab select-none p-2 pb-3 mb-6"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          width: '100%',
          maxWidth: '100vw',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {categories.map((category, index) => (
          <div
            key={category}
            className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <Chip
              variant={selectedCategory === category ? 'solid' : 'bordered'}
              color={selectedCategory === category ? 'primary' : 'default'}
              onClick={() => handleChipClick(category)}
              className={`
                cursor-pointer whitespace-nowrap transition-all duration-200
                ${selectedCategory === category 
                  ? 'shadow-lg scale-105' 
                  : 'hover:shadow-md hover:scale-102'
                }
                ${isDragging ? 'pointer-events-none' : ''}
              `}
            >
              {category}
            </Chip>
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}