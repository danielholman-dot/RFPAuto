'use client';

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Textarea from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { RFP, MetroCode } from "@/lib/types";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, updateDoc } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { contractorTypes } from "@/lib/data";

type RfpClarificationDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  rfp: RFP;
  missingFields: string[];
  onSubmit: (updatedRfp: RFP) => void;
};

const formSchema = z.object({
  projectName: z.string().min(1, "Project name is required."),
  scopeOfWork: z.string().min(1, "Scope of work is required."),
  metroCode: z.string().min(1, "Metro code is required."),
  contractorType: z.string().min(1, "Contractor type is required."),
  projectStartDate: z.date({ required_error: "A project start date is required."}),
});

export function RfpClarificationDialog({ isOpen, onOpenChange, rfp, missingFields, onSubmit }: RfpClarificationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const metroCodesQuery = useMemoFirebase(() => collection(firestore, 'metro_codes'), [firestore]);
  const { data: allMetroCodes, isLoading: metrosLoading } = useCollection<MetroCode>(metroCodesQuery);

  const sortedMetroCodes = useMemo(() => {
    if (!allMetroCodes) return [];
    return [...allMetroCodes].sort((a, b) => a.code.localeCompare(b.code));
  }, [allMetroCodes]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: rfp.projectName !== 'New RFP Draft' ? rfp.projectName : '',
      scopeOfWork: rfp.scopeOfWork !== 'To be defined.' ? rfp.scopeOfWork : '',
      metroCode: rfp.metroCode !== 'N/A' ? rfp.metroCode : '',
      contractorType: rfp.contractorType !== 'N/A' ? rfp.contractorType : '',
      projectStartDate: rfp.projectStartDate?.toDate(),
    },
  });

  useEffect(() => {
    if (rfp) {
        form.reset({
            projectName: rfp.projectName !== 'New RFP Draft' ? rfp.projectName : '',
            scopeOfWork: rfp.scopeOfWork !== 'To be defined.' ? rfp.scopeOfWork : '',
            metroCode: rfp.metroCode !== 'N/A' ? rfp.metroCode : '',
            contractorType: rfp.contractorType !== 'N/A' ? rfp.contractorType : '',
            projectStartDate: rfp.projectStartDate?.toDate(),
        })
    }
  }, [rfp, form]);

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
        const rfpDocRef = doc(firestore, 'rfps', rfp.id);
        const updatedData = {
            ...values,
            projectStartDate: values.projectStartDate ? new Date(values.projectStartDate) : undefined
        };

        await updateDoc(rfpDocRef, updatedData);

        const updatedRfp = { ...rfp, ...updatedData };
        
        toast({
            title: "RFP Updated",
            description: "RFP details have been saved.",
        });
        
        onSubmit(updatedRfp);
        onOpenChange(false);
    } catch (error) {
      console.error("Failed to update RFP:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to update RFP details."});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Clarification Needed</DialogTitle>
          <DialogDescription>
            Please fill in the missing details before generating the RFP draft.
          </DialogDescription>
        </DialogHeader>
        {metrosLoading ? (
            <div className="flex justify-center items-center h-48"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {missingFields.includes('projectName') && (
                    <FormField
                        control={form.control}
                        name="projectName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {missingFields.includes('scopeOfWork') && (
                     <FormField
                        control={form.control}
                        name="scopeOfWork"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Scope of Work</FormLabel>
                                <FormControl><Textarea {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                 {missingFields.includes('metroCode') && (
                    <FormField
                        control={form.control}
                        name="metroCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Metro Code</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a metro" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {sortedMetroCodes.map(metro => (
                                            <SelectItem key={metro.code} value={metro.code}>{metro.code} - {metro.city}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {missingFields.includes('contractorType') && (
                    <FormField
                        control={form.control}
                        name="contractorType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contractor Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {contractorTypes.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {missingFields.includes('projectStartDate') && (
                    <FormField
                        control={form.control}
                        name="projectStartDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Project Start Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}
                                    >
                                    {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                 <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update and Generate
                    </Button>
                </DialogFooter>
            </form>
            </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
