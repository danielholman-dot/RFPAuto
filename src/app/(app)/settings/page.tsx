
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";

const permissionsData = [
    { feature: "Dashboard", page: true, gpo: true, pm: false },
    { feature: "New RFP", page: true, gpo: true, pm: false },
    { feature: "RFP Registry", page: true, gpo: true, pm: false },
    { feature: "Templates", page: true, gpo: true, pm: false },
    { feature: "Contractors", page: true, gpo: true, pm: false },
    { feature: "Metro", page: true, gpo: true, pm: false },
    { feature: "User Guide", page: true, gpo: true, pm: true },
    { feature: "Settings", page: true, gpo: true, pm: false },
    { feature: "RFP: Selection & Vetting", page: false, gpo: true, pm: true },
    { feature: "RFP: Drafting & Generation", page: false, gpo: true, pm: false },
    { feature: "RFP: Sending Invitations", page: false, gpo: true, pm: false },
    { feature: "RFP: Proposal Submission Tracking", page: false, gpo: true, pm: false },
    { feature: "RFP: AI Comparative Analysis", page: false, gpo: true, pm: true },
    { feature: "RFP: Awarding & Notifications", page: false, gpo: true, pm: false },
    { feature: "RFP: Feedback Collection", page: false, gpo: true, pm: false },
]

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
      <Card>
        <CardHeader>
          <CardTitle>User Roles & Permissions</CardTitle>
          <CardDescription>
            Overview of access levels for different user roles within the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature / Page</TableHead>
                <TableHead className="text-center">GPO (Global Program Owner)</TableHead>
                <TableHead className="text-center">Project Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissionsData.map((item) => (
                <TableRow key={item.feature} className={!item.page ? "bg-muted/50" : ""}>
                  <TableCell className="font-medium">{item.feature}</TableCell>
                  <TableCell className="text-center">
                    {item.gpo ? <Check className="mx-auto h-5 w-5 text-green-600" /> : <X className="mx-auto h-5 w-5 text-red-600" />}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.pm ? <Check className="mx-auto h-5 w-5 text-green-600" /> : <X className="mx-auto h-5 w-5 text-red-600" />}
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
