'use client';

import { SignUp, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/dashboard');
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded || (isLoaded && isSignedIn)) {
    return (
      <div className='absolute top-0 right-0 bottom-0 left-0 z-1 flex flex-col items-center justify-center bg-white'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
      </div>
    );
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-white'>
      <div className='w-full max-w-md mb-8'>
        <SignUp
          signInUrl='/sign-in'
          forceRedirectUrl='/dashboard'
        />
      </div>
    </main>
  );
}
