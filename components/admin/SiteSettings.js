// components/admin/SiteSettings.js
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const input =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40";

export default function SiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneDisplay, setPhoneDisplay] = useState("");

  useEffect(() => {
    const run = async () => {
      const ref = doc(db, "site", "content");
      const snap = await getDoc(ref);
      const data = snap.data() || {};
      setPhone(data.contact_phone || "");
      setPhoneDisplay(data.contact_phone_display || data.contact_phone || "");
      setLoading(false);
    };
    run();
  }, []);

  async function save() {
    setSaving(true);
    try {
      const ref = doc(db, "site", "content");
      const snap = await getDoc(ref);
      const data = {
        contact_phone: phone,
        contact_phone_display: phoneDisplay || phone,
        updatedAt: serverTimestamp(),
      };
      if (snap.exists()) {
        await updateDoc(ref, data);
      } else {
        await setDoc(ref, { ...data, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-muted">Loading settings…</div>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm grid gap-4">
      <h3 className="text-lg font-semibold text-ink">Site settings</h3>

      <div>
        <label className="block text-sm text-ink/80 mb-1">
          WhatsApp phone (E.164 or local)
        </label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+57 300 123 4567"
          className={input}
        />
        <p className="mt-1 text-xs text-muted">
          This is used in the “Order on WhatsApp” button across the site.
        </p>
      </div>

      <div>
        <label className="block text-sm text-ink/80 mb-1">
          Phone display (optional)
        </label>
        <input
          value={phoneDisplay}
          onChange={(e) => setPhoneDisplay(e.target.value)}
          placeholder="+57 300 123 4567"
          className={input}
        />
      </div>

      <div>
        <button onClick={save} className="btn" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
