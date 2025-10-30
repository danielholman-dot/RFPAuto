'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Textarea from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useFirebase } from "@/firebase";
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import type { RFP } from "@/lib/types";

const formSchema = z.object({
  question: z.string().min(1, "Question cannot be empty."),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface RfpClarificationDialogProps {
  rfpId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missingFields: string[];
  rfp: RFP;
}

export function RfpClarificationDialog({
  rfpId,
  open,
  onOpenChange,
  missingFields,
  rfp,
}: RfpClarificationDialogProps) {
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  async function onSubmit(values: FormSchemaType) {
    if (!rfpId) {
        toast({ variant: "destructive", title: "Error", description: "RFP ID is missing." });
        return;
    }
    setIsSubmitting(true);
    try {
      const clarificationsCol = collection(firestore, 'rfps', rfpId, 'clarifications');
      await addDoc(clarificationsCol, {
        question: values.question,
        askedAt: Timestamp.now(),
        answer: null,
      });

      toast({
        title: "Question Submitted",
        description: "Your question has been submitted for review.",
      });
      form.reset();
      onOpenChange(false);

    } catch (error: any) {
      console.error("Error submitting clarification: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit question.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Provide More Details</DialogTitle>
          <DialogDescription>
            The following fields are missing or incomplete in the RFP draft:
            <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
              {missingFields.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
            Please provide these details to improve the AI-generated draft. You can also ask any other clarifying questions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clarifications / Additional Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide missing details or ask questions here..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Clarifications
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}