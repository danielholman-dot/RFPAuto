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
import { getAllMetroCodes } from '@/lib/data';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Save, X } from 'lucide-react';

type Metro = {
  code: string;
  city: string;
  state: string;
  region: string;
  lat: number;
  lon: number;
};

export default function MetroPage() {
  const [metros, setMetros] = useState<Metro[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedMetro, setEditedMetro] = useState<Partial<Metro> | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getAllMetroCodes();
      setMetros(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleEdit = (metro: Metro) => {
    setEditingRow(metro.code);
    setEditedMetro({ lat: metro.lat, lon: metro.lon });
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedMetro(null);
  };

  const handleSave = (code: string) => {
    if (!editedMetro) return;
    setMetros(currentMetros =>
      currentMetros.map(m =>
        m.code === code ? { ...m, ...editedMetro } : m
      )
    );
    setEditingRow(null);
    setEditedMetro(null);
  };

  const handleInputChange = (field: 'lat' | 'lon', value: string) => {
    if (editedMetro) {
      setEditedMetro({ ...editedMetro, [field]: parseFloat(value) || 0 });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
              {metros.map((metro) => (
                <TableRow key={metro.code}>
                  <TableCell className="font-medium">{metro.code}</TableCell>
                  <TableCell>{metro.city}</TableCell>
                  <TableCell>{metro.state}</TableCell>
                  <TableCell>
                    {editingRow === metro.code ? (
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
                    {editingRow === metro.code ? (
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
                    {editingRow === metro.code ? (
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleSave(metro.code)}>
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
