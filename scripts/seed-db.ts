
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch } from 'firebase/firestore';
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
    const contractorsCollection = collection(db, 'contractors');
    let contractorCount = 0;
    ContractorsData.forEach(contractor => {
      // Use a consistent ID generation if possible, or let Firestore auto-generate
      const docRef = collection(db, 'contractors').doc();
      contractorsBatch.set(docRef, { ...contractor, id: docRef.id });
      contractorCount++;
    });
    await contractorsBatch.commit();
    console.log(`Seeded ${contractorCount} contractors.`);

    // Seed Metro Codes
    const metrosBatch = writeBatch(db);
    const metrosCollection = collection(db, 'metro_codes');
    let metroCount = 0;
    MetroCodesData.forEach(metro => {
        const docRef = collection(db, 'metro_codes').doc();
        metrosBatch.set(docRef, { ...metro, id: docRef.id });
        metroCount++;
    });
    await metrosBatch.commit();
    console.log(`Seeded ${metroCount} metro codes.`);


    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Firebase does not need to be explicitly disconnected for client-side SDK
    // In a Node.js script, you might want to process.exit() if it hangs
    // For this simple script, we'll just let it finish.
  }
}

seedDatabase();
