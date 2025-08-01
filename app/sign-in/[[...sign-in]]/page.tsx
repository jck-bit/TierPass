'use client';

import { SignIn, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function Page() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // If the user is already signed in, redirect them to the `/dashboard` page
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/dashboard');
    }
  }, [isSignedIn, isLoaded, router]);

  // Show loading state while Clerk is loading or user is being redirected
  if (!isLoaded || (isLoaded && isSignedIn)) {
    return (
      <div className='absolute top-0 right-0 bottom-0 left-0 z-1 flex flex-col items-center justify-center bg-white'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
      </div>
    );
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-white'>
      <div className='w-full max-w-md'>
        <SignIn /> 
      </div>
    </main>
  );
}
