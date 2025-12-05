// Root not-found page - handles all unmatched routes
import Link from "next/link";
import "../styles/globals.css";
import { Providers } from "./(app)/providers";
import Layout from "./(app)/layout";

export default function NotFound() {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Page Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition"
                >
                    Go Home
                </Link>
            </div>
        </Layout>
    );
}
