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
import { metroCodes } from '@/lib/data';
import { MetroMapChart } from '@/components/metro/metro-map-chart';

export default function MetroPage() {
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {metroCodes.map((metro) => (
                <TableRow key={metro.code}>
                  <TableCell className="font-medium">{metro.code}</TableCell>
                  <TableCell>{metro.city}</TableCell>
                  <TableCell>{metro.state}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Metro Locations</CardTitle>
          <CardDescription>
            A map showing the distribution of active project metros.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MetroMapChart metros={metroCodes} />
        </CardContent>
      </Card>
    </div>
  );
}
