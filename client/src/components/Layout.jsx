import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  const [user, setUser] = useState(null);

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
        }
      } catch (err) {
        // Not logged in or error — keep user null
      }
    };

    fetchUser();
  }, []);

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 text-slate-800">
      <header className="bg-white/70 backdrop-blur-sm sticky top-0 z-1000 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold">RV</div>
            <div className="text-lg font-semibold">CleverVault</div>
          </Link>

          <nav className="space-x-4 flex items-center">
            {!user ? (
              <>
                <Link to="/login" className="text-sm font-medium text-indigo-600">Login</Link>
                <Link to="/register" className="text-sm font-medium text-indigo-600">Register</Link>
              </>
            ) : (
              <Link to="/profile">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm shadow-sm">
                  {firstLetter}
                </div>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <Outlet />
      </main>

      <footer className="mt-12 py-8 text-center text-sm text-slate-500">
        Built with ❤️
      </footer>
    </div>
  );
}
