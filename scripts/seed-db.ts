
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc, getDocs, Timestamp } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { firebaseConfig } from '../src/firebase/config';
import { ContractorsData, MetroCodesData, RFPData as seedRFPData } from '../src/lib/data';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function seedCollection(collectionName: string, data: any[], idField?: string) {
    const collectionRef = collection(db, collectionName);
    
    // Check if collection is empty
    const snapshot = await getDocs(collectionRef);
    if (!snapshot.empty) {
        console.log(`Collection "${collectionName}" already contains data. Skipping seeding.`);
        return;
    }

    console.log(`Seeding "${collectionName}"...`);
    const batch = writeBatch(db);
    let count = 0;

    data.forEach((item, index) => {
        const id = idField ? item[idField] : (item.id || `${collectionName.slice(0, -1)}-${index + 1}`);
        const docRef = doc(db, collectionName, id);
        
        const dataToSet = { ...item };
        if (!idField || !item[idField]) {
          dataToSet.id = id;
        }

        // Convert JS Dates to Firestore Timestamps
        Object.keys(dataToSet).forEach(key => {
            if (dataToSet[key] instanceof Date) {
                dataToSet[key] = Timestamp.fromDate(dataToSet[key]);
            }
        });
        
        // Ensure preferredStatus is a string
        if (typeof dataToSet.preferred === 'boolean') {
            dataToSet.preferredStatus = dataToSet.preferred ? 'Preferred' : 'Not Evaluated';
            delete dataToSet.preferred;
        }


        batch.set(docRef, dataToSet);
        count++;
    });

    await batch.commit();
    console.log(`Seeded ${count} documents into "${collectionName}".`);
}

async function seedDatabase() {
    try {
        console.log('Signing in anonymously...');
        await signInAnonymously(auth);
        console.log('Signed in.');

        console.log('Starting database seed...');
        
        await seedCollection('contractors', ContractorsData, 'id');
        await seedCollection('metro_codes', MetroCodesData, 'id');
        
        // Custom seeding for RFPs to generate IDs and add createdAt
        const rfpsRef = collection(db, 'rfps');
        const rfpsSnapshot = await getDocs(rfpsRef);
        if (rfpsSnapshot.empty) {
            console.log('Seeding "rfps"...');
            const batch = writeBatch(db);
            seedRFPData.forEach((rfp, index) => {
                const id = `rfp-${index + 1}`;
                const docRef = doc(db, "rfps", id);
                
                const dataWithId = { 
                    ...rfp, 
                    id, 
                    createdAt: Timestamp.now(),
                    invitedContractors: [],
                };
                 // Convert JS Dates to Firestore Timestamps
                Object.keys(dataWithId).forEach(key => {
                    if ((dataWithId as any)[key] instanceof Date) {
                        (dataWithId as any)[key] = Timestamp.fromDate((dataWithId as any)[key]);
                    }
                });

                batch.set(docRef, dataWithId);
            });
            await batch.commit();
            console.log(`Seeded ${seedRFPData.length} documents into "rfps".`);
        } else {
             console.log(`Collection "rfps" already contains data. Skipping seeding.`);
        }


        console.log('Database seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
