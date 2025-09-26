
'use client';
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, Pencil, X, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const initialPermissionsData = [
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
];

type PermissionItem = typeof initialPermissionsData[0];

export default function SettingsPage() {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState(initialPermissionsData);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [tempPermissions, setTempPermissions] = useState<PermissionItem | null>(null);

  const handleEdit = (item: PermissionItem) => {
    setEditingRow(item.feature);
    setTempPermissions(item);
  };

  const handleCancel = () => {
    setEditingRow(null);
    setTempPermissions(null);
  };

  const handleSave = () => {
    if (tempPermissions) {
      setPermissions(currentPermissions =>
        currentPermissions.map(p =>
          p.feature === tempPermissions.feature ? tempPermissions : p
        )
      );
      toast({
        title: "Permissions Saved",
        description: `Changes for "${tempPermissions.feature}" have been saved for this session.`,
      })
    }
    setEditingRow(null);
    setTempPermissions(null);
  };

  const handlePermissionChange = (role: 'gpo' | 'pm', value: boolean) => {
    if (tempPermissions) {
      setTempPermissions({ ...tempPermissions, [role]: value });
    }
  };

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
                <TableHead className="text-center">Google Procurement Office</TableHead>
                <TableHead className="text-center">Project Management</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((item) => (
                <TableRow key={item.feature} className={!item.page ? "bg-muted/50" : ""}>
                  <TableCell className="font-medium">{item.feature}</TableCell>
                  
                  {editingRow === item.feature && tempPermissions ? (
                    <>
                      <TableCell className="text-center">
                        <Switch
                          checked={tempPermissions.gpo}
                          onCheckedChange={(value) => handlePermissionChange('gpo', value)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={tempPermissions.pm}
                          onCheckedChange={(value) => handlePermissionChange('pm', value)}
                        />
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="text-center">
                        {item.gpo ? <Check className="mx-auto h-5 w-5 text-green-600" /> : <X className="mx-auto h-5 w-5 text-red-600" />}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.pm ? <Check className="mx-auto h-5 w-5 text-green-600" /> : <X className="mx-auto h-5 w-5 text-red-600" />}
                      </TableCell>
                    </>
                  )}
                  
                  <TableCell className="text-right">
                    {editingRow === item.feature ? (
                        <div className="flex gap-2 justify-end">
                            <Button variant="default" size="sm" onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" /> Save
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleCancel}>
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
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
