
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectIntakeForm } from "@/components/rfp/project-intake-form";
import { contractorTypes } from "@/lib/data";
import type { MetroCode } from "@/lib/types";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export default function NewRfpPage() {
  const firestore = useFirestore();

  const metroCodesQuery = useMemoFirebase(() => collection(firestore, 'metro_codes'), [firestore]);
  const { data: allMetroCodes, isLoading: metrosLoading } = useCollection<MetroCode>(metroCodesQuery);

  const sortedMetroCodes = useMemo(() => {
    if (!allMetroCodes) return [];
    return [...allMetroCodes].sort((a, b) => a.code.localeCompare(b.code));
  }, [allMetroCodes]);

  if (metrosLoading) {
      return (
          <div className="flex h-screen items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      )
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
          <ProjectIntakeForm metroCodes={sortedMetroCodes} contractorTypes={contractorTypes} />
        </CardContent>
      </Card>
    </div>
  )
}
