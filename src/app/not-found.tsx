"use client";

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@heroui/react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-purple-600 mb-4">404</div>
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-teal-600 rounded-full flex items-center justify-center mb-4">
            <Search className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            as={Link}
            href="/"
            color="primary"
            size="lg"
            className="w-full bg-gradient-to-r from-purple-500 to-teal-500"
            startContent={<Home className="w-5 h-5" />}
          >
            Go Home
          </Button>
          
          <Button
            as={Link}
            href="/messages"
            variant="bordered"
            size="lg"
            className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
            startContent={<ArrowLeft className="w-5 h-5" />}
          >
            Back to Messages
          </Button>
        </div>

        {/* Additional Links */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">Looking for something specific?</p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/categories" 
              className="text-purple-600 hover:text-purple-800 transition-colors"
            >
              Categories
            </Link>
            <Link 
              href="/circles" 
              className="text-purple-600 hover:text-purple-800 transition-colors"
            >
              Circles
            </Link>
            <Link 
              href="/favorites" 
              className="text-purple-600 hover:text-purple-800 transition-colors"
            >
              Favorites
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-teal-200/30 rounded-full blur-xl"></div>
      </div>
    </div>
  );
}