
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { RFP, Contractor } from '@/lib/types';
import { RfpGanttChart } from '@/components/dashboard/rfp-gantt-chart';
import { getContractors, getRfps, getAllMetroCodes, getMetroRegions, getMetrosByRegion } from '@/lib/data';
import { useEffect, useState, useMemo } from 'react';
import { BudgetVsWonChart } from '@/components/dashboard/budget-vs-won-chart';

type MetroInfo = {
  code: string;
  city: string;
  state: string;
  region: string;
  lat: number;
  lon: number;
};

type MetroOption = {
  code: string;
  city: string;
};

export default function Dashboard() {
  const [allRfps, setAllRfps] = useState<RFP[]>([]);
  const [allContractors, setAllContractors] = useState<Contractor[]>([]);
  const [allMetroInfo, setAllMetroInfo] = useState<MetroInfo[]>([]);
  
  const [regions, setRegions] = useState<string[]>([]);
  const [metros, setMetros] = useState<MetroOption[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState('all');
  const [metroFilter, setMetroFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      const [rfpsData, contractorsData, regionData, metroInfoData] = await Promise.all([
        getRfps(), 
        getContractors(),
        getMetroRegions(),
        getAllMetroCodes(),
      ]);
      setAllRfps(rfpsData);
      setAllContractors(contractorsData);
      setRegions(['all', ...regionData]);
      setAllMetroInfo(metroInfoData);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadMetros() {
      let metroData: MetroOption[] = [];
      if (regionFilter === 'all') {
        metroData = allMetroInfo.map(m => ({ code: m.code, city: m.city }));
      } else {
        metroData = await getMetrosByRegion(regionFilter);
      }
      setMetros(metroData.sort((a,b) => a.code.localeCompare(b.code)));
      setMetroFilter('all');
    }
    loadMetros();
  }, [regionFilter, allMetroInfo]);

  const filteredRfps = useMemo(() => {
    return allRfps.filter(rfp => {
      const regionInfo = allMetroInfo.find(m => m.code === rfp.metroCode);
      const regionMatch = regionFilter === 'all' || (regionInfo && regionInfo.region === regionFilter);
      const metroMatch = metroFilter === 'all' || rfp.metroCode === metroFilter;
      return regionMatch && metroMatch;
    });
  }, [allRfps, regionFilter, metroFilter, allMetroInfo]);

  const filteredContractors = useMemo(() => {
    return allContractors.filter(c => {
      const contractorMetrosInRegion = allMetroInfo.filter(m => c.metroCodes.includes(m.code) && (regionFilter === 'all' || m.region === regionFilter));
      
      const regionMatch = regionFilter === 'all' || contractorMetrosInRegion.length > 0;
      const metroMatch = metroFilter === 'all' || c.metroCodes.includes(metroFilter);
      
      return regionMatch && metroMatch;
    });
  }, [allContractors, regionFilter, metroFilter, allMetroInfo]);


  if (loading) {
    return <div>Loading...</div>;
  }

  const activeRFPs =
    filteredRfps?.filter((r) => r.status !== 'Draft' && r.status !== 'Completed' && r.status !== 'Award') || [];
  const totalBudget = filteredRfps?.reduce((sum, rfp) => sum + rfp.estimatedBudget, 0) || 0;

  const getStatusVariant = (status: RFP['status']) => {
    switch (status) {
      case 'Award':
      case 'Completed':
        return 'default'; // Green / primary color for success
      case 'Analysis':
      case 'Feedback':
          return 'secondary'; // Blue / secondary for final stages
      case 'Draft':
        return 'outline'; // Grey outline for pending
      default:
        return 'secondary'; // Yellow / warning for active states like Selection, Invitation, etc.
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex gap-4">
               <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by Region" />
                  </SelectTrigger>
                  <SelectContent>
                      {regions.map(region => (
                          <SelectItem key={region} value={region}>{region === 'all' ? 'All Regions' : region}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
              <Select value={metroFilter} onValueChange={setMetroFilter}>
                  <SelectTrigger className="w-full md:w-[220px]">
                      <SelectValue placeholder="Filter by Metro" />
                  </SelectTrigger>
                  <SelectContent>
                       <SelectItem value="all">All Metros</SelectItem>
                      {metros.map(metro => (
                          <SelectItem key={metro.code} value={metro.code}>{metro.code} - {metro.city}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </div>
      </div>
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
            <div className="text-2xl font-bold">{filteredContractors?.length || 0}</div>
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
            <div className="text-2xl font-bold">{filteredRfps?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Matching current filters
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active RFPs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRFPs.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
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
                  <RfpGanttChart rfps={filteredRfps} />
              </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Budget vs. Won Proposal</CardTitle>
              <CardDescription>
                Comparison of budgeted amounts vs. final awarded proposal amounts across projects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetVsWonChart rfps={filteredRfps}/>
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
                {filteredRfps?.slice(0, 5).map((rfp) => (
                  <TableRow key={rfp.id}>
                    <TableCell>
                      <div className="font-medium">{rfp.projectName}</div>
                      <div className="text-sm text-muted-foreground">
                        {rfp.metroCode}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(rfp.status)}
                      >
                        {rfp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${rfp.estimatedBudget.toLocaleString('de-DE')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );

    

