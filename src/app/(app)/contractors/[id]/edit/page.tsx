
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams, notFound } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, updateDoc } from 'firebase/firestore';
import type { MetroCode, Contractor } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { contractorTypes as allContractorTypes } from "@/lib/data";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Company name is required."),
  contactName: z.string().min(1, "Contact name is required."),
  contactEmail: z.string().min(1, "Contact email is required."),
  contactPhone: z.string().min(1, "Contact phone is required."),
  type: z.string().min(1, "Contractor type is required."),
  preferredStatus: z.string().min(1, "Preferred status is required."),
  region: z.string().min(1, "Region is required."),
  metroCodes: z.array(z.string()).min(1, "At least one metro code must be selected."),
});

const preferredStatuses = ["Most Preferred", "Preferred", "Not Evaluated"];

export default function EditContractorPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contractorRef = useMemoFirebase(() => doc(firestore, 'contractors', id), [firestore, id]);
  const { data: contractor, isLoading: contractorLoading } = useDoc<Contractor>(contractorRef);

  const metroCodesQuery = useMemoFirebase(() => collection(firestore, 'metro_codes'), [firestore]);
  const { data: allMetroCodes, isLoading: metrosLoading } = useCollection<MetroCode>(metroCodesQuery);

  const regions = useMemo(() => {
    if (!allMetroCodes) return [];
    return [...new Set(allMetroCodes.map(m => m.region))].sort();
  }, [allMetroCodes]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      type: "",
      preferredStatus: "Not Evaluated",
      region: "",
      metroCodes: [],
    },
  });

  useEffect(() => {
    if (contractor) {
      form.reset({
        name: contractor.name || "",
        contactName: contractor.contactName || "",
        contactEmail: contractor.contactEmail || "",
        contactPhone: contractor.contactPhone || "",
        type: contractor.type || "",
        preferredStatus: contractor.preferredStatus || "Not Evaluated",
        region: contractor.region || "",
        metroCodes: contractor.metroCodes || [],
      });
    }
  }, [contractor, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const contractorDoc = doc(firestore, 'contractors', id);
      await updateDoc(contractorDoc, values);

      toast({
        title: "Contractor Updated",
        description: `Contractor "${values.name}" has been successfully updated.`,
      });
      router.push(`/contractors`);

    } catch (error) {
      console.error("Error updating contractor: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update contractor. Please try again.",
      });
      setIsSubmitting(false);
    }
  }

  const loading = contractorLoading || metrosLoading;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!contractor) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Contractor</CardTitle>
          <CardDescription>
            Update the details for {contractor.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Acme Construction Inc." {...field} /></FormControl>
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
                      <FormDescription>For multiple contacts, separate with a semicolon (;).</FormDescription>
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
                      <FormControl><Textarea placeholder="john.doe@email.com; jane.smith@email.com" {...field} /></FormControl>
                      <FormDescription>For multiple emails, separate with a semicolon (;).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl><Input placeholder="(555) 123-4567" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contractor Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {allContractorTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
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
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {preferredStatuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
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
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a region" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {regions.map(region => (
                            <SelectItem key={region} value={region}>{region}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metroCodes"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Operating Metro Codes</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value?.length && "text-muted-foreground"
                              )}
                            >
                              {field.value?.length ? `${field.value.length} selected` : "Select metros"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Search metros..." />
                            <CommandEmpty>No metro found.</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-y-auto">
                              {(allMetroCodes || []).map((metro) => (
                                <CommandItem
                                  value={metro.code}
                                  key={metro.id}
                                  onSelect={() => {
                                    const currentMetros = field.value || [];
                                    const isSelected = currentMetros.includes(metro.code);
                                    form.setValue(
                                      "metroCodes",
                                      isSelected
                                        ? currentMetros.filter((m) => m !== metro.code)
                                        : [...currentMetros, metro.code]
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value?.includes(metro.code) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {metro.code} - {metro.city}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
