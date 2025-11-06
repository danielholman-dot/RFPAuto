
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
import { useState, useMemo, useRef } from 'react';
import { Users, Wrench, Zap, HardHat, Loader2, Star, Pencil, Upload } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase, useAuth, useAuthState } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

function ContractorsList({ contractors }: { contractors: Contractor[] }) {
  if (!contractors || contractors.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No contractors match the current filters.</p>;
  }

  const getPreferredVariant = (status: string) => {
    switch (status) {
        case 'Most Preferred':
            return 'default';
        case 'Preferred':
            return 'secondary';
        default:
            return 'outline';
    }
  };

  const renderMultiLine = (text: string) => {
    return text.split(';').map((item, index) => (
      <div key={index}>{item.trim()}</div>
    ));
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company Name</TableHead>
          <TableHead>POC Name</TableHead>
          <TableHead>POC Email</TableHead>
          <TableHead>Contractor Type</TableHead>
          <TableHead>Preferred</TableHead>
          <TableHead>Operating Metros</TableHead>
          <TableHead className="text-right">Actions</TableHead>
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
                <Badge variant={getPreferredVariant(contractor.preferredStatus)}>
                    {contractor.preferredStatus}
                </Badge>
            </TableCell>
            <TableCell>{contractor.metroCodes?.join(', ')}</TableCell>
            <TableCell className="text-right">
                <Button asChild variant="outline" size="icon">
                    <Link href={`/contractors/${contractor.id}/edit`}>
                        <Pencil className="h-4 w-4"/>
                    </Link>
                </Button>
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
  const auth = useAuth();
  const [user, isUserLoading] = useAuthState(auth);
  const importFileRef = useRef<HTMLInputElement>(null);

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
  
  const convertToCSV = (data: any[], headers: string[]) => {
    const headerRow = headers.join(',');
    const rows = data.map(row => {
      return headers.map(header => {
        let cell = row[header] === null || row[header] === undefined ? '' : row[header];
        if (Array.isArray(cell)) {
          cell = cell.join(';');
        }
        cell = String(cell).replace(/"/g, '""');
        if (cell.includes(',')) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(',');
    });
    return [headerRow, ...rows].join('\n');
  };

  const downloadCSV = (csvString: string, filename: string) => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportTemplate = () => {
    const headers = ['name', 'contactName', 'contactEmail', 'contactPhone', 'type', 'preferredStatus', 'region', 'metroCodes'];
    const csvString = headers.join(',');
    downloadCSV(csvString, 'contractor_template.csv');
  };

  const handleExportInformation = () => {
    if (!filteredContractors || filteredContractors.length === 0) {
      alert('No contractor information to export.');
      return;
    }
    const headers = ['name', 'contactName', 'contactEmail', 'contactPhone', 'type', 'preferredStatus', 'region', 'metroCodes'];
    const csvString = convertToCSV(filteredContractors, headers);
    downloadCSV(csvString, 'contractor_information.csv');
  };

  const handleImportClick = () => {
    importFileRef.current?.click();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`File "${file.name}" selected for import. Processing logic to be implemented.`);
      // Here you would add logic to parse the CSV and update Firestore
    }
  };


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
            <div className='flex-1'>
                <CardTitle>Contractor List</CardTitle>
                <CardDescription>A list of all preferred contractors.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Input
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-auto md:w-[200px]"
                />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-auto md:w-[180px]">
                        <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {contractorTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type === 'all' ? 'All Types' : type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={metroCodeFilter} onValueChange={setMetroCodeFilter}>
                    <SelectTrigger className="w-full sm:w-auto md:w-[220px]">
                        <SelectValue placeholder="Filter by Metro/Site" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Metros</SelectItem>
                        {sortedMetroCodes.map(metro => (
                            <SelectItem key={metro.code} value={metro.code}>{metro.code} - {metro.city}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Upload className="mr-2 h-4 w-4" />
                      Import / Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={handleExportTemplate}>Export Template</DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleExportInformation}>Export Information</DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleImportClick}>Import Information</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                 <Button asChild className="w-full sm:w-auto">
                    <Link href="/contractors/new">Add new Contractor</Link>
                </Button>
                <input
                    type="file"
                    ref={importFileRef}
                    className="hidden"
                    accept=".csv"
                    onChange={handleImportFile}
                />
            </div>
        </CardHeader>
        <CardContent>
          <ContractorsList contractors={filteredContractors || []} />
        </CardContent>
      </Card>
    </div>
  );
}
