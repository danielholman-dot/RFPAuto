
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
import { Mail, Send, FileText, Bot, Trophy, Star, MessageSquare, Users, Loader2, UploadCloud, PlusCircle, Settings, Award, PencilRuler, CheckCircle2, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge";
import { useEffect, useState, useMemo, useCallback } from "react";
import { generateComparativeAnalysis, GenerateComparativeAnalysisOutput } from "@/ai/flows/generate-comparative-analysis";
import { getProposalsForRfp, getSuggestedContractors, getInvitedContractors, getContractors, addInvitedContractorToRfp } from "@/lib/data";
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

const STAGES: RFP['status'][] = ['Draft', 'Drafting', 'Invitation', 'Proposals', 'Analysis', 'Award', 'Feedback', 'Completed'];

const StageContentWrapper = ({ title, children, onComplete, isCompleted }: { title: string, children: React.ReactNode, onComplete: () => void, isCompleted?: boolean }) => (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        {isCompleted ? "This stage is complete." : `Complete this stage to move to the next step.`}
                    </CardDescription>
                </div>
                {!isCompleted && (
                    <Button onClick={onComplete}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark as Complete & Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
);

export function RfpTabs({ rfp: initialRfp, isDraft = false }: RfpTabsProps) {
  const [rfp, setRfp] = useState(initialRfp);
  const [activeTab, setActiveTab] = useState(rfp.status);

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

  const currentStageIndex = STAGES.indexOf(rfp.status);

  useEffect(() => {
    setActiveTab(rfp.status);
  }, [rfp.status]);

  const handleStageComplete = () => {
    const nextStageIndex = currentStageIndex + 1;
    if (nextStageIndex < STAGES.length) {
      const nextStage = STAGES[nextStageIndex];
      setRfp(prev => ({ ...prev, status: nextStage }));
      setActiveTab(nextStage);
      toast({
        title: "Stage Completed!",
        description: `RFP moved to ${nextStage} stage.`,
      });
    }
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
      alert("Please select at least one proposal to analyze.");
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
      alert("There was an error running the comparative analysis.");
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

  const uninvitedContractors = useMemo(() => {
    const invitedIds = new Set(invitedContractors.map(c => c.id));
    return allContractors.filter(c => !invitedIds.has(c.id));
  }, [allContractors, invitedContractors]);

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
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="Drafting" disabled={currentStageIndex < STAGES.indexOf('Drafting')}>
            <PencilRuler className="w-4 h-4 mr-2"/> Drafting
          </TabsTrigger>
          <TabsTrigger value="Invitation" disabled={currentStageIndex < STAGES.indexOf('Invitation')}>
            <Mail className="w-4 h-4 mr-2"/> Invitation
          </TabsTrigger>
          <TabsTrigger value="Proposals" disabled={currentStageIndex < STAGES.indexOf('Proposals')}>
            <FileText className="w-4 h-4 mr-2"/> Proposals
          </TabsTrigger>
          <TabsTrigger value="Analysis" disabled={currentStageIndex < STAGES.indexOf('Analysis')}>
            <Bot className="w-4 h-4 mr-2"/> Analysis
          </TabsTrigger>
          <TabsTrigger value="Award" disabled={currentStageIndex < STAGES.indexOf('Award')}>
            <Trophy className="w-4 h-4 mr-2"/> Award
          </TabsTrigger>
          <TabsTrigger value="Feedback" disabled={currentStageIndex < STAGES.indexOf('Feedback')}>
            <MessageSquare className="w-4 h-4 mr-2"/> Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Drafting" className="mt-4">
            <StageContentWrapper title="RFP Drafting" onComplete={handleStageComplete} isCompleted={currentStageIndex > STAGES.indexOf('Drafting')}>
                 <RfpDrafting rfp={rfp} />
            </StageContentWrapper>
        </TabsContent>

        <TabsContent value="Invitation" className="mt-4">
             <StageContentWrapper title="Contractor Invitation" onComplete={handleStageComplete} isCompleted={currentStageIndex > STAGES.indexOf('Invitation')}>
                <div className="space-y-6">
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
                                <TableHead className="text-right">Action</TableHead>
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
                                    <Button variant="outline" size="sm" onClick={() => handleInviteClick(contractor)}>Invite</Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        )}
                        </CardContent>
                    </Card>
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
                                            {uninvitedContractors.map(c => (
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
                        </CardContent>
                    </Card>
                </div>
            </StageContentWrapper>
        </TabsContent>

        <TabsContent value="Proposals" className="mt-4">
           <StageContentWrapper title="Proposal Submission" onComplete={handleStageComplete} isCompleted={currentStageIndex > STAGES.indexOf('Proposals')}>
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
                    </CardContent>
                </Card>
           </StageContentWrapper>
        </TabsContent>

        
        <TabsContent value="Analysis" className="mt-4">
             <StageContentWrapper title="AI-Driven Proposal Analysis" onComplete={handleStageComplete} isCompleted={currentStageIndex > STAGES.indexOf('Analysis')}>
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
                </div>
            </StageContentWrapper>
        </TabsContent>

        <TabsContent value="Award" className="mt-4">
            <StageContentWrapper title="Award Recommendation" onComplete={handleStageComplete} isCompleted={currentStageIndex > STAGES.indexOf('Award')}>
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
            </StageContentWrapper>
        </TabsContent>

        <TabsContent value="Feedback" className="mt-4">
             <StageContentWrapper title="Stakeholder Feedback" onComplete={handleStageComplete} isCompleted={currentStageIndex > STAGES.indexOf('Feedback')}>
                  <p className="text-muted-foreground text-center py-8">Feedback summary tools will be available after project completion.</p>
            </StageContentWrapper>
        </TabsContent>
      </Tabs>
      {selectedContractor && (
        <RfpInvitationDialog
          isOpen={isInvitationDialogOpen}
          onOpenChange={setIsInvitationDialogOpen}
          rfp={rfp}
          contractor={selectedContractor}
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
