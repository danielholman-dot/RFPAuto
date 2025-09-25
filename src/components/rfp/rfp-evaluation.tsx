
'use client';
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Textarea from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Proposal } from "@/lib/types";
import { evaluationChecklist } from "@/lib/checklist-data";

type RfpEvaluationProps = {
    proposals: Proposal[];
    getContractorNameById: (id: string) => string;
}

export function RfpEvaluation({ proposals, getContractorNameById }: RfpEvaluationProps) {
    const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);

    const renderChecklistSection = (section: (typeof evaluationChecklist)[0]) => {
        return (
            <AccordionItem value={section.title} key={section.title}>
                <AccordionTrigger>
                    <div className="flex flex-col items-start">
                        <span className="font-semibold">{section.title}</span>
                        {section.description && <span className="text-sm text-muted-foreground font-normal">{section.description}</span>}
                    </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pl-2">
                    {section.criteria.map((criterion, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <Label className="md:col-span-3">{criterion.text}</Label>
                            <div className="flex items-center gap-4">
                                <Slider defaultValue={[criterion.value]} max={100} step={1} />
                                <span>{criterion.value}%</span>
                            </div>
                        </div>
                    ))}
                     <div className="space-y-2">
                        <Label>Observations</Label>
                        <Textarea placeholder={section.observations.placeholder} />
                    </div>
                </AccordionContent>
            </AccordionItem>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Proposal Evaluation Checklist</CardTitle>
                <CardDescription>Select a proposal and complete the evaluation checklist below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="max-w-sm">
                    <Label>Select Proposal to Evaluate</Label>
                    <Select onValueChange={setSelectedProposalId} value={selectedProposalId || ""}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a submitted proposal..." />
                        </SelectTrigger>
                        <SelectContent>
                            {proposals.length > 0 ? (
                                proposals.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                        Proposal from {getContractorNameById(p.contractorId)}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="disabled" disabled>No proposals submitted</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {selectedProposalId ? (
                    <>
                        <Accordion type="multiple" className="w-full space-y-4">
                           {evaluationChecklist.map(section => renderChecklistSection(section))}
                        </Accordion>
                         <div className="flex justify-end">
                            <Button>Save Evaluation</Button>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-muted-foreground py-12">Please select a proposal to begin the evaluation.</p>
                )}
            </CardContent>
        </Card>
    )
}

    