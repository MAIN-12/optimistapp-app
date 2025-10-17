import { Categories } from '@/components/categories';
import OptimistHeader from '@/components/OptimistHeader';

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
                <p className="text-gray-600">Explore inspiring messages by category</p>
            </div>
            <Categories />
        </div>
    );
}
