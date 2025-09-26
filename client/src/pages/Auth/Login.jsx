import React, { useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState(null);
  const nav = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    const res = await api.login(form);
    if (res.ok) {
      setMsg({ type: "success", text: res.data.message || "Logged in" });
      setTimeout(() => nav("/profile"), 500);
    } else {
      setMsg({ type: "error", text: res.data.message || "Login failed" });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
      {msg && (<div className={`p-3 rounded ${msg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</div>)}
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input name="email" value={form.email} onChange={handle} required type="email" placeholder="Email" className="w-full px-4 py-2 rounded border" />
        <input name="password" value={form.password} onChange={handle} required type="password" placeholder="Password" className="w-full px-4 py-2 rounded border" />
        <button className="w-full py-2 bg-indigo-600 text-white rounded">Sign in</button>
      </form>

      <div className="mt-4 flex justify-between text-sm">
        <a href="/auth/forgot" className="text-indigo-600">Forgot password?</a>
        <a href="/register" className="text-slate-600">Create account</a>
      </div>
    </div>
  );
}
