
import type { RFP, Contractor, MetroCode } from '@/lib/types';
import { format, addBusinessDays } from 'date-fns';

export const MetroCodesData: Omit<MetroCode, 'id'>[] = [
  { code: 'CMH', city: 'Columbus', state: 'Ohio', region: 'North America - East', lat: 39.9612, lon: -82.9988 },
  { code: 'IAD', city: 'Gainesville', state: 'Virginia', region: 'North America - East', lat: 38.7932, lon: -77.6142 },
  { code: 'LNK/CBF', city: 'Council Bluffs', state: 'Iowa', region: 'North America - Central', lat: 41.2619, lon: -95.8608 },
  { code: 'DFW', city: 'Midlothian', state: 'Texas', region: 'North America - Central', lat: 32.4839, lon: -96.9928 },
  { code: 'DLS', city: 'The Dalles', state: 'Oregon', region: 'North America - West', lat: 45.5946, lon: -121.1787 },
  { code: 'TUL', city: 'Pryor', state: 'Oklahoma', region: 'North America - Central', lat: 36.307, lon: -95.3155 },
  { code: 'CKV', city: 'Clarksville', state: 'Tennessee', region: 'North America - East', lat: 36.5298, lon: -87.3595 },
  { code: 'RIC', city: 'Richmond', state: 'Virginia', region: 'North America - East', lat: 37.5407, lon: -77.436 },
  { code: 'CHS', city: 'Charleston', state: 'South Carolina', region: 'North America - East', lat: 32.7765, lon: -79.9311 },
  { code: 'RNO', city: 'McCarren', state: 'Nevada', region: 'North America - West', lat: 39.5296, lon: -119.8138 },
  { code: 'SLC', city: 'Salt Lake City', state: 'Utah', region: 'North America - West', lat: 40.7608, lon: -111.891 },
  { code: 'MCI', city: 'Kansas City', state: 'Missouri', region: 'North America - Central', lat: 39.0997, lon: -94.5786 },
  { code: 'PHX', city: 'Mesa', state: 'Arizona', region: 'North America - West', lat: 33.4152, lon: -111.8315 },
  { code: 'YUL', city: 'Montreal', state: 'Quebec', region: 'North America - East', lat: 45.5017, lon: -73.5673 },
  { code: 'FWA', city: 'Fort Wayne', state: 'Indiana', region: 'North America - East', lat: 41.0793, lon: -85.1394 },
  { code: 'CLT', city: 'Charlotte', state: 'North Carolina', region: 'North America - East', lat: 35.2271, lon: -80.8431 },
  { code: 'AUS', city: 'Austin', state: 'Texas', region: 'North America - Central', lat: 30.2672, lon: -97.7431 },
  { code: 'HSV', city: 'Widows Creek', state: 'Alabama', region: 'North America - East', lat: 34.7304, lon: -86.5861 },
  { code: 'BMI', city: 'Bloomington', state: 'Illinois', region: 'North America - East', lat: 40.4842, lon: -88.9937 },
  { code: 'CID', city: 'Cedar Rapids', state: 'Iowa', region: 'North America - Central', lat: 41.9779, lon: -91.6656 },
  { code: 'FDY', city: 'Lima', state: 'Ohio', region: 'North America - East', lat: 40.7431, lon: -84.1055 },
  { code: 'SWO', city: 'Stillwater', state: 'Oklahoma', region: 'North America - Central', lat: 36.1156, lon: -97.0584 },
  { code: 'AMW', city: 'Ames', state: 'Iowa', region: 'North America - Central', lat: 42.0347, lon: -93.62 },
  { code: 'LAS', city: 'Las Vegas', state: 'Nevada', region: 'North America - West', lat: 36.1699, lon: -115.1398 },
  { code: 'LAX', city: 'Los Angeles', state: 'California', region: 'North America - West', lat: 34.0522, lon: -118.2437 },
  { code: 'ATL', city: 'Atlanta', state: 'Georgia', region: 'North America - Central', lat: 33.749, lon: -84.388 },
  { code: 'MSP', city: 'Minneapolis', state: 'Minnesota', region: 'North America - Central', lat: 44.9778, lon: -93.265 },
  { code: 'MRN', city: 'Morganton', state: 'North Carolina', region: 'North America - East', lat: 35.746, lon: -81.6882 },
  { code: 'MEM', city: 'Memphis', state: 'Tennessee', region: 'North America - East', lat: 35.1495, lon: -90.049 },
  { code: 'PHN', city: 'Clair County', state: 'Michigan', region: 'North America - East', lat: 42.9725, lon: -82.7849 },
  { code: 'ROA', city: 'Roanoke', state: 'Virginia', region: 'North America - East', lat: 37.271, lon: -79.9414 },
  { code: 'DYS', city: 'Abilene', state: 'Texas', region: 'North America - Central', lat: 32.4487, lon: -99.7331 },
  { code: 'HOU', city: 'Houston', state: 'Texas', region: 'North America - Central', lat: 29.7604, lon: -95.3698 }
];

export const ContractorsData: Omit<Contractor, 'id'>[] = [
    {
        "name": "ABB Inc",
        "contactName": "Ted Ioannou; Edgard Rodriguez; Elina Hermunen",
        "contactEmail": "ted.ioannou@us.abb.com; edgard.rodriguez@us.abb.com; elina.hermunen@abb.com",
        "type": "Electrical",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "CLT (Charlotte), PHX (Phoenix), DFW (Dallas), CMH (Columbus)",
        "metroCodes": ["CLT", "PHX", "DFW", "CMH"],
        "performance": 90
    },
    {
        "name": "Allison-Smith Company LLC",
        "contactName": "Austin Morgan; Mark Gallacher; Jason Smith; Courtney Britt; Blake Harrelson; Stephen Sanchez",
        "contactEmail": "amorgan@allisonsmith.com; mgallacher@allisonsmith.com; jsmith@allisonsmith.com; cbritt@allisonsmith.com; bharrelson@allisonsmith.com; ssanchez@allisonsmith.com",
        "type": "Electrical",
        "preferredStatus": "Preferred",
        "region": "East",
        "metroSite": "ATL (Atlanta), CHS (Charleston)",
        "metroCodes": ["ATL", "CHS"],
        "performance": 95
    },
    {
        "name": "Archkey Solutions LLC",
        "contactName": "Chris White; Steven Stone; Rich Ross; Jason Fean; Kari Crawley; Dan Dvorak; Ryan Hildebrandt; Bill Olson",
        "contactEmail": "cwhite@sachsco.com; steven.stone@archkey.com; Rich.Ross@archkey.com; jason.fean@archkey.com; kari.crawley@archkey.com; dan.dvorak@archkey.com; ryan.hildebrandt@archkey.com; bill.olson@archkey.com",
        "type": "Electrical / NICON",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "CMH (Columbus), NOVA (Northern Virginia), CHS (Charleston)",
        "metroCodes": ["CMH", "IAD", "CHS"],
        "performance": 92
    },
    // ... (All other contractors)
].map((c, i) => {
    const metroSiteString = c.metroSite || '';
    const regex = /([A-Z]{3,4})/g;
    const matches = metroSiteString.match(regex) || [];
    const contractorMetroCodes = Array.from(new Set(matches));

    let performance = Math.floor(Math.random() * 21) + 80;

    return {
        ...c,
        metroCodes: contractorMetroCodes,
        performance,
    };
});

export const contractorTypes = Array.from(new Set(ContractorsData.map(c => c.type))).sort();

// ... (Rest of the file remains the same, with mock RFP data etc)

const now = new Date();
const getFutureDate = (baseDate: Date, days: number): Date => {
    const futureDate = new Date(baseDate);
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate;
};

const baseStartDate = new Date('2025-10-26T00:00:00Z');

export const RFPData: Omit<RFP, 'id'>[] = [
  {
    projectName: 'Data Center HVAC Upgrade',
    scopeOfWork: 'Upgrade the existing HVAC system to a more energy-efficient solution.',
    metroCode: 'DFW',
    contractorType: 'Mechanical',
    estimatedBudget: 2500000,
    status: 'Selection'
  },
  {
    projectName: 'West Coast Fiber Network Expansion',
    scopeOfWork: 'Lay new fiber optic cables to expand network capacity in key western metro areas.',
    metroCode: 'LAX',
    contractorType: 'NICON',
    estimatedBudget: 15000000,
    status: 'Selection'
  },
  // ... more mock RFPs
];
