import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { contractorTypes } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Manage system-wide configurations and options.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p>User preferences, notification settings, and other global configurations will be available here in a future update.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Contractor Types</CardTitle>
          <CardDescription>
            List of supported contractor specializations.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {contractorTypes.map(type => (
            <Badge key={type} variant="secondary">{type}</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
