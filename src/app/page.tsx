
'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const landingImage = PlaceHolderImages.find(img => img.id === 'procurement-landing');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    try {
        // Use one of the pre-seeded user emails to sign in as a "guest"
        // This simulates a guest user with a pre-defined role
        await signInWithEmailAndPassword(auth, 'bob.w@example.com', 'password123');
        router.push('/dashboard');
    } catch (error: any) {
        // As a fallback if the seeded user doesn't exist, sign in anonymously
        try {
            await signInAnonymously(auth);
            router.push('/dashboard');
        } catch (anonError: any) {
             toast({
                variant: 'destructive',
                title: 'Guest Login Failed',
                description: anonError.message,
            });
            setIsGuestLoading(false);
        }
    }
  };


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
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Login
                        </Button>
                         <Button variant="outline" className="w-full" onClick={handleGuestLogin} disabled={isGuestLoading}>
                            {isGuestLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Continue as Guest
                        </Button>
                    </CardFooter>
                </form>
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
