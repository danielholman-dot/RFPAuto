
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { ContractorsData, MetroCodesData, RFPData as seedRFPData } from '../src/lib/data';

// Initialize Firebase Admin SDK
initializeApp();

const db = getFirestore();

async function seedCollection(collectionName: string, data: any[], idField?: string) {
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.limit(1).get();

    if (!snapshot.empty) {
        console.log(`Collection "${collectionName}" already contains data. Skipping seeding.`);
        return;
    }

    console.log(`Seeding "${collectionName}"...`);
    const batch = db.batch();
    let count = 0;

    data.forEach((item, index) => {
        const id = idField ? item[idField] : (item.id || `${collectionName.slice(0, -1)}-${index + 1}`);
        const docRef = collectionRef.doc(id);
        const dataToSet = { ...item };
        if (idField) {
          dataToSet.id = id;
        }

        // Convert JS Dates to Firestore Timestamps
        Object.keys(dataToSet).forEach(key => {
            if (dataToSet[key] instanceof Date) {
                dataToSet[key] = Timestamp.fromDate(dataToSet[key]);
            }
        });

        batch.set(docRef, dataToSet);
        count++;
    });

    await batch.commit();
    console.log(`Seeded ${count} documents into "${collectionName}".`);
}


async function seedDatabase() {
    try {
        console.log('Starting database seed...');
        
        await seedCollection('contractors', ContractorsData, 'id');
        await seedCollection('metro_codes', MetroCodesData, 'id');
        
        // Custom seeding for RFPs to generate IDs
        const rfpsRef = db.collection('rfps');
        const rfpsSnapshot = await rfpsRef.limit(1).get();
        if (rfpsSnapshot.empty) {
            console.log('Seeding "rfps"...');
            const batch = db.batch();
            seedRFPData.forEach((rfp, index) => {
                const id = `rfp-${index + 1}`;
                const docRef = rfpsRef.doc(id);
                
                const dataWithId = { 
                    ...rfp, 
                    id, 
                    createdAt: Timestamp.now(),
                    invitedContractors: [],
                    proposals: [],
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
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
