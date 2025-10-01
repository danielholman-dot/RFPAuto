
'use client';

import { useFirebase } from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase, Zap, Bot, GanttChartSquare } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Helper component for feature highlights
const FeatureHighlight = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-1">
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{children}</p>
        </div>
    </div>
);

export default function LoginPage() {
  const { auth, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // If a logged-in user lands here, redirect them to the dashboard.
  useEffect(() => {
    if (!isUserLoading && user) {
      setIsRedirecting(true);
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = () => {
    if (auth) {
      const provider = new GoogleAuthProvider();
      // Use signInWithRedirect for a full-page redirect flow.
      signInWithRedirect(auth, provider);
    }
  };

  // Show a loading screen during the initial auth check or while redirecting.
  // This prevents the login page from flashing before a redirect.
  if (isUserLoading || isRedirecting || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-3">Loading application...</p>
      </div>
    );
  }

  const landingImage = PlaceHolderImages.find(img => img.id === 'dashboard-hero');

  // If we are done loading and there is no user, show the full login page.
  return (
    <div className="flex h-screen w-full bg-card">
      <div className="hidden lg:flex lg:w-1/2 relative">
          <Image 
            src={landingImage?.imageUrl || "https://picsum.photos/seed/arch/1200/1800"}
            alt={landingImage?.description || "An abstract image representing modern architecture"}
            fill
            className="object-cover"
            data-ai-hint={landingImage?.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="relative z-10 flex flex-col justify-end p-12 text-white">
              <h2 className="text-4xl font-bold tracking-tight">From request to resolution, intelligently.</h2>
              <p className="mt-4 text-lg max-w-lg">
                  The MARCUS Automation Suite transforms your procurement lifecycle with AI-driven insights, streamlined workflows, and unparalleled efficiency.
              </p>
          </div>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
            <div className="text-left">
                <div className="flex items-center gap-3 mb-4">
                    <Briefcase className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">MARCUS Automation Suite</h1>
                </div>
                <p className="text-muted-foreground">
                    Sign in to access your dashboard and manage your procurement projects.
                </p>
            </div>
            
            <div className="space-y-6">
                 <FeatureHighlight icon={<Zap className="h-5 w-5"/>} title="Automated RFP Generation">
                    Create comprehensive, compliant RFP documents in minutes using AI-powered templates and project data.
                </FeatureHighlight>
                <FeatureHighlight icon={<Bot className="h-5 w-5"/>} title="Intelligent Bid Analysis">
                    Leverage AI for comparative analysis and bid scoring to make confident, data-driven award decisions.
                </FeatureHighlight>
                 <FeatureHighlight icon={<GanttChartSquare className="h-5 w-5"/>} title="Centralized Project Tracking">
                    Monitor all your RFPs, timelines, and budgets from a single, intuitive dashboard.
                </FeatureHighlight>
            </div>

            <div className="space-y-4 pt-4">
                <button onClick={handleSignIn} className="w-full flex justify-center" aria-label="Sign in with Google">
                    <Image 
                        src="https://developers.google.com/static/identity/images/branding_guideline_sample_lt_rd_lg.svg"
                        alt="Sign in with Google button"
                        width={191}
                        height={46}
                        className="cursor-pointer hover:opacity-90 transition-opacity"
                        priority
                    />
                </button>
                <p className="px-8 text-center text-xs text-muted-foreground">
                    By clicking "Sign in with Google", you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
