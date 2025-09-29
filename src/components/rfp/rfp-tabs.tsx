
'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import type { RFP, Contractor, Proposal } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import { Mail, Send, Bot, Trophy, Star, Loader2, UploadCloud, PlusCircle, Settings, Award, CheckCircle, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge";
import { useEffect, useState, useMemo, useCallback } from "react";
import { generateComparativeAnalysis, GenerateComparativeAnalysisOutput } from "@/ai/flows/generate-comparative-analysis";
import { getProposalsForRfp, getSuggestedContractors, getInvitedContractors, getContractors, addInvitedContractorToRfp, updateRfp } from "@/lib/data";
import { RfpInvitationDialog } from "./rfp-invitation-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { RfpChecklistDialog } from "./rfp-checklist-dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { RfpAwardDialog } from "./rfp-award-dialog"
import { RfpNonAwardDialog } from "./rfp-non-award-dialog"
import { RfpDrafting } from "./rfp-drafting"
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";


type RfpTabsProps = {
  rfp: RFP;
  isDraft?: boolean;
}

type RfpStage = 'Selection' | 'Drafting' | 'Invitation' | 'Proposals' | 'Analysis' | 'Award' | 'Feedback';

const STAGES: RfpStage[] = ['Selection', 'Drafting', 'Invitation', 'Proposals', 'Analysis', 'Award', 'Feedback'];

const StageCompletion = ({ stage, completedStages, onStageToggle }: { stage: RfpStage, completedStages: RfpStage[], onStageToggle: (stage: RfpStage) => void }) => {
    return (
        <div className="flex items-center justify-end space-x-2 mt-6 border-t pt-4">
            <Checkbox
                id={`complete-${stage}`}
                checked={completedStages.includes(stage)}
                onCheckedChange={() => onStageToggle(stage)}
            />
            <label
                htmlFor={`complete-${stage}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                Mark stage as complete
            </label>
        </div>
    );
};


export function RfpTabs({ rfp: initialRfp, isDraft = false }: RfpTabsProps) {
  const [rfp, setRfp] = useState(initialRfp);
  const [activeTab, setActiveTab] = useState(rfp.status === 'Draft' ? 'Selection' : rfp.status);
  
  // Initialize completed stages based on current RFP status
  const getInitialCompletedStages = (status: RfpStage) => {
    const currentIndex = STAGES.indexOf(status);
    return STAGES.slice(0, currentIndex);
  };
  const [completedStages, setCompletedStages] = useState<RfpStage[]>(getInitialCompletedStages(rfp.status as RfpStage));
  const { toast } = useToast();

  const [suggestedContractors, setSuggestedContractors] = useState<Contractor[]>([]);
  const [suggestedLoading, setSuggestedLoading] = useState(!isDraft);

  const [allContractors, setAllContractors] = useState<Contractor[]>([]);
  const [selectedContractorToAdd, setSelectedContractorToAdd] = useState<string>('');

  const [invitedContractors, setInvitedContractors] = useState<Contractor[]>([]);
  const [invitedLoading, setInvitedLoading] = useState(!isDraft);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalsLoading, setProposalsLoading] = useState(!isDraft);

  const [isInvitationDialogOpen, setIsInvitationDialogOpen] = useState(false);
  const [isChecklistDialogOpen, setIsChecklistDialogOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);

  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  const [comparativeAnalysisResult, setComparativeAnalysisResult] = useState<GenerateComparativeAnalysisOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [winningContractorId, setWinningContractorId] = useState<string | null>(null);
  
  const [isAwardDialogOpen, setIsAwardDialogOpen] = useState(false);
  const [isNonAwardDialogOpen, setIsNonAwardDialogOpen] = useState(false);
  const [contractorForDialog, setContractorForDialog] = useState<Contractor | null>(null);
  const [sentEoiContractors, setSentEoiContractors] = useState<string[]>([]);

  const handleStageToggle = (stage: RfpStage) => {
    const isCompleting = !completedStages.includes(stage);
    let newCompletedStages = [...completedStages];

    if (isCompleting) {
        newCompletedStages.push(stage);
    } else {
        // If unchecking a stage, uncheck all subsequent stages
        const stageIndex = STAGES.indexOf(stage);
        newCompletedStages = completedStages.filter(s => STAGES.indexOf(s) < stageIndex);
    }

    setCompletedStages(newCompletedStages);

    const findNextStage = () => {
        for (const s of STAGES) {
            if (!newCompletedStages.includes(s)) {
                return s;
            }
        }
        return 'Completed';
    };

    const newStatus = findNextStage();
    
    const updatedRfp = { ...rfp, status: newStatus as RFP['status'] };
    setRfp(updatedRfp);
    updateRfp(rfp.id, { status: newStatus as RFP['status'] });

    toast({
        title: "Status Updated",
        description: `RFP is now in the "${newStatus}" stage.`,
    });
};

  const loadInvited = useCallback(async () => {
    if (isDraft) return;
    setInvitedLoading(true);
    const contractors = await getInvitedContractors(rfp.invitedContractors || []);
    setInvitedContractors(contractors);
    setInvitedLoading(false);
  }, [isDraft, rfp.invitedContractors]);

  useEffect(() => {
    if (isDraft) return;

    async function loadSuggestions() {
      setSuggestedLoading(true);
      const contractors = await getSuggestedContractors(rfp.metroCode, rfp.contractorType);
      setSuggestedContractors(contractors);
      setSuggestedLoading(false);
    }
    
    async function loadProposals() {
      setProposalsLoading(true);
      const props = await getProposalsForRfp(rfp.id);
      const propsWithBids = props.map(p => ({...p, bidAmount: Math.floor(Math.random() * (rfp.estimatedBudget * 1.5 - rfp.estimatedBudget * 0.8 + 1)) + rfp.estimatedBudget * 0.8 }));
      setProposals(propsWithBids);
      setProposalsLoading(false);
    }
    
    async function loadAllContractors() {
        const contractors = await getContractors();
        setAllContractors(contractors);
    }

    loadSuggestions();
    loadInvited();
    loadProposals();
    loadAllContractors();

  }, [rfp.id, rfp.metroCode, rfp.contractorType, rfp.estimatedBudget, isDraft, loadInvited]);

  const handleAddContractorToRfp = async () => {
    if (!selectedContractorToAdd) return;
    await addInvitedContractorToRfp(rfp.id, selectedContractorToAdd);
    const contractor = allContractors.find(c => c.id === selectedContractorToAdd);
    if (contractor && !invitedContractors.find(c => c.id === contractor.id)) {
        setInvitedContractors(prev => [...prev, contractor]);
        setRfp(prev => ({ ...prev, invitedContractors: [...(prev.invitedContractors || []), contractor.id]}));
    }
    setSelectedContractorToAdd('');
  };


  const proposalStatusByContractor = useMemo(() => {
    const statusMap = new Map<string, Proposal | null>();
    invitedContractors.forEach(c => {
      const proposal = proposals.find(p => p.contractorId === c.id);
      statusMap.set(c.id, proposal || null);
    });
    return statusMap;
  }, [invitedContractors, proposals]);
  
  const handleInviteClick = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setIsInvitationDialogOpen(true);
  };
  
  const handleEoiSent = (contractorId: string) => {
    setSentEoiContractors(prev => [...prev, contractorId]);
    setIsInvitationDialogOpen(false);
  };

  const handleAwardLetterClick = (contractor: Contractor) => {
    setContractorForDialog(contractor);
    setIsAwardDialogOpen(true);
  }

  const handleNonAwardLetterClick = (contractor: Contractor) => {
    setContractorForDialog(contractor);
    setIsNonAwardDialogOpen(true);
  }

  const handleAnalyze = async () => {
    const proposalsToAnalyze = proposals.filter(p => selectedProposals.includes(p.id));
    if (proposalsToAnalyze.length === 0) {
      toast({ variant: "destructive", title: "Selection required", description: "Please select at least one proposal to analyze."});
      return;
    }

    setIsAnalyzing(true);
    setComparativeAnalysisResult(null);

    const proposalInputs = proposalsToAnalyze.map(p => ({
      contractorName: getContractorById(p.contractorId)?.name || 'Unknown',
      proposalText: p.proposalText || '',
    }));

    try {
      const result = await generateComparativeAnalysis({
        rfpScope: rfp.scopeOfWork,
        proposals: proposalInputs,
      });
      setComparativeAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({ variant: "destructive", title: "Analysis Failed", description: "There was an error running the comparative analysis." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProposalSelection = (proposalId: string) => {
    setSelectedProposals(prev => 
      prev.includes(proposalId) 
        ? prev.filter(id => id !== proposalId)
        : [...prev, proposalId]
    );
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (date.toDate) { // Firebase Timestamp
      return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  const getContractorById = useCallback((id: string) => {
    return invitedContractors?.find(c => c.id === id) || suggestedContractors?.find(c => c.id === id) || allContractors?.find(c => c.id === id);
  }, [invitedContractors, suggestedContractors, allContractors]);

  const uninvitedSuggestedContractors = useMemo(() => {
    const invitedIds = new Set(rfp.invitedContractors || []);
    return suggestedContractors.filter(c => !invitedIds.has(c.id));
  }, [suggestedContractors, rfp.invitedContractors]);

  const analysisChartData = useMemo(() => {
    return proposals
      .filter(p => selectedProposals.includes(p.id))
      .map(p => ({
        name: getContractorById(p.contractorId)?.name || 'Unknown',
        value: p.bidAmount,
      }));
  }, [proposals, selectedProposals, getContractorById]);


  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            {STAGES.map(stage => (
                 <TabsTrigger key={stage} value={stage} className="flex items-center gap-2">
                    {completedStages.includes(stage) && <CheckCircle size={16} className="text-green-600"/>}
                    {stage}
                </TabsTrigger>
            ))}
        </TabsList>

        <TabsContent value="Selection" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Suggested Contractors</CardTitle>
                    <CardDescription>
                        {isDraft ? "Complete the RFP draft to see contractor suggestions." : `Based on the project's metro code (${rfp.metroCode}) and contractor type (${rfp.contractorType}), here are top suggestions.`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {suggestedLoading && <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>}
                    {!suggestedLoading && !suggestedContractors?.length && <p className="text-center text-muted-foreground py-8">No matching contractors found for this RFP's criteria.</p>}
                    {suggestedContractors && suggestedContractors.length > 0 && (
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Contractor</TableHead>
                            <TableHead>Performance</TableHead>
                            <TableHead className="text-right">EOI Expression of Interest</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suggestedContractors.map(contractor => (
                            <TableRow key={contractor.id}>
                                <TableCell className="font-medium">{contractor.name}</TableCell>
                                <TableCell className="flex items-center">
                                {contractor.performance}% <Star className="w-4 h-4 ml-1 text-yellow-500 fill-yellow-500" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleInviteClick(contractor)}>
                                            Send EOI
                                        </Button>
                                        {sentEoiContractors.includes(contractor.id) && (
                                            <Check className="h-5 w-5 text-green-600" />
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    )}
                    <StageCompletion stage="Selection" completedStages={completedStages} onStageToggle={handleStageToggle} />
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="Drafting" className="mt-4">
            <RfpDrafting rfp={rfp} />
            <StageCompletion stage="Drafting" completedStages={completedStages} onStageToggle={handleStageToggle} />
        </TabsContent>

        <TabsContent value="Invitation" className="mt-4">
            <Card>
                <CardHeader>
                <CardTitle>Invited Contractors</CardTitle>
                <CardDescription>
                    Generate and send EOI / RFP invitation emails to selected contractors.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 mb-6 p-4 border rounded-lg">
                        <p className="text-sm font-medium">Manually add a contractor to the invitation list:</p>
                        <div className="flex-grow">
                            <Select value={selectedContractorToAdd} onValueChange={setSelectedContractorToAdd}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a contractor..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {uninvitedSuggestedContractors.map(c => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleAddContractorToRfp} disabled={!selectedContractorToAdd}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add to Invite List
                        </Button>
                    </div>
                {invitedLoading && <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>}
                {!invitedLoading && !invitedContractors?.length && <p className="text-muted-foreground text-center py-8">No contractors have been invited yet.</p>}
                {invitedContractors && invitedContractors.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-sm text-muted-foreground">{c.contactEmail}</p>
                    </div>
                    <div className="space-x-2">
                        <Button variant="outline" onClick={() => handleInviteClick(c)}><Mail className="mr-2 h-4 w-4"/> Generate EOI</Button>
                    </div>
                    </div>
                ))}
                <StageCompletion stage="Invitation" completedStages={completedStages} onStageToggle={handleStageToggle} />
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="Proposals" className="mt-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Proposal Submissions</CardTitle>
                    <CardDescription>Track proposal submissions from invited contractors and upload relevant documents.</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setIsChecklistDialogOpen(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configure RFP Checklist
                </Button>
                </CardHeader>
                <CardContent>
                {proposalsLoading ? (
                    <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
                ) : invitedContractors.length === 0 && !invitedLoading ? (
                    <p className="text-muted-foreground text-center py-8">No contractors have been invited to submit proposals yet.</p>
                ) : (
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Contractor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Documents</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invitedContractors.map(contractor => {
                        const proposal = proposalStatusByContractor.get(contractor.id);
                        const hasSubmitted = !!proposal;
                        return (
                            <TableRow key={contractor.id}>
                            <TableCell className="font-medium">{contractor.name}</TableCell>
                            <TableCell>
                                <Badge variant={hasSubmitted ? 'default' : 'outline'}>
                                {hasSubmitted ? 'Submitted' : 'Pending'}
                                </Badge>
                                {hasSubmitted && <div className="text-xs text-muted-foreground mt-1">on {formatDate(proposal.submittedDate)}</div>}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <label className="flex items-center gap-2" htmlFor={`proposal-upload-${contractor.id}`}>
                                        <Button asChild variant="outline" size="sm" className="h-8">
                                            <span>
                                                <UploadCloud className="mr-2 h-4 w-4"/> Upload Proposal
                                            </span>
                                        </Button>
                                        <Input id={`proposal-upload-${contractor.id}`} type="file" className="hidden"/>
                                    </label>
                                </div>
                            </TableCell>
                            </TableRow>
                        );
                        })}
                    </TableBody>
                    </Table>
                )}
                <StageCompletion stage="Proposals" completedStages={completedStages} onStageToggle={handleStageToggle} />
                </CardContent>
            </Card>
        </TabsContent>

        
        <TabsContent value="Analysis" className="mt-4">
            <div className="space-y-6">
                <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">1. Select Proposals for Analysis</h3>
                <div className="space-y-3">
                    {proposals?.length > 0 ? proposals.map(p => (
                    <div key={p.id} className="flex items-center space-x-3">
                        <Checkbox 
                        id={`proposal-${p.id}`}
                        checked={selectedProposals.includes(p.id)}
                        onCheckedChange={() => handleProposalSelection(p.id)}
                        disabled={!p.proposalText}
                        />
                        <label htmlFor={`proposal-${p.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Proposal from <strong>{getContractorById(p.contractorId)?.name}</strong>
                        </label>
                        {!p.proposalText && <Badge variant="outline">No text</Badge>}
                    </div>
                    )) : (
                    <p className="text-muted-foreground text-center py-4">No proposals submitted yet.</p>
                    )}
                </div>
                </div>
                
                <div className="text-center">
                <Button onClick={handleAnalyze} disabled={isAnalyzing || selectedProposals.length === 0}>
                    {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Run AI Evaluation
                </Button>
                </div>
                
                {isAnalyzing && <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /><p className="ml-2">Generating comparative analysis...</p></div>}
                
                {comparativeAnalysisResult && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Comparative Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold">Commercial</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comparativeAnalysisResult.commercialAnalysis}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Technical</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comparativeAnalysisResult.technicalAnalysis}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Presentation</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comparativeAnalysisResult.presentationAnalysis}</p>
                        </div>
                        </CardContent>
                    </Card>
                    <Card>
                    <CardHeader>
                        <CardTitle>Proposal Bids vs. Budget</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analysisChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`} />
                            <Tooltip formatter={(value:any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
                            <Legend />
                            <ReferenceLine y={rfp.estimatedBudget} label={{ value: "Budget", position: "insideTopLeft" }} stroke="red" strokeDasharray="3 3" />
                            <Bar dataKey="value" fill="#8884d8" name="Bid Amount" />
                        </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                    </Card>
                </div>
                )}
                 <StageCompletion stage="Analysis" completedStages={completedStages} onStageToggle={handleStageToggle} />
            </div>
        </TabsContent>

        <TabsContent value="Award" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Award Recommendation</CardTitle>
                    <CardDescription>Select a winning contractor and send award notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                    {invitedLoading ? (
                    <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
                    ) : invitedContractors.length > 0 ? (
                    <RadioGroup value={winningContractorId || ''} onValueChange={setWinningContractorId}>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-32">Select Winner</TableHead>
                            <TableHead>Contractor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invitedContractors.map(contractor => {
                            const isWinner = winningContractorId === contractor.id;
                            const isLoser = winningContractorId !== null && winningContractorId !== contractor.id;
                            return (
                                <TableRow key={contractor.id}>
                                <TableCell>
                                    <RadioGroupItem value={contractor.id} id={contractor.id} />
                                </TableCell>
                                <TableCell>
                                    <Label htmlFor={contractor.id} className="font-medium">{contractor.name}</Label>
                                </TableCell>
                                <TableCell>
                                    {isWinner && <Badge>Winner</Badge>}
                                    {isLoser && <Badge variant="destructive">Not Selected</Badge>}
                                </TableCell>
                                <TableCell className="text-right">
                                    {isWinner && (
                                    <Button size="sm" onClick={() => handleAwardLetterClick(contractor)}>
                                        <Award className="mr-2 h-4 w-4" />
                                        Send Award Letter
                                    </Button>
                                    )}
                                    {isLoser && (
                                    <Button size="sm" variant="secondary" onClick={() => handleNonAwardLetterClick(contractor)}>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Send Non-Award Letter
                                    </Button>
                                    )}
                                </TableCell>
                                </TableRow>
                            );
                            })}
                        </TableBody>
                        </Table>
                    </RadioGroup>
                    ) : (
                    <p className="text-muted-foreground text-center py-8">No contractors have been invited for this RFP.</p>
                    )}
                    <StageCompletion stage="Award" completedStages={completedStages} onStageToggle={handleStageToggle} />
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="Feedback" className="mt-4">
            <Card>
                <CardHeader>
                     <CardTitle>Stakeholder Feedback</CardTitle>
                     <CardDescription>This section will become active after project completion.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">Feedback summary tools will be available after project completion.</p>
                    <StageCompletion stage="Feedback" completedStages={completedStages} onStageToggle={handleStageToggle} />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      {selectedContractor && (
        <RfpInvitationDialog
          isOpen={isInvitationDialogOpen}
          onOpenChange={setIsInvitationDialogOpen}
          rfp={rfp}
          contractor={selectedContractor}
          onEoiSent={handleEoiSent}
        />
      )}
      {contractorForDialog && (
        <>
          <RfpAwardDialog
            isOpen={isAwardDialogOpen}
            onOpenChange={setIsAwardDialogOpen}
            rfp={rfp}
            contractor={contractorForDialog}
          />
          <RfpNonAwardDialog
            isOpen={isNonAwardDialogOpen}
            onOpenChange={setIsNonAwardDialogOpen}
            rfp={rfp}
            contractor={contractorForDialog}
          />
        </>
      )}
      <RfpChecklistDialog
        isOpen={isChecklistDialogOpen}
        onOpenChange={setIsChecklistDialogOpen}
      />
    </>
  )
}

    

    