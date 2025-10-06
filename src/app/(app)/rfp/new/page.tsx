
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectIntakeForm } from "@/components/rfp/project-intake-form";
import { MetroCodesData, contractorTypes } from "@/lib/data";
import type { MetroCode } from "@/lib/types";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";

export default function NewRfpPage() {

  const sortedMetroCodes = useMemo(() => {
    return [...MetroCodesData].sort((a, b) => a.code.localeCompare(b.code));
  }, []);

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
