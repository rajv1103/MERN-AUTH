import React, { useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const nav = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const res = await api.register(form);
    setLoading(false);
    if (res.ok) {
      setMsg({ type: "success", text: res.data.message || "Registered" });
      setTimeout(() => nav("/login"), 1000);
    } else {
      setMsg({ type: "error", text: res.data.message || "Failed" });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-2">Create account</h2>
      <p className="text-sm text-slate-600 mb-4">Start your secure session — we’ll email you after signup.</p>

      {msg && (
        <div className={`p-3 rounded ${msg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={submit} className="mt-4 space-y-3">
        <input name="name" value={form.name} onChange={handle} required placeholder="Full name" className="w-full px-4 py-2 rounded border" />
        <input name="email" value={form.email} onChange={handle} required type="email" placeholder="Email" className="w-full px-4 py-2 rounded border" />
        <input name="password" value={form.password} onChange={handle} required type="password" placeholder="Password" className="w-full px-4 py-2 rounded border" />
        <button disabled={loading} className="w-full py-2 bg-indigo-600 text-white rounded">
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
