// lib/useProducts.js
//temporary. Just a fall back to use hardcorded products if firebase is not configured
"use client";
import { useEffect, useState } from "react";
import { firebaseEnabled, db } from "@/lib/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";

export default function useProducts(fallback = []) {
  const [list, setList] = useState(fallback);
  useEffect(() => {
    if (!firebaseEnabled) return; // keep fallback
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setList(arr);
    });
    return () => unsub();
  }, []);
  return list;
}
