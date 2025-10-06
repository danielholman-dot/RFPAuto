
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import { useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, updateDoc } from "firebase/firestore";
import type { Contractor, MetroCode } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contractorSchema = z.object({
  name: z.string().min(1, "Name is required."),
  contactName: z.string().min(1, "Contact name is required."),
  contactEmail: z.string().min(1, "Contact email is required."),
  type: z.string().min(1, "Contractor type is required."),
  preferredStatus: z.string().min(1, "Preferred status is required."),
  region: z.string().min(1, "Region is required."),
  metroSite: z.string().min(1, "Metro/Site is required."),
  performance: z.coerce.number().min(0).max(100),
  metroCodes: z.array(z.string()).min(1, "At least one metro code is required."),
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
      name: "",
      contactName: "",
      contactEmail: "",
      type: "",
      preferredStatus: "",
      region: "",
      metroSite: "",
      performance: 0,
      metroCodes: [],
    },
  });

  useEffect(() => {
    if (contractor) {
      form.reset(contractor);
    }
  }, [contractor, form]);

  const onSubmit = async (values: z.infer<typeof contractorSchema>) => {
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

  const preferredStatuses = ["Most Preferred", "Preferred", "Not Evaluated"];
  const regions = ["North America", "East", "West", "West (Central)"];


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
          <CardDescription>Update the details for {contractor.name}.</CardDescription>
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

              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="type"
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
                  name="preferredStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {preferredStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a region" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regions.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
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
                        <FormLabel>Metro / Site Description</FormLabel>
                        <FormControl><Input placeholder="CLT (Charlotte), PHX (Phoenix)" {...field} /></FormControl>
                        <FormMessage />
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
                            <div className="grid grid-cols-4 gap-4">
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
                                                                    ? field.onChange([...field.value, metro.code])
                                                                    : field.onChange(
                                                                        field.value?.filter(
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
