
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
import { useCollection, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import { collection, updateDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Save, X, Loader2 } from 'lucide-react';
import type { MetroCode } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function MetroPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const metroCodesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'metro_codes');
  }, [firestore, user]);

  const { data: metros, isLoading: metrosLoading } = useCollection<MetroCode>(metroCodesQuery);

  const [localMetros, setLocalMetros] = useState<MetroCode[]>([]);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedMetro, setEditedMetro] = useState<Partial<MetroCode> | null>(null);

  useEffect(() => {
    if (metros) {
      setLocalMetros(metros);
    }
  }, [metros]);

  const handleEdit = (metro: MetroCode) => {
    setEditingRow(metro.id);
    setEditedMetro({ lat: metro.lat, lon: metro.lon });
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedMetro(null);
  };

  const handleSave = async (id: string) => {
    if (!editedMetro || !firestore) return;
    const docRef = doc(firestore, 'metro_codes', id);
    try {
      await updateDoc(docRef, {
        lat: editedMetro.lat,
        lon: editedMetro.lon,
      });
      setLocalMetros(currentMetros =>
        currentMetros.map(m =>
          m.id === id ? { ...m, ...editedMetro as { lat: number; lon: number } } : m
        )
      );
      toast({ title: 'Success', description: 'Metro coordinates updated.' });
    } catch (error) {
      console.error('Failed to update metro:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update coordinates.' });
    } finally {
      setEditingRow(null);
      setEditedMetro(null);
    }
  };

  const handleInputChange = (field: 'lat' | 'lon', value: string) => {
    if (editedMetro) {
      setEditedMetro({ ...editedMetro, [field]: parseFloat(value) || 0 });
    }
  };

  const loading = isUserLoading || metrosLoading;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!localMetros || localMetros.length === 0) {
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
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localMetros.map((metro) => (
                <TableRow key={metro.id}>
                  <TableCell className="font-medium">{metro.code}</TableCell>
                  <TableCell>{metro.city}</TableCell>
                  <TableCell>{metro.state}</TableCell>
                  <TableCell>
                    {editingRow === metro.id ? (
                      <Input
                        type="number"
                        value={editedMetro?.lat ?? ''}
                        onChange={(e) => handleInputChange('lat', e.target.value)}
                        className="w-24"
                      />
                    ) : (
                      metro.lat
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === metro.id ? (
                      <Input
                        type="number"
                        value={editedMetro?.lon ?? ''}
                        onChange={(e) => handleInputChange('lon', e.target.value)}
                        className="w-24"
                      />
                    ) : (
                      metro.lon
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingRow === metro.id ? (
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleSave(metro.id)}>
                          <Save className="mr-2 h-4 w-4" /> Save
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleCancel}>
                          <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleEdit(metro)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
