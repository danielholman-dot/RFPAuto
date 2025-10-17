
import { Timestamp, FieldValue } from 'firebase/firestore';

export type RFP = {
  id: string;
  projectName: string;
  scopeOfWork: string;
  metroCode: string;
  contractorType: string;
  estimatedBudget: number;
  rfpStartDate?: Timestamp;
  rfpEndDate?: Timestamp;
  projectStartDate?: Timestamp;
  projectEndDate?: Timestamp;
  status: 'Selection' | 'Drafting' | 'Invitation' | 'Proposals' | 'Analysis' | 'Award' | 'Feedback' | 'Draft' | 'Completed';
  invitedContractors?: string[];
  proposals?: Proposal[];
  primaryStakeholderName?: string;
  primaryStakeholderEmail?: string;
  additionalStakeholderEmails?: string;
  createdAt?: Timestamp;
  technicalDocumentsLinks?: string;
  technicalDocumentUrls?: string[];
  completedStages?: string[];
};

export type Contractor = {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  type: string;
  metroCodes: string[];
  preferredStatus: string;
  performance: number;
  region: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
};

export type Proposal = {
  id: string;
  contractorId: string;
  rfpId: string;
  submittedDate: Timestamp | FieldValue; 
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

export type MetroCode = {
    id: string;
    code: string;
    city: string;
    state: string;
    region: string;
    lat: number;
    lon: number;
};

    