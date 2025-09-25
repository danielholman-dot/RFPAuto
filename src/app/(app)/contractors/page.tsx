import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { contractors } from "@/lib/data"
import { Star } from "lucide-react"

export default function ContractorsPage() {
  const sortedContractors = [...contractors].sort((a, b) => (b.performance ?? 0) - (a.performance ?? 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contractor List</CardTitle>
        <CardDescription>A list of all preferred contractors.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Metro Codes</TableHead>
              <TableHead className="text-right">Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedContractors.map((contractor) => (
              <TableRow key={contractor.id}>
                <TableCell className="font-medium">{contractor.name}</TableCell>
                <TableCell>{contractor.type}</TableCell>
                <TableCell>
                  <div>{contractor.contactName}</div>
                  <div className="text-sm text-muted-foreground">{contractor.contactEmail}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {contractor.metroCodes.map(code => (
                      <Badge key={code} variant="outline">{code}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right flex items-center justify-end">
                  {contractor.performance}%
                  <Star className="w-4 h-4 ml-1 text-yellow-500 fill-yellow-500" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
