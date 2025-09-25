import { collection, writeBatch, getDocs, Firestore } from 'firebase/firestore';
import { metroCodes } from './data';

const newContractorsData = [
    {
        "name": "Ascension Construction Solutions LLC",
        "contactName": "Jeanna Hondel; Michael Hondel",
        "contactEmail": "jhondel@ascension-cs.com; mhondel@ascension-cs.com",
        "type": "General Contractor",
        "hqAddress": "4200 Regent St Ste 200, Columbus, OH 43219",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Preferred",
        "region": "East",
        "metroSite": "CMH (Columbus)"
    },
    {
        "name": "Bremik Construction",
        "contactName": "Brent Parry; Vijay Daniel; Trang Pham",
        "contactEmail": "bp@bremik.com; vdaniel@bremik.com; tpham@bremik.com",
        "type": "General Contractor",
        "hqAddress": "1026 SE Stark St, Portland, OR 97214",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TBD"
    },
    {
        "name": "Century Contractors, Inc.",
        "contactName": "Howard Smith; Johnny Dotson; Jim Kick",
        "contactEmail": "hsmith@centurycontractors.com; jdotson@centurycontractors.com; jkick@centurycontractors.com",
        "type": "General Contractor",
        "hqAddress": "5100 Smith Farm Rd, Matthews, NC 28104",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "Custom Computer Cable, Inc.",
        "contactName": "Michael Evans; Jeff Watson",
        "contactEmail": "Mevans@cccincorp.com; jwatson@cccincorp.com",
        "type": "Electrical / NICON",
        "hqAddress": "43766 Trade Center Place, Ste 100, Dulles, VA 20166",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "Direct Line Global LLC",
        "contactName": "Jennifer Yniesta; Nathan Wood; Bret Kammersgard",
        "contactEmail": "jennifer.yniesta@dlcomm.com; nathan.wood@dlcomm.com; bkammersgard@dlcomm.com",
        "type": "NICON",
        "hqAddress": "3839 Spinnaker Ct, Fremont, CA 94538",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "Fisk Electric Company",
        "contactName": "Cory Borchardt; Anthony Sant; Lenny Seibert; Greg Thomas",
        "contactEmail": "cborchardt@fiskcorp.com; asant@fiskcorp.com; lseibert@fiskcorp.com; gthomas@fiskcorp.com",
        "type": "Electrical / NICON",
        "hqAddress": "10855 Westview Dr, Houston, TX 77043",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "Fortis Construction, Inc",
        "contactName": "Greg Wimmer; Chris Warner; Dan Boel (STY); Joe Vlasteelicia (STY); David Curry (PRY); Joe Bowen (PRY)",
        "contactEmail": "greg.wimmer@fortisconstruction.com; Chris.warner@fortisconstruction.com; dan.boel@fortisconstruction; joe.vlasteelicia@fortisconstruction; david.curry@fortisconstruction; joe.bowen@fortisconstruction.com",
        "type": "General Contractor",
        "hqAddress": "5331 S Macadam Ave, Ste 100, Portland, OR 97239",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Preferred",
        "region": "West",
        "metroSite": "TBD"
    },
    {
        "name": "Fulcrum Reliability Systems, Inc.",
        "contactName": "Jimmie Bailey; Andrew Bohm",
        "contactEmail": "jimmie.bailey@fulcrumdcs.com; andrew.bohm@fulcrumdcs.com",
        "type": "Electrical",
        "hqAddress": "405 Main Street, Houston, TX 77002",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Most Preferred",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "GBA Builders, LLC.",
        "contactName": "Graham Jones; Joseph Alvarez; Kyle Quigley",
        "contactEmail": "gjones@gbabuilders.com; jalvarez@gbabuilders.com; kquigley@gbabuilders.com",
        "type": "General Contractor",
        "hqAddress": "9801 Renner Blvd Ste 300, Lenexa, KS 66219",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TBD"
    },
    {
        "name": "Gilbane Building Company",
        "contactName": "Larry Mast; Daniel Baima",
        "contactEmail": "LMastella@gilbaneco.com; DBaima@gilbaneco.com",
        "type": "General Contractor",
        "hqAddress": "7 Jackson Walkway, Providence, RI 02903-3694",
        "nda": "Yes",
        "gval": "Pre-Qualified",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "Grade A Construction, LLC",
        "contactName": "Rachelle Reigard; John Hayman; Mike Roberts",
        "contactEmail": "rachelle.reigard@gradeaservices.com; john.hayman@gradeaservices.com; mike.roberts@gradeaservices.com",
        "type": "General Contractor",
        "hqAddress": "636 Jennings Pond Rd, Lebanon, TN 37090",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "HITT Contracting, Inc",
        "contactName": "Evan Antonides; Steve Schoenefeldt; Kim Roy; Spencer Allin; Connor Toomey",
        "contactEmail": "eantonides@hitt-gc.com; sschoenefeldt@hitt-gc.com; sallin@hitt-gc.com; ctoomey@hitt-gc.com",
        "type": "General Contractor",
        "hqAddress": "2900 Fairview Park Dr, Falls Church, VA 22042",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "Holder Construction Group, LLC",
        "contactName": "William Turpin; Shaun Haycock; Kim Spence; Rob Elias; Jason Bell",
        "contactEmail": "bturpin@holder.com; shaycock@holder.com; kspence@holder.com; relias@holder.com; jbell@holder.com",
        "type": "General Contractor",
        "hqAddress": "3333 Riverwood Pkwy Ste 400, Atlanta, GA 30339",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "IES Communications, LLC",
        "contactName": "Matthew Allen; John Seli; Becky Fisher; Jeff Carney; Richard Cho; Sarah Brouillette; Willam Schoeb; Kirsten Aydt; Brian Pezzillo",
        "contactEmail": "Matt.Allen@iescomm.com; John.Seli@iescomm.com; Becky.Fisher@iescomm.com; Jeff.Carney@iescomm.com; Richard.Cho@iescomm.com; Sarah.Brouillette@iescomm.com; william.schoeb@iescomm.com; kirsten.aydt@iescomm.com; brian.pezzillo@iescomm.com",
        "type": "NICON",
        "hqAddress": "2801 S Fair Ln, Tempe, AZ 85282",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "Infrastructure Professional Services and Equipment, LLC",
        "contactName": "Jeffrey Farlow; Armita Ghalandar; Christina Griggs; Troy Bowen",
        "contactEmail": "jeff.farlow@infrapros.net; armita.ghalandar@infrapros.net; christina.griggs@infrapros.net; troy.bowen@infrapros.net",
        "type": "Electrical / Mechanical",
        "hqAddress": "5621 Production Ct, Greensboro, NC 27409-9475",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TBD"
    },
    {
        "name": "Inglett & Stubbs, LLC",
        "contactName": "Elyse Mcdowell; Holly Wilson; Gael Pirlot; Greg Turner",
        "contactEmail": "emcdowell@inglett-stubbs.com; hwilson@inglett-stubbs.com; gpirlot@inglett-stubbs.com; gturner@inglett-stubbs.com",
        "type": "Electrical",
        "hqAddress": "5200 Riverview Rd SE, Atlanta, GA 30339",
        "nda": "Yes",
        "gval": "Not Listed",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "J.E. Dunn Construction Group, Inc.",
        "contactName": "Chris Teddy; Joseph Schultz; Erica Froelich",
        "contactEmail": "chris.teddy@jedunn.com; joseph.schultz@jedunn.com; erica.froelich@jedunn.com",
        "type": "General Contractor",
        "hqAddress": "1001 Locust St, Kansas City, MO 64106",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "Kor Building Group",
        "contactName": "Rebecca Fountain; Paul Bressan; Kris Churchfield",
        "contactEmail": "rebecca@korbg.com; paul@korbg.com; kris@korbg.com",
        "type": "General Contractor",
        "hqAddress": "2670 Chandler Ave Ste 10, Las Vegas, NV 89120-4084",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TBD"
    },
    {
        "name": "M. A. Mortenson Company",
        "contactName": "Brian Tobiczyk; Bob Bachmeier; Emily Sherry",
        "contactEmail": "bob.bachmeier@mortenson.com; emily.sherry@mortenson.com",
        "type": "General Contractor",
        "hqAddress": "700 Meadow Lane North, Hennepin County, MN 55422, Golden Valley",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "M.C. Dean, Inc.",
        "contactName": "Ahmed Gokturk; Karen Goldbeck; Amanda Johnson; Troy Stuck",
        "contactEmail": "ahmed.gokturk@mcdean.com; Karen.Goldbeck@mcdean.com; amanda.johnson@mcdean.com; Troy.stuck@mcdean.com",
        "type": "Electrical",
        "hqAddress": "1765 Greensboro Station Place, Tysons, VA 22102",
        "nda": "Yes",
        "gval": "Not Onboarded",
        "preferredStatus": "Most Preferred",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "McKenney's, Inc.",
        "contactName": "Steve Smith; Matt Stroer; Valerie Vanantwerp; Timothy Smith",
        "contactEmail": "steve.r.smith@mckenneys.com; matt.stroer@mckenneys.com; valerie.vanantwerp@mckenneys.com; timothy.smith@mckenneys.com",
        "type": "Mechanical",
        "hqAddress": "1056 Moreland Industrial Blvd SE, Atlanta, GA 30316",
        "nda": "5+ years - Information requested",
        "gval": "Not Listed",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "P & C Construction, Inc.",
        "contactName": "Royce Cornelison; Stacie Cooper; Nic Cornelison; Jordan Cornelison",
        "contactEmail": "royce@pc-const.com; stacie@pc-const.com; nic@pc-const.com; jordan@pc-const.com",
        "type": "General Contractor",
        "hqAddress": "1037 W Main St, Chattanooga, TN 37402",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "P1 Group",
        "contactName": "Daniel Farnan; Danny Rickman; Dan Gibson; Dan Osborne",
        "contactEmail": "daniel.farnan@p1group.com; danny.rickman@p1group.com; dan.gibson@p1group.com; dan.osborne@p1group.com",
        "type": "General Contractor",
        "hqAddress": "13605 W 96Th Ter, Ste 200, Lenexa, Kansas, 66215-1253",
        "nda": "Yes",
        "gval": "Not Listed",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TBD"
    },
    {
        "name": "Palmetto Tri-Venture",
        "contactName": "Corey Ketchum; Todd Pressley; Bill Johnson; Jeremy Southerland",
        "contactEmail": "CKetchum@tcco.com; TPressley@ujamaaconstruction.com; johnsonb@twc-stl.com; jsoutherland@tcco.com",
        "type": "General Contractor",
        "hqAddress": "Charlotte, NC, EE. UU.",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "Patterson & Dewar Engineers, Inc.",
        "contactName": "John McCullen; James Rains; Larry Kincer; Jim Gelsomini",
        "contactEmail": "johnmccullen@hoodpd.com; jrains@pdengineers.com; lkincer@pdengineers.com; jgelsomini@pdengineers.com",
        "type": "Electrical / Professional Services",
        "hqAddress": "850 Center Way, Norcross, GA 30071",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "The Poole and Kent Corporation",
        "contactName": "Donald Lynott; Jake Medina; Brian Touchard; Daniel Bock; Adam Snavely",
        "contactEmail": "dlynott@emcor.net; dlynott@pkcorp.com; jmedina@emcor.net; jmedina@pkcorp.com; btouchard@emcor.net; btouchard@pkcorp.com; dbock@pkcorp.com; asnavely@emcor.net",
        "type": "Mechanical",
        "hqAddress": "4530 Hollins Ferry Rd, Baltimore, MD 21227",
        "nda": "5+ years - Information requested",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "R. Lafferty & Son Industrial And Commercial Contractors, LLC",
        "contactName": "Hunter Schmitton; William B Bryant",
        "contactEmail": "hunter@laffertyandson.com; bbryant@laffertyandson.com; laffertygc@laffertyandson.com",
        "type": "General Contractor",
        "hqAddress": "1778 Wilma Rudolph Blvd, Clarksville, TN 37040",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "Superior Fiber & Data Services, Inc.",
        "contactName": "Randy Fuller; Tommy Osborne; Jeff Macfee",
        "contactEmail": "rfuller@sfdcabling.com",
        "type": "Electrical / NICON",
        "hqAddress": "1711 Briercroft Court Suite 154, Carrollton, TX 75006",
        "nda": "Yes",
        "gval": "Not Listed",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "T5 Data Centers LLC",
        "contactName": "Adam Board; Benjamin Hilderbrand; David Gruber; David Mettler; Brian Pate",
        "contactEmail": "aboard@t5datacenters.com; bhilderbrand@t5datacenters.com; dgruber@t5datacenters.com; dmettler@t5datacenters.com; bpate@t5datacenters.com",
        "type": "General Contractor",
        "hqAddress": "3344 Peachtree Rd, N.E., Ste 2550, Atlanta, GA 30326",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Preferred",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "Teklus Construction, LLC",
        "contactName": "Shu Nomura; Chris Hood; Nathan Weber; Joel McGraw",
        "contactEmail": "shu.nomura@teklus.com; chris.hood@teklus.com; nathan.weber@teklus.com; joel.mcgraw@teklus.com",
        "type": "General Contractor",
        "hqAddress": "3855 Warren Way Ste B, Reno, NV 89509",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TBD"
    },
    {
        "name": "TM Source Building Group, Inc.",
        "contactName": "Trelaine M. Mapp; Laurie Smithson Butler; Martin Barron",
        "contactEmail": "tmapp@sourcebuild.net; lsmithson@sourcebuild.net; mbarron@sourcebuild.net",
        "type": "General Contractor",
        "hqAddress": "5601 Bridge St Ste 230, Fort Worth, TX 76112",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TBD"
    },
    {
        "name": "Ujamaa Construction Inc.",
        "contactName": "Todd O. Pressley; Justin Dwaun Redding; Kevin P. Waco",
        "contactEmail": "TPressley@ujamaaconstruction.com; jredding@ujamaaconstruction.com; kwaco@ujamaaconstruction.com",
        "type": "General Contractor",
        "hqAddress": "7744 S Stony Island Ave, Chicago, IL 60649",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "U.S. Engineering Innovations, LLC",
        "contactName": "Vincent Michael Pianalto; Bryan Taylor; Justin Apprill; Jarrod Foster; Jeff Kiblen; Adam Provost; Richard Green",
        "contactEmail": "vince.pianalto@usengineering.com; Bryan.Taylor@usengineering.com; Justin.Apprill@useinnovations.com; Jarrod.foster@useinnovations.com; jeff.kiblen@useinnovations.com; adam.provost@useinnovations.com; richard.green@usengineering.com",
        "type": "Mechanical",
        "hqAddress": "3433 Roanoke Rd, Kansas City, MO 64111-3778",
        "nda": "5+ years - Information requested",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TBD"
    },
    {
        "name": "Vertiv Corporation",
        "contactName": "Omar Mckee; Samir Mehta; Simon Killen; Mark Asgarian; Dave Rubcich; Mike Zapata",
        "contactEmail": "omar.mckee@emerson.com; samir.mehta@vertiv.com; simon.killen@vertiv.com; mark.asgarian@vertiv.com; dave.rubcich@vertiv.com; mike.zapata@vertiv.com",
        "type": "Electrical",
        "hqAddress": "505 N Cleveland Ave, Westerville, OH 43082",
        "nda": "Yes",
        "gval": "Not Listed",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TBD"
    },
    {
        "name": "W. G. Yates & Sons Construction Company",
        "contactName": "Barry Scearce; Nick McIlwain; Jennifer Mountjoy",
        "contactEmail": "bscearce@wgyates.com; nmcilwain@wgyates.com; jmountjoy@wgyates.com; chetnadolski@wgyates.com; piden@wgyates.com",
        "type": "General Contractor",
        "hqAddress": "104 Gully Ave, Philadelphia, MS 39350-2730",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TBD"
    },
    {
        "name": "Wycliffe Trinity, LLC",
        "contactName": "Anthony Reichel; Kristen Askin; Sam Metta",
        "contactEmail": "tonyr@trinitygc.us; KristenA@TRINITYgc.us; SamM@TRINITYgc.us",
        "type": "General Contractor",
        "hqAddress": "4501 Forbes Blvd Ste H, Lanham, MD 20706",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "ABB Inc",
        "contactName": "Ted Ioannou; Edgard Rodriguez; Elina Hermunen",
        "contactEmail": "ted.ioannou@us.abb.com; edgard.rodriguez@us.abb.com; elina.hermunen@abb.com",
        "type": "Electrical",
        "hqAddress": "high Tech Executive Program Manager Project Director",
        "nda": "Yes",
        "gval": "Not Listed",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "Brandt Mechanical Services",
        "contactName": "Michael Kimmell; Enoch Paris; Josh Sperling",
        "contactEmail": "michael.kimmell@brandt.us; enoch.paris@brandt.us; josh.sperling@brandt.us",
        "type": "Mechanical",
        "hqAddress": "1728 Briercroft Court, Carrollton, Texas 75006",
        "nda": "Yes",
        "gval": "Not Listed",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TBD"
    },
    {
        "name": "Cache Valley Electric Company",
        "contactName": "Jim Laub; Michael Petric; Jammie Greer; Randi Burton",
        "contactEmail": "jim.laub@cve.com; michael.petric@cve.com; jammie.greer@cve.com; businessdevelopment@cve.com",
        "type": "Electrical / NICON",
        "hqAddress": "875 N 1000 W, Logan, Utah, 84321-7800",
        "nda": "5+ years - Information requested",
        "gval": "Not Listed",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "Caddell Construction Co., Inc.",
        "contactName": "Zach Moore; Scott Thompson; Ricky Byrd",
        "contactEmail": "Zach.Moore@caddell.com; Scott.Thompson@caddell.com; Ricky.Byrd@caddell.com",
        "type": "General Contractor",
        "hqAddress": "445 Dexter Ave Ste 11000, Montgomery, Alabama, 36104-3775",
        "nda": "Yes",
        "gval": "Not Listed, Need to Submit for Gval",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "CPG Beyond",
        "contactName": "Chad Towner; Keith Lambert",
        "contactEmail": "chad.towner@cpgbeyond.com",
        "type": "Electrical / Professional Services",
        "hqAddress": "19775 Belmont Executive Plz, Ashburn, Virginia, 20147-7600",
        "nda": "Yes",
        "gval": "Not Listed, Need to Submit for Gval",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "DPR Construction, Inc",
        "contactName": "Luke Stocking; Damien McCants; Felix Cole; Kevin Burch; Brett Korn; Scott Hibbard; Chuck Rosenthal",
        "contactEmail": "lukes@dpr.com; DamienM@dpr.com; felixc@dpr.com; kevinb@dpr.com; brettk@dpr.com; Scotthi@dpr.com; chuckr@dpr.com",
        "type": "General Contractor",
        "hqAddress": "1450 Veterans Blvd, Redwood City, CA 94063",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "Dwatts Construction LLC",
        "contactName": "Jeremiah Watts; Maricar Buot; David Doherty",
        "contactEmail": "JWatts@dwatts.com; mbuot@dwatts.com; DDoherty@dwatts.com",
        "type": "General Contractor",
        "hqAddress": "4875 Eisenhower Ave Ste 250, Alexandria, Virginia, 22304-4850",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "Dynalectric Company",
        "contactName": "Bob Wagner; KaHee Emerson",
        "contactEmail": "bwagner@dyna-oregon.com; kemerson@dyna-oregon.com",
        "type": "Electrical / NICON",
        "hqAddress": "22930 Shaw Rd Ste 100, Dulles, Virginia, 20166-9448",
        "nda": "5+ years - Information requested",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "Environmental Air Systems, LLC",
        "contactName": "Charles Dick; Frank Stewart; Johnny Moorefield; Bill Bullock",
        "contactEmail": "cdick@easinc.net; fstefanick@easinc.net; jmoorefield@etrol.net; bbullock@easinc.net",
        "type": "Mechanical",
        "hqAddress": "250 Swathmore Avenue, High Point, NC 27263",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "Leapley Construction Group of Atlanta, LLC",
        "contactName": "David Goodson; Beau Walker; Mark Cleverly; Michael Mcrae; Meredith Leapley; Alisa Henderson",
        "contactEmail": "dgoodson@leapleyconstruction.com; bwalker@leapleyconstruction.com; mcleverly@leapleyconstruction.com; mmcrae@leapleyconstruction.com; mleapley@leapleyconstruction.com; ahenderson@leapleyconstruction.com",
        "type": "General Contractor",
        "hqAddress": "180 Interstate N Pkwy E SE ste 140, Atlanta, GA 30339",
        "nda": "Yes",
        "gval": "Not Listed",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "Low Voltage Solutions, Inc.",
        "contactName": "Gary St Cin; Nick Siwak; Tom Bleker; Steve Martin",
        "contactEmail": "gstcin@lvsolutions.com; nsiwak@lvsolutions.com; tbleker@lvsolutions.com; smartin@lvsolutions.com",
        "type": "NICON",
        "hqAddress": "20516 Caton Farm Rd, Lockport, Illinois, 60441",
        "nda": "Yes",
        "gval": "Not Listed",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "Miller Electric Company [MECOJAX]",
        "contactName": "Kevin Hebert; Derek Elmo; Helga Oliver; Donnie Smith; Nadene Young; Craig Langfeldt",
        "contactEmail": "nhebert@mecojax.com; delmo@mecojax.com; holiver@mecojax.com; dsmith@mecojax.com; nyoung@mecojax.com; craigl@millerelect.com; byarber@mecojax.com",
        "type": "Electrical",
        "hqAddress": "6805 Southpoint Pkwy, Jacksonville, Florida, 32216-6220",
        "nda": "Yes",
        "gval": "Not Listed",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "Oklahoma Electrical Supply Company",
        "contactName": "Bill Cooper; Rick Brasher; Robert Cook; William Hill; Roger Calvert; Steve Maloney [Tulsa]; Becky Barney [Oklahoma]",
        "contactEmail": "bcooper@oesco.com; ebrashear@oesco.com; rcook@oesco.com; bhill@oesco.com; calvert@oesco.com; smaloney@oesco.com; RBarney@oesco.com",
        "type": "Electrical / NICON",
        "hqAddress": "4901 North Sewell Avenue, Oklahoma City, Oklahoma, 73118-7800",
        "nda": "Yes",
        "gval": "Not Listed",
        "preferredStatus": "Not Evaluated",
        "region": "West",
        "metroSite": "TBD"
    },
    {
        "name": "Suffolk Construction Company, Inc",
        "contactName": "Darin S Hart; Michael Mallon",
        "contactEmail": "Dhart@suffolk.com; MMallon@suffolk.com",
        "type": "General Contractor",
        "hqAddress": "65 Allerton St, Boston, Massachusetts, 02119-2923",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    },
    {
        "name": "Superior Fiber & Data Services, Inc.",
        "contactName": "Randy Fuller; Tommy Osborne; Jeff Macfee",
        "contactEmail": "rfuller@sfdcabling.com",
        "type": "Electrical / NICON",
        "hqAddress": "1711 Briercroft Court Suite 154, Carrollton, TX 75006",
        "nda": "Yes",
        "gval": "Not Listed",
        "preferredStatus": "Not Evaluated",
        "region": "North America",
        "metroSite": "TBD"
    },
    {
        "name": "Teel Construction",
        "contactName": "Bryce Teel; Robert Tucker; Nick Davis; Adam Turner",
        "contactEmail": "bteel@teelconstruction.com; rtucker@teelconstruction.com; ndavis@teelconstruction.com; aturner@teelconstruction.com",
        "type": "General Contractor",
        "hqAddress": "3920 University Dr, Fairfax, Virginia, 22030-2507",
        "nda": "Yes",
        "gval": "Onboarded",
        "preferredStatus": "Not Evaluated",
        "region": "East",
        "metroSite": "TBD"
    }
]

export async function seedContractors(db: Firestore, setStatus: (status: string) => void) {
    const contractorsCollection = collection(db, 'contractors');
    
    try {
        setStatus('Deleting existing contractors...');
        const existingContractors = await getDocs(contractorsCollection);
        const deleteBatch = writeBatch(db);
        existingContractors.forEach(doc => {
            deleteBatch.delete(doc.ref);
        });
        await deleteBatch.commit();
        setStatus('Existing contractors deleted.');

        setStatus(`Seeding ${newContractorsData.length} new contractors...`);
        const addBatch = writeBatch(db);
        
        const allMetroCodes = metroCodes.map(m => m.code);

        newContractorsData.forEach(contractor => {
            const docRef = collection(db, 'contractors').doc();
            
            // Assign some random metro codes
            const numMetroCodes = Math.floor(Math.random() * 3) + 1;
            const contractorMetroCodes = [...new Array(numMetroCodes)].map(() => allMetroCodes[Math.floor(Math.random() * allMetroCodes.length)]);
            
            let preference = 3;
            if (contractor.preferredStatus === 'Most Preferred') preference = 1;
            if (contractor.preferredStatus === 'Preferred') preference = 2;

            addBatch.set(docRef, {
                ...contractor,
                metroCodes: Array.from(new Set(contractorMetroCodes)), // Ensure unique metro codes
                performance: Math.floor(Math.random() * 21) + 80, // 80 to 100
                preference,
            });
        });

        await addBatch.commit();
        setStatus('Seeding complete!');

    } catch (error) {
        console.error("Error seeding contractors: ", error);
        setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
