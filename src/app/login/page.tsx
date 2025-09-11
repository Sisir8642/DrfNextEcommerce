'use client'
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CgSpinner } from 'react-icons/cg';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { checkAdminAccess } from '../../../lib/axios';

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  console.log("hiehriehriehi")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
  await login(username, password);
  router.push('/admin');
} catch (error: unknown) {
  let message = 'Error occurred !!';
  if (error instanceof Error) {
    message = error.message;
  } else if 
  (typeof error === 'object' && error !== null && 
    'response' in error){
    // AxiosError shape
    const axiosError = error as { response?: { status?: number; data?: any } };
    message = axiosError.response?.data?.detail || message;
    console.log('Error status:', axiosError.response?.status);
  }
  setError(message);
} finally {
  setIsSubmitting(false);
}
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <CgSpinner className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-700 dark:text-gray-300">Loading authentication...</span>
      </div>
    );
  }

  // if (isAuthenticated) return null;

return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 space-y-6">
    
    {/* ✅ Test access info - outside card */}
   {/* 💡 Test Credentials Info Box */}
<div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-700 shadow-sm rounded-lg p-3 text-sm text-center text-gray-700 dark:text-gray-300 max-w-md w-full">
  <div className="flex items-center justify-center mb-1">
    <span className="text-blue-500 text-lg font-semibold mr-2">🧪</span>
    <span className="font-medium text-blue-600 dark:text-blue-400">Test Access</span>
  </div>
  <p className="mb-1">
    Admin Panel: <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs text-blue-700 dark:text-blue-300">baburam / baburam</code>
  </p>
  <p>
    Customer Page: <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs text-green-700 dark:text-green-300">ram</code> (or register)
  </p>
</div>


    {/* 🔐 Login card */}
    <Card className="w-full max-w-md p-6 shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <CgSpinner className="animate-spin h-5 w-5 mr-2" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  </div>
);

}
