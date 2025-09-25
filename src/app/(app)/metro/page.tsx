import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { metroCodes } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function MetroPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Metro Codes</CardTitle>
        <CardDescription>
          List of active metro codes for projects.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {metroCodes.map(code => (
          <Badge key={code} variant="secondary">{code}</Badge>
        ))}
      </CardContent>
    </Card>
  );
}
