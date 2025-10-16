
'use client';
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
import type { MetroCode } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function MetroPage() {
  const firestore = useFirestore();
  const metrosQuery = useMemoFirebase(() => collection(firestore, 'metro_codes'), [firestore]);
  const { data: metros, isLoading } = useCollection<MetroCode>(metrosQuery);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!metros || metros.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Metro Codes</CardTitle>
                 <CardDescription>
                    List of active metro codes for projects.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground py-8">No metro codes found.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Metro Codes</CardTitle>
          <CardDescription>
            List of active metro codes for projects. Click on a code to see a detailed summary.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metro Code</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State/Province</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metros.map((metro) => (
                <TableRow key={metro.id}>
                  <TableCell className="font-medium">
                    <Link href={`/metro/${metro.code}`} className="text-primary hover:underline">
                        {metro.code}
                    </Link>
                  </TableCell>
                  <TableCell>{metro.city}</TableCell>
                  <TableCell>{metro.state}</TableCell>
                  <TableCell>{metro.region}</TableCell>
                  <TableCell>{metro.lat}</TableCell>
                  <TableCell>{metro.lon}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
