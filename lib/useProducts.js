// lib/useProducts.js
"use client";

import { useEffect, useState } from "react";
import { db, firebaseEnabled } from "@/lib/firebaseClient";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

/**
 * STRICT: returns ONLY what's in Firestore.
 * - If Firebase isn't configured or the collection is empty, you get [].
 */
export default function useProducts() {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!firebaseEnabled) {
      console.warn("[useProducts] Firebase not configured. Returning [].");
      setList([]);
      return;
    }
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setList(arr);
    });
    return () => unsub();
  }, []);

  return list;
}
