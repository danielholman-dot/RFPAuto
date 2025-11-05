'use client';
    
import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  Query,
  DocumentData,
  FirestoreError,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useFirestore } from '../provider';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data in the collection.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Array of document data with IDs, or null.
  isLoading: boolean;        // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/**
 * React hook to subscribe to a Firestore collection in real-time.
 * It can take a collection path string or a Firestore Query object.
 * Handles nullable references.
 * 
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedTargetRefOrQuery or BAD THINGS WILL HAPPEN
 * use useMemo to memoize it per React guidence.  Also make sure that it's dependencies are stable
 * references
 *
 * @template T Optional type for documents in the collection. Defaults to any.
 * @param {string | Query<DocumentData> | null | undefined} targetRefOrQuery -
 * The path to the collection or a Firestore Query object. Hook waits if null/undefined.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export default function useCollection<T = any>(
  memoizedTargetRefOrQuery: string | Query<DocumentData> | null | undefined,
): UseCollectionResult<T> {
  type StateDataType = WithId<T>[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  const firestore = useFirestore();

  useEffect(() => {
    if (!memoizedTargetRefOrQuery || !firestore) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const queryObj =
      typeof memoizedTargetRefOrQuery === 'string'
        ? query(collection(firestore, memoizedTargetRefOrQuery))
        : memoizedTargetRefOrQuery;

    const unsubscribe = onSnapshot(
      queryObj,
      (querySnapshot) => {
        const data = querySnapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as WithId<T>)
        );
        setData(data);
        setError(null); // Clear previous errors
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        // Firestore queries don't have a single .path property.
        // We can get the path from the original collection reference if it's a simple query.
        let path = "Unknown Query Path";
        if (queryObj instanceof CollectionReference) {
            path = queryObj.path;
        } else if (typeof memoizedTargetRefOrQuery === 'string') {
            path = memoizedTargetRefOrQuery;
        }

        const contextualError = new FirestorePermissionError({
            operation: 'list',
            path: path,
        });

        setError(contextualError);
        setData(null);
        setIsLoading(false);

        // trigger global error propagation
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery, firestore]);

  return { data, isLoading, error };
}
