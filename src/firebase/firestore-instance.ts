
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// This is a separate file to avoid circular dependencies
// when used in server-side data fetching functions (e.g., in lib/data.ts)

const { firestore } = initializeFirebase();

export { firestore };

    