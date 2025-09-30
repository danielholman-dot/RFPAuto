
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectIntakeForm } from "@/components/rfp/project-intake-form";
import { getContractorTypes, getMetroCodes } from "@/lib/data";
import { useEffect, useState } from "react";

export default function NewRfpPage() {
  const [metroCodes, setMetroCodes] = useState<{code: string, city: string}[]>([]);
  const [contractorTypes, setContractorTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [metros, types] = await Promise.all([
        getMetroCodes(),
        getContractorTypes(),
      ]);
      setMetroCodes(metros.map(m => ({code: m.code, city: m.city})));
      setContractorTypes(types);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div>Loading form...</div>;
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
          <ProjectIntakeForm metroCodes={metroCodes} contractorTypes={contractorTypes} />
        </CardContent>
      </Card>
    </div>
  )
}
