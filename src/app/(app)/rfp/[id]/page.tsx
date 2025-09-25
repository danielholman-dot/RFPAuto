import { rfps } from '@/lib/data';
import { notFound } from 'next/navigation';
import { RfpTabs } from '@/components/rfp/rfp-tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type RfpDetailPageProps = {
  params: {
    id: string;
  };
};

export default function RfpDetailPage({ params }: RfpDetailPageProps) {
  const rfp = rfps.find((r) => r.id === params.id);

  if (!rfp) {
    // In a real app, you might fetch a new draft from the DB
    // For this demo, we'll create a placeholder for new RFPs
    if (params.id.startsWith('rfp-')) {
        const newRfp = {
            id: params.id,
            projectName: 'New RFP Draft',
            scopeOfWork: 'To be defined.',
            metroCode: 'NYC',
            contractorType: 'General Contractor',
            estimatedBudget: 0,
            startDate: new Date(),
            status: 'Draft' as const,
            proposals: [],
            invitedContractors: [],
        }
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl font-bold">{newRfp.projectName}</CardTitle>
                            <CardDescription>ID: {newRfp.id}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-lg">{newRfp.status}</Badge>
                        </div>
                    </CardHeader>
                </Card>
                <p className="text-center text-muted-foreground py-8">This is a new RFP draft. Complete the details and invite contractors to begin the process.</p>
            </div>
        )
    }
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{rfp.projectName}</CardTitle>
              <CardDescription>ID: {rfp.id}</CardDescription>
            </div>
            <Badge variant={rfp.status === 'Awarded' ? 'default' : 'secondary'} className="text-lg">{rfp.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
            <div><strong>Metro:</strong> {rfp.metroCode}</div>
            <div><strong>Contractor Type:</strong> {rfp.contractorType}</div>
            <div><strong>Start Date:</strong> {rfp.startDate.toLocaleDateString()}</div>
            <div className="md:col-span-3"><strong>Budget:</strong> ${rfp.estimatedBudget.toLocaleString()}</div>
            <div className="md:col-span-3">
                <p><strong>Scope:</strong> {rfp.scopeOfWork}</p>
            </div>
        </CardContent>
      </Card>
      <RfpTabs rfp={rfp} />
    </div>
  );
}
