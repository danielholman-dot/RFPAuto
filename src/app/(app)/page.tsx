
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This is a temporary component to redirect from the old root to the new /dashboard page.
export default function OldHomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null;
}
