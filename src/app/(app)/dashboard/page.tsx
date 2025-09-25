'use client';
import {
  Activity,
  ArrowUpRight,
  CircleDollarSign,
  FileText,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { RFP, Contractor } from '@/lib/types';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { RfpVolumeChart } from '@/components/dashboard/rfp-volume-chart';

export default function Dashboard() {
  const firestore = useFirestore();
  const { data: rfps, loading: rfpsLoading } = useCollection<RFP>(
    query(collection(firestore, 'rfps'), orderBy('startDate', 'desc'))
  );
  const { data: contractors, loading: contractorsLoading } =
    useCollection<Contractor>(collection(firestore, 'contractors'));

  if (rfpsLoading || contractorsLoading) {
    return <div>Loading...</div>;
  }

  const activeRFPs =
    rfps?.filter((r) => r.status === 'In Progress' || r.status === 'Sent') || [];
  const totalBudget = rfps?.reduce((sum, rfp) => sum + rfp.estimatedBudget, 0) || 0;

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (date.toDate) { // Firebase Timestamp
      return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Budget
              </CardTitle>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(totalBudget / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">
                Sum of all RFP budgets
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Contractors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{contractors?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                In the preferred list
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total RFPs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{rfps?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                +2 since last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active RFPs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{activeRFPs.length}</div>
              <p className="text-xs text-muted-foreground">
                Currently in progress or sent
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Recent RFPs</CardTitle>
                <CardDescription>
                  Recently created or updated Requests for Proposal.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/rfp">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfps?.slice(0, 5).map((rfp) => (
                    <TableRow key={rfp.id}>
                      <TableCell>
                        <div className="font-medium">{rfp.projectName}</div>
                        <div className="text-sm text-muted-foreground">
                          {rfp.metroCode}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            rfp.status === 'Awarded' ? 'default' : 'outline'
                          }
                        >
                          {rfp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${rfp.estimatedBudget.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>RFP Volume</CardTitle>
              <CardDescription>
                Number of RFPs created over the last 6 months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RfpVolumeChart />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
