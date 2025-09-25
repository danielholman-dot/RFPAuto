export type RFP = {
  id: string;
  projectName: string;
  scopeOfWork: string;
  metroCode: string;
  contractorType: string;
  estimatedBudget: number;
  startDate: Date;
  status: 'Draft' | 'Sent' | 'In Progress' | 'Awarded' | 'Completed';
  proposals: Proposal[];
  invitedContractors: string[];
};

export type Contractor = {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  metroCodes: string[];
  type: string;
  preference: number;
  performance?: number;
};

export type Proposal = {
  id: string;
  contractorId: string;
  rfpId: string;
  submittedDate: Date;
  status: 'Pending' | 'Submitted' | 'Under Review' | 'Awarded' | 'Rejected';
  scorecard?: Scorecard;
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
