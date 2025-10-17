import { CategoryMessages } from '@/components/categories';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <div className="space-y-4">
      {/* Back button */}
      <Link 
        href="/categories" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Categories</span>
      </Link>

      <CategoryMessages categoryId={params.categoryId} />
    </div>
  );
}