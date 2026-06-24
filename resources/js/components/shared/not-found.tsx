import { Link } from '@inertiajs/react';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-8 text-center">
        <h1 className="mb-8 animate-pulse text-9xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          404
        </h1>
        <AlertTriangle className="mx-auto mb-4 size-16 animate-pulse text-yellow-500" />
        <h1 className="mb-4 text-3xl font-bold text-gray-700 dark:text-gray-300">
          Oops! Page not found
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          The admin page you're looking for doesn't exist or you may not have
          the necessary permissions.
        </p>
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-md font-semibold text-gray-700 dark:text-gray-300">
            Quick access to main sections:
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Link
              href="/"
              className="flex flex-col items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <LayoutDashboard className="mb-2 size-6 text-blue-500" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link
              href="/access-control/users"
              className="flex flex-col items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Users className="mb-2 size-6 text-green-500" />
              <span className="text-sm font-medium">Users</span>
            </Link>
            <Link
              href="/"
              className="flex flex-col items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Settings className="mb-2 size-6 text-purple-500" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
            <Link
              href="/"
              className="flex flex-col items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <BarChart3 className="mb-2 size-6 text-red-500" />
              <span className="text-sm font-medium">Reports</span>
            </Link>
          </div>
          <Button asChild className="mt-8">
            <Link href="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
