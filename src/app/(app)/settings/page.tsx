
'use client';
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, Pencil, X, Save, Trash2, UserPlus, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/lib/types";
import { AddUserDialog } from "@/components/settings/add-user-dialog";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EditUserDialog } from "@/components/settings/edit-user-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


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

function DeleteUserDialog({ user, onConfirm, children }: { user: User, onConfirm: () => void, children: React.ReactNode }) {
    const [confirmationEmail, setConfirmationEmail] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const isMatch = confirmationEmail === user.email;

    const handleConfirm = () => {
        onConfirm();
        setIsOpen(false);
        setConfirmationEmail('');
    }
    
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setConfirmationEmail('');
        }
        setIsOpen(open);
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the user <span className="font-semibold">{user.name}</span>.
                        To confirm, please type <span className="font-semibold text-foreground">{user.email}</span> below.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-2">
                    <Input 
                        id="delete-confirm" 
                        value={confirmationEmail}
                        onChange={(e) => setConfirmationEmail(e.target.value)}
                        placeholder="user@example.com"
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={handleConfirm}
                        disabled={!isMatch}
                    >
                        Delete User
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState(initialPermissionsData);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [tempPermissions, setTempPermissions] = useState<PermissionItem | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const firestore = useFirestore();
  const usersQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const { data: users, isLoading: usersLoading } = useCollection<User>(usersQuery);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };
  
  const handleDeleteClick = async (userId: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, "users", userId));
        toast({
            title: "User Deleted",
            description: "The user has been successfully removed.",
        });
    } catch (error) {
        console.error("Error deleting user: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete user. Please try again.",
        });
    }
  };


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
  
  const getRoleVariant = (role: string) => {
    if (role === 'Google Procurement Office') return 'secondary';
    return 'outline';
  }


  return (
    <>
      <div className="grid gap-6">
        <Accordion type="multiple" className="w-full space-y-6" defaultValue={["user-management"]}>
          <AccordionItem value="user-management" className="border-b-0">
            <Card>
                <AccordionTrigger className="p-6 hover:no-underline text-left flex justify-between">
                    <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription className="mt-1">
                            Add, remove, and manage user roles and access.
                        </CardDescription>
                    </div>
                </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                 <div className="flex justify-end mb-4">
                    <Button onClick={() => setIsAddUserDialogOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>
                <CardContent className="p-0">
                    {usersLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {users && users.map((user) => (
                                <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getRoleVariant(user.role)}>{user.role}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <DeleteUserDialog user={user} onConfirm={() => handleDeleteClick(user.id)}>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </DeleteUserDialog>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
          
          <AccordionItem value="user-roles" className="border-b-0">
            <Card>
              <AccordionTrigger className="p-6 hover:no-underline text-left">
                <div>
                  <CardTitle>User Roles & Permissions</CardTitle>
                  <CardDescription className="mt-1">
                    Overview of access levels for different user roles within the system.
                  </CardDescription>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <CardContent className="p-0">
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
                                <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      </div>
      <AddUserDialog
        isOpen={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
      />
      {selectedUser && (
        <EditUserDialog
            isOpen={isEditUserDialogOpen}
            onOpenChange={setIsEditUserDialogOpen}
            user={selectedUser}
        />
      )}
    </>
  );
}

    