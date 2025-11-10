
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, writeBatch, doc, getDocs, Timestamp, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '../src/firebase';
import { ContractorsData, MetroCodesData, RFPData as seedRFPData, usersData } from '../src/lib/data';

// Initialize Firebase and get the auth and firestore instances
const { auth, firestore: db } = initializeFirebase();

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


async function seedCollection(collectionName: string, data: any[], idField?: keyof any) {
    const collectionRef = collection(db, collectionName);
    
    const snapshot = await getDocs(collectionRef);
    if (!snapshot.empty) {
        console.log(`Collection "${collectionName}" already contains data. Skipping seeding.`);
        return;
    }

    console.log(`Seeding "${collectionName}"...`);
    const batch = writeBatch(db);
    let count = 0;

    data.forEach((item) => {
        const docId = idField ? String(item[idField]) : doc(collectionRef).id;
        const docRef = doc(db, collectionName, docId);
        
        const dataToSet: { [key: string]: any } = { ...item };
        if (idField) {
            dataToSet.id = docId;
        }

        // Convert JS Dates to Firestore Timestamps
        Object.keys(dataToSet).forEach(key => {
            if (dataToSet[key] instanceof Date) {
                dataToSet[key] = Timestamp.fromDate(dataToSet[key]);
            }
            if(key === 'createdAt' && !dataToSet[key]) {
                dataToSet[key] = Timestamp.now();
            }
        });
        
        batch.set(docRef, dataToSet, { merge: true });
        count++;
    });

    await batch.commit();
    console.log(`Seeded ${count} documents in "${collectionName}".`);
}

async function seedDatabase() {
    try {
        console.log('Starting database seed...');
        
        await seedAuthUsers();
        await seedCollection('users', usersData, 'id');
        await seedCollection('contractors', ContractorsData, 'id');
        await seedCollection('metro_codes', MetroCodesData, 'id');
        await seedCollection('rfps', seedRFPData, 'id');

        console.log('Database seeding completed successfully. Run "npm run dev" to start the app.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
