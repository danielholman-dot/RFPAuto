

'use client';

import { 
  collection, 
  getDocs, 
  getDoc, 
  doc,
  addDoc, 
  updateDoc, 
  arrayUnion,
  query,
  where,
  limit,
  orderBy,
  Timestamp,
  documentId,
  deleteDoc,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import type { Contractor, RFP, Proposal } from './types';
import { ContractorsData } from './seed';

// This function should be called within a component or context where Firebase is initialized.
const getDb = () => {
    return initializeFirebase().firestore;
};

// Metro Codes - This can remain as static data or be moved to Firestore if it needs to be dynamic.
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

export const getMetroByCode = async (code: string) => {
    return Promise.resolve(metroCodes.find(m => m.code === code) || null);
}


export const getMetroRegions = async () => {
    return Promise.resolve([...new Set(metroCodes.map(m => m.region))]);
}

export const getMetrosByRegion = async (region: string) => {
    return Promise.resolve(metroCodes.filter(m => m.region === region).map(m => ({ code: m.code, city: m.city })));
}

// Contractor Types - Can also remain static or be moved to Firestore.
export const contractorTypes = [
  'General Contractor', 
  'Mechanical', 
  'Electrical', 
  'Civil Engineering', 
  'NICON',
  'Electrical / NICON',
  'Electrical / Mechanical',
  'Electrical / Professional Services',
  'Electrical / Mechanical / NICON'
];

export const getContractorTypes = async () => {
  return Promise.resolve(contractorTypes);
}

// Data access functions
export async function getContractors(): Promise<Contractor[]> {
  // Using mock data for contractors
  return Promise.resolve(ContractorsData as Contractor[]);
}

export async function getContractorById(id: string): Promise<Contractor | null> {
  // Using mock data for contractors
  const contractor = ContractorsData.find(c => c.id === id);
  return Promise.resolve((contractor as Contractor) || null);
}


export async function getRfps(): Promise<RFP[]> {
  const db = getDb();
  const rfpsCol = collection(db, 'rfps');
  const rfpSnapshot = await getDocs(query(rfpsCol, orderBy('createdAt', 'desc')));
  const rfpList = rfpSnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
          id: doc.id, 
          ...data,
          // Convert Firestore Timestamps to JS Dates
          rfpStartDate: data.rfpStartDate?.toDate(),
          rfpEndDate: data.rfpEndDate?.toDate(),
          projectStartDate: data.projectStartDate?.toDate(),
          projectEndDate: data.projectEndDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
      } as RFP
  });
  return rfpList;
}

export async function getRfpById(id: string): Promise<RFP | null> {
  const db = getDb();
  const rfpDocRef = doc(db, 'rfps', id);
  const rfpSnap = await getDoc(rfpDocRef);
  if (rfpSnap.exists()) {
    const data = rfpSnap.data();
    return { 
        id: rfpSnap.id,
        ...data,
        rfpStartDate: data.rfpStartDate?.toDate(),
        rfpEndDate: data.rfpEndDate?.toDate(),
        projectStartDate: data.projectStartDate?.toDate(),
        projectEndDate: data.projectEndDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
    } as RFP;
  }
  return null;
}

export async function addRfp(rfpData: Omit<RFP, 'id' | 'proposals' | 'invitedContractors'>): Promise<string> {
    const db = getDb();
    const rfpsCol = collection(db, 'rfps');
    
    const firestoreRfpData: { [key: string]: any } = { ...rfpData };
    for (const key in firestoreRfpData) {
        if (firestoreRfpData[key] instanceof Date) {
            firestoreRfpData[key] = Timestamp.fromDate(firestoreRfpData[key] as Date);
        }
    }

    const dataToSave = {
        ...firestoreRfpData,
        createdAt: Timestamp.now(),
        invitedContractors: [],
        status: 'Draft'
    };

    const docRef = await addDoc(rfpsCol, dataToSave)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: rfpsCol.path,
                operation: 'create',
                requestResourceData: dataToSave,
            });
            errorEmitter.emit('permission-error', permissionError);
            // Re-throw the original error if you need to propagate it further,
            // or return a specific value to indicate failure.
            throw serverError;
        });

    return docRef.id;
}


export async function updateRfp(rfpId: string, updates: Partial<RFP>): Promise<void> {
    const db = getDb();
    const rfpDocRef = doc(db, 'rfps', rfpId);
    
    const firestoreUpdates: { [key: string]: any } = { ...updates };
    for (const key in firestoreUpdates) {
      if (firestoreUpdates[key] instanceof Date) {
        firestoreUpdates[key] = Timestamp.fromDate(firestoreUpdates[key] as Date);
      }
    }
  
    updateDoc(rfpDocRef, firestoreUpdates).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: rfpDocRef.path,
            operation: 'update',
            requestResourceData: firestoreUpdates,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}
  
export async function deleteRfp(rfpId: string): Promise<void> {
    const db = getDb();
    const rfpDocRef = doc(db, 'rfps', rfpId);
    
    deleteDoc(rfpDocRef).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: rfpDocRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export async function addProposal(rfpId: string, proposalData: Omit<Proposal, 'id'>): Promise<string> {
    const db = getDb();
    const proposalsCol = collection(db, 'rfps', rfpId, 'proposals');
    const dataToSave = {
        ...proposalData,
        submittedDate: Timestamp.now()
    };
    
    const docRef = await addDoc(proposalsCol, dataToSave)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: proposalsCol.path,
                operation: 'create',
                requestResourceData: dataToSave,
            });
            errorEmitter.emit('permission-error', permissionError);
            throw serverError;
        });
        
    return docRef.id;
}

export async function getProposalsForRfp(rfpId: string): Promise<Proposal[]> {
  const db = getDb();
  const proposalsCol = collection(db, 'rfps', rfpId, 'proposals');
  const proposalSnapshot = await getDocs(proposalsCol);
  const proposalList = proposalSnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
          id: doc.id,
          ...data,
          submittedDate: data.submittedDate.toDate(),
      } as Proposal;
  });
  return proposalList;
}

export async function getSuggestedContractors(metroCode: string, contractorType: string): Promise<Contractor[]> {
  // Using mock data for contractors
  const filtered = ContractorsData.filter(c => 
      c.metroCodes.includes(metroCode) && c.type === contractorType
  );
  return Promise.resolve(filtered.sort((a, b) => (a.preference || 3) - (b.preference || 3)).slice(0, 5) as Contractor[]);
}

export async function getInvitedContractors(ids: string[]): Promise<Contractor[]> {
    if (!ids || ids.length === 0) {
        return Promise.resolve([]);
    }
    // Using mock data for contractors
    const contractors = ContractorsData.filter(c => ids.includes(c.id));
    return Promise.resolve(contractors as Contractor[]);
}

export async function addInvitedContractorToRfp(rfpId: string, contractorId: string): Promise<void> {
  const db = getDb();
  const rfpDocRef = doc(db, 'rfps', rfpId);
  const updateData = {
      invitedContractors: arrayUnion(contractorId)
  };

  updateDoc(rfpDocRef, updateData).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
        path: rfpDocRef.path,
        operation: 'update',
        requestResourceData: updateData
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}
