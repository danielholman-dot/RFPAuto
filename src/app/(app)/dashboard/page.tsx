
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
import type { RFP, Contractor } from '@/lib/types';
import { RfpVolumeChart } from '@/components/dashboard/rfp-volume-chart';
import { RfpGanttChart } from '@/components/dashboard/rfp-gantt-chart';
import { getContractors, getRfps } from '@/lib/data';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [rfpsData, contractorsData] = await Promise.all([getRfps(), getContractors()]);
      setRfps(rfpsData);
      setContractors(contractorsData);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
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
        
        <div className="grid grid-cols-1 items-start gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>RFP & Project Timelines</CardTitle>
                <CardDescription>
                    Gantt chart showing the duration of the RFP and project phases for each initiative.
                </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <RfpGanttChart rfps={rfps} />
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
          <Card>
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
        </div>
      </main>
    </div>
  );
}
