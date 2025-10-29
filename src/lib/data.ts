
export const usersData = [
    {
        id: 'user-gpo-1',
        name: 'Alex Johnson',
        email: 'gpo@example.com',
        role: 'Google Procurement Office',
        avatar: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8cGVyc29uJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzU4Nzg4OTc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
        id: 'user-pm-1',
        name: 'Samantha Lee',
        email: 'pm@example.com',
        role: 'Project Management',
        avatar: 'https://images.unsplash.com/photo-1610655507808-a59293f4e332?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc1ODc1MTMyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
        id: 'user-test-1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'Project Management',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwb3J0cmFpdHxlbnwwfHx8fDE3NTg3NDM5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
];

export const MetroCodesData = [
    { id: "metro-1", code: "ATL", city: "Atlanta", state: "GA", region: "East", lat: 33.749, lon: -84.388 },
    { id: "metro-2", code: "AUS", city: "Austin", state: "TX", region: "West", lat: 30.2672, lon: -97.7431 },
    { id: "metro-3", code: "CHS", city: "Charleston", state: "SC", region: "East", lat: 32.7765, lon: -79.9311 },
    { id: "metro-4", code: "CKV", city: "Clarksville", state: "TN", region: "East", lat: 36.5297, lon: -87.3595 },
    { id: "metro-5", code: "CLT", city: "Charlotte", state: "NC", region: "East", lat: 35.2271, lon: -80.8431 },
    { id: "metro-6", code: "CMH", city: "Columbus", state: "OH", region: "East", lat: 39.9612, lon: -82.9988 },
    { id: "metro-7", code: "DFW", city: "Dallas-Fort Worth", state: "TX", region: "West", lat: 32.7767, lon: -96.7970 },
    { id: "metro-8", code: "DLS", city: "The Dalles", state: "OR", region: "West", lat: 45.5946, lon: -121.1787 },
    { id: "metro-9", code: "IAD", city: "Ashburn", state: "VA", region: "East", lat: 39.0438, lon: -77.4874 },
    { id: "metro-10", code: "LAS", city: "Las Vegas", state: "NV", region: "West", lat: 36.1699, lon: -115.1398 },
    { id: "metro-11", code: "LAX", city: "Los Angeles", state: "CA", region: "West", lat: 34.0522, lon: -118.2437 },
    { id: "metro-12", code: "LNR", city: "Lenoir", state: "NC", region: "East", lat: 35.914, lon: -81.539 },
    { id: "metro-13", code: "NOVA", city: "Northern Virginia", state: "VA", region: "East", lat: 38.933, lon: -77.443 },
    { id: "metro-14", code: "OMA", city: "Omaha", state: "NE", region: "West", lat: 41.2565, lon: -95.9345 },
    { id: "metro-15", code: "PHX", city: "Phoenix", state: "AZ", region: "West", lat: 33.4484, lon: -112.0740 },
    { id: "metro-16", code: "RNO", city: "Reno", state: "NV", region: "West", lat: 39.5296, lon: -119.8138 },
    { id: "metro-17", code: "SLC", city: "Salt Lake City", state: "UT", region: "West", lat: 40.7608, lon: -111.8910 },
    { id: "metro-18", code: "TUL", city: "Tulsa", state: "OK", region: "West", lat: 36.1540, lon: -95.9928 }
];


export const ContractorsData = [
    {
        "name": "ABB Inc",
        "contactName": "Ted Ioannou; Edgard Rodriguez; Elina Hermunen",
        "contactEmail": "ted.ioannou@us.abb.com; edgard.rodriguez@us.abb.com; elina.hermunen@abb.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "CLT (Charlotte), PHX (Phoenix), DFW (Dallas), CMH (Columbus)"
    },
    {
        "name": "Allison-Smith Company LLC",
        "contactName": "Austin Morgan; Mark Gallacher; Jason Smith; Courtney Britt; Blake Harrelson; Stephen Sanchez",
        "contactEmail": "amorgan@allisonsmith.com; mgallacher@allisonsmith.com; jsmith@allisonsmith.com; cbritt@allisonsmith.com; bharrelson@allisonsmith.com; ssanchez@allisonsmith.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical",
        "preferredStatus": "Preferred",
        "region": "East",
        "metroSite": "ATL (Atlanta), CHS (Charleston)"
    },
    {
        "name": "Archkey Solutions LLC",
        "contactName": "Chris White; Steven Stone; Rich Ross; Jason Fean; Kari Crawley; Dan Dvorak; Ryan Hildebrandt; Bill Olson",
        "contactEmail": "cwhite@sachsco.com; steven.stone@archkey.com; Rich.Ross@archkey.com; jason.fean@archkey.com; kari.crawley@archkey.com; dan.dvorak@archkey.com; ryan.hildebrandt@archkey.com; bill.olson@archkey.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical / NICON",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "CMH (Columbus), NOVA (Northern Virginia), CHS (Charleston)"
    },
    {
        "name": "Ascension Construction Solutions LLC",
        "contactName": "Jeanna Hondel; Michael Hondel",
        "contactEmail": "jhondel@ascension-cs.com; mhondel@ascension-cs.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "East",
        "metroSite": "CMH (Columbus), DFW (Dallas)"
    },
    {
        "name": "Batchelor and Kimball, Inc.",
        "contactName": "David Batchelor; Brian Batchelor; Nathan Deasy; William Doty; David M. Vepraskas; Carter Cochran; Roger Atkinson",
        "contactEmail": "David@bkimechanical.com; Brian@bkimechanical.com; NDeasy@bkimechanical.com; Bill@bkimechanical.com; davidv@bkimechanical.com; ccochran@bkimechanical.com; ratkinson@bkimechanical.com",
        "contactPhone": "(555) 123-4567",
        "type": "Mechanical",
        "preferredStatus": "Preferred",
        "region": "East",
        "metroSite": "CHS (Charleston)"
    },
    {
        "name": "BGI-GCON JV LLC",
        "contactName": "Michael Godbehere; Michele Newlon",
        "contactEmail": "godbehere@gconinc.com; michelen@gconinc.com; brianw@gconinc.com; flinte@gconinc.com; sarahg@gconinc.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "West",
        "metroSite": "DFW (Dallas)"
    },
    {
        "name": "Bombard Electric, LLC",
        "contactName": "Stephen Murray; Bobby House; Jason Luehsenhop",
        "contactEmail": "stephen.murray@bombardmc.com; bobby.house@bombardelec.com; jason.luehsenhop@bombardmc.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical",
        "preferredStatus": "Preferred",
        "region": "West Coast",
        "metroSite": "LAS"
    },
    {
        "name": "Brandt Mechanical Services",
        "contactName": "Michael Kimmell; Enoch Paris; Josh Sperling",
        "contactEmail": "michael.kimmell@brandt.us; enoch.paris@brandt.us; josh.sperling@brandt.us",
        "contactPhone": "(555) 123-4567",
        "type": "Mechanical",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "DFW (Dallas), HOU (Houston), AUS (Austin)"
    },
    {
        "name": "Bremik Construction",
        "contactName": "Brent Parry; Vijay Daniel; Trang Pham",
        "contactEmail": "bp@bremik.com; vdaniel@bremik.com; tpham@bremik.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "DLS (The Dalles)"
    },
    {
        "name": "C.D. Moody Construction Company, Inc",
        "contactName": "C. David Moody, Jr; Erica Sims-Young",
        "contactEmail": "dmoody@cdmoodyconstruction.com; Esims@cdmoodyconstruction.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "NOVA (Northern Virginia), CHS (Charleston)"
    },
    {
        "name": "Cache Valley Electric Company",
        "contactName": "Jim Laub; Michael Petric; Jammie Greer; Randi Burton",
        "contactEmail": "jim.laub@cve.com; michael.petric@cve.com; jammie.greer@cve.com; businessdevelopment@cve.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical / NICON",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "SLC (Salt Lake City), DLS (The Dalles), PHX (Phoenix), DFW (Dallas)"
    },
    {
        "name": "Caddell Construction Co., Inc.",
        "contactName": "Zach Moore; Scott Thompson; Ricky Byrd",
        "contactEmail": "Zach.Moore@caddell.com; Scott.Thompson@caddell.com; Ricky.Byrd@caddell.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "HSV (Huntsville), PHX (Phoenix), ATL (Atlanta)"
    },
    {
        "name": "Century Contractors, Inc.",
        "contactName": "Howard Smith; Johnny Dotson; Jim Kick",
        "contactEmail": "hsmith@centurycontractors.com; jdotson@centurycontractors.com; jkick@centurycontractors.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "ATL (Atlanta), CLT (Charlotte), CHS (Charleston), CKV (Clarksville), RIC (Richmond)"
    },
    {
        "name": "Cleveland Electric Company",
        "contactName": "Robert Siegworth; Vann Cleveland; Andy Tolbert; Corey Bobo; Mike Taylor; Robin Domogala; John Cleveland; Corey Bobo",
        "contactEmail": "roberts@clevelandgroup.com; vannc@clevelandgroup.com; Andy.Tolbert@clevelandgroup.com; CoreyB@clevelandgroup.com; MikeT@clevelandgroup.com; robind@clevelandgroup.com; coreyB@clevelandgroup.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical / NICON",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "CHS (Charleston), LNR (Lenior), ATL (Atlanta)"
    },
    {
        "name": "CPG Beyond",
        "contactName": "Chad Towner; Keith Lambert",
        "contactEmail": "chad.towner@cpgbeyond.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical / Professional Services",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "IAD (Washington, D.C.), PHX (Phoenix)"
    },
    {
        "name": "Custom Computer Cable, Inc.",
        "contactName": "Michael Evans; Jeff Watson",
        "contactEmail": "Mevans@cccincorp.com; jwatson@cccincorp.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical / NICON",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "IAD (Washington, D.C.), RIC (Richmond)"
    },
    {
        "name": "D.H. Griffin Infrastructure LLC",
        "contactName": "Chad Wineinger; Danny Hoyle; Chris Carter",
        "contactEmail": "cwineinger@dhgriffin.com; dhoyle@dhgriffin.com; ccarter@dhgriffin.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "East",
        "metroSite": "LNR (Lenior)"
    },
    {
        "name": "Direct Line Global LLC",
        "contactName": "Jennifer Yniesta; Nathan Wood; Bret Kammersgard",
        "contactEmail": "jennifer.yniesta@dlcomm.com; nathan.wood@dlcomm.com; bkammersgard@dlcomm.com",
        "contactPhone": "(555) 123-4567",
        "type": "NICON",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "LAX (Los Angeles), IAD (Washington, D.C.), DFW (Dallas), DLS (The Dalles)"
    },
    {
        "name": "DPR Construction, Inc",
        "contactName": "Luke Stocking; Damien McCants; Felix Cole; Kevin Burch; Brett Korn; Scott Hibbard; Chuck Rosenthall",
        "contactEmail": "lukes@dpr.com; DamienM@dpr.com; felixc@dpr.com; kevinb@dpr.com; brettk@dpr.com; Scotthi@dpr.com; chuckr@dpr.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "ATL (Atlanta), DFW (Dallas), CLT (Charlotte), PHX (Phoenix), LAX (Los Angeles), IAD (Washington, D.C.)"
    },
    {
        "name": "Dwatts Construction LLC",
        "contactName": "Jeremiah Watts; Maricar Buot; David Doherty",
        "contactEmail": "JWatts@dwatts.com; mbuot@dwatts.com; DDoherty@dwatts.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "IAD (Washington, D.C.), RIC (Richmond)"
    },
    {
        "name": "Dynalectric Company",
        "contactName": "Bob Wagner; KaHee Emerson",
        "contactEmail": "bwagner@dyna-oregon.com; kemerson@dyna-oregon.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical / NICON",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "LAX (Los Angeles), DLS (The Dalles), IAD (Washington, D.C.), RNO (Reno), PHX (Phoenix)"
    },
    {
        "name": "E2 Optics, LLC.",
        "contactName": "Kristi Alford-Haarberg; Shane Moore; Andrea Spisak",
        "contactEmail": "kristi@e2optics.com; shane.moore@e2optics.com; andrea.spisak@e2optics.com",
        "contactPhone": "(555) 123-4567",
        "type": "NICON",
        "preferredStatus": "Most Preferred",
        "region": "North America",
        "metroSite": "CMH (Columbus), CHS (Charleston), NOVA (Northern Virginia), DFW (Dallas)"
    },
    {
        "name": "Environmental Air Systems, LLC",
        "contactName": "Charles Dick; Frank Stewart; Johnny Moorefield; Bill Bullock",
        "contactEmail": "cdick@easinc.net; fstefanick@easinc.net; jmoorefield@etrol.net; bbullock@easinc.net",
        "contactPhone": "(555) 123-4567",
        "type": "Mechanical",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "CLT (Charlotte), MRN (Morganton)"
    },
    {
        "name": "Faith Technologies Inc.",
        "contactName": "David Jahner; Pat McGettigan; Mike Brown; Jesse Davis; Ken Baumgart; Brandon Miller",
        "contactEmail": "David.jahner@faithtechinc.com; Pat.McGettigan@faithtechinc.com; michael.brown@faithtechinc.com; jesse.davis@faithtechinc.com; Ken.Baumgart@faithtechinc.com; brandon.miller@faithtechinc.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical / NICON",
        "preferredStatus": "Most Preferred",
        "region": "North America",
        "metroSite": "SPC (Clarksville), TUL (Pryor)"
    },
    {
        "name": "Fisk Electric Company",
        "contactName": "Cory Borchardt; Anthony Sant; Lenny Seibert; Greg Thomas",
        "contactEmail": "cborchardt@fiskcorp.com; asant@fiskcorp.com; lseibert@fiskcorp.com; gthomas@fiskcorp.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical / NICON",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "LAX (Los Angeles), LAS (Las Vegas), DFW (Dallas), PHX (Phoenix)"
    },
    {
        "name": "Fortis Construction, Inc",
        "contactName": "Greg Wimmer; Chris Warner; Dan Boel (STY); Joe Vlasteelicia (STY); David Curry (PRY); Joe Bowen (PRY)",
        "contactEmail": "greg.wimmer@fortisconstruction.com; Chris.warner@fortisconstruction.com; dan.boel@fortisconstruction; joe.vlasteelicia@fortisconstruction; david.curry@fortisconstruction; joe.bowen@fortisconstruction.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "West",
        "metroSite": "RNO (Reno), TUL (Tulsa), SLC (Salt Lake City), DLS (The Dalles)"
    },
    {
        "name": "Fulcrum Reliability Systems, Inc.",
        "contactName": "Jimmie Baile; Andrew Bohm",
        "contactEmail": "jimmie.bailey@fulcrumdcs.com; andrew.bohm@fulcrumdcs.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical",
        "preferredStatus": "Most Preferred",
        "region": "North America",
        "metroSite": "PHX (Phoenix), DFW (Dallas), LAS (Las Vegas), CID (Cedar Rapids), ATL (Atlanta), CMH (Columbus)"
    },
    {
        "name": "GBA Builders, LLC.",
        "contactName": "Graham Jones; Joseph Alvarez; Kyle Quigley",
        "contactEmail": "gjones@gbabuilders.com; jalvarez@gbabuilders.com; kquigley@gbabuilders.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "MCI (Kansas City), DFW (Dallas), BMI (Bloomington), CLT (Charlotte), IAD (Washington, D.C.)"
    },
    {
        "name": "GCON, Inc.",
        "contactName": "Michael Godbehere; Flint Ellis; Brian White",
        "contactEmail": "mikegodbehere@gconinc.com; flinte@gconinc.com; brianw@gconinc.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "West",
        "metroSite": "DFW (Dallas)"
    },
    {
        "name": "Gilbane Building Company",
        "contactName": "Larry Mast; Daniel Baima",
        "contactEmail": "LMastella@gilbaneco.com; DBaima@gilbaneco.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "Multi-Region"
    },
    {
        "name": "Grade A Construction, LLC",
        "contactName": "Rachelle Reigard; John Hayman; Mike Roberts",
        "contactEmail": "rachelle.reigard@gradeaservices.com; john.hayman@gradeaservices.com; mike.roberts@gradeaservices.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "MEM (Memphis), CKV (Clarksville)"
    },
    {
        "name": "H. J. Russell & Company",
        "contactName": "Clinton Kurtz; M Swick; Michael Russell",
        "contactEmail": "ckurtz@hjrussell.com; mswick@hjrussell.com; mrussell@hjrussell.com; edent@hjrussell.com; bsharpe@hjrussell.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "CHS (Charleston), ATL (Atlanta), CKV (Clarksville)"
    },
    {
        "name": "HITT Contracting, Inc",
        "contactName": "Evan Antonides; Steve Schoenefeldt; Kim Roy; Spencer Allin; Connor Toomey",
        "contactEmail": "eantonides@hitt-gc.com; sschoenefeldt@hitt-gc.com; sallin@hitt-gc.com; ctoomey@hitt-gc.com; SAllin@hitt-gc.com; CToomey@hitt-gc.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "LAX (Los Angeles), ATL (Atlanta), CLT (Charlotte), DFW (Dallas), IAD (Washington, D.C.)"
    },
    {
        "name": "Holder Construction Group, LLC",
        "contactName": "William Turpin; Shaun Haycock; Kim Spence; Rob Elias; Jason Bell",
        "contactEmail": "bturpin@holder.com; shaycock@holder.com; kspence@holder.com; relias@holder.com; jbell@holder.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "ATL (Atlanta), CLT (Charlotte), CMH (Columbus), DFW (Dallas), PHX (Phoenix), LAX (Los Angeles)"
    },
    {
        "name": "Holt Brothers Construction, LLC",
        "contactName": "Jeff Beam; Terrence Holt; Torry Holt; Yaswanthi Kothapalli",
        "contactEmail": "jbeam@holtbrothersinc.com; terrence@holtbrothersinc.com; torry@holtbrothersinc.com; ykothapalli@holtbrothersinc.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "CHS (Charleston), LNR (Lenior)"
    },
    {
        "name": "IES Communications, LLC",
        "contactName": "Matthew Allen; John Seli; Becky Fisher; Jeff Carney; Richard Cho; Sarah Brouillette; Willam Schoeb; Kirsten Aydt; Brian Pezzillo",
        "contactEmail": "Matt.Allen@iescomm.com; John.Seli@iescomm.com; Becky.Fisher@iescomm.com; Jeff.Carney@iescomm.com; Richard.Cho@iescomm.com; Sarah.Brouillette@iescomm.com; william.schoeb@iescomm.com; kirsten.aydt@iescomm.com; brian.pezzillo@iescomm.com",
        "contactPhone": "(555) 123-4567",
        "type": "NICON",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "PHX (Phoenix), LAX (Los Angeles), ATL (Atlanta), CID (Cedar Rapids), DFW (Dallas), IAD (Washington, D.C.), SLC (Salt Lake City)"
    },
    {
        "name": "Infrastructure Professional Services and Equipment, LLC",
        "contactName": "Jeffrey Farlow; Armita Ghalandar; Christina Griggs; Troy Bowen",
        "contactEmail": "jeff.farlow@infrapros.net; armita.ghalandar@infrapros.net; christina.griggs@infrapros.net; troy.bowen@infrapros.net",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical / Mechanical",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TBD"
    },
    {
        "name": "Inglett & Stubbs, LLC",
        "contactName": "Elyse Mcdowell; Holly Wilson; Gael Pirlot; Greg Turner",
        "contactEmail": "emcdowell@inglett-stubbs.com; hwilson@inglett-stubbs.com; gpirlot@inglett-stubbs.com; gturner@inglett-stubbs.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "ATL (Atlanta)"
    },
    {
        "name": "J.E. Dunn Construction Group, Inc.",
        "contactName": "Chris Teddy; Joseph Schultz; Erica Froelich",
        "contactEmail": "chris.teddy@jedunn.com; joseph.schultz@jedunn.com; erica.froelich@jedunn.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "MCI (Kansas City), ATL (Atlanta), DFW (Dallas), CLT (Charlotte), PHX (Phoenix)"
    },
    {
        "name": "Kenimer & Knox Mechanical, LLC",
        "contactName": "Bill Kenimer; Tanya Kenimer; Tommy McChargue",
        "contactEmail": "bkenimer@kkmech.com; tkenimer@kkmech.com; tmcchargue@kkmech.com",
        "contactPhone": "(555) 123-4567",
        "type": "Mechanical",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "CHS (Charleston)"
    },
    {
        "name": "Kor Building Group",
        "contactName": "Rebecca Fountain; Paul Bressan; Kris Churchfield",
        "contactEmail": "rebecca@korbg.com; paul@korbg.com; kris@korbg.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "PHX (Phoenix), LAS (Las Vegas), RNO (Reno)"
    },
    {
        "name": "Leapley Construction Group of Atlanta, LLC",
        "contactName": "David Goodson; Beau Walker; Mark Cleverly; Michael Mcrae; Meredith Leapley; Alisa Henderson",
        "contactEmail": "dgoodson@leapleyconstruction.com; bwalker@leapleyconstruction.com; mcleverly@leapleyconstruction.com; mmcrae@leapleyconstruction.com; mleapley@leapleyconstruction.com; ahenderson@leapleyconstruction.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "ATL (Atlanta), HSV (Huntsville)"
    },
    {
        "name": "Low Voltage Solutions, Inc.",
        "contactName": "Gary St Cin; Nick Siwak; Tom Bleker; Steve Martin",
        "contactEmail": "gstcin@lvsolutions.com; nsiwak@lvsolutions.com; tbleker@lvsolutions.com; smartin@lvsolutions.com",
        "contactPhone": "(555) 123-4567",
        "type": "NICON",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "BMI (Bloomington)"
    },
    {
        "name": "M. A. Mortenson Company",
        "contactName": "Brian Tobiczyk; Bob Bachmeier; Emily Sherry",
        "contactEmail": "bob.bachmeier@mortenson.com; emily.sherry@mortenson.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "PHX (Phoenix), CID (Cedar Rapids), MSP (Minneapolis), DLS (The Dalles), MCI (Kansas City), DFW (Dallas)"
    },
    {
        "name": "M.C. Dean, Inc.",
        "contactName": "Ahmed Gokturk; Karen Goldbeck; Amanda Johnson; Troy Stuck",
        "contactEmail": "ahmed.gokturk@mcdean.com; Karen.Goldbeck@mcdean.com; amanda.johnson@mcdean.com; Troy.stuck@mcdean.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical",
        "preferredStatus": "Most Preferred",
        "region": "North America",
        "metroSite": "IAD (Washington, D.C.), LAX (Los Angeles), DLS (The Dalles), SLC (Salt Lake City), DFW (Dallas), ATL (Atlanta)"
    },
    {
        "name": "Manhattan Construction Company",
        "contactName": "Ryan Haynie; Ronnie Wood; Greg McClure; Davis Barksdale",
        "contactEmail": "rhaynie@manhattanconstruction.com; rawood@manhattanconstruction.com; GMcClure@manhattanconstruction.com; Dbarksdale@manhattanconstruction.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "West (Central)",
        "metroSite": "TUL (Pryor)"
    },
    {
        "name": "McFarland Building Group, LLC",
        "contactName": "Michelle Smith; Becki Wilson; Ben Wilhelm; Gene Harris",
        "contactEmail": "msmith@mcco-us.com; bwilson@mcco-us.com; bwilhelm@mcco-us.com; gharris@mcco-us.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "LNR (Lenior)"
    },
    {
        "name": "McKenney's, Inc.",
        "contactName": "Steve Smith; Matt Stroer; Valerie Vanantwerp; Timothy Smith",
        "contactEmail": "steve.r.smith@mckenneys.com; matt.stroer@mckenneys.com; valerie.vanantwerp@mckenneys.com; timothy.smith@mckenneys.com",
        "contactPhone": "(555) 123-4567",
        "type": "Mechanical",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "ATL (Atlanta), CLT (Charlotte)"
    },
    {
        "name": "Miller Electric Company [MECOJAX]",
        "contactName": "Kevin Hebert; Derek Elmo; Helga Oliver; Donnie Smith; Nadene Young; Craig Langfeldt",
        "contactEmail": "nhebert@mecojax.com; delmo@mecojax.com; holiver@mecojax.com; dsmith@mecojax.com; nyoung@mecojax.com; craigl@millerelect.com; byarber@mecojax.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "ATL (Atlanta), CLT (Charlotte), DFW (Dallas), IAD (Washington, D.C.)"
    },
    {
        "name": "Miller Electric Company [Omaha]",
        "contactName": "Craig Langfeldt; Tim Tanner; Roger Ferris",
        "contactEmail": "craigl@millerelect.com; tim.tanner@millerelect.com; roger.ferris@millerelect.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical",
        "preferredStatus": "Most Preferred",
        "region": "West (Central)",
        "metroSite": "OMA (Omaha)"
    },
    {
        "name": "MMC Mechanical Contractors, Inc",
        "contactName": "Tom Benassi; Jack Duren; Andrew Thompson; Dennis Eden",
        "contactEmail": "tbenassi@mmccontractors.com; jduren@mmccontractors.com; athompson@mmccontractors.com; deden@mmccontractors.com",
        "contactPhone": "(555) 123-4567",
        "type": "Mechanical",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "CMH (Columbus)"
    },
    {
        "name": "OEG, Inc",
        "contactName": "Alex Maia; Sean Cox; Tom Bergmann; Danny Robinson",
        "contactEmail": "alex.maia@oeg.us.com; sean.cox@oeg.us.com; tom.bergmann@oeg.us.com; danny.robinson@oeg.us.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical / NICON",
        "preferredStatus": "Most Preferred",
        "region": "West",
        "metroSite": "DLS (The Dalles)"
    },
    {
        "name": "Oklahoma Electrical Supply Company",
        "contactName": "Bill Cooper; Rick Brasher; Robert Cook; William Hill; Roger Calvert; Steve Maloney [Tulsa]; Becky Barney [Oklahoma]",
        "contactEmail": "bcooper@oesco.com; ebrashear@oesco.com; rcook@oesco.com; bhill@oesco.com; calvert@oesco.com; smaloney@oesco.com; RBarney@oesco.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical / NICON",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TUL (Tulsa), SWO (Stillwater), LNK (Lincoln)"
    },
    {
        "name": "P & C Construction, Inc.",
        "contactName": "Royce Cornelison; Stacie Cooper; Nic Cornelison; Jordan Cornelison",
        "contactEmail": "royce@pc-const.com; stacie@pc-const.com; nic@pc-const.com; jordan@pc-const.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "HSV (Huntsville), BMI (Bloomington), CKV (Clarksville), ATL (Atlanta), CLT (Charlotte), DFW (Dallas)"
    },
    {
        "name": "P1 Group",
        "contactName": "Daniel Farnan; Danny Rickman; Dan Gibson; Dan Osborne",
        "contactEmail": "daniel.farnan@p1group.com; danny.rickman@p1group.com; dan.gibson@p1group.com; dan.osborne@p1group.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "LAS (Las Vegas), MCI (Kansas City)"
    },
    {
        "name": "Palmetto Tri-Venture",
        "contactName": "Corey Ketchum; Todd Pressley; Bill Johnson; Jeremy Southerland",
        "contactEmail": "CKetchum@tcco.com; TPressley@ujamaaconstruction.com; johnsonb@twc-stl.com; jsoutherland@tcco.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "CMH (Columbus), CHS (Charleston), DFW (Dallas), CID (Cedar Rapids), DLS (The Dalles), CLT (Charlotte)"
    },
    {
        "name": "Patterson & Dewar Engineers, Inc.",
        "contactName": "John McCullen; James Rains; Larry Kincer; Jim Gelsomini",
        "contactEmail": "johnmccullen@hoodpd.com; jrains@pdengineers.com; lkincer@pdengineers.com; jgelsomini@pdengineers.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical / Professional Services",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "ATL (Atlanta), PHX (Phoenix), CKV (Clarksville), DFW (Dallas), RIC (Richmond)"
    },
    {
        "name": "R. Lafferty & Son Industrial And Commercial Contractors, LLC",
        "contactName": "Hunter Schmitton; William B Bryant",
        "contactEmail": "hunter@laffertyandson.com; bbryant@laffertyandson.com; laffertygc@laffertyandson.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "Southland Industries",
        "contactName": "Timothy Michael; Jose Felsmann; Michael Starego; Jeremiah Newens",
        "contactEmail": "tmichael@southlandind.com; jfelsmann@southlandind.com; mstarego@southlandind.com; jnewens@southlandind.com",
        "contactPhone": "(555) 123-4567",
        "type": "Mechanical",
        "preferredStatus": "Most Preferred",
        "region": "West (Central)",
        "metroSite": "DFW (Dallas), MEM (Memphis)"
    },
    {
        "name": "Suffolk Construction Company, Inc",
        "contactName": "Darin S Hart; Michael Mallon",
        "contactEmail": "Dhart@suffolk.com; MMallon@suffolk.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "DLS (The Dalles), DFW (Dallas), LAX (Los Angeles), IAD (Washington, D.C.)"
    },
    {
        "name": "Superior Fiber & Data Services, Inc.",
        "contactName": "Randy Fuller; Tommy Osborne; Jeff Macfee",
        "contactEmail": "rfuller@sfdcabling.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical / NICON",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "DFW (Dallas), HOU (Houston), AUS (Austin)"
    },
    {
        "name": "T5 Data Centers LLC",
        "contactName": "Adam Board; Benjamin Hilderbrand; David Gruber; David Mettler; Brian Pate",
        "contactEmail": "aboard@t5datacenters.com; bhilderbrand@t5datacenters.com; dgruber@t5datacenters.com; dmettler@t5datacenters.com; bpate@t5datacenters.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "ATL (Atlanta), BMI (Bloomington), CLT (Charlotte), LAX (Los Angeles), MSP (Minneapolis), DLS (The Dalles)"
    },
    {
        "name": "Teel Construction",
        "contactName": "Bryce Teel; Robert Tucker; Nick Davis; Adam Turner",
        "contactEmail": "bteel@teelconstruction.com; rtucker@teelconstruction.com; ndavis@teelconstruction.com; aturner@teelconstruction.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "LAX (Los Angeles), IAD (Washington, D.C.)"
    },
    {
        "name": "Teklus Construction, LLC",
        "contactName": "Shu Nomura; Chris Hood; Nathan Weber; Joel McGraw",
        "contactEmail": "shu.nomura@teklus.com; chris.hood@teklus.com; nathan.weber@teklus.com; joel.mcgraw@teklus.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "LAS (Las Vegas), RNO (Reno), LAX (Los Angeles), MCI (Kansas City)"
    },
    {
        "name": "The Poole and Kent Corporation",
        "contactName": "Donald Lynott; Jake Medina; Brian Touchard; Daniel Bock; Adam Snavely",
        "contactEmail": "dlynott@emcor.net / dlynott@pkcorp.com; jmedina@emcor.net / jmedina@pkcorp.com; btouchard@emcor.net / btouchard@pkcorp.com; dbock@pkcorp.com; asnavely@emcor.net",
        "contactPhone": "(555) 123-4567",
        "type": "Mechanical",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "CMH (Columbus), IAD (Washington, D.C.), RIC (Richmond)"
    },
    {
        "name": "The Whiting-Turner Contracting Company",
        "contactName": "Jonathan Hess; Brent Voyles; Kendall Martin; Adam Eshelbrenner",
        "contactEmail": "Jonathan.Hess@whiting-turner.com; Brent.Voyles@whiting-turner.com; kendall.martin@whiting-turner.com; adam.eshelbrenner@whiting-turner.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "West (Central)",
        "metroSite": "OMA (Omaha)"
    },
    {
        "name": "TM Source Building Group, Inc.",
        "contactName": "Trelaine M. Mapp; Laurie Smithson Butler; Martin Barron",
        "contactEmail": "tmapp@sourcebuild.net; lsmithson@sourcebuild.net; mbarron@sourcebuild.net",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "DFW (Dallas), HOU (Houston), AUS (Austin)"
    },
    {
        "name": "Turner Construction Company Inc",
        "contactName": "Corey Ketchum; Dan Fine",
        "contactEmail": "CKetchum@tcco.com; dmfine@tcco.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "CMH (Columbus)"
    },
    {
        "name": "TW Constructors, LLC",
        "contactName": "Todd Weaver; Bill Johnson; Nick Gittemeier; Bill Begis; Todd Nelson",
        "contactEmail": "weavert@twc-stl.com; Johnsonb@twc-stl.com; begisb@twc-stl.com; nelsont@twc-stl.com; gittemeiern@twc-stl.com; johnsonb@twc-stl.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "CMH (Columbus)"
    },
    {
        "name": "U.S. Engineering Innovations, LLC",
        "contactName": "Vincent Michael Pianalto; Bryan Taylor; Justin Apprill; Jarrod Foster; Jeff Kiblen; Adam Provost; Richard Green",
        "contactEmail": "vince.pianalto@usengineering.com; Bryan.Taylor@usengineering.com; Justin.Apprill@useinnovations.com; Jarrod.foster@useinnovations.com; jeff.kiblen@useinnovations.com; adam.provost@useinnovations.com; richard.green@usengineering.com",
        "contactPhone": "(555) 123-4567",
        "type": "Mechanical",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "MCI (Kansas City), CKV (Clarksville), TUL (Tulsa)"
    },
    {
        "name": "Ujamaa Construction Inc.",
        "contactName": "Todd O. Pressley; Justin Dwaun Redding; Kevin P. Waco",
        "contactEmail": "TPressley@ujamaaconstruction.com; jredding@ujamaaconstruction.com; kwaco@ujamaaconstruction.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "BMI (Bloomington), CHS (Charleston), CKV (Clarksville), ATL (Atlanta), LAS (Las Vegas), DLS (The Dalles)"
    },
    {
        "name": "Vertiv Corporation",
        "contactName": "Omar Mckee; Samir Mehta; Simon Killen; Mark Asgarian; Dave Rubcich; Mike Zapata",
        "contactEmail": "omar.mckee@emerson.com; samir.mehta@vertiv.com; simon.killen@vertiv.com; mark.asgarian@vertiv.com; dave.rubcich@vertiv.com; mike.zapata@vertiv.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "CMH (Columbus), HSV (Huntsville)"
    },
    {
        "name": "Viking Engineering and Construction, LLC",
        "contactName": "Cecil DelaCruz; Jeffrey Payson; Drew Schaefer; Serge Bachinsky; Zach Hunt; Noah Johnson",
        "contactEmail": "cecil@vikingec.com; jpayson@vikingec.com; drew@vikingec.com; serge@vikingec.com; zach@vikingec.com; noah@vikingec.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Most Preferred",
        "region": "West",
        "metroSite": "DLS (The Dalles)"
    },
    {
        "name": "Vision Technologies, LLC",
        "contactName": "Kevin Nolan; Yaser Ali; Peter Cava; Jon Lyman; Jennifer Spees; S. Michael Quade",
        "contactEmail": "knolan@visiontech.biz; yali@visiontech.biz; pcava@visiontech.biz; jlyman@visiontech.biz; jspees@visiontech.biz; mquade@visiontech.biz",
        "contactPhone": "(555) 123-4567",
        "type": "NICON",
        "preferredStatus": "Most Preferred",
        "region": "East",
        "metroSite": "CHS (Charleston), CMH (Columbus), NOVA (Northern Virginia)"
    },
    {
        "name": "W. G. Yates & Sons Construction Company",
        "contactName": "Barry Scearce; Nick McIlwain; Jennifer Mountjoy",
        "contactEmail": "bscearce@wgyates.com; nmcilwain@wgyates.com; jmountjoy@wgyates.com; chetnadolski@wgyates.com; piden@wgyates.com",
        "contactPhone": "(555) 123-4567",
        "type": "General Contractor",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "HSV (Huntsville), MEM (Memphis), DFW (Dallas), ATL (Atlanta), LAX (Los Angeles)"
    },
    {
        "name": "Walker Engineering, Inc.",
        "contactName": "Randy Randolph; Eric Lugger; Justin Davis; Raymond Fischer",
        "contactEmail": "rrandolph@walkertx.com; elugger@walkertx.com; jrdavis@walkertx.com; rfischer@walkertx.com",
        "contactPhone": "(555) 123-4567",
        "type": "Electrical",
        "preferredStatus": "Most Preferred",
        "region": "West",
        "metroSite": "DFW (Dallas)"
    },
    {
        "name": "Wycliffe Trinity, LLC",
        "contactName": "Anthony Reichel; Kristen Askin; Sam Metta",
        "contactEmail": "tonyr@trinitygc.us; KristenA@TRINITYgc.us; SamM@TRINITYgc.us",
        "contactPhone": "(555) 123-4567",
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
    metroCode: 'OMA',
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
