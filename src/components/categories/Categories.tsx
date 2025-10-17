'use client';

import { useRouter } from 'next/navigation';
import categoriesData from './categories-data.json';

export default function Categories() {
  const router = useRouter();
  const { categories } = categoriesData;

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/categories/${categoryId}`);
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={`
            relative overflow-hidden rounded-3xl p-6 cursor-pointer
            transform transition-all duration-200 hover:scale-105 hover:shadow-lg
            bg-gradient-to-br ${category.gradient}
            min-h-[180px] flex flex-col justify-between
          `}
          style={{ backgroundColor: category.bgColor }}
        >
          {/* Icon container */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">{category.icon}</span>
            </div>
          </div>

          {/* Category info */}
          <div className="text-center text-white">
            <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
            <p className="text-white/80 text-sm">
              {category.messageCount} messages
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/10 rounded-full"></div>
        </div>
      ))}
    </div>
  );
}