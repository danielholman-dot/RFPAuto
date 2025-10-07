
'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, CalendarIcon } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useFirebase } from "@/firebase"
import { collection, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import type { RFP, MetroCode } from "@/lib/types"
import { FileInput } from "../ui/file-input"

const formSchema = z.object({
  projectName: z.string().min(1, "Project name is required."),
  scopeOfWork: z.string().min(1, "Scope of work is required."),
  primaryStakeholderName: z.string().optional(),
  primaryStakeholderEmail: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  additionalStakeholderEmails: z.string().optional(),
  metroCode: z.string().min(1, "Metro code is required."),
  contractorType: z.string().min(1, "Contractor type is required."),
  estimatedBudget: z.coerce.number().min(0, "Budget must be a positive number."),
  rfpStartDate: z.date().optional(),
  rfpEndDate: z.date().optional(),
  projectStartDate: z.date({ required_error: "A project start date is required."}),
  projectEndDate: z.date().optional(),
  technicalDocuments: z.array(z.instanceof(File)).optional(),
  technicalDocumentsLinks: z.string().optional(),
})

type ProjectIntakeFormProps = {
    metroCodes: MetroCode[];
    contractorTypes: string[];
}

export function ProjectIntakeForm({ metroCodes, contractorTypes }: ProjectIntakeFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { firestore, firebaseApp } = useFirebase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formattedBudget, setFormattedBudget] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      scopeOfWork: "",
      primaryStakeholderName: "",
      primaryStakeholderEmail: "",
      additionalStakeholderEmails: "",
      metroCode: "",
      contractorType: "",
      technicalDocumentsLinks: "",
      technicalDocuments: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    let rfpId = '';
    
    try {
      const rfpsCol = collection(firestore, 'rfps');
      
      const newRfpData: Omit<RFP, 'id'> = {
        projectName: values.projectName || "Untitled RFP",
        scopeOfWork: values.scopeOfWork || "",
        metroCode: values.metroCode || "",
        contractorType: values.contractorType || "",
        estimatedBudget: values.estimatedBudget || 0,
        rfpStartDate: values.rfpStartDate ? Timestamp.fromDate(values.rfpStartDate) : undefined,
        rfpEndDate: values.rfpEndDate ? Timestamp.fromDate(values.rfpEndDate) : undefined,
        projectStartDate: values.projectStartDate ? Timestamp.fromDate(values.projectStartDate) : undefined,
        projectEndDate: values.projectEndDate ? Timestamp.fromDate(values.projectEndDate) : undefined,
        primaryStakeholderName: values.primaryStakeholderName,
        primaryStakeholderEmail: values.primaryStakeholderEmail,
        additionalStakeholderEmails: values.additionalStakeholderEmails,
        status: "Draft" as const,
        createdAt: Timestamp.now(),
        technicalDocumentsLinks: values.technicalDocumentsLinks,
        technicalDocumentUrls: [],
        invitedContractors: [],
        completedStages: [],
      };
      
      const docRef = await addDoc(rfpsCol, newRfpData);
      rfpId = docRef.id;

      // Handle file uploads
      if (values.technicalDocuments && values.technicalDocuments.length > 0) {
        toast({
            title: "Uploading files...",
            description: `Attaching ${values.technicalDocuments.length} document(s). Please wait.`,
        });

        const storage = getStorage(firebaseApp);
        const uploadPromises = values.technicalDocuments.map(file => {
          return new Promise<string>((resolve, reject) => {
            const storageRef = ref(storage, `rfp-technical-documents/${rfpId}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
              (snapshot) => {
                // Optional: handle progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
              },
              (error) => {
                console.error("Upload failed:", error);
                reject(error);
              },
              async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
              }
            );
          });
        });

        const downloadUrls = await Promise.all(uploadPromises);

        // Update Firestore document with storage URLs
        const rfpDoc = doc(firestore, 'rfps', rfpId);
        await updateDoc(rfpDoc, {
            technicalDocumentUrls: downloadUrls
        });
      }


      toast({
        title: "RFP Draft Created",
        description: `Project "${values.projectName || "Untitled RFP"}" has been saved as a draft.`,
      });
      router.push(`/rfp/${rfpId}`);

    } catch (error: any) {
      console.error("Error creating RFP: ", error);
      toast({
        variant: "destructive",
        title: "Error Creating RFP",
        description: error.message || "Failed to create RFP draft. Please check the console for details.",
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
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-8"
        onKeyDown={(e) => {
            if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) {
                e.preventDefault();
            }
        }}
    >
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
              name="primaryStakeholderName"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Primary Stakeholder Name</FormLabel>
                  <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
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
        </div>
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
                    {metroCodes && metroCodes.map(metro => (
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
                    {contractorTypes && contractorTypes.map(type => (
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
                      placeholder="5,000,000" 
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
                    <FormItem className="flex flex-col">
                    <FormLabel>RFP Start Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="rfpEndDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>RFP End Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
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
                    <FormItem className="flex flex-col">
                    <FormLabel>Project Start Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="projectEndDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Project End Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <div className="space-y-4">
            <FormField
              control={form.control}
              name="technicalDocuments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Documents (Files)</FormLabel>
                  <FormControl>
                    <FileInput onFileChange={(files) => field.onChange(files)} multiple>
                      <p className="text-xs text-muted-foreground">
                        Upload any relevant local files like specs, drawings, or zipped documents.
                      </p>
                    </FileInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="technicalDocumentsLinks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Documents (Links)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste links to Google Sheets, Docs, or other web-based resources here, one per line."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>For documents that are URLs, like Google Sheets, paste the links here.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
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
