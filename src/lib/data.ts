
import type { RFP, MetroCode } from './types';

export const MetroCodesData: MetroCode[] = [
  { "id": "metro-1", "code": "CMH", "city": "Columbus", "state": "Ohio", "region": "North America - East", "lat": 39.9612, "lon": -82.9988 },
  { "id": "metro-2", "code": "IAD", "city": "Gainesville", "state": "Virginia", "region": "North America - East", "lat": 38.7932, "lon": -77.6142 },
  { "id": "metro-3", "code": "LNK/CBF", "city": "Council Bluffs", "state": "Iowa", "region": "North America - Central", "lat": 41.2619, "lon": -95.8608 },
  { "id": "metro-4", "code": "DFW", "city": "Midlothian", "state": "Texas", "region": "North America - Central", "lat": 32.4839, "lon": -96.9928 },
  { "id": "metro-5", "code": "DLS", "city": "The Dalles", "state": "Oregon", "region": "North America - West", "lat": 45.5946, "lon": -121.1787 },
  { "id": "metro-6", "code": "TUL", "city": "Pryor", "state": "Oklahoma", "region": "North America - Central", "lat": 36.307, "lon": -95.3155 },
  { "id": "metro-7", "code": "CKV", "city": "Clarksville", "state": "Tennessee", "region": "North America - East", "lat": 36.5298, "lon": -87.3595 },
  { "id": "metro-8", "code": "RIC", "city": "Richmond", "state": "Virginia", "region": "North America - East", "lat": 37.5407, "lon": -77.436 },
  { "id": "metro-9", "code": "CHS", "city": "Charleston", "state": "South Carolina", "region": "North America - East", "lat": 32.7765, "lon": -79.9311 },
  { "id": "metro-10", "code": "RNO", "city": "McCarren", "state": "Nevada", "region": "North America - West", "lat": 39.5296, "lon": -119.8138 },
  { "id": "metro-11", "code": "SLC", "city": "Salt Lake City", "state": "Utah", "region": "North America - West", "lat": 40.7608, "lon": -111.891 },
  { "id": "metro-12", "code": "MCI", "city": "Kansas City", "state": "Missouri", "region": "North America - Central", "lat": 39.0997, "lon": -94.5786 },
  { "id": "metro-13", "code": "PHX", "city": "Mesa", "state": "Arizona", "region": "North America - West", "lat": 33.4152, "lon": -111.8315 },
  { "id": "metro-14", "code": "YUL", "city": "Montreal", "state": "Quebec", "region": "North America - East", "lat": 45.5017, "lon": -73.5673 },
  { "id": "metro-15", "code": "FWA", "city": "Fort Wayne", "state": "Indiana", "region": "North America - East", "lat": 41.0793, "lon": -85.1394 },
  { "id": "metro-16", "code": "CLT", "city": "Charlotte", "state": "North Carolina", "region": "North America - East", "lat": 35.2271, "lon": -80.8431 },
  { "id": "metro-17", "code": "AUS", "city": "Austin", "state": "Texas", "region": "North America - Central", "lat": 30.2672, "lon": -97.7431 },
  { "id": "metro-18", "code": "HSV", "city": "Widows Creek", "state": "Alabama", "region": "North America - East", "lat": 34.7304, "lon": -86.5861 },
  { "id": "metro-19", "code": "BMI", "city": "Bloomington", "state": "Illinois", "region": "North America - East", "lat": 40.4842, "lon": -88.9937 },
  { "id": "metro-20", "code": "CID", "city": "Cedar Rapids", "state": "Iowa", "region": "North America - Central", "lat": 41.9779, "lon": -91.6656 },
  { "id": "metro-21", "code": "FDY", "city": "Lima", "state": "Ohio", "region": "North America - East", "lat": 40.7431, "lon": -84.1055 },
  { "id": "metro-22", "code": "SWO", "city": "Stillwater", "state": "Oklahoma", "region": "North America - Central", "lat": 36.1156, "lon": -97.0584 },
  { "id": "metro-23", "code": "AMW", "city": "Ames", "state": "Iowa", "region": "North America - Central", "lat": 42.0347, "lon": -93.62 },
  { "id": "metro-24", "code": "LAS", "city": "Las Vegas", "state": "Nevada", "region": "North America - West", "lat": 36.1699, "lon": -115.1398 },
  { "id": "metro-25", "code": "LAX", "city": "Los Angeles", "state": "California", "region": "North America - West", "lat": 34.0522, "lon": -118.2437 },
  { "id": "metro-26", "code": "ATL", "city": "Atlanta", "state": "Georgia", "region": "North America - Central", "lat": 33.749, "lon": -84.388 },
  { "id": "metro-27", "code": "MSP", "city": "Minneapolis", "state": "Minnesota", "region": "North America - Central", "lat": 44.9778, "lon": -93.265 },
  { "id": "metro-28", "code": "MRN", "city": "Morganton", "state": "North Carolina", "region": "North America - East", "lat": 35.746, "lon": -81.6882 },
  { "id": "metro-29", "code": "MEM", "city": "Memphis", "state": "Tennessee", "region": "North America - East", "lat": 35.1495, "lon": -90.049 },
  { "id": "metro-30", "code": "PHN", "city": "Clair County", "state": "Michigan", "region": "North America - East", "lat": 42.9725, "lon": -82.7849 },
  { "id": "metro-31", "code": "ROA", "city": "Roanoke", "state": "Virginia", "region": "North America - East", "lat": 37.271, "lon": -79.9414 },
  { "id": "metro-32", "code": "DYS", "city": "Abilene", "state": "Texas", "region": "North America - Central", "lat": 32.4487, "lon": -99.7331 },
  { "id": "metro-33", "code": "HOU", "city": "Houston", "state": "Texas", "region": "North America - Central", "lat": 29.7604, "lon": -95.3698 }
];

const getFutureDate = (baseDate: Date, days: number): Date => {
    const futureDate = new Date(baseDate);
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate;
};

const baseStartDate = new Date('2025-10-26T00:00:00Z');

export const RFPData: Partial<RFP>[] = [
  {
    projectName: 'Data Center HVAC Upgrade',
    scopeOfWork: 'Upgrade the existing HVAC system to a more energy-efficient solution.',
    metroCode: 'DFW',
    contractorType: 'Mechanical',
    estimatedBudget: 2500000,
    status: 'Selection',
    id: 'rfp-1',
  },
  {
    projectName: 'West Coast Fiber Network Expansion',
    scopeOfWork: 'Lay new fiber optic cables to expand network capacity in key western metro areas.',
    metroCode: 'LAX',
    contractorType: 'NICON',
    estimatedBudget: 15000000,
    status: 'Invitation',
    id: 'rfp-2',
  },
  {
    projectName: 'Columbus Campus Security System Overhaul',
    scopeOfWork: 'Full replacement of all security cameras, access control systems, and monitoring software.',
    metroCode: 'CMH',
    contractorType: 'Electrical / NICON',
    estimatedBudget: 5000000,
    status: 'Proposals',
    id: 'rfp-3',
  },
  {
    projectName: 'Council Bluffs Power Distribution Unit Refresh',
    scopeOfWork: 'Replace and upgrade all PDUs in the data hall to support higher density racks.',
    metroCode: 'LNK/CBF',
    contractorType: 'Electrical',
    estimatedBudget: 7500000,
    status: 'Analysis',
    id: 'rfp-4',
  },
  {
    projectName: 'New Office Build-out in Austin',
    scopeOfWork: 'Complete interior construction for a new 50,000 sq ft office space.',
    metroCode: 'AUS',
    contractorType: 'General Contractor',
    estimatedBudget: 12000000,
    status: 'Award',
    id: 'rfp-5',
  },
];
