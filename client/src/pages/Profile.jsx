import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function Profile() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE = "http://localhost:3000/api";

  const fetchProfile = async () => {
    setMsg(null);
    setLoading(true);

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
        setMsg({ type: "error", text: data.message || "Failed to get user" });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(null);
        setMsg({ type: "success", text: "Logged out" });
        navigate("/");
      } else {
        setMsg({ type: "error", text: data.message || "Logout failed" });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Network error during logout" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Profile</h3>
        <button
          onClick={logout}
          className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <button
          onClick={fetchProfile}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch profile"}
        </button>

        <a
          href="/auth/verify"
          className="px-4 py-2 border rounded text-indigo-600 inline-block"
        >
          Verify account
        </a>

        {msg && (
          <div
            className={`p-3 rounded ${
              msg.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {msg.text}
          </div>
        )}

        {user && (
          <div className="mt-4 bg-slate-50 p-4 rounded">
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-slate-600">{user.email}</div>
            <div className="text-sm mt-2">
              Verified:{" "}
              <span className="font-semibold">
                {String(user.isAccountVerified)}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Joined: {new Date(user.createdAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
