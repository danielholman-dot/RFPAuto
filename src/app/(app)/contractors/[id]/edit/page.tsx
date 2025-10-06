
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useMemo } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import { useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, updateDoc } from "firebase/firestore";
import type { Contractor, MetroCode } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contractorSchema = z.object({
  companyName: z.string().min(1, "Company Name is required."),
  contactName: z.string().min(1, "Contact name is required."),
  contactEmail: z.string().min(1, "Contact email is required."),
  contractorType: z.string().min(1, "Contractor type is required."),
  preferred: z.boolean().default(false),
  metroCodes: z.array(z.string()).min(1, "At least one metro code is required."),
  contactPhone: z.string().min(1, "Contact phone is required."),
});

export default function EditContractorPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const contractorRef = useMemoFirebase(() => doc(firestore, 'contractors', id), [firestore, id]);
  const { data: contractor, isLoading: contractorLoading } = useDoc<Contractor>(contractorRef);

  const metrosQuery = useMemoFirebase(() => collection(firestore, 'metro_codes'), [firestore]);
  const { data: metroCodes, isLoading: metrosLoading } = useCollection<MetroCode>(metrosQuery);

  const form = useForm<z.infer<typeof contractorSchema>>({
    resolver: zodResolver(contractorSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      contractorType: "",
      preferred: false,
      metroCodes: [],
    },
  });

  useEffect(() => {
    if (contractor) {
      form.reset({
        companyName: contractor.companyName,
        contactName: contractor.contactName,
        contactEmail: contractor.contactEmail,
        contactPhone: contractor.contactPhone,
        contractorType: contractor.contractorType,
        preferred: contractor.preferred,
        metroCodes: contractor.metroCodes || [],
      });
    }
  }, [contractor, form]);

  const onSubmit = async (values: z.infer<typeof contractorSchema>) => {
    if (!contractorRef) return;
    try {
      await updateDoc(contractorRef, values);
      toast({
        title: "Contractor Updated",
        description: "The contractor information has been saved.",
      });
      router.push(`/contractors/${id}`);
    } catch (error) {
      console.error("Error updating contractor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update contractor. Please try again.",
      });
    }
  };
  
  const contractorTypes = useMemo(() => {
    return ["Electrical", "Electrical / NICON", "Electrical / Professional Services", "General Contractor", "Mechanical", "NICON"];
  }, []);

  if (contractorLoading || metrosLoading) {
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
          <CardDescription>Update the details for {contractor.companyName}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contractor Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>POC Name(s)</FormLabel>
                    <FormControl><Textarea placeholder="John Doe; Jane Smith" {...field} /></FormControl>
                    <FormDescription>Separate multiple names with a semicolon.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>POC Email(s)</FormLabel>
                    <FormControl><Textarea placeholder="john@example.com; jane@example.com" {...field} /></FormControl>
                    <FormDescription>Separate multiple emails with a semicolon.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>POC Phone</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="contractorType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contractor Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                        </FormControl>
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
                  name="preferred"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-8">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Preferred Contractor
                        </FormLabel>
                        <FormDescription>
                          Mark this contractor as a preferred partner.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

                <FormField
                    control={form.control}
                    name="metroCodes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Operating Metro Codes</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {metroCodes?.map((metro) => (
                                    <FormField
                                        key={metro.id}
                                        control={form.control}
                                        name="metroCodes"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={metro.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(metro.code)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...(field.value || []), metro.code])
                                                                    : field.onChange(
                                                                        (field.value || [])?.filter(
                                                                            (value) => value !== metro.code
                                                                        )
                                                                    )
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {metro.code}
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

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
