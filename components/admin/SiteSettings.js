// components/admin/SiteSettings.js
"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const input =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40";

export default function SiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // WhatsApp / phone
  const [phone, setPhone] = useState("");
  const [phoneDisplay, setPhoneDisplay] = useState("");

  // Contact details
  const [email, setEmail] = useState("");
  const [addressEs, setAddressEs] = useState("");
  const [addressEn, setAddressEn] = useState("");
  const [hoursEs, setHoursEs] = useState(""); // accepts HTML or plain text
  const [hoursEn, setHoursEn] = useState("");

  // Map (optional)
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  useEffect(() => {
    (async () => {
      const ref = doc(db, "site", "content");
      const snap = await getDoc(ref);
      const data = snap.data() || {};

      setPhone(data.contact_phone || "");
      setPhoneDisplay(data.contact_phone_display || data.contact_phone || "");
      setEmail(data.contact_email || "");

      setAddressEs(data.contact_address_es || "");
      setAddressEn(data.contact_address_en || "");

      setHoursEs(data.contact_hours_html_es || "");
      setHoursEn(data.contact_hours_html_en || "");

      setLat(data.contact_lat?.toString?.() || "");
      setLng(data.contact_lng?.toString?.() || "");

      setLoading(false);
    })();
  }, []);

  async function save() {
    setSaving(true);
    try {
      const ref = doc(db, "site", "content");
      const base = {
        contact_phone: phone,
        contact_phone_display: phoneDisplay || phone,
        contact_email: email,

        contact_address_es: addressEs,
        contact_address_en: addressEn,

        contact_hours_html_es: hoursEs,
        contact_hours_html_en: hoursEn,

        updatedAt: serverTimestamp(),
      };

      // only add coords if both are provided
      if (lat && lng) {
        base.contact_lat = Number(lat);
        base.contact_lng = Number(lng);
      } else {
        base.contact_lat = null;
        base.contact_lng = null;
      }

      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, base);
      } else {
        await setDoc(ref, { ...base, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-muted">Loading settings…</div>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm grid gap-6">
      <h3 className="text-lg font-semibold text-ink">Site settings</h3>

      {/* WhatsApp / Phone */}
      <div className="grid gap-4">
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
            Used in the “Order on WhatsApp” button across the site.
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
          <label className="block text-sm text-ink/80 mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@damioptica.com"
            className={input}
          />
        </div>
      </div>

      {/* Contact details (ES/EN) */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm text-ink/80 mb-1">Address (ES)</label>
          <input
            value={addressEs}
            onChange={(e) => setAddressEs(e.target.value)}
            placeholder="Av. Óptica 123, Local 2 — Ciudad Visión"
            className={input}
          />
        </div>
        <div>
          <label className="block text-sm text-ink/80 mb-1">Address (EN)</label>
          <input
            value={addressEn}
            onChange={(e) => setAddressEn(e.target.value)}
            placeholder="Optic Ave 123, Suite 2 — Vision City"
            className={input}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-ink/80 mb-1">
            Hours (ES) — HTML allowed
          </label>
          <textarea
            value={hoursEs}
            onChange={(e) => setHoursEs(e.target.value)}
            placeholder="Lun–Sáb: 9:00–18:00 • Dom: Cerrado"
            rows={3}
            className={input}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-ink/80 mb-1">
            Hours (EN) — HTML allowed
          </label>
          <textarea
            value={hoursEn}
            onChange={(e) => setHoursEn(e.target.value)}
            placeholder="Mon–Sat: 9:00 AM–6:00 PM • Sun: Closed"
            rows={3}
            className={input}
          />
        </div>
      </div>

      {/* Map (optional) */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm text-ink/80 mb-1">Map latitude</label>
          <input
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="4.62"
            className={input}
          />
        </div>
        <div>
          <label className="block text-sm text-ink/80 mb-1">
            Map longitude
          </label>
          <input
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="-74.06"
            className={input}
          />
        </div>
      </div>

      <div>
        <button onClick={save} className="btn" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
