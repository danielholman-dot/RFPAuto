
'use client';

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Textarea from "../ui/textarea";
import type { RFP } from "@/lib/types";
import { generateProjectRFPInstructions } from "@/ai/flows/generate-project-rfp-instructions";
import { Bot, Edit, Loader2, Save, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

type RfpDraftingProps = {
    rfp: RFP;
};

export function RfpDrafting({ rfp }: RfpDraftingProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [draftContent, setDraftContent] = useState<string | null>(null);
    const { toast } = useToast();

    const handleGenerateDraft = async () => {
        const missingFields = [];
        if (!rfp.projectName || rfp.projectName === 'New RFP Draft') missingFields.push("Project Name");
        if (!rfp.scopeOfWork || rfp.scopeOfWork === 'To be defined.') missingFields.push("Scope of Work");
        if (!rfp.metroCode || rfp.metroCode === 'N/A') missingFields.push("Metro Code (Campus)");
        if (!rfp.contractorType || rfp.contractorType === 'N/A') missingFields.push("Contractor Type");
        if (!rfp.projectStartDate) missingFields.push("Project Start Date");

        if (missingFields.length > 0) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: `Please provide the following details before generating a draft: ${missingFields.join(', ')}.`,
            });
            return;
        }

        setIsGenerating(true);
        setDraftContent(null);
        try {
            const startDateValue = rfp.projectStartDate ? (rfp.projectStartDate instanceof Date ? rfp.projectStartDate : rfp.projectStartDate.toDate()) : new Date();

            const result = await generateProjectRFPInstructions({
                projectName: rfp.projectName,
                scopeOfWork: rfp.scopeOfWork,
                metroCode: rfp.metroCode,
                contractorType: rfp.contractorType,
                estimatedBudget: rfp.estimatedBudget,
                startDate: format(startDateValue, 'MM/dd/yyyy'),
                technicalDocuments: "N/A",
                primaryStakeholderEmail: rfp.primaryStakeholderEmail,
            });
            setDraftContent(result.rfpInstructions);
        } catch (error) {
            console.error("Failed to generate RFP draft:", error);
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: "There was an error generating the RFP instructions."
            })
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(prev => !prev);
    };

    const handleSave = () => {
        setIsEditing(false);
        toast({
            title: "Draft Saved",
            description: "Your changes to the RFP draft have been saved.",
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI-Powered RFP Drafting</CardTitle>
                <CardDescription>
                    Use AI to generate a detailed RFP instructions document based on the project information and standard templates. You can then review and edit the draft.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {!draftContent && !isGenerating && (
                    <div className="text-center py-12">
                        <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Ready to Draft</h3>
                        <p className="mt-1 text-sm text-gray-500">Click the button to generate the initial RFP draft.</p>
                        <div className="mt-6">
                            <Button onClick={handleGenerateDraft}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Draft RFP
                            </Button>
                        </div>
                    </div>
                )}

                {isGenerating && (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <p className="ml-3">AI is drafting your RFP instructions...</p>
                    </div>
                )}
                
                {draftContent && (
                    <div>
                        <div className="flex justify-end gap-2 mb-4">
                            {isEditing ? (
                                <Button onClick={handleSave}>
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </Button>
                            ) : (
                                <Button variant="outline" onClick={handleEditToggle}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </Button>
                            )}
                             <Button variant="outline" onClick={handleGenerateDraft}>
                                <Sparkles className="mr-2 h-4 w-4" /> Regenerate
                            </Button>
                        </div>

                        {isEditing ? (
                             <Textarea 
                                value={draftContent}
                                onChange={(e) => setDraftContent(e.target.value)}
                                className="w-full h-[70vh] font-mono text-xs"
                                placeholder="RFP draft will appear here..."
                            />
                        ) : (
                            <div 
                                className={cn(
                                    "prose prose-sm max-w-none p-4 border rounded-md h-[70vh] overflow-auto bg-background",
                                    "[&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:p-2 [&_th]:font-bold [&_td]:border [&_td]:p-2 [&_ul]:list-disc [&_ul]:pl-5"
                                )}
                                dangerouslySetInnerHTML={{ __html: draftContent }} 
                            />
                        )}
                         <div className="mt-4 flex justify-end">
                            <Button>Review and Approve</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
