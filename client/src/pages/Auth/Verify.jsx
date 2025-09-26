import React, { useState } from "react";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:3000/api";

  const send = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/send-verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({
          type: "success",
          text: data.message || "Verification mail sent",
        });
        setSent(true);
      } else {
        setMsg({ type: "error", text: data.message || "Failed to send" });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/verify-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({ type: "success", text: data.message || "Verified" });
      } else {
        setMsg({ type: "error", text: data.message || "Invalid/expired OTP" });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Network error during verification" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-semibold mb-2">Verify account</h3>

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

      {!sent ? (
        <form onSubmit={send} className="mt-4 space-y-3">
          <button
            className="w-full py-2 bg-indigo-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send verification email"}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="mt-4 space-y-3">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            placeholder="Enter OTP"
            className="w-full px-4 py-2 rounded border"
          />
          <button
            className="w-full py-2 bg-green-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}
    </div>
  );
}
