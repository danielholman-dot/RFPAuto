
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

// Helper to create a stable string representation of a query
const getQueryPath = (query: Query | CollectionReference | null | undefined): string | null => {
  if (!query) return null;

  // Check if it's a Query object
  if ('ref' in query && 'where' in query) {
    const q = query as Query;
    // A Query's ref points to the CollectionReference, which has the path.
    const path = q.ref.path;
    const filters = JSON.stringify((q as any)._query?.filters || []);
    return `${path}-${filters}`;
  }
  
  // Check if it's a CollectionReference
  if ('path' in query && 'id' in query) {
    return (query as CollectionReference).path;
  }
  
  return null;
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * Handles nullable references/queries.
 * 
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedTargetRefOrQuery or BAD THINGS WILL HAPPEN
 * use useMemoFirebase to memoize it per React guidance.
 *  
 * @template T Optional type for document data. Defaults to any.
 * @param {CollectionReference<DocumentData> | Query<DocumentData> | null | undefined} memoizedTargetRefOrQuery -
 * The Firestore CollectionReference or Query. Waits if null/undefined.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: (CollectionReference<DocumentData> | Query<DocumentData>)  | null | undefined,
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as true
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  // Use a ref to track a stable representation of the query
  const queryPathRef = useRef<string | null>(null);

  useEffect(() => {
    const newQueryPath = getQueryPath(memoizedTargetRefOrQuery);

    // Only reset and show loading if the actual query has changed.
    if (newQueryPath !== queryPathRef.current) {
        setData(null);
        setError(null);
        setIsLoading(true);
        queryPathRef.current = newQueryPath;
    }

    if (!memoizedTargetRefOrQuery) {
        // If the query is null/undefined, we are not loading.
        setIsLoading(false);
        return;
    }

    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: ResultItemType[] = [];
        for (const doc of snapshot.docs) {
          results.push({ ...(doc.data() as T), id: doc.id });
        }
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        const path = getQueryPath(memoizedTargetRefOrQuery) || 'Unknown path';
        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path,
        })

        setError(contextualError)
        setData(null)
        setIsLoading(false)

        // trigger global error propagation
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery]); // Re-run if the target query/reference changes.

  return { data, isLoading, error };
}

