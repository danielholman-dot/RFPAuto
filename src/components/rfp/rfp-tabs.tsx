'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import type { RFP, Contractor } from "@/lib/types"
import { contractors as allContractors } from "@/lib/data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import { Mail, Send, FileText, Bot, Trophy, Star, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

type RfpTabsProps = {
  rfp: RFP;
}

export function RfpTabs({ rfp }: RfpTabsProps) {
  const suggestedContractors = allContractors
    .filter(c => c.metroCodes.includes(rfp.metroCode) && c.type === rfp.contractorType)
    .sort((a, b) => a.preference - b.preference)
    .slice(0, 5);

  const invitedContractors = allContractors.filter(c => rfp.invitedContractors.includes(c.id));

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
              Based on the project's metro code ({rfp.metroCode}) and contractor type ({rfp.contractorType}), here are the top suggested contractors.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                      {contractor.performance}% <Star className="w-4 h-4 ml-1 text-yellow-500" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Invite</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
            {invitedContractors.length > 0 ? invitedContractors.map(c => (
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
            )) : <p className="text-muted-foreground text-center py-8">No contractors have been invited yet.</p>}
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Contractor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted On</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rfp.proposals.map(proposal => {
                        const contractor = allContractors.find(c => c.id === proposal.contractorId);
                        return (
                            <TableRow key={proposal.id}>
                                <TableCell className="font-medium">{contractor?.name}</TableCell>
                                <TableCell>
                                    <Badge variant={proposal.status === 'Submitted' || proposal.status === 'Under Review' ? 'default' : 'outline'}>{proposal.status}</Badge>
                                </TableCell>
                                <TableCell>{proposal.status === 'Pending' ? 'N/A' : proposal.submittedDate.toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    {proposal.status === 'Pending' && <Button variant="outline" size="sm">Send Reminder</Button>}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="analysis" className="mt-4">
        <Card>
            <CardHeader>
                <CardTitle>AI-Driven Proposal Analysis</CardTitle>
                <CardDescription>Analyze submitted proposals and generate preliminary scorecard entries for review.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">Analysis tools will be available here once proposals are submitted and ready for review.</p>
            </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
