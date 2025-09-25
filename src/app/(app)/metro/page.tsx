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

export default function MetroPage() {
  return (
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
  );
}
