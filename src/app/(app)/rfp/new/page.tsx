
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectIntakeForm } from "@/components/rfp/project-intake-form";
import { useCollection, useMemoFirebase, useFirestore, useUser } from "@/firebase";
import { collection } from 'firebase/firestore';
import type { MetroCode } from "@/lib/types";
import { contractorTypes as allContractorTypes } from '@/lib/seed';
import { useMemo } from "react";
import { Loader2 } from "lucide-react";

export default function NewRfpPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const metroCodesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'metro_codes');
  }, [firestore, user]);
  const { data: metroCodes, isLoading: metrosLoading } = useCollection<MetroCode>(metroCodesQuery);

  const metroOptions = useMemo(() => {
    if (!metroCodes) return [];
    return metroCodes.map(m => ({ code: m.code, city: m.city }));
  }, [metroCodes]);

  const loading = isUserLoading || metrosLoading;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create a New RFP</CardTitle>
          <CardDescription>
            Fill out the details below to start a new Request for Proposal. This will create a draft that you can finalize and send later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectIntakeForm metroCodes={metroOptions || []} contractorTypes={allContractorTypes || []} />
        </CardContent>
      </Card>
    </div>
  )
}
