
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
        <CardContent className="space-y-4">
            <p>User preferences, notification settings, and other global configurations will be available here in a future update.</p>
        </CardContent>
      </Card>
    </div>
  );
}
