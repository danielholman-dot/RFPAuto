
'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getContractors, getContractorTypes } from '@/lib/data';
import type { Contractor } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { Users, Wrench, Zap, HardHat } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function ContractorsList({ contractors }: { contractors: Contractor[] }) {
  if (!contractors || contractors.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No contractors match the current filters.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contractor Name</TableHead>
          <TableHead>POC Name</TableHead>
          <TableHead>POC Email</TableHead>
          <TableHead>Contractor Type</TableHead>
          <TableHead>Most Preferred/Preferred</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Metro/Site</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contractors.map((contractor) => (
          <TableRow key={contractor.id}>
            <TableCell className="font-medium">{contractor.name}</TableCell>
            <TableCell>{contractor.contactName}</TableCell>
            <TableCell>{contractor.contactEmail}</TableCell>
            <TableCell>{contractor.type}</TableCell>
            <TableCell>{contractor.preferredStatus}</TableCell>
            <TableCell>{contractor.region}</TableCell>
            <TableCell>{contractor.metroSite}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const getIconForType = (type: string) => {
  switch (type) {
    case 'General Contractor':
      return <HardHat className="h-4 w-4 text-muted-foreground" />;
    case 'Electrical':
    case 'Electrical / NICON':
    case 'Electrical / Professional Services':
      return <Zap className="h-4 w-4 text-muted-foreground" />;
    case 'Mechanical':
    case 'Electrical / Mechanical':
      return <Wrench className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Users className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function ContractorsPage() {
  const [allContractors, setAllContractors] = useState<Contractor[]>([]);
  const [contractorTypes, setContractorTypes] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [metroSites, setMetroSites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [metroSiteFilter, setMetroSiteFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [data, types] = await Promise.all([
        getContractors(),
        getContractorTypes(),
      ]);
      setAllContractors(data);
      setContractorTypes(['all', ...types]);
      
      const uniqueRegions = ['all', ...Array.from(new Set(data.map(c => c.region)))];
      setRegions(uniqueRegions);

      const uniqueMetroSites = ['all', ...Array.from(new Set(data.map(c => c.metroSite)))];
      setMetroSites(uniqueMetroSites);

      setLoading(false);
    }
    loadData();
  }, []);

  const summaryStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    allContractors.forEach(c => {
      stats[c.type] = (stats[c.type] || 0) + 1;
    });
    return Object.entries(stats).sort((a,b) => b[1] - a[1]);
  }, [allContractors]);

  const filteredContractors = useMemo(() => {
    return allContractors.filter(contractor => {
      const typeMatch = typeFilter === 'all' || contractor.type === typeFilter;
      const regionMatch = regionFilter === 'all' || contractor.region === regionFilter;
      const metroSiteMatch = metroSiteFilter === 'all' || contractor.metroSite === metroSiteFilter;
      return typeMatch && regionMatch && metroSiteMatch;
    });
  }, [allContractors, typeFilter, regionFilter, metroSiteFilter]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Contractors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allContractors.length}</div>
              <p className="text-xs text-muted-foreground">
                In the preferred list
              </p>
            </CardContent>
          </Card>
          {summaryStats.slice(0,3).map(([type, count]) => (
            <Card key={type}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{type}</CardTitle>
                {getIconForType(type)}
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">
                    Contractors
                </p>
                </CardContent>
            </Card>
          ))}
       </div>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Contractor List</CardTitle>
            <CardDescription>A list of all preferred contractors.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                    {contractorTypes.map(type => (
                        <SelectItem key={type} value={type}>{type === 'all' ? 'All Types' : type}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by Region" />
                </SelectTrigger>
                <SelectContent>
                    {regions.map(region => (
                        <SelectItem key={region} value={region}>{region === 'all' ? 'All Regions' : region}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={metroSiteFilter} onValueChange={setMetroSiteFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by Metro/Site" />
                </SelectTrigger>
                <SelectContent>
                    {metroSites.map(metro => (
                        <SelectItem key={metro} value={metro}>{metro === 'all' ? 'All Metro/Sites' : metro}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ContractorsList contractors={filteredContractors} />
        </CardContent>
      </Card>
    </div>
  );
}
