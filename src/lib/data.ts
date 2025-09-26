import { ContractorsData, RFPData } from './seed';
import type { Contractor, RFP, Proposal } from './types';

// Simulate a database
let contractors: (Contractor & { id: string })[] = ContractorsData.map((c, i) => ({ ...c, id: `contractor-${i}`}));
let rfps: (RFP & { id: string })[] = RFPData.map((r, i) => ({ ...r, id: `rfp-${i}`, proposals: [], invitedContractors: [] }));
let proposals: (Proposal & { id: string })[] = [];

// Metro Codes
export const metroCodes = [
  { code: 'CMH', city: 'Columbus', state: 'Ohio', region: 'East', lat: 39.96, lon: -82.99 },
  { code: 'IAD', city: 'Gainsville', state: 'Virginia', region: 'East', lat: 38.79, lon: -77.61 },
  { code: 'LNK/CBF', city: 'Council Bluffs', state: 'Iowa', region: 'Midwest', lat: 41.26, lon: -95.86 },
  { code: 'DFW', city: 'Midlothian', state: 'Texas', region: 'South', lat: 32.48, lon: -96.99 },
  { code: 'DLS', city: 'The Dalles', state: 'Oregon', region: 'West', lat: 45.59, lon: -121.17 },
  { code: 'TUL', city: 'Pryor', state: 'Oklahoma', region: 'South', lat: 36.30, lon: -95.31 },
  { code: 'CKV', city: 'Clarksville', state: 'Tennessee', region: 'East', lat: 36.52, lon: -87.35 },
  { code: 'RIC', city: 'Richmond', state: 'Virginia', region: 'East', lat: 37.54, lon: -77.43 },
  { code: 'CHS', city: 'Charleston', state: 'South Carolina', region: 'East', lat: 32.77, lon: -79.93 },
  { code: 'RNO', city: 'McCarren', state: 'Nevada', region: 'West', lat: 39.53, lon: -119.81 },
  { code: 'SLC', city: 'Salt Lake City', state: 'Utah', region: 'West', lat: 40.76, lon: -111.89 },
  { code: 'MCI', city: 'Kansas City', state: 'Missouri', region: 'Midwest', lat: 39.09, lon: -94.57 },
  { code: 'PHX', city: 'Mesa', state: 'Arizona', region: 'West', lat: 33.41, lon: -111.83 },
  { code: 'YUL', city: 'Montreal', state: 'Quebec', region: 'Canada', lat: 45.50, lon: -73.56 },
  { code: 'FWA', city: 'Fort Wayne', state: 'Indiana', region: 'Midwest', lat: 41.07, lon: -85.13 },
  { code: 'CLT', city: 'Charlotte', state: 'North Carolina', region: 'East', lat: 35.22, lon: -80.84 },
  { code: 'AUS', city: 'Austin', state: 'Texas', region: 'South', lat: 30.26, lon: -97.74 },
  { code: 'HSV', city: 'Widows Creek', state: 'Alabama', region: 'South', lat: 34.73, lon: -86.58 },
  { code: 'BMI', city: 'Bloomington', state: 'Illinois', region: 'Midwest', lat: 40.48, lon: -88.99 },
  { code: 'CID', city: 'Cedar Rapids', state: 'Iowa', region: 'Midwest', lat: 42.00, lon: -91.66 },
  { code: 'FDY', city: 'Lima', state: 'Ohio', region: 'East', lat: 40.74, lon: -84.10 },
  { code: 'SWO', city: 'Stillwater', state: 'Oklahoma', region: 'South', lat: 36.11, lon: -97.05 },
  { code: 'AMW', city: 'Ames', state: 'Iowa', region: 'Midwest', lat: 42.03, lon: -93.62 },
  { code: 'LAS', city: 'Las Vegas', state: 'Nevada', region: 'West', lat: 36.16, lon: -115.14 },
  { code: 'LAX', city: 'Los Angeles', state: 'California', region: 'West', lat: 34.05, lon: -118.24 },
  { code: 'ATL', city: 'Atlanta', state: 'Georgia', region: 'East', lat: 33.74, lon: -84.38 },
  { code: 'MSP', city: 'Minneapolis', state: 'Minnesota', region: 'Midwest', lat: 44.97, lon: -93.26 },
  { code: 'MRN', city: 'Lenoir', state: 'North Carolina', region: 'East', lat: 35.91, lon: -81.54 },
  { code: 'MEM', city: 'Memphis', state: 'Tennessee', region: 'East', lat: 35.14, lon: -90.04 },
  { code: 'PHN', city: 'Clair County', state: 'Michigan', region: 'Midwest', lat: 42.97, lon: -82.78 },
  { code: 'ROA', city: 'Roanoke', state: 'Virginia', region: 'East', lat: 37.27, lon: -79.94 },
  { code: 'DYS', city: 'Abilene', state: 'Texas', region: 'South', lat: 32.44, lon: -99.73 },
  { code: 'HOU', city: 'Houston', state: 'Texas', region: 'South', lat: 29.76, lon: -95.36 }
];

export const getMetroCodes = async () => {
  return Promise.resolve(metroCodes.map(m => ({ code: m.code, city: m.city, region: m.region })));
}

export const getAllMetroCodes = async () => {
    return Promise.resolve(metroCodes);
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
