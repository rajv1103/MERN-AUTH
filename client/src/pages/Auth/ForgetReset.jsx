import React, { useState } from "react";
import { api } from "../../services/api";

export default function ForgotReset() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState(null);

  const sendOtp = async (e) => {
    e.preventDefault();
    setMsg(null);
    const res = await api.sendResetPassword({ email });
    if (res.ok) {
      setMsg({ type: "success", text: res.data.message || "OTP sent" });
      setOtpSent(true);
    } else {
      setMsg({ type: "error", text: res.data.message || "Failed to send OTP" });
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    const res = await api.resetPassword({ email, otp, newPassword });
    if (res.ok) {
      setMsg({ type: "success", text: res.data.message || "Password updated" });
      setOtp("");
      setNewPassword("");
      setOtpSent(false);
    } else {
      setMsg({ type: "error", text: res.data.message || "Failed to reset" });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-semibold mb-2">Reset password</h3>
      {msg && <div className={`p-3 rounded ${msg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</div>}

      {!otpSent ? (
        <form onSubmit={sendOtp} className="space-y-3 mt-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="w-full px-4 py-2 rounded border" />
          <button className="w-full py-2 bg-indigo-600 text-white rounded">Send reset OTP</button>
        </form>
      ) : (
        <form onSubmit={reset} className="space-y-3 mt-4">
          <input value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="Enter OTP" className="w-full px-4 py-2 rounded border" />
          <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required type="password" placeholder="New password" className="w-full px-4 py-2 rounded border" />
          <button className="w-full py-2 bg-green-600 text-white rounded">Reset password</button>
        </form>
      )}
    </div>
  );
}
