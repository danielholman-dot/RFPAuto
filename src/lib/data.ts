import { collection, getDocs, doc, getDoc, addDoc, query, where, Timestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase'; // Changed this line
import type { MetroCode, RFP, Contractor, Proposal } from './types';

// Get the Firebase SDKs, including firestore
const { firestore } = initializeFirebase(); // Added this line

export const usersData = [
    {
        id: 'usr_1',
        name: 'Alice Johnson',
        email: 'alice.j@example.com',
        role: 'Google Procurement Office',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1080',
    },
    {
        id: 'usr_2',
        name: 'Bob Williams',
        email: 'bob.w@example.com',
        role: 'Project Management',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1080',
    },
    {
        id: 'usr_3',
        name: 'Charlie Brown',
        email: 'charlie.b@example.com',
        role: 'Project Management',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1080',
    },
    {
        id: 'usr_4',
        name: 'Test User',
        email: 'test@example.com',
        role: 'Google Procurement Office',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1080',
    }
];

export const ContractorsData = [
    {
        "name": "ABB Inc",
        "contactName": "Ted Ioannou; Edgard Rodriguez; Elina Hermunen",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "CLT (Charlotte), PHX (Phoenix), DFW (Dallas), CMH (Columbus)"
    },
    {
        "name": "Allison-Smith Company LLC",
        "contactName": "Austin Morgan; Mark Gallacher; Jason Smith; Courtney Britt; Blake Harrelson; Stephen Sanchez",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical",
        "preferredStatus": "Preferred",
        "region": "East",
        "metroSite": "ATL (Atlanta), CHS (Charleston)"
    },
    {
        "name": "Archkey Solutions LLC",
        "contactName": "Chris White; Steven Stone; Rich Ross; Jason Fean; Kari Crawley; Dan Dvorak; Ryan Hildebrandt; Bill Olson",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical / NICON",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "CMH (Columbus), NOVA (Northern Virginia), CHS (Charleston)"
    },
    {
        "name": "Ascension Construction Solutions LLC",
        "contactName": "Jeanna Hondel; Michael Hondel",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "East",
        "metroSite": "CMH (Columbus), DFW (Dallas)"
    },
    {
        "name": "Batchelor and Kimball, Inc.",
        "contactName": "David Batchelor; Brian Batchelor; Nathan Deasy; William Doty; David M. Vepraskas; Carter Cochran; Roger Atkinson",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Mechanical",
        "preferredStatus": "Preferred",
        "region": "East",
        "metroSite": "CHS (Charleston)"
    },
    {
        "name": "BGI-GCON JV LLC",
        "contactName": "Michael Godbehere; Michele Newlon",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "West",
        "metroSite": "DFW (Dallas)"
    },
    {
        "name": "Bombard Electric, LLC",
        "contactName": "Stephen Murray; Bobby House; Jason Luehsenhop",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical",
        "preferredStatus": "Preferred",
        "region": "West Coast",
        "metroSite": "LAS"
    },
    {
        "name": "Brandt Mechanical Services",
        "contactName": "Michael Kimmell; Enoch Paris; Josh Sperling",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Mechanical",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "DFW (Dallas), HOU (Houston), AUS (Austin)"
    },
    {
        "name": "Bremik Construction",
        "contactName": "Brent Parry; Vijay Daniel; Trang Pham",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "DLS (The Dalles)"
    },
    {
        "name": "C.D. Moody Construction Company, Inc",
        "contactName": "C. David Moody, Jr; Erica Sims-Young",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "NOVA (Northern Virginia), CHS (Charleston)"
    },
    {
        "name": "Cache Valley Electric Company",
        "contactName": "Jim Laub; Michael Petric; Jammie Greer; Randi Burton",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical / NICON",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "SLC (Salt Lake City), DLS (The Dalles), PHX (Phoenix), DFW (Dallas)"
    },
    {
        "name": "Caddell Construction Co., Inc.",
        "contactName": "Zach Moore; Scott Thompson; Ricky Byrd",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "HSV (Huntsville), PHX (Phoenix), ATL (Atlanta)"
    },
    {
        "name": "Century Contractors, Inc.",
        "contactName": "Howard Smith; Johnny Dotson; Jim Kick",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "ATL (Atlanta), CLT (Charlotte), CHS (Charleston), CKV (Clarksville), RIC (Richmond)"
    },
    {
        "name": "Cleveland Electric Company",
        "contactName": "Robert Siegworth; Vann Cleveland; Andy Tolbert; Corey Bobo; Mike Taylor; Robin Domogala; John Cleveland; Corey Bobo",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical / NICON",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "CHS (Charleston), LNR (Lenior), ATL (Atlanta)"
    },
    {
        "name": "CPG Beyond",
        "contactName": "Chad Towner; Keith Lambert",
        "contactEmail": "<REDACTED_PII>",
        "type": "Electrical / Professional Services",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "IAD (Washington, D.C.), PHX (Phoenix)"
    },
    {
        "name": "Custom Computer Cable, Inc.",
        "contactName": "Michael Evans; Jeff Watson",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical / NICON",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "IAD (Washington, D.C.), RIC (Richmond)"
    },
    {
        "name": "D.H. Griffin Infrastructure LLC",
        "contactName": "Chad Wineinger; Danny Hoyle; Chris Carter",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "East",
        "metroSite": "LNR (Lenior)"
    },
    {
        "name": "Direct Line Global LLC",
        "contactName": "Jennifer Yniesta; Nathan Wood; Bret Kammersgard",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "NICON",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "LAX (Los Angeles), IAD (Washington, D.C.), DFW (Dallas), DLS (The Dalles)"
    },
    {
        "name": "DPR Construction, Inc",
        "contactName": "Luke Stocking; Damien McCants; Felix Cole; Kevin Burch; Brett Korn; Scott Hibbard; Chuck Rosenthall",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "ATL (Atlanta), DFW (Dallas), CLT (Charlotte), PHX (Phoenix), LAX (Los Angeles), IAD (Washington, D.C.)"
    },
    {
        "name": "Dwatts Construction LLC",
        "contactName": "Jeremiah Watts; Maricar Buot; David Doherty",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "IAD (Washington, D.C.), RIC (Richmond)"
    },
    {
        "name": "Dynalectric Company",
        "contactName": "Bob Wagner; KaHee Emerson",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical / NICON",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "LAX (Los Angeles), DLS (The Dalles), IAD (Washington, D.C.), RNO (Reno), PHX (Phoenix)"
    },
    {
        "name": "E2 Optics, LLC.",
        "contactName": "Kristi Alford-Haarberg; Shane Moore; Andrea Spisak",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "NICON",
        "preferredStatus": "Most Preferred",
        "region": "North America",
        "metroSite": "CMH (Columbus), CHS (Charleston), NOVA (Northern Virginia), DFW (Dallas)"
    },
    {
        "name": "Environmental Air Systems, LLC",
        "contactName": "Charles Dick; Frank Stewart; Johnny Moorefield; Bill Bullock",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Mechanical",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "CLT (Charlotte), MRN (Morganton)"
    },
    {
        "name": "Faith Technologies Inc.",
        "contactName": "David Jahner; Pat McGettigan; Mike Brown; Jesse Davis; Ken Baumgart; Brandon Miller",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical / NICON",
        "preferredStatus": "Most Preferred",
        "region": "North America",
        "metroSite": "SPC (Clarksville), TUL (Pryor)"
    },
    {
        "name": "Fisk Electric Company",
        "contactName": "Cory Borchardt; Anthony Sant; Lenny Seibert; Greg Thomas",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical / NICON",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "LAX (Los Angeles), LAS (Las Vegas), DFW (Dallas), PHX (Phoenix)"
    },
    {
        "name": "Fortis Construction, Inc",
        "contactName": "Greg Wimmer; Chris Warner; Dan Boel (STY); Joe Vlasteelicia (STY); David Curry (PRY); Joe Bowen (PRY)",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; dan.boel@fortisconstruction; joe.vlasteelicia@fortisconstruction; david.curry@fortisconstruction; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "West",
        "metroSite": "RNO (Reno), TUL (Tulsa), SLC (Salt Lake City), DLS (The Dalles)"
    },
    {
        "name": "Fulcrum Reliability Systems, Inc.",
        "contactName": "Jimmie Baile; Andrew Bohm",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical",
        "preferredStatus": "Most Preferred",
        "region": "North America",
        "metroSite": "PHX (Phoenix), DFW (Dallas), LAS (Las Vegas), CID (Cedar Rapids), ATL (Atlanta), CMH (Columbus)"
    },
    {
        "name": "GBA Builders, LLC.",
        "contactName": "Graham Jones; Joseph Alvarez; Kyle Quigley",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "MCI (Kansas City), DFW (Dallas), BMI (Bloomington), CLT (Charlotte), IAD (Washington, D.C.)"
    },
    {
        "name": "GCON, Inc.",
        "contactName": "Michael Godbehere; Flint Ellis; Brian White",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "West",
        "metroSite": "DFW (Dallas)"
    },
    {
        "name": "Gilbane Building Company",
        "contactName": "Larry Mast; Daniel Baima",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "Multi-Region"
    },
    {
        "name": "Grade A Construction, LLC",
        "contactName": "Rachelle Reigard; John Hayman; Mike Roberts",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "MEM (Memphis), CKV (Clarksville)"
    },
    {
        "name": "H. J. Russell & Company",
        "contactName": "Clinton Kurtz; M Swick; Michael Russell",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "CHS (Charleston), ATL (Atlanta), CKV (Clarksville)"
    },
    {
        "name": "HITT Contracting, Inc",
        "contactName": "Evan Antonides; Steve Schoenefeldt; Kim Roy; Spencer Allin; Connor Toomey",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "LAX (Los Angeles), ATL (Atlanta), CLT (Charlotte), DFW (Dallas), IAD (Washington, D.C.)"
    },
    {
        "name": "Holder Construction Group, LLC",
        "contactName": "William Turpin; Shaun Haycock; Kim Spence; Rob Elias; Jason Bell",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "ATL (Atlanta), CLT (Charlotte), CMH (Columbus), DFW (Dallas), PHX (Phoenix), LAX (Los Angeles)"
    },
    {
        "name": "Holt Brothers Construction, LLC",
        "contactName": "Jeff Beam; Terrence Holt; Torry Holt; Yaswanthi Kothapalli",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "CHS (Charleston), LNR (Lenior)"
    },
    {
        "name": "IES Communications, LLC",
        "contactName": "Matthew Allen; John Seli; Becky Fisher; Jeff Carney; Richard Cho; Sarah Brouillette; Willam Schoeb; Kirsten Aydt; Brian Pezzillo",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "NICON",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "PHX (Phoenix), LAX (Los Angeles), ATL (Atlanta), CID (Cedar Rapids), DFW (Dallas), IAD (Washington, D.C.), SLC (Salt Lake City)"
    },
    {
        "name": "Infrastructure Professional Services and Equipment, LLC",
        "contactName": "Jeffrey Farlow; Armita Ghalandar; Christina Griggs; Troy Bowen",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical / Mechanical",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TBD"
    },
    {
        "name": "Inglett & Stubbs, LLC",
        "contactName": "Elyse Mcdowell; Holly Wilson; Gael Pirlot; Greg Turner",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "ATL (Atlanta)"
    },
    {
        "name": "J.E. Dunn Construction Group, Inc.",
        "contactName": "Chris Teddy; Joseph Schultz; Erica Froelich",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "MCI (Kansas City), ATL (Atlanta), DFW (Dallas), CLT (Charlotte), PHX (Phoenix)"
    },
    {
        "name": "Kenimer & Knox Mechanical, LLC",
        "contactName": "Bill Kenimer; Tanya Kenimer; Tommy McChargue",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Mechanical",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "CHS (Charleston)"
    },
    {
        "name": "Kor Building Group",
        "contactName": "Rebecca Fountain; Paul Bressan; Kris Churchfield",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "PHX (Phoenix), LAS (Las Vegas), RNO (Reno)"
    },
    {
        "name": "Leapley Construction Group of Atlanta, LLC",
        "contactName": "David Goodson; Beau Walker; Mark Cleverly; Michael Mcrae; Meredith Leapley; Alisa Henderson",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "ATL (Atlanta), HSV (Huntsville)"
    },
    {
        "name": "Low Voltage Solutions, Inc.",
        "contactName": "Gary St Cin; Nick Siwak; Tom Bleker; Steve Martin",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "NICON",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "BMI (Bloomington)"
    },
    {
        "name": "M. A. Mortenson Company",
        "contactName": "Brian Tobiczyk; Bob Bachmeier; Emily Sherry",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "PHX (Phoenix), CID (Cedar Rapids), MSP (Minneapolis), DLS (The Dalles), MCI (Kansas City), DFW (Dallas)"
    },
    {
        "name": "M.C. Dean, Inc.",
        "contactName": "Ahmed Gokturk; Karen Goldbeck; Amanda Johnson; Troy Stuck",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical",
        "preferredStatus": "Most Preferred",
        "region": "North America",
        "metroSite": "IAD (Washington, D.C.), LAX (Los Angeles), DLS (The Dalles), SLC (Salt Lake City), DFW (Dallas), ATL (Atlanta)"
    },
    {
        "name": "Manhattan Construction Company",
        "contactName": "Ryan Haynie; Ronnie Wood; Greg McClure; Davis Barksdale",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "West (Central)",
        "metroSite": "TUL (Pryor)"
    },
    {
        "name": "McFarland Building Group, LLC",
        "contactName": "Michelle Smith; Becki Wilson; Ben Wilhelm; Gene Harris",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "LNR (Lenior)"
    },
    {
        "name": "McKenney's, Inc.",
        "contactName": "Steve Smith; Matt Stroer; Valerie Vanantwerp; Timothy Smith",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Mechanical",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "ATL (Atlanta), CLT (Charlotte)"
    },
    {
        "name": "Miller Electric Company [MECOJAX]",
        "contactName": "Kevin Hebert; Derek Elmo; Helga Oliver; Donnie Smith; Nadene Young; Craig Langfeldt",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "ATL (Atlanta), CLT (Charlotte), DFW (Dallas), IAD (Washington, D.C.)"
    },
    {
        "name": "Miller Electric Company [Omaha]",
        "contactName": "Craig Langfeldt; Tim Tanner; Roger Ferris",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical",
        "preferredStatus": "Most Preferred",
        "region": "West (Central)",
        "metroSite": "OMA (Omaha)"
    },
    {
        "name": "MMC Mechanical Contractors, Inc",
        "contactName": "Tom Benassi; Jack Duren; Andrew Thompson; Dennis Eden",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Mechanical",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "CMH (Columbus)"
    },
    {
        "name": "OEG, Inc",
        "contactName": "Alex Maia; Sean Cox; Tom Bergmann; Danny Robinson",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical / NICON",
        "preferredStatus": "Most Preferred",
        "region": "West",
        "metroSite": "DLS (The Dalles)"
    },
    {
        "name": "Oklahoma Electrical Supply Company",
        "contactName": "Bill Cooper; Rick Brasher; Robert Cook; William Hill; Roger Calvert; Steve Maloney [Tulsa]; Becky Barney [Oklahoma]",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical / NICON",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TUL (Tulsa), SWO (Stillwater), LNK (Lincoln)"
    },
    {
        "name": "P & C Construction, Inc.",
        "contactName": "Royce Cornelison; Stacie Cooper; Nic Cornelison; Jordan Cornelison",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "HSV (Huntsville), BMI (Bloomington), CKV (Clarksville), ATL (Atlanta), CLT (Charlotte), DFW (Dallas)"
    },
    {
        "name": "P1 Group",
        "contactName": "Daniel Farnan; Danny Rickman; Dan Gibson; Dan Osborne",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "LAS (Las Vegas), MCI (Kansas City)"
    },
    {
        "name": "Palmetto Tri-Venture",
        "contactName": "Corey Ketchum; Todd Pressley; Bill Johnson; Jeremy Southerland",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "CMH (Columbus), CHS (Charleston), DFW (Dallas), CID (Cedar Rapids), DLS (The Dalles), CLT (Charlotte)"
    },
    {
        "name": "Patterson & Dewar Engineers, Inc.",
        "contactName": "John McCullen; James Rains; Larry Kincer; Jim Gelsomini",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical / Professional Services",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "ATL (Atlanta), PHX (Phoenix), CKV (Clarksville), DFW (Dallas), RIC (Richmond)"
    },
    {
        "name": "R. Lafferty & Son Industrial And Commercial Contractors, LLC",
        "contactName": "Hunter Schmitton; William B Bryant",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "Southland Industries",
        "contactName": "Timothy Michael; Jose Felsmann; Michael Starego; Jeremiah Newens",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Mechanical",
        "preferredStatus": "Most Preferred",
        "region": "West (Central)",
        "metroSite": "DFW (Dallas), MEM (Memphis)"
    },
    {
        "name": "Suffolk Construction Company, Inc",
        "contactName": "Darin S Hart; Michael Mallon",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "DLS (The Dalles), DFW (Dallas), LAX (Los Angeles), IAD (Washington, D.C.)"
    },
    {
        "name": "Superior Fiber & Data Services, Inc.",
        "contactName": "Randy Fuller; Tommy Osborne; Jeff Macfee",
        "contactEmail": "<REDACTED_PII>",
        "type": "Electrical / NICON",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "DFW (Dallas), HOU (Houston), AUS (Austin)"
    },
    {
        "name": "T5 Data Centers LLC",
        "contactName": "Adam Board; Benjamin Hilderbrand; David Gruber; David Mettler; Brian Pate",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "ATL (Atlanta), BMI (Bloomington), CLT (Charlotte), LAX (Los Angeles), MSP (Minneapolis), DLS (The Dalles)"
    },
    {
        "name": "Teel Construction",
        "contactName": "Bryce Teel; Robert Tucker; Nick Davis; Adam Turner",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "LAX (Los Angeles), IAD (Washington, D.C.)"
    },
    {
        "name": "Teklus Construction, LLC",
        "contactName": "Shu Nomura; Chris Hood; Nathan Weber; Joel McGraw",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "LAS (Las Vegas), RNO (Reno), LAX (Los Angeles), MCI (Kansas City)"
    },
    {
        "name": "The Poole and Kent Corporation",
        "contactName": "Donald Lynott; Jake Medina; Brian Touchard; Daniel Bock; Adam Snavely",
        "contactEmail": "<REDACTED_PII> / <REDACTED_PII>; <REDACTED_PII> / <REDACTED_PII>; <REDACTED_PII> / <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Mechanical",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "CMH (Columbus), IAD (Washington, D.C.), RIC (Richmond)"
    },
    {
        "name": "The Whiting-Turner Contracting Company",
        "contactName": "Jonathan Hess; Brent Voyles; Kendall Martin; Adam Eshelbrenner",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "West (Central)",
        "metroSite": "OMA (Omaha)"
    },
    {
        "name": "TM Source Building Group, Inc.",
        "contactName": "Trelaine M. Mapp; Laurie Smithson Butler; Martin Barron",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "DFW (Dallas), HOU (Houston), AUS (Austin)"
    },
    {
        "name": "Turner Construction Company Inc",
        "contactName": "Corey Ketchum; Dan Fine",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "CMH (Columbus)"
    },
    {
        "name": "TW Constructors, LLC",
        "contactName": "Todd Weaver; Bill Johnson; Nick Gittemeier; Bill Begis; Todd Nelson",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "CMH (Columbus)"
    },
    {
        "name": "U.S. Engineering Innovations, LLC",
        "contactName": "Vincent Michael Pianalto; Bryan Taylor; Justin Apprill; Jarrod Foster; Jeff Kiblen; Adam Provost; Richard Green",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Mechanical",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "MCI (Kansas City), CKV (Clarksville), TUL (Tulsa)"
    },
    {
        "name": "Ujamaa Construction Inc.",
        "contactName": "Todd O. Pressley; Justin Dwaun Redding; Kevin P. Waco",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "BMI (Bloomington), CHS (Charleston), CKV (Clarksville), ATL (Atlanta), LAS (Las Vegas), DLS (The Dalles)"
    },
    {
        "name": "Vertiv Corporation",
        "contactName": "Omar Mckee; Samir Mehta; Simon Killen; Mark Asgarian; Dave Rubcich; Mike Zapata",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "CMH (Columbus), HSV (Huntsville)"
    },
    {
        "name": "Viking Engineering and Construction, LLC",
        "contactName": "Cecil DelaCruz; Jeffrey Payson; Drew Schaefer; Serge Bachinsky; Zach Hunt; Noah Johnson",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "West",
        "metroSite": "DLS (The Dalles)"
    },
    {
        "name": "Vision Technologies, LLC",
        "contactName": "Kevin Nolan; Yaser Ali; Peter Cava; Jon Lyman; Jennifer Spees; S. Michael Quade",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "NICON",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "CHS (Charleston), CMH (Columbus), NOVA (Northern Virginia)"
    },
    {
        "name": "W. G. Yates & Sons Construction Company",
        "contactName": "Barry Scearce; Nick McIlwain; Jennifer Mountjoy",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "HSV (Huntsville), MEM (Memphis), DFW (Dallas), ATL (Atlanta), LAX (Los Angeles)"
    },
    {
        "name": "Walker Engineering, Inc.",
        "contactName": "Randy Randolph; Eric Lugger; Justin Davis; Raymond Fischer",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "Electrical",
        "preferredStatus": "Most Preferred",
        "region": "West",
        "metroSite": "DFW (Dallas)"
    },
    {
        "name": "Wycliffe Trinity, LLC",
        "contactName": "Anthony Reichel; Kristen Askin; Sam Metta",
        "contactEmail": "<REDACTED_PII>; <REDACTED_PII>; <REDACTED_PII>",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "IAD (Washington, D.C.)"
    }
].map((c, i) => {
    // Extract metro codes from the metroSite string
    const metroSiteString = c.metroSite || '';
    // This regex will find all 3-4 letter uppercase codes, handling cases like LNK/CBF by finding LNK and CBF
    const regex = /([A-Z]{3,4})/g;
    const matches = metroSiteString.match(regex) || [];
    
    const contractorMetroCodes = Array.from(new Set(matches));

    let preference = 3;
    if (c.preferredStatus === 'Most Preferred') preference = 1;
    if (c.preferredStatus === 'Preferred') preference = 2;

    let performance = Math.floor(Math.random() * 21) + 80; // 80 to 100
    if (c.name === 'TEST Rafael Correa') {
        performance = 100;
    }


    return {
        id: `contractor-${i + 1}`,
        ...c,
        metroCodes: contractorMetroCodes,
        performance,
        preference,
    };
});

export const contractorTypes = Array.from(new Set(ContractorsData.map(c => c.type))).sort();


export const MetroCodesData: MetroCode[] = [
  { "id": "metro-1", "code": "CMH", "city": "Columbus", "state": "Ohio", "region": "North America - East", "lat": 39.9612, "lon": -82.9988 },
  { "id": "metro-2", "code": "IAD", "city": "Gainesville", "state": "Virginia", "region": "North America - East", "lat": 38.7932, "lon": -77.6142 },
  { "id": "metro-3", "code": "LNK", "city": "Council Bluffs", "state": "Iowa", "region": "North America - Central", "lat": 41.2619, "lon": -95.8608 },
  { "id": "metro-3b", "code": "CBF", "city": "Council Bluffs", "state": "Iowa", "region": "North America - Central", "lat": 41.2619, "lon": -95.8608 },
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
  { "id": "metro-33", "code": "HOU", "city": "Houston", "state": "Texas", "region": "North America - Central", "lat": 29.7604, "lon": -95.3698 },
  { "id": "metro-34", "code": "NOVA", "city": "Northern Virginia", "state": "Virginia", "region": "North America - East", "lat": 38.9, "lon": -77.4 },
  { "id": "metro-35", "code": "LNR", "city": "Lenior", "state": "North Carolina", "region": "North America - East", "lat": 35.91, "lon": -81.53 },
  { "id": "metro-36", "code": "OMA", "city": "Omaha", "state": "Nebraska", "region": "North America - Central", "lat": 41.25, "lon": -95.93 },
  { "id": "metro-37", "code": "SPC", "city": "Clarksville", "state": "Tennessee", "region": "North America - East", "lat": 36.5298, "lon": -87.3595 },
];

const now = new Date();
const getFutureDate = (baseDate: Date, days: number): Date => {
    const futureDate = new Date(baseDate);
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate;
};

const baseStartDate = new Date('2025-10-26T00:00:00Z');

export const RFPData = [
  {
    projectName: 'Data Center HVAC Upgrade',
    scopeOfWork: 'Upgrade the existing HVAC system to a more energy-efficient solution.',
    metroCode: 'DFW',
    contractorType: 'Mechanical',
    estimatedBudget: 2500000,
    rfpStartDate: getFutureDate(baseStartDate, 0),
    rfpEndDate: getFutureDate(baseStartDate, 20),
    projectStartDate: getFutureDate(baseStartDate, 31),
    projectEndDate: getFutureDate(baseStartDate, 213),
    status: 'Selection'
  },
  {
    projectName: 'West Coast Fiber Network Expansion',
    scopeOfWork: 'Lay new fiber optic cables to expand network capacity in key western metro areas.',
    metroCode: 'LAX',
    contractorType: 'NICON',
    estimatedBudget: 15000000,
    rfpStartDate: getFutureDate(baseStartDate, 15),
    rfpEndDate: getFutureDate(baseStartDate, 45),
    projectStartDate: getFutureDate(baseStartDate, 62),
    projectEndDate: getFutureDate(baseStartDate, 427),
    status: 'Selection'
  },
  {
    projectName: 'Columbus Campus Security System Overhaul',
    scopeOfWork: 'Full replacement of all security cameras, access control systems, and monitoring software.',
    metroCode: 'CMH',
    contractorType: 'Electrical / NICON',
    estimatedBudget: 5000000,
    rfpStartDate: getFutureDate(baseStartDate, 31),
    rfpEndDate: getFutureDate(baseStartDate, 62),
    projectStartDate: getFutureDate(baseStartDate, 92),
    projectEndDate: getFutureDate(baseStartDate, 274),
    status: 'Selection'
  },
  {
    projectName: 'Council Bluffs Power Distribution Unit Refresh',
    scopeOfWork: 'Replace and upgrade all PDUs in the data hall to support higher density racks.',
    metroCode: 'LNK/CBF',
    contractorType: 'Electrical',
    estimatedBudget: 7500000,
    rfpStartDate: getFutureDate(baseStartDate, -30),
    rfpEndDate: getFutureDate(baseStartDate, 0),
    projectStartDate: getFutureDate(baseStartDate, 20),
    projectEndDate: getFutureDate(baseStartDate, 202),
    status: 'Selection'
  },
  {
    projectName: 'New Office Build-out in Austin',
    scopeOfWork: 'Complete interior construction for a new 50,000 sq ft office space.',
    metroCode: 'AUS',
    contractorType: 'General Contractor',
    estimatedBudget: 12000000,
    rfpStartDate: getFutureDate(baseStartDate, 92),
    rfpEndDate: getFutureDate(baseStartDate, 122),
    projectStartDate: getFutureDate(baseStartDate, 132),
    projectEndDate: getFutureDate(baseStartDate, 437),
    status: 'Selection'
  },
];


export const getRfps = async (): Promise<RFP[]> => {
    const rfpsCol = collection(firestore, 'rfps');
    const rfpSnapshot = await getDocs(rfpsCol);
    const rfpList = rfpSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RFP));
    return rfpList;
};

export const getRfpById = async (id: string): Promise<RFP | null> => {
    const rfpDocRef = doc(firestore, 'rfps', id);
    const rfpSnap = await getDoc(rfpDocRef);
    if (rfpSnap.exists()) {
        return { id: rfpSnap.id, ...rfpSnap.data() } as RFP;
    } else {
        return null;
    }
};

export const getContractors = async (): Promise<Contractor[]> => {
    const contractorsCol = collection(firestore, 'contractors');
    const contractorSnapshot = await getDocs(contractorsCol);
    const contractorList = contractorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contractor));
    return contractorList;
};

export const getProposalsByRfpId = async (rfpId: string): Promise<Proposal[]> => {
    const proposalsCol = collection(firestore, 'rfps', rfpId, 'proposals');
    const proposalSnapshot = await getDocs(proposalsCol);
    const proposalList = proposalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Proposal));
    return proposalList;
};

export const addProposal = async (rfpId: string, proposal: Omit<Proposal, 'id'>) => {
    const proposalsCol = collection(firestore, `rfps/${rfpId}/proposals`);
    const newProposalData = {
        ...proposal,
        submittedDate: Timestamp.now(),
    }
    const docRef = await addDoc(proposalsCol, newProposalData);
    return docRef.id;
};
