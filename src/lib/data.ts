import type { RFP, Contractor } from './types';

export const metroCodes = [
  'ATL', 'BOS', 'CHI', 'DFW', 'DEN', 'LAX', 'MIA', 'NYC', 'PHX', 'SEA', 'SFO', 'WAS'
];

export const contractorTypes = [
  'General Contractor', 'Mechanical', 'Electrical', 'Plumbing', 'Civil Engineering'
];

export const contractors: Contractor[] = [
  { id: 'c1', name: 'Apex Builders', contactName: 'John Doe', contactEmail: 'john.d@apex.com', metroCodes: ['NYC', 'BOS'], type: 'General Contractor', preference: 1, performance: 95 },
  { id: 'c2', name: 'Pinnacle Construction', contactName: 'Jane Smith', contactEmail: 'jane.s@pinnacle.com', metroCodes: ['NYC', 'CHI'], type: 'General Contractor', preference: 2, performance: 92 },
  { id: 'c3', name: 'Summit General', contactName: 'Peter Jones', contactEmail: 'p.jones@summit.com', metroCodes: ['LAX', 'SFO'], type: 'General Contractor', preference: 3, performance: 88 },
  { id: 'c4', name: 'Keystone Mechanical', contactName: 'Mary Johnson', contactEmail: 'mary.j@keystone.com', metroCodes: ['NYC', 'BOS', 'CHI'], type: 'Mechanical', preference: 1, performance: 98 },
  { id: 'c5', name: 'Horizon Electrical', contactName: 'David Williams', contactEmail: 'd.williams@horizon.com', metroCodes: ['DFW', 'MIA'], type: 'Electrical', preference: 1, performance: 94 },
  { id: 'c6', name: 'Bedrock Civil', contactName: 'Emily Brown', contactEmail: 'e.brown@bedrock.com', metroCodes: ['DEN', 'PHX'], type: 'Civil Engineering', preference: 2, performance: 91 },
  { id: 'c7', name: 'Flow Plumbing', contactName: 'Michael Davis', contactEmail: 'm.davis@flow.com', metroCodes: ['SEA', 'LAX'], type: 'Plumbing', preference: 1, performance: 96 },
  { id: 'c8', name: 'Stature Construction', contactName: 'Sarah Miller', contactEmail: 's.miller@stature.com', metroCodes: ['NYC'], type: 'General Contractor', preference: 4, performance: 85 },
  { id: 'c9', name: 'Vertex Mechanical', contactName: 'Chris Wilson', contactEmail: 'c.wilson@vertex.com', metroCodes: ['NYC'], type: 'Mechanical', preference: 2, performance: 90 },
  { id: 'c10', name: 'Ohm Electricals', contactName: 'Jessica Moore', contactEmail: 'j.moore@ohm.com', metroCodes: ['NYC'], type: 'Electrical', preference: 3, performance: 89 },
];

export const rfps: RFP[] = [
  {
    id: 'rfp-001',
    projectName: 'Project Alpha - NYC Data Center',
    scopeOfWork: 'Full build-out of a new 10,000 sq ft data center facility in downtown New York.',
    metroCode: 'NYC',
    contractorType: 'General Contractor',
    estimatedBudget: 5000000,
    startDate: new Date('2024-09-01'),
    status: 'In Progress',
    invitedContractors: ['c1', 'c2', 'c8'],
    proposals: [
      { id: 'p1', contractorId: 'c1', rfpId: 'rfp-001', submittedDate: new Date('2024-07-20'), status: 'Under Review', scorecard: { safety: 9, experience: 10, programmaticApproach: 8, commercialExcellence: 9, innovativeSolutions: 7, missionCriticalExperience: 10, total: 53 } },
      { id: 'p2', contractorId: 'c2', rfpId: 'rfp-001', submittedDate: new Date('2024-07-22'), status: 'Under Review', scorecard: { safety: 8, experience: 9, programmaticApproach: 9, commercialExcellence: 8, innovativeSolutions: 8, missionCriticalExperience: 9, total: 51 } },
      { id: 'p3', contractorId: 'c8', rfpId: 'rfp-001', submittedDate: new Date('2024-07-21'), status: 'Pending', },
    ]
  },
  {
    id: 'rfp-002',
    projectName: 'Project Beta - Boston HVAC Upgrade',
    scopeOfWork: 'Complete overhaul of the HVAC system in the 5-story commercial building.',
    metroCode: 'BOS',
    contractorType: 'Mechanical',
    estimatedBudget: 1200000,
    startDate: new Date('2024-10-15'),
    status: 'Awarded',
    invitedContractors: ['c4'],
    proposals: [
      { id: 'p4', contractorId: 'c4', rfpId: 'rfp-002', submittedDate: new Date('2024-08-01'), status: 'Awarded' },
    ]
  },
  {
    id: 'rfp-003',
    projectName: 'Project Gamma - LA Office Renovation',
    scopeOfWork: 'Interior renovation of two floors of our LA office, including new electrical and plumbing.',
    metroCode: 'LAX',
    contractorType: 'General Contractor',
    estimatedBudget: 750000,
    startDate: new Date('2025-01-10'),
    status: 'Draft',
    invitedContractors: [],
    proposals: []
  },
  {
    id: 'rfp-004',
    projectName: 'Project Delta - DFW Power Distribution',
    scopeOfWork: 'Upgrade of main power distribution units and backup generators.',
    metroCode: 'DFW',
    contractorType: 'Electrical',
    estimatedBudget: 2300000,
    startDate: new Date('2024-11-01'),
    status: 'Sent',
    invitedContractors: ['c5'],
    proposals: [
      { id: 'p5', contractorId: 'c5', rfpId: 'rfp-004', submittedDate: new Date(), status: 'Pending' }
    ]
  },
];
