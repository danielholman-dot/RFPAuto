import { ContractorsData, RFPData } from './seed';
import type { Contractor, RFP, Proposal } from './types';

// Simulate a database
let contractors: (Contractor & { id: string })[] = ContractorsData.map((c, i) => ({ ...c, id: `contractor-${i}`}));
let rfps: (RFP & { id: string })[] = RFPData.map((r, i) => ({ ...r, id: `rfp-${i}`, proposals: [] }));
let proposals: (Proposal & { id: string })[] = [];

// Metro Codes
export const metroCodes = [
  { code: 'CMH', city: 'Columbus', state: 'Ohio' },
  { code: 'IAD', city: 'Gainsville', state: 'Virginia' },
  { code: 'LNK/CBF', city: 'Council Bluffs', state: 'Iowa' },
  { code: 'DFW', city: 'Midlothian', state: 'Texas' },
  { code: 'DLS', city: 'The Dalles', state: 'Oregon' },
  { code: 'TUL', city: 'Pryor', state: 'Oklahoma' },
  { code: 'CKV', city: 'Clarksville', state: 'Tennessee' },
  { code: 'RIC', city: 'Richmond', state: 'Virginia' },
  { code: 'CHS', city: 'Charleston', state: 'South Carolina' },
  { code: 'RNO', city: 'McCarren', state: 'Nevada' },
  { code: 'SLC', city: 'Salt Lake City', state: 'Utah' },
  { code: 'MCI', city: 'Kansas City', state: 'Missouri' },
  { code: 'PHX', city: 'Mesa', state: 'Arizona' },
  { code: 'YUL', city: 'Montreal', state: 'Quebec' },
  { code: 'FWA', city: 'Fort Wayne', state: 'Indiana' },
  { code: 'CLT', city: 'Charlotte', state: 'North Carolina' },
  { code: 'AUS', city: 'Austin', state: 'Texas' },
  { code: 'HSV', city: 'Widows Creek', state: 'Alabama' },
  { code: 'BMI', city: 'Bloomington', state: 'Illinois' },
  { code: 'CID', city: 'Cedar Rapids', state: 'Iowa' },
  { code: 'FDY', city: 'Lima', state: 'Ohio' },
  { code: 'SWO', city: 'Stillwater', state: 'Oklahoma' },
  { code: 'AMW', city: 'Ames', state: 'Iowa' },
  { code: 'LAS', city: 'Las Vegas', state: 'Nevada' },
  { code: 'LAX', city: 'Los Angeles', state: 'California' },
  { code: 'ATL', city: 'Atlanta', state: 'Georgia' },
  { code: 'MSP', city: 'Minneapolis', state: 'Minnesota' },
  { code: 'MRN', city: 'Lenoir', state: 'North Carolina' },
  { code: 'MEM', city: 'Memphis', state: 'Tennessee' },
  { code: 'PHN', city: 'Clair County', state: 'Michigan' },
  { code: 'ROA', city: 'Roanoke', state: 'Virginia' },
  { code: 'DYS', city: 'Abilene', state: 'Texas' },
  { code: 'HOU', city: 'Houston', state: 'Texas' }
];

export const getMetroCodes = async () => {
  return metroCodes.map(m => ({ code: m.code, city: m.city }));
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
