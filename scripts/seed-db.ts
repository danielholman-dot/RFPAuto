
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import { ContractorsData } from '@/lib/seed';
import { MetroCodesData } from '@/lib/metro-seed';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function seedDatabase() {
  try {
    console.log('Starting to seed database...');

    // Seed Contractors
    const contractorsBatch = writeBatch(db);
    let contractorCount = 0;
    ContractorsData.forEach(contractor => {
      const docRef = doc(collection(db, 'contractors'));
      contractorsBatch.set(docRef, { ...contractor, id: docRef.id });
      contractorCount++;
    });
    await contractorsBatch.commit();
    console.log(`Seeded ${contractorCount} contractors.`);

    // Seed Metro Codes
    const metrosBatch = writeBatch(db);
    let metroCount = 0;
    MetroCodesData.forEach(metro => {
        const docRef = doc(collection(db, 'metro_codes'));
        metrosBatch.set(docRef, { ...metro, id: docRef.id });
        metroCount++;
    });
    await metrosBatch.commit();
    console.log(`Seeded ${metroCount} metro codes.`);


    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // In a Node.js script that doesn't exit automatically, you might need to force exit.
    // However, for this script, we'll let it finish and Node should exit.
    // If it hangs, uncomment the next line:
    // process.exit(0);
  }
}

seedDatabase();
