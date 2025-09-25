'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function TemplatesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Templates</CardTitle>
        <CardDescription>
          Manage your RFP and proposal templates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <p>Template management functionality will be available here in a future update.</p>
          <p>You will be able to create, edit, and organize your document templates.</p>
        </div>
      </CardContent>
    </Card>
  );
}
