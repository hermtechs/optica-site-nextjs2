// components/admin/AuthGate.js
"use client";

import { useEffect, useState } from "react";
import { auth, adminEmails, firebaseEnabled } from "@/lib/firebaseClient";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { Lock } from "lucide-react";

export default function AuthGate({ children }) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!firebaseEnabled) return;
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub && unsub();
  }, []);

  if (!firebaseEnabled) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">
          Firebase not configured
        </h2>
        <p className="text-ink/80 mt-2">
          Add your Firebase keys to <code>.env.local</code> and restart the dev
          server.
        </p>
      </div>
    );
  }

  const isAdmin = !!user && adminEmails.includes(user.email);

  if (!user) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm max-w-md">
        <h2 className="text-xl font-semibold text-ink">Admin sign in</h2>
        <p className="text-sm text-muted mt-1">
          Email &amp; Password only (create the user in Firebase Console).
        </p>

        <form
          className="mt-4 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            try {
              await signInWithEmailAndPassword(auth, email, pass);
            } catch (err) {
              setError(err.message);
            }
          }}
        >
          <div>
            <label className="block text-sm text-ink/80 mb-1">Email</label>
            <input
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40"
              placeholder="you@damioptica.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-ink/80 mb-1">Password</label>
            <input
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40"
              placeholder="••••••••"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button className="btn w-full" type="submit">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm max-w-lg">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Lock className="h-5 w-5 text-ink" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">
              No permission to view this page
            </h2>
            <p className="text-ink/80 mt-1">
              You’re signed in as <b>{user.email}</b>, but this account isn’t on
              the admin allowlist.
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted">
              <li>Sign out and sign in with an approved admin email.</li>
              <li>
                Ask the site owner to add your email in{" "}
                <code>NEXT_PUBLIC_ADMIN_EMAILS</code> and in Firestore/Storage
                rules.
              </li>
            </ul>
            <div className="mt-3 flex gap-2">
              <button className="btn-outline" onClick={() => signOut(auth)}>
                Sign out
              </button>
              <a
                className="btn-outline"
                href="mailto:hello@damioptica.com?subject=Admin%20access%20request"
              >
                Request access
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted">Signed in as {user.email}</div>
        <button className="btn-outline" onClick={() => signOut(auth)}>
          Sign out
        </button>
      </div>
      {children}
    </div>
  );
}
