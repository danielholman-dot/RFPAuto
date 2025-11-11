
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const auth = useAuth();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading...</p>
    </div>
  );
}
