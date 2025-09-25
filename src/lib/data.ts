import { ContractorsData, RFPData } from './seed';
import type { Contractor, RFP, Proposal } from './types';

// Simulate a database
let contractors: (Contractor & { id: string })[] = ContractorsData.map((c, i) => ({ ...c, id: `contractor-${i}`}));
let rfps: (RFP & { id: string })[] = RFPData.map((r, i) => ({ ...r, id: `rfp-${i}`, proposals: [], invitedContractors: [] }));
let proposals: (Proposal & { id: string })[] = [];

// Metro Codes
export const metroCodes = [
  { code: 'CMH', city: 'Columbus', state: 'Ohio', region: 'East' },
  { code: 'IAD', city: 'Gainsville', state: 'Virginia', region: 'East' },
  { code: 'LNK/CBF', city: 'Council Bluffs', state: 'Iowa', region: 'Midwest' },
  { code: 'DFW', city: 'Midlothian', state: 'Texas', region: 'South' },
  { code: 'DLS', city: 'The Dalles', state: 'Oregon', region: 'West' },
  { code: 'TUL', city: 'Pryor', state: 'Oklahoma', region: 'South' },
  { code: 'CKV', city: 'Clarksville', state: 'Tennessee', region: 'East' },
  { code: 'RIC', city: 'Richmond', state: 'Virginia', region: 'East' },
  { code: 'CHS', city: 'Charleston', state: 'South Carolina', region: 'East' },
  { code: 'RNO', city: 'McCarren', state: 'Nevada', region: 'West' },
  { code: 'SLC', city: 'Salt Lake City', state: 'Utah', region: 'West' },
  { code: 'MCI', city: 'Kansas City', state: 'Missouri', region: 'Midwest' },
  { code: 'PHX', city: 'Mesa', state: 'Arizona', region: 'West' },
  { code: 'YUL', city: 'Montreal', state: 'Quebec', region: 'Canada' },
  { code: 'FWA', city: 'Fort Wayne', state: 'Indiana', region: 'Midwest' },
  { code: 'CLT', city: 'Charlotte', state: 'North Carolina', region: 'East' },
  { code: 'AUS', city: 'Austin', state: 'Texas', region: 'South' },
  { code: 'HSV', city: 'Widows Creek', state: 'Alabama', region: 'South' },
  { code: 'BMI', city: 'Bloomington', state: 'Illinois', region: 'Midwest' },
  { code: 'CID', city: 'Cedar Rapids', state: 'Iowa', region: 'Midwest' },
  { code: 'FDY', city: 'Lima', state: 'Ohio', region: 'East' },
  { code: 'SWO', city: 'Stillwater', state: 'Oklahoma', region: 'South' },
  { code: 'AMW', city: 'Ames', state: 'Iowa', region: 'Midwest' },
  { code: 'LAS', city: 'Las Vegas', state: 'Nevada', region: 'West' },
  { code: 'LAX', city: 'Los Angeles', state: 'California', region: 'West' },
  { code: 'ATL', city: 'Atlanta', state: 'Georgia', region: 'East' },
  { code: 'MSP', city: 'Minneapolis', state: 'Minnesota', region: 'Midwest' },
  { code: 'MRN', city: 'Lenoir', state: 'North Carolina', region: 'East' },
  { code: 'MEM', city: 'Memphis', state: 'Tennessee', region: 'East' },
  { code: 'PHN', city: 'Clair County', state: 'Michigan', region: 'Midwest' },
  { code: 'ROA', city: 'Roanoke', state: 'Virginia', region: 'East' },
  { code: 'DYS', city: 'Abilene', state: 'Texas', region: 'South' },
  { code: 'HOU', city: 'Houston', state: 'Texas', region: 'South' }
];

export const getMetroCodes = async () => {
  return metroCodes.map(m => ({ code: m.code, city: m.city }));
}

export const getMetroRegions = async () => {
    return Promise.resolve([...new Set(metroCodes.map(m => m.region))]);
}

export const getMetrosByRegion = async (region: string) => {
    return Promise.resolve(metroCodes.filter(m => m.region === region).map(m => ({ code: m.code, city: m.city })));
}


// Contractor Types
export const contractorTypes = [
  'General Contractor', 
  'Mechanical', 
  'Electrical', 
  'Civil Engineering', 
  'NICON',
  'Electrical / NICON',
  'Electrical / Mechanical',
  'Electrical / Professional Services'
];

export const getContractorTypes = async () => {
  return contractorTypes;
}

// Data access functions
export async function getContractors(): Promise<Contractor[]> {
  return Promise.resolve(contractors);
}

export async function getContractorById(id: string): Promise<Contractor | null> {
  return Promise.resolve(contractors.find(c => c.id === id) || null);
}


export async function getRfps(): Promise<RFP[]> {
  // sort by project start date descending
  return Promise.resolve(rfps.sort((a, b) => {
    const dateA = a.projectStartDate ? new Date(a.projectStartDate).getTime() : 0;
    const dateB = b.projectStartDate ? new Date(b.projectStartDate).getTime() : 0;
    return dateB - dateA;
  }));
}

export async function getRfpById(id: string): Promise<RFP | null> {
  const rfp = rfps.find(r => r.id === id) || null;
  return Promise.resolve(rfp);
}

export async function addRfp(rfpData: Omit<RFP, 'id' | 'proposals'>): Promise<string> {
  const newId = `rfp-${rfps.length}`;
  const newRfp: RFP = {
    ...rfpData,
    id: newId,
    proposals: [],
    invitedContractors: [],
  };
  rfps.push(newRfp);
  return Promise.resolve(newId);
}

export async function addProposal(rfpId: string, proposalData: Omit<Proposal, 'id'>) {
  const rfp = rfps.find(r => r.id === rfpId);
  if (!rfp) {
    throw new Error("RFP not found");
  }
  const newId = `proposal-${proposals.length}`;
  const newProposal = {
    ...proposalData,
    id: newId
  };
  proposals.push(newProposal);
  if (!rfp.proposals) {
    rfp.proposals = [];
  }
  rfp.proposals.push(newProposal);
  return Promise.resolve();
}

export async function getProposalsForRfp(rfpId: string): Promise<Proposal[]> {
  const rfp = rfps.find(r => r.id === rfpId);
  return Promise.resolve(rfp?.proposals || []);
}

export async function getSuggestedContractors(metroCode: string, contractorType: string): Promise<Contractor[]> {
  return Promise.resolve(
    contractors
      .filter(c => c.metroCodes.includes(metroCode) && c.type === contractorType)
      .sort((a,b) => (a.preference || 99) - (b.preference || 99))
      .slice(0, 5)
  );
}

export async function getInvitedContractors(ids: string[]): Promise<Contractor[]> {
  if (!ids || ids.length === 0) {
    return Promise.resolve([]);
  }
  return Promise.resolve(contractors.filter(c => ids.includes(c.id)));
}

export async function addInvitedContractorToRfp(rfpId: string, contractorId: string): Promise<void> {
  const rfp = rfps.find(r => r.id === rfpId);
  if (!rfp) {
    throw new Error("RFP not found");
  }
  if (!rfp.invitedContractors) {
    rfp.invitedContractors = [];
  }
  if (!rfp.invitedContractors.includes(contractorId)) {
    rfp.invitedContractors.push(contractorId);
  }
  return Promise.resolve();
}
