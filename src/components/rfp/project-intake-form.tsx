
'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Textarea from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getContractorTypes, getMetroCodes, addRfp } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const formSchema = z.object({
  projectName: z.string().optional(),
  scopeOfWork: z.string().optional(),
  primaryStakeholderEmail: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  additionalStakeholderEmails: z.string().optional(),
  metroCode: z.string().optional(),
  contractorType: z.string().optional(),
  estimatedBudget: z.coerce.number().optional(),
  rfpStartDate: z.string().optional(),
  rfpEndDate: z.string().optional(),
  projectStartDate: z.string().optional(),
  projectEndDate: z.string().optional(),
  technicalDocuments: z.any().optional(),
})

export function ProjectIntakeForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metroCodes, setMetroCodes] = useState<{code: string, city: string}[]>([]);
  const [contractorTypes, setContractorTypes] = useState<string[]>([]);
  const [formattedBudget, setFormattedBudget] = useState("");


  useEffect(() => {
    async function loadData() {
      const [metros, types] = await Promise.all([getMetroCodes(), getContractorTypes()]);
      setMetroCodes(metros);
      setContractorTypes(types);
    }
    loadData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      scopeOfWork: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const newRfp = {
        projectName: values.projectName || "Untitled RFP",
        scopeOfWork: values.scopeOfWork || "",
        metroCode: values.metroCode || "",
        contractorType: values.contractorType || "",
        estimatedBudget: values.estimatedBudget || 0,
        rfpStartDate: values.rfpStartDate ? new Date(values.rfpStartDate) : undefined,
        rfpEndDate: values.rfpEndDate ? new Date(values.rfpEndDate) : undefined,
        projectStartDate: values.projectStartDate ? new Date(values.projectStartDate) : undefined,
        projectEndDate: values.projectEndDate ? new Date(values.projectEndDate) : undefined,
        primaryStakeholderEmail: values.primaryStakeholderEmail,
        additionalStakeholderEmails: values.additionalStakeholderEmails,
        status: "Draft",
        createdAt: new Date(),
      };
      
      const docId = await addRfp(newRfp);

      toast({
        title: "RFP Draft Created",
        description: `Project "${values.projectName || "Untitled RFP"}" has been saved as a draft.`,
      });
      router.push(`/rfp/${docId}`);

    } catch (error) {
      console.error("Error creating RFP: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create RFP draft. Please try again.",
      });
      setIsSubmitting(false);
    }
  }
  
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const numericValue = Number(rawValue);
    
    if (!isNaN(numericValue)) {
      form.setValue('estimatedBudget', numericValue);
      setFormattedBudget(new Intl.NumberFormat('de-DE').format(numericValue));
    } else {
      form.setValue('estimatedBudget', 0);
      setFormattedBudget("");
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., NYC Data Center Expansion" {...field} />
              </FormControl>
              <FormDescription>The official name of the project.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scopeOfWork"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scope of Work</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the project scope in detail..." className="min-h-32" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="grid md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="primaryStakeholderEmail"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Primary Stakeholder Email</FormLabel>
                <FormControl>
                    <Input type="email" placeholder="stakeholder@example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="additionalStakeholderEmails"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Additional Stakeholder Emails</FormLabel>
                <FormControl>
                    <Input placeholder="email1@example.com, email2@example.com" {...field} />
                </FormControl>
                 <FormDescription>A comma-separated list of emails.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="metroCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metro Code</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a metro area" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {metroCodes.map(metro => (
                      <SelectItem key={metro.code} value={metro.code}>{metro.code} - {metro.city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contractorType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contractor Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a contractor type" />
                    </SelectTrigger>
                  </FormControl>
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
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="estimatedBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Budget</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input 
                      type="text"
                      placeholder="5.000.000" 
                      {...field}
                      value={formattedBudget}
                      onChange={handleBudgetChange}
                      className="pl-7"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="rfpStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RFP Start Date</FormLabel>
                <FormControl>
                  <Input placeholder="MM/DD/YYYY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rfpEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RFP End Date</FormLabel>
                <FormControl>
                  <Input placeholder="MM/DD/YYYY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="projectStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Start Date</FormLabel>
                <FormControl>
                  <Input placeholder="MM/DD/YYYY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project End Date</FormLabel>
                <FormControl>
                  <Input placeholder="MM/DD/YYYY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="technicalDocuments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technical Documents</FormLabel>
              <FormControl>
                <Input type="file" multiple {...field} />
              </FormControl>
              <FormDescription>Upload any relevant technical specs, drawings, or documents.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create RFP Draft
          </Button>
        </div>
      </form>
    </Form>
  )
}
