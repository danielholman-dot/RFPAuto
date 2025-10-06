
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Save, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams, notFound } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
    useFirestore,
    useDoc,
    useCollection,
    useUser,
    useMemoFirebase,
} from "@/firebase";
import { doc, updateDoc, deleteDoc, collection, query } from "firebase/firestore";
import type { Contractor, MetroCode } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(1, "Contractor name is required."),
  contactName: z.string().min(1, "Contact name is required."),
  contactEmail: z.string().min(1, "Contact email is required."),
  type: z.string().min(1, "Contractor type is required."),
  preferredStatus: z.string().min(1, "Preferred status is required."),
  region: z.string().min(1, "Region is required."),
  metroSite: z.string().min(1, "Metro/Site is required."),
  performance: z.coerce.number().min(0).max(100),
  metroCodes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one metro code.",
  }),
});

export default function EditContractorPage() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const contractorRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, "contractors", id);
    }, [firestore, id, user]);
    const { data: contractor, isLoading: contractorLoading } = useDoc<Contractor>(contractorRef);

    const metroCodesQuery = useMemoFirebase(() => collection(firestore, 'metro_codes'), [firestore]);
    const { data: allMetroCodes, isLoading: metrosLoading } = useCollection<MetroCode>(metroCodesQuery);
    
    const contractorTypes = useMemo(() => {
        if (!allMetroCodes) return [];
        // This should ideally come from a dedicated collection or a comprehensive scan
        return ["Electrical", "Electrical / NICON", "Electrical / Professional Services", "General Contractor", "Mechanical", "Electrical / Mechanical", "NICON"].sort();
    }, [allMetroCodes]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            metroCodes: [],
        }
    });

    useEffect(() => {
        if (contractor) {
            form.reset({
                name: contractor.name,
                contactName: contractor.contactName,
                contactEmail: contractor.contactEmail,
                type: contractor.type,
                preferredStatus: contractor.preferredStatus,
                region: contractor.region,
                metroSite: contractor.metroSite,
                performance: contractor.performance,
                metroCodes: contractor.metroCodes || [],
            });
        }
    }, [contractor, form]);
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            await updateDoc(contractorRef!, values);
            toast({
                title: "Contractor Updated",
                description: `${values.name} has been successfully updated.`,
            });
            router.push(`/contractors/${id}`);
        } catch (error) {
            console.error("Error updating contractor:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update contractor. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this contractor? This action cannot be undone.")) {
            try {
                await deleteDoc(contractorRef!);
                toast({
                    title: "Contractor Deleted",
                    description: `${contractor?.name} has been deleted.`,
                });
                router.push("/contractors");
            } catch (error) {
                console.error("Error deleting contractor:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to delete contractor. Please try again.",
                });
            }
        }
    }

    if (isUserLoading || contractorLoading || metrosLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!contractor) {
        return notFound();
    }
    
    return (
        <div className="max-w-4xl mx-auto">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Edit Contractor</CardTitle>
                    <CardDescription>Update the details for {contractor.name}.</CardDescription>
                </div>
                <Button variant="destructive" onClick={handleDelete}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Contractor
                </Button>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contractor Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Point of Contact Name(s)</FormLabel>
                            <FormControl><Textarea placeholder="John Doe; Jane Smith" {...field} /></FormControl>
                            <FormDescription>Separate multiple names with a semicolon (;).</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Point of Contact Email(s)</FormLabel>
                            <FormControl><Textarea placeholder="john@example.com; jane@example.com" {...field} /></FormControl>
                            <FormDescription>Separate multiple emails with a semicolon (;).</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contractor Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                {contractorTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="preferredStatus"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preferred Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Most Preferred">Most Preferred</SelectItem>
                                <SelectItem value="Preferred">Preferred</SelectItem>
                                <SelectItem value="Not Evaluated">Not Evaluated</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                 <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Region</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="North America">North America</SelectItem>
                                <SelectItem value="East">East</SelectItem>
                                <SelectItem value="West">West</SelectItem>
                                <SelectItem value="West (Central)">West (Central)</SelectItem>
                                <SelectItem value="West Coast">West Coast</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="metroSite"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Metro / Site (Legacy)</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormDescription>This is a text field for legacy data.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="metroCodes"
                    render={() => (
                        <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">Operating Metro Codes</FormLabel>
                            <FormDescription>
                            Select all the metro areas where this contractor operates.
                            </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-64 overflow-auto border p-4 rounded-md">
                        {allMetroCodes?.map((item) => (
                            <FormField
                            key={item.id}
                            control={form.control}
                            name="metroCodes"
                            render={({ field }) => {
                                return (
                                <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item.code)}
                                        onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...field.value, item.code])
                                            : field.onChange(
                                                field.value?.filter(
                                                (value) => value !== item.code
                                                )
                                            )
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {item.code} - {item.city}
                                    </FormLabel>
                                </FormItem>
                                )
                            }}
                            />
                        ))}
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                 />

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                    </Button>
                </div>
                </form>
            </Form>
            </CardContent>
        </Card>
        </div>
    );
}

    