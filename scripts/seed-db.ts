
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc, getDocs, Timestamp } from 'firebase/firestore';

// This config must be kept in sync with src/firebase/config.ts
const firebaseConfig = {
  "projectId": "gpo-procurement-sandbox-563772",
  "appId": "1:1071160844261:web:30144bf94e97dfb6dad90c",
  "storageBucket": "gpo-procurement-sandbox-563772.appspot.com",
  "apiKey": "AIzaSyCvHiAeqP8TGLnkcpxRfo7XAwS8AJxpk2k",
  "authDomain": "gpo-procurement-sandbox-563772.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1071160844261"
};

import { ContractorsData, MetroCodesData, RFPData as seedRFPData, usersData } from '../src/lib/data';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
        let id;
        if (idField && item[idField]) {
            id = item[idField];
        } else if (item.id) {
            id = item.id;
        } else if (collectionName === 'users' && item.email) {
            // Use a deterministic ID for users based on email for claim purposes
            id = item.email.replace(/[^a-zA-Z0-9]/g, '_');
        } else {
            id = `${collectionName.slice(0, -1)}-${index + 1}`;
        }
        
        const docRef = doc(db, collectionName, id);
        
        const dataToSet = { ...item, id: id };

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

        // Add admin claim for the first user for demo purposes
        if (collectionName === 'users' && index === 0) {
            (dataToSet as any).customClaims = { admin: true };
        }

        batch.set(docRef, dataToSet);
        count++;
    });

    await batch.commit();
    console.log(`Seeded ${count} documents into "${collectionName}".`);
}

async function seedDatabase() {
    try {
        console.log('Starting database seed...');
        
        await seedCollection('users', usersData, 'id');
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
                    completedStages: [], // Ensure this is initialized as empty
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


        console.log('Database seeding completed successfully. Run "npm run dev" to start the app.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
