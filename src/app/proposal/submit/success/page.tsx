'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function SubmissionSuccessPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle>Submission Successful!</CardTitle>
          <CardDescription>Your proposal has been received.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Thank you for your submission. The project owner has been notified.</p>
          <p className="mt-4">
            <Link href="/" className="text-primary hover:underline">
              Return to home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
