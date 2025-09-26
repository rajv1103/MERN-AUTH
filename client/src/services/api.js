const API_BASE ="http://localhost:3000/api";

async function request(path, { method = "GET", body, headers = {}, withCredentials = true } = {}) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    credentials: withCredentials ? "include" : "omit",
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  sendResetPassword: (payload) => request("/auth/send-reset-password", { method: "POST", body: payload }),
  resetPassword: (payload) => request("/auth/reset-password", { method: "POST", body: payload }),
  isLogged: () => request("/auth/is-auth", { method: "GET" }),
};
