import type { Timestamp } from "firebase/firestore";

export type RFP = {
  id: string;
  projectName: string;
  scopeOfWork: string;
  metroCode: string;
  contractorType: string;
  estimatedBudget: number;
  rfpStartDate?: Timestamp | Date;
  rfpEndDate?: Timestamp | Date;
  projectStartDate?: Timestamp | Date;
  projectEndDate?: Timestamp | Date;
  status: 'Draft' | 'Sent' | 'In Progress' | 'Awarded' | 'Completed';
  invitedContractors?: string[];
  proposals?: Proposal[];
};

export type Contractor = {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  type: string;
  preferredStatus: string;
  region: string;
  metroSite: string;
  performance: number;
  metroCodes: string[];
  preference?: number;
};

export type Proposal = {
  id: string;
  contractorId: string;
  rfpId: string;
  submittedDate: Timestamp | Date;
  status: 'Pending' | 'Submitted' | 'Under Review' | 'Awarded' | 'Rejected';
  scorecard?: Scorecard;
  proposalDocumentUrl?: string;
  proposalText?: string;
  bidAmount?: number;
};

export type Scorecard = {
  safety: number;
  experience: number;
  programmaticApproach: number;
  commercialExcellence: number;
  innovativeSolutions: number;
  missionCriticalExperience: number;
  total: number;
};
