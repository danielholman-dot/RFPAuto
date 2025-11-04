'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { signInWithGoogle } from '@/firebase/auth/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Separator } from '@/components/ui/separator';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.67-4.06 1.67-3.4 0-6.17-2.83-6.17-6.23s2.77-6.23 6.17-6.23c1.87 0 3.13.67 4.06 1.67l2.35-2.35C18.27.46 15.47 0 12.48 0 5.88 0 .81 5.06.81 11.69s5.07 11.69 11.67 11.69c3.34 0 5.78-1.15 7.6-2.98 1.9-1.8 2.54-4.35 2.54-6.83 0-.75-.07-1.45-.18-2.15z" fill="currentColor"/>
    </svg>
);


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();

  const landingImage = PlaceHolderImages.find(img => img.id === 'procurement-landing');

  useEffect(() => {
    // If user is logged in, redirect to the main application.
    if (!isUserLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener in the provider will handle the redirect.
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await signInWithGoogle(auth);
    // The redirect result will be handled by the FirebaseProvider, and the useEffect above will trigger the navigation.
  };

  // While checking for user, show a loading state on the page
  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If user is already logged in, this component will be redirecting, so we can return null or a loader.
  if (user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2">
                <Briefcase className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">MARCUS</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              RFP Automation & Management Suite
            </p>
          </div>
           <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="m@example.com" 
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                             />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                required 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Login
                        </Button>
                    </CardFooter>
                </form>
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                        </span>
                    </div>
                </div>
                 <div className="px-6 pb-6">
                    <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading}>
                       {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                        Google
                    </Button>
                </div>
            </Card>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {landingImage && (
            <Image
                src={landingImage.imageUrl}
                alt={landingImage.description}
                fill
                className="object-cover"
                data-ai-hint={landingImage.imageHint}
            />
        )}
      </div>
    </div>
  );
}

    