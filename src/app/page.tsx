
'use client';

import { useFirebase } from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase, Zap, Bot, GanttChartSquare } from 'lucide-react';

export default function LoginPage() {
  const { auth, user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = () => {
    if (auth) {
      const provider = new GoogleAuthProvider();
      signInWithRedirect(auth, provider);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-3">Loading application...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-muted p-12 text-foreground">
        <div className="flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">MARCUS Automation Suite</h1>
        </div>

        <div className="space-y-6 max-w-md">
            <h2 className="text-4xl font-bold tracking-tight">Streamline Your RFP Workflow</h2>
            <p className="text-muted-foreground">
                From creation to award, leverage intelligent automation to manage your Request for Proposal process with unparalleled efficiency.
            </p>
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Zap className="h-5 w-5"/>
                    </div>
                    <div>
                        <h3 className="font-semibold">Automated RFP Generation</h3>
                        <p className="text-sm text-muted-foreground">Create comprehensive RFP documents in minutes using AI-powered templates.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Bot className="h-5 w-5"/>
                    </div>
                    <div>
                        <h3 className="font-semibold">Intelligent Bid Analysis</h3>
                        <p className="text-sm text-muted-foreground">Leverage AI for comparative analysis and bid scoring to make data-driven decisions.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <GanttChartSquare className="h-5 w-5"/>
                    </div>
                    <div>
                        <h3 className="font-semibold">Centralized Project Tracking</h3>
                        <p className="text-sm text-muted-foreground">Monitor all your RFPs, timelines, and budgets from a single, intuitive dashboard.</p>
                    </div>
                </div>
            </div>
        </div>

        <footer className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MARCUS Automation Suite. All rights reserved.
        </footer>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm text-center">
            <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
            <p className="mt-2 text-muted-foreground">Sign in to access your dashboard</p>
            <Button className="w-full mt-8" onClick={handleSignIn} size="lg">
                Sign in with Google
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
                By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
      </div>
    </div>
  );
}
