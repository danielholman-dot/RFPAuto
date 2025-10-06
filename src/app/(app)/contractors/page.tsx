
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
import type { Contractor, MetroCode } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Users, Wrench, Zap, HardHat, Loader2, Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';

function ContractorsList({ contractors }: { contractors: Contractor[] }) {
  if (!contractors || contractors.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No contractors match the current filters.</p>;
  }

  const renderMultiLine = (text: string) => {
    return text.split(';').map((item, index) => (
      <div key={index}>{item.trim()}</div>
    ));
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contractor Name</TableHead>
          <TableHead>POC Name</TableHead>
          <TableHead>POC Email</TableHead>
          <TableHead>Contractor Type</TableHead>
          <TableHead>Preferred Status</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Metro/Site</TableHead>
          <TableHead>Performance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contractors.map((contractor) => (
          <TableRow key={contractor.id}>
            <TableCell className="font-medium">
              <Link href={`/contractors/${contractor.id}`} className="hover:underline">
                {contractor.name}
              </Link>
            </TableCell>
            <TableCell>{renderMultiLine(contractor.contactName)}</TableCell>
            <TableCell>{renderMultiLine(contractor.contactEmail)}</TableCell>
            <TableCell>{contractor.type}</TableCell>
            <TableCell>
                <Badge variant={contractor.preferredStatus === 'Most Preferred' ? 'default' : 'secondary'}>
                    {contractor.preferredStatus}
                </Badge>
            </TableCell>
            <TableCell>{contractor.region}</TableCell>
            <TableCell>{contractor.metroSite}</TableCell>
            <TableCell className="flex items-center">
                {contractor.performance}% <Star className="w-4 h-4 ml-1 text-yellow-500 fill-yellow-500" />
            </TableCell>
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
  const firestore = useFirestore();
  const { isUserLoading } = useUser();

  const contractorsQuery = useMemoFirebase(() => query(collection(firestore, 'contractors')), [firestore]);
  const { data: allContractors, isLoading: contractorsLoading } = useCollection<Contractor>(contractorsQuery);

  const metroCodesQuery = useMemoFirebase(() => collection(firestore, 'metro_codes'), [firestore]);
  const { data: allMetroCodes, isLoading: metrosLoading } = useCollection<MetroCode>(metroCodesQuery);


  const [typeFilter, setTypeFilter] = useState('all');
  const [metroCodeFilter, setMetroCodeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const contractorTypes = useMemo(() => {
    if (!allContractors) return [];
    return ['all', ...Array.from(new Set(allContractors.map(c => c.type))).sort()];
  }, [allContractors]);

  const sortedMetroCodes = useMemo(() => {
    if (!allMetroCodes) return [];
    return [...allMetroCodes].sort((a,b) => a.code.localeCompare(b.code));
  }, [allMetroCodes]);

  const summaryStats = useMemo(() => {
    if (!allContractors) return [];
    const stats: { [key: string]: number } = {};
    allContractors.forEach(c => {
      stats[c.type] = (stats[c.type] || 0) + 1;
    });
    return Object.entries(stats).sort((a,b) => b[1] - a[1]);
  }, [allContractors]);

  const filteredContractors = useMemo(() => {
    if (!allContractors) return [];
    return allContractors.filter(contractor => {
      const typeMatch = typeFilter === 'all' || contractor.type === typeFilter;
      const metroCodeMatch = metroCodeFilter === 'all' || (contractor.metroCodes && contractor.metroCodes.includes(metroCodeFilter));
      const searchMatch = searchTerm === '' || contractor.name.toLowerCase().includes(searchTerm.toLowerCase());
      return typeMatch && metroCodeMatch && searchMatch;
    });
  }, [allContractors, typeFilter, metroCodeFilter, searchTerm]);

  const loading = isUserLoading || contractorsLoading || metrosLoading;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
              <div className="text-2xl font-bold">{allContractors?.length || 0}</div>
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
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[200px]"
            />
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
            <Select value={metroCodeFilter} onValueChange={setMetroCodeFilter}>
                <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue placeholder="Filter by Metro/Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Metros</SelectItem>
                    {sortedMetroCodes.map(metro => (
                        <SelectItem key={metro.code} value={metro.code}>{metro.code} - {metro.city}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ContractorsList contractors={filteredContractors || []} />
        </CardContent>
      </Card>
    </div>
  );
}
