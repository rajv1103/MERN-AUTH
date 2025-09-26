import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
          Auth flows made simple
        </h1>
        <p className="text-lg text-slate-700">
          Register, login, verify email with OTP, reset password — all with a
          clean UI and secure cookie-based auth.
        </p>
        <div className="flex gap-3">
          <Link
            to="/register"
            className="px-5 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
          >
            Get started
          </Link>
          <Link
            to="/login"
            className="px-5 py-3 border border-indigo-200 rounded-lg text-indigo-600"
          >
            Sign in
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Feature
            title="Email verification"
            desc="Send and confirm OTP to verify account."
          />
          <Feature
            title="Password reset"
            desc="Request reset OTP and change password securely."
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-6 shadow-lg">
        <MockCard />
      </div>
    </section>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h4 className="font-semibold text-slate-800">{title}</h4>
      <p className="text-sm text-slate-600">{desc}</p>
    </div>
  );
}


export function MockCard() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:3000/api";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/user/data`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setUser(data.userData);
        } else {
          throw new Error(data.message || "Failed to fetch user");
        }
      } catch (err) {
        setMsg({ type: "error", text: err.message });
        // Fallback dummy data for guest
        setUser({
          name: "Guest User",
          email: "guest@example.com",
          isAccountVerified: false,
          createdAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const isGuest = user?.email === "guest@example.com";

  return (
    <div className="p-4">
      <div className="flex items-center z-10 justify-between">
        <div>
          <div className="text-sm text-indigo-600 font-semibold">Account</div>
          <div className="text-lg font-bold">
            {loading ? "Loading..." : user?.name}
          </div>

          {/* ✅ Show Verified status only if not guest */}
          {!isGuest && (
            <div className="text-sm text-slate-500">
              Verified:{" "}
              {loading ? (
                "..."
              ) : user?.isAccountVerified ? (
                <span className="text-green-600 font-semibold">Yes</span>
              ) : (
                <span className="text-red-600 font-semibold">No</span>
              )}
            </div>
          )}
        </div>

        <div className="rounded-full bg-indigo-100 text-indigo-700 px-3 py-2 font-medium">
          {isGuest ? "Guest" : "User"}
        </div>
      </div>

      {msg && (
        <div className="mt-4 p-3 rounded bg-red-50 text-red-700 text-sm">
          {msg.text}
        </div>
      )}
    </div>
  );
}
