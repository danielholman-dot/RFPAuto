'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { contractorTypes } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [seedStatus, setSeedStatus] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedStatus('Seeding is no longer supported after removing Firebase.');
    setIsSeeding(false);
  }

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
            <div>
              <h3 className="text-lg font-medium mb-2">Database Seeding</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This would previously populate the contractors collection in Firestore. This functionality is disabled.
              </p>
              <div className="flex items-center gap-4">
                <Button onClick={handleSeed} disabled>
                  {isSeeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Seed Contractor Data
                </Button>
                {seedStatus && <p className="text-sm text-muted-foreground">{seedStatus}</p>}
              </div>
            </div>
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
