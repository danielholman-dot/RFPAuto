
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, writeBatch, doc, getDocs, Timestamp } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config';
import { ContractorsData, MetroCodesData, RFPData as seedRFPData, usersData } from '../src/lib/data';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function seedAuthUsers() {
    console.log('Seeding authentication users...');
    let count = 0;
    for (const user of usersData) {
        try {
            await createUserWithEmailAndPassword(auth, user.email, 'password');
            console.log(`Created auth user: ${user.email}`);
            count++;
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                console.log(`Auth user ${user.email} already exists. Skipping.`);
            } else {
                console.error(`Error creating auth user ${user.email}:`, error);
            }
        }
    }
    console.log(`Seeded ${count} new authentication users.`);
}


async function seedCollection(collectionName: string, data: any[], idField?: string) {
    const collectionRef = collection(db, collectionName);
    
    // Check if collection is empty
    const snapshot = await getDocs(collectionRef);
    if (!snapshot.empty && collectionName !== 'users') { // Always check users for updates
        console.log(`Collection "${collectionName}" already contains data. Skipping seeding.`);
        return;
    }

    console.log(`Seeding "${collectionName}"...`);
    const batch = writeBatch(db);
    let count = 0;

    data.forEach((item, index) => {
        let docId = item.id;
        
        const docRef = doc(db, collectionName, docId);
        
        const dataToSet = { ...item };

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

        batch.set(docRef, dataToSet, { merge: true });
        count++;
    });

    await batch.commit();
    console.log(`Seeded/Updated ${count} documents in "${collectionName}".`);
}

async function seedDatabase() {
    try {
        console.log('Starting database seed...');
        
        await seedAuthUsers();
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

    
