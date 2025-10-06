
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
import { MetroCodesData } from '@/lib/data';
import type { MetroCode } from '@/lib/types';
import { useState, useEffect } from 'react';

export default function MetroPage() {
  const [metros, setMetros] = useState<MetroCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMetros(MetroCodesData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
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
            List of active metro codes for projects.
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
                  <TableCell className="font-medium">{metro.code}</TableCell>
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
