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
import { Mail, Send, FileText, Bot, Trophy, Star, MessageSquare, Users, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge";
import { useEffect, useMemo, useState } from "react";
import { analyzeAndScoreProposals, AnalyzeAndScoreProposalsOutput } from "@/ai/flows/analyze-and-score-proposals";
import Link from "next/link";
import { getProposalsForRfp, getSuggestedContractors, getInvitedContractors } from "@/lib/data";

type RfpTabsProps = {
  rfp: RFP;
  isDraft?: boolean;
}

export function RfpTabs({ rfp, isDraft = false }: RfpTabsProps) {
  const [suggestedContractors, setSuggestedContractors] = useState<Contractor[]>([]);
  const [suggestedLoading, setSuggestedLoading] = useState(!isDraft);

  const [invitedContractors, setInvitedContractors] = useState<Contractor[]>([]);
  const [invitedLoading, setInvitedLoading] = useState(!isDraft);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalsLoading, setProposalsLoading] = useState(!isDraft);

  useEffect(() => {
    if (isDraft) return;

    async function loadSuggestions() {
      setSuggestedLoading(true);
      const contractors = await getSuggestedContractors(rfp.metroCode, rfp.contractorType);
      setSuggestedContractors(contractors);
      setSuggestedLoading(false);
    }

    async function loadInvited() {
      setInvitedLoading(true);
      const contractors = await getInvitedContractors(rfp.invitedContractors || []);
      setInvitedContractors(contractors);
      setInvitedLoading(false);
    }
    
    async function loadProposals() {
      setProposalsLoading(true);
      const props = await getProposalsForRfp(rfp.id);
      setProposals(props);
      setProposalsLoading(false);
    }

    loadSuggestions();
    loadInvited();
    loadProposals();

  }, [rfp, isDraft]);
  
  const [analysisResult, setAnalysisResult] = useState<AnalyzeAndScoreProposalsOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (proposal: Proposal) => {
    if (!proposal.proposalText) {
        alert("This proposal has no text to analyze.");
        return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
        const result = await analyzeAndScoreProposals({
            proposalText: proposal.proposalText,
            rfpRequirements: rfp.scopeOfWork,
            technicalDocuments: '', // Assuming no technical docs for now
        });
        setAnalysisResult(result);
    } catch (error) {
        console.error("Analysis failed:", error);
        alert("There was an error analyzing the proposal.");
    } finally {
        setIsAnalyzing(false);
    }
  };


  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (date.toDate) { // Firebase Timestamp
      return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  const getContractorById = (id: string) => {
    return invitedContractors?.find(c => c.id === id);
  }

  return (
    <Tabs defaultValue="selection" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <TabsTrigger value="selection">
          <Users className="w-4 h-4 mr-2"/> Selection
        </TabsTrigger>
        <TabsTrigger value="invitations">
          <Mail className="w-4 h-4 mr-2"/> Invitations
        </TabsTrigger>
        <TabsTrigger value="proposals">
          <FileText className="w-4 h-4 mr-2"/> Proposals
        </TabsTrigger>
        <TabsTrigger value="analysis">
          <Bot className="w-4 h-4 mr-2"/> Analysis
        </TabsTrigger>
        <TabsTrigger value="award">
          <Trophy className="w-4 h-4 mr-2"/> Award
        </TabsTrigger>
        <TabsTrigger value="feedback">
          <MessageSquare className="w-4 h-4 mr-2"/> Feedback
        </TabsTrigger>
      </TabsList>

      <TabsContent value="selection" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Contractor Selection</CardTitle>
            <CardDescription>
              {isDraft ? "Complete the RFP draft to see contractor suggestions." : `Based on the project's metro code (${rfp.metroCode}) and contractor type (${rfp.contractorType}), here are the top suggested contractors.`}
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
                    <TableHead>Contact</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestedContractors.map(contractor => (
                    <TableRow key={contractor.id}>
                      <TableCell className="font-medium">{contractor.name}</TableCell>
                      <TableCell>{contractor.contactName} ({contractor.contactEmail})</TableCell>
                      <TableCell className="flex items-center">
                        {contractor.performance}% <Star className="w-4 h-4 ml-1 text-yellow-500 fill-yellow-500" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Invite</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="invitations" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>RFP Invitations</CardTitle>
            <CardDescription>
              Generate and send EOI / RFP invitation emails to selected contractors.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invitedLoading && <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>}
            {!invitedLoading && !invitedContractors?.length && <p className="text-muted-foreground text-center py-8">No contractors have been invited yet.</p>}
            {invitedContractors && invitedContractors.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.contactEmail}</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline"><Mail className="mr-2 h-4 w-4"/> Generate EOI</Button>
                  <Button><Send className="mr-2 h-4 w-4"/> Send RFP</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="proposals" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Proposal Submissions</CardTitle>
            <CardDescription>Track proposal submissions from invited contractors and send reminders.</CardDescription>
          </CardHeader>
          <CardContent>
            {proposalsLoading ? <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div> :
            proposals && proposals.length === 0 ? <p className="text-muted-foreground text-center py-8">No proposals submitted yet.</p> :
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Contractor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted On</TableHead>
                        <TableHead>Document</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {proposals?.map(proposal => {
                        const contractor = getContractorById(proposal.contractorId);
                        return (
                            <TableRow key={proposal.id}>
                                <TableCell className="font-medium">{contractor?.name || 'Unknown Contractor'}</TableCell>
                                <TableCell>
                                    <Badge variant={proposal?.status === 'Submitted' || proposal?.status === 'Under Review' ? 'default' : 'outline'}>{proposal?.status || 'Not Submitted'}</Badge>
                                </TableCell>
                                <TableCell>{proposal ? formatDate(proposal.submittedDate) : 'N/A'}</TableCell>
                                <TableCell>
                                    {proposal.proposalDocumentUrl && (
                                        <Link href={proposal.proposalDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                            View Document
                                        </Link>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {!proposal && <Button variant="outline" size="sm">Send Reminder</Button>}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            }
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="analysis" className="mt-4">
        <Card>
            <CardHeader>
                <CardTitle>AI-Driven Proposal Analysis</CardTitle>
                <CardDescription>Analyze submitted proposals and generate preliminary scorecard entries for review.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                  {proposals?.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <p>Proposal from <strong>{getContractorById(p.contractorId)?.name}</strong></p>
                      <Button onClick={() => handleAnalyze(p)} disabled={isAnalyzing || !p.proposalText}>
                        {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Analyze
                      </Button>
                    </div>
                  ))}
                  {proposals?.length === 0 && !proposalsLoading && <p className="text-muted-foreground text-center py-8">No proposals submitted yet to analyze.</p>}
                </div>
                
                {isAnalyzing && <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /><p className="ml-2">Analyzing...</p></div>}
                
                {analysisResult && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Analysis Scorecard</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(analysisResult.scorecardEntries).map(([key, value]) => (
                                    <div key={key} className="p-3 bg-muted rounded-lg">
                                        <dt className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
                                        <dd className="text-sm">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="award" className="mt-4">
        <Card>
            <CardHeader>
                <CardTitle>Award Recommendation</CardTitle>
                <CardDescription>Review final scores and generate an award recommendation.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">Award recommendation tools will be available after proposal analysis.</p>
            </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="feedback" className="mt-4">
        <Card>
            <CardHeader>
                <CardTitle>Stakeholder Feedback</CardTitle>
                <CardDescription>Summarize feedback and generate a Lessons Learned report.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">Feedback summary tools will be available after project completion.</p>
            </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
