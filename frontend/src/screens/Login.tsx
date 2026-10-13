// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const { Check, X, ChevronRight, User, Clock, ArrowRight, AlertCircle, CheckCircle } = Icons;

const ACCOUNTS = [
  { email: "dana.okonkwo@sparkline.dev", password: "lateshift2026" },
  { email: "r.halvorsen@sparkline.dev", password: "chunksize800" },
];

const LAST_SESSION = {
  email: "dana.okonkwo@sparkline.dev",
  signedIn: "13 Oct 2026, 18:42",
  expiredAgo: "11 minutes ago",
};

const BACKEND_ROWS = [
  { label: "DATABASE_URL", value: "not set — SQLite ./ragdesk.db", tag: "ok" },
  { label: "JWT_SECRET", value: "not set — random secret per start", tag: "note", note: "Everyone is signed out when uvicorn restarts." },
  { label: "GEMINI_API_KEY", value: "not set — paste your own after login", tag: "note" },
  { label: "GEMINI_CHAT_MODEL", value: "gemini-2.5-flash", tag: "ok" },
  { label: "GEMINI_EMBED_MODEL", value: "gemini-embedding-001", tag: "ok" },
];

const SHORTCUTS = [
  { keys: ["Enter"], action: "Sign in" },
  { keys: ["Esc"], action: "Dismiss the message" },
  { keys: ["Alt", "N"], action: "Create an account" },
];

const CSS = `
.nd-root{color-scheme:dark}
.nd-field{background:var(--nd-field);border:1px solid var(--nd-line);color:var(--nd-text)}
.nd-field::placeholder{color:var(--nd-muted);opacity:.75}
.nd-field:focus-visible,.nd-focus:focus-visible{outline:none;box-shadow:0 0 0 2px var(--nd-bg),0 0 0 3px var(--nd-primary)}
.nd-field:hover{border-color:var(--nd-line-strong)}
.nd-enter{animation:nd-in .22s cubic-bezier(.2,.7,.3,1) both}
@keyframes nd-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.nd-pulse{animation:nd-pulse 1.1s ease-in-out infinite}
@keyframes nd-pulse{0%,100%{opacity:.3}50%{opacity:1}}
.nd-link{text-underline-offset:3px}
.nd-link:hover{text-decoration:underline}
button:disabled{cursor:not-allowed}
@media (prefers-reduced-motion:reduce){.nd-enter,.nd-pulse{animation:none!important}}
`;

export default function Screen() {
  const navigate = useNavigate();
  const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [capsOn, setCapsOn] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [status, setStatus] = React.useState("idle"); // idle | submitting | success
  const [attempts, setAttempts] = React.useState(0);
  const [api, setApi] = React.useState({ state: "online", latency: 23, at: "18:51:04" });
  const [banner, setBanner] = React.useState({
    tone: "notice",
    icon: "Clock",
    title: "Your session expired.",
    body: "Tokens last 24 hours. Sign in again to pick up the chat you left open.",
  });

  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const timers = React.useRef([]);
  const after = (ms, fn) => { const t = setTimeout(fn, ms); timers.current.push(t); };

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { setBanner(null); }
      if (e.altKey && (e.key === "n" || e.key === "N")) { e.preventDefault(); navigate("register"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const Glyph = ({ name, className }) => {
    const C = typeof Icons !== "undefined" ? Icons[name] : null;
    return C ? <C className={className} aria-hidden="true" /> : null;
  };

  const checkCaps = (e) => {
    if (typeof e.getModifierState === "function") setCapsOn(e.getModifierState("CapsLock"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === "submitting" || status === "success") return;

    const next = {};
    if (!email.trim()) next.email = "Enter the email you registered with.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "That does not look like an email address.";
    if (!password) next.password = "Enter your password.";
    else if (password.length < 8) next.password = "Password must be at least 8 characters.";
    setErrors(next);
    if (next.email) { emailRef.current && emailRef.current.focus(); return; }
    if (next.password) { passwordRef.current && passwordRef.current.focus(); return; }

    if (api.state === "offline") {
      setBanner({
        tone: "error",
        icon: "AlertCircle",
        title: "Can't reach the API on 127.0.0.1:8000.",
        body: "Start the backend with  uvicorn app.main:app --reload  and try again. Nothing you typed was lost.",
      });
      return;
    }

    setStatus("submitting");
    setBanner(null);
    after(820, () => {
      const hit = ACCOUNTS.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
      );
      if (hit) {
        setStatus("success");
        setBanner({
          tone: "success",
          icon: "CheckCircle",
          title: "Signed in. Token expires 14 Oct 2026, 19:04.",
          body: "Opening your chats — 6 saved, newest first.",
        });
        after(1150, () => navigate("chat"));
      } else {
        setStatus("idle");
        setAttempts((n) => n + 1);
        setBanner({
          tone: "error",
          icon: "AlertCircle",
          title: "Invalid email or password.",
          body: "The same message is returned for an unknown email and a wrong password, on purpose.",
        });
        setPassword("");
        passwordRef.current && passwordRef.current.focus();
      }
    });
  };

  const busy = status === "submitting";
  const done = status === "success";
  const toneColor = (tone) => (tone === "success" ? "var(--nd-primary)" : "var(--nd-accent)");

  const rootStyle = {
    backgroundColor: brand.backgroundColor,
    fontFamily: brand.fontBody,
    "--nd-bg": brand.backgroundColor,
    "--nd-primary": brand.primaryColor,
    "--nd-accent": brand.accentColor,
    "--nd-muted": brand.neutralColor,
    "--nd-text": "rgba(255,255,255,0.92)",
    "--nd-field": "rgba(255,255,255,0.045)",
    "--nd-line": "rgba(255,255,255,0.10)",
    "--nd-line-strong": "rgba(255,255,255,0.20)",
  };

  const panel = {
    backgroundColor: "rgba(255,255,255,0.028)",
    border: "1px solid var(--nd-line)",
    borderRadius: brand.radius,
  };

  const labelCls = "block text-[11px] font-medium uppercase tracking-[0.09em]";

  const fieldNote = (id, msg) =>
    msg ? (
      <p id={id} className="nd-enter mt-1.5 flex items-start gap-1.5 text-[12px]" style={{ color: "var(--nd-accent)" }}>
        <Glyph name="AlertCircle" className="mt-[1px] h-3.5 w-3.5 shrink-0" />
        <span>{msg}</span>
      </p>
    ) : null;

  return (
    <div className="nd-root min-h-full w-full px-5 py-8 sm:px-8" style={rootStyle}>
      <style>{CSS}</style>

      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
        {/* ---------------- Primary column: the sign-in ---------------- */}
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--nd-muted)", fontFamily: mono }}>
            ragdesk
            <span style={{ color: "var(--nd-accent)" }}> / </span>
            auth
          </p>

          <h1
            className="mt-2 text-[34px] font-semibold leading-none tracking-tight sm:text-[40px]"
            style={{ color: "var(--nd-text)", fontFamily: brand.fontHeading }}
          >
            Log in
          </h1>
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed" style={{ color: "var(--nd-muted)" }}>
            Your documents, chunks and saved chats are bound to this account. Nothing is shared between accounts.
          </p>

          {banner ? (
            <div
              key={banner.title + attempts}
              role={banner.tone === "error" ? "alert" : "status"}
              className="nd-enter mt-6 flex items-start gap-2.5 p-3 pr-2"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                borderLeft: `2px solid ${toneColor(banner.tone)}`,
                borderRadius: `0 ${brand.radius} ${brand.radius} 0`,
              }}
            >
              <span style={{ color: toneColor(banner.tone) }} className="mt-[2px]">
                <Glyph name={banner.icon} className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold" style={{ color: "var(--nd-text)" }}>
                  {banner.title}
                </p>
                {banner.body ? (
                  <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: "var(--nd-muted)" }}>
                    {banner.body}
                  </p>
                ) : null}
                {attempts > 1 && banner.tone === "error" ? (
                  <p className="mt-1 text-[11.5px]" style={{ color: "var(--nd-muted)", fontFamily: mono, fontVariantNumeric: "tabular-nums" }}>
                    attempt {attempts} · 401 from POST /api/v1/auth/login
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setBanner(null)}
                aria-label="Dismiss this message"
                className="nd-focus -mt-0.5 rounded p-1 transition-colors hover:bg-white/5"
                style={{ color: "var(--nd-muted)", borderRadius: brand.radius }}
              >
                <Glyph name="X" className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} noValidate className="mt-6 max-w-md" style={panel}>
            <div className="space-y-4 p-5">
              <div>
                <label htmlFor="login-email" className={labelCls} style={{ color: "var(--nd-muted)" }}>
                  Email
                </label>
                <input
                  id="login-email"
                  ref={emailRef}
                  type="email"
                  autoComplete="email"
                  autoFocus
                  spellCheck="false"
                  value={email}
                  disabled={busy || done}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: null })); }}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "login-email-err" : undefined}
                  placeholder="you@company.dev"
                  className="nd-field mt-1.5 block w-full px-3 py-2 text-[13.5px] transition-colors disabled:opacity-60"
                  style={{ borderRadius: brand.radius, fontFamily: mono }}
                />
                {fieldNote("login-email-err", errors.email)}
              </div>

              <div>
                <label htmlFor="login-password" className={labelCls} style={{ color: "var(--nd-muted)" }}>
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="login-password"
                    ref={passwordRef}
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    disabled={busy || done}
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: null })); }}
                    onKeyUp={checkCaps}
                    onKeyDown={checkCaps}
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={[errors.password ? "login-password-err" : null, capsOn ? "login-caps" : null].filter(Boolean).join(" ") || undefined}
                    placeholder="at least 8 characters"
                    className="nd-field block w-full px-3 py-2 pr-[4.5rem] text-[13.5px] transition-colors disabled:opacity-60"
                    style={{ borderRadius: brand.radius, fontFamily: mono }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-pressed={showPw}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="nd-focus absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 text-[11px] uppercase tracking-wider transition-colors hover:bg-white/5"
                    style={{ color: "var(--nd-muted)", borderRadius: brand.radius, fontFamily: mono }}
                  >
                    {showPw ? "hide" : "show"}
                  </button>
                </div>
                {fieldNote("login-password-err", errors.password)}
                {capsOn ? (
                  <p id="login-caps" className="nd-enter mt-1.5 flex items-center gap-1.5 text-[12px]" style={{ color: "var(--nd-accent)" }}>
                    <Glyph name="AlertCircle" className="h-3.5 w-3.5" />
                    Caps Lock is on.
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={busy || done}
                className="nd-focus mt-1 flex w-full items-center justify-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold transition-[opacity,transform] active:translate-y-[1px] disabled:opacity-80"
                style={{
                  backgroundColor: done ? "transparent" : brand.primaryColor,
                  color: done ? brand.primaryColor : "#0B0F14",
                  border: done ? `1px solid ${brand.primaryColor}` : "1px solid transparent",
                  borderRadius: brand.radius,
                }}
              >
                {busy ? (
                  <>
                    <span className="nd-pulse">Verifying credentials…</span>
                  </>
                ) : done ? (
                  <>
                    <Glyph name="Check" className="h-4 w-4" />
                    Session started
                  </>
                ) : (
                  <>
                    Sign in
                    <Glyph name="ArrowRight" className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-[11.5px]" style={{ color: "var(--nd-muted)", fontVariantNumeric: "tabular-nums" }}>
                Issues a JWT that lasts 24 hours, kept in localStorage.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 border-t px-5 py-3" style={{ borderColor: "var(--nd-line)" }}>
              <span className="text-[12.5px]" style={{ color: "var(--nd-muted)" }}>
                No account yet?
              </span>
              <button
                type="button"
                onClick={() => navigate("register")}
                className="nd-link nd-focus flex items-center gap-1 rounded px-1 py-0.5 text-[12.5px] font-medium"
                style={{ color: brand.primaryColor, borderRadius: brand.radius }}
              >
                Create an account
                <Glyph name="ChevronRight" className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {done ? (
            <button
              type="button"
              onClick={() => navigate("chat")}
              className="nd-link nd-focus nd-enter mt-3 rounded px-1 text-[12.5px]"
              style={{ color: brand.primaryColor, borderRadius: brand.radius }}
            >
              Open chat now
            </button>
          ) : null}

          <p className="mt-6 max-w-md text-[12px] leading-relaxed" style={{ color: "var(--nd-muted)" }}>
            Seed account from the README (SQLite path):{" "}
            <span style={{ fontFamily: mono, color: "var(--nd-text)" }}>dana.okonkwo@sparkline.dev</span>
            {" / "}
            <span style={{ fontFamily: mono, color: "var(--nd-text)" }}>lateshift2026</span>
          </p>
        </div>

        {/* ---------------- Secondary column: machine state ---------------- */}
        <aside className="min-w-0 space-y-4 lg:pt-10">
          <section style={panel} className="p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--nd-text)" }}>
                Local backend
              </h2>
              <span className="text-[11px]" style={{ color: "var(--nd-muted)", fontFamily: mono }}>
                api v1
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[12px]" style={{ fontFamily: mono, fontVariantNumeric: "tabular-nums" }}>
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: api.state === "online" ? brand.primaryColor : brand.accentColor }}
              />
              <span style={{ color: "var(--nd-text)" }}>127.0.0.1:8000</span>
              <span style={{ color: api.state === "online" ? "var(--nd-muted)" : "var(--nd-accent)" }}>
                {api.state === "online" ? `reachable · ${api.latency} ms` : "unreachable"}
              </span>
            </div>
            <p className="mt-1 text-[11px]" style={{ color: "var(--nd-muted)", fontFamily: mono, fontVariantNumeric: "tabular-nums" }}>
              checked {api.at}
            </p>

            <ul className="mt-4 space-y-2.5">
              {BACKEND_ROWS.map((row) => (
                <li key={row.label}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11.5px]" style={{ color: "var(--nd-text)", fontFamily: mono }}>
                      {row.label}
                    </span>
                    <span
                      className="shrink-0 px-1.5 py-[1px] text-[10px] uppercase tracking-wider"
                      style={{
                        color: row.tag === "ok" ? "var(--nd-muted)" : brand.accentColor,
                        border: `1px solid ${row.tag === "ok" ? "var(--nd-line)" : brand.accentColor}`,
                        borderRadius: brand.radius,
                        fontFamily: mono,
                      }}
                    >
                      {row.tag}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11.5px] leading-snug" style={{ color: "var(--nd-muted)" }}>
                    {row.value}
                  </p>
                  {row.note ? (
                    <p className="mt-0.5 text-[11.5px] leading-snug" style={{ color: brand.accentColor }}>
                      {row.note}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <section style={panel} className="p-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--nd-text)" }}>
              Last session here
            </h2>
            <p className="mt-2 flex items-center gap-2 text-[12px]" style={{ color: "var(--nd-text)", fontFamily: mono }}>
              <Glyph name="User" className="h-3.5 w-3.5" />
              {LAST_SESSION.email}
            </p>
            <p className="mt-1 text-[11.5px]" style={{ color: "var(--nd-muted)", fontVariantNumeric: "tabular-nums" }}>
              Signed in {LAST_SESSION.signedIn} · token expired {LAST_SESSION.expiredAgo}
            </p>
            <button
              type="button"
              onClick={() => {
                setEmail(LAST_SESSION.email);
                setErrors({});
                passwordRef.current && passwordRef.current.focus();
              }}
              disabled={busy || done}
              className="nd-link nd-focus mt-2 rounded px-1 text-[12px] disabled:opacity-50"
              style={{ color: brand.primaryColor, borderRadius: brand.radius }}
            >
              Use this email
            </button>
          </section>

          <section style={panel} className="p-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--nd-text)" }}>
              Shortcuts
            </h2>
            <ul className="mt-2.5 space-y-2">
              {SHORTCUTS.map((s) => (
                <li key={s.action} className="flex items-center justify-between gap-3">
                  <span className="text-[12px]" style={{ color: "var(--nd-muted)" }}>
                    {s.action}
                  </span>
                  <span className="flex gap-1">
                    {s.keys.map((k) => (
                      <kbd
                        key={k}
                        className="px-1.5 py-[1px] text-[10.5px]"
                        style={{
                          color: "var(--nd-text)",
                          border: "1px solid var(--nd-line-strong)",
                          borderRadius: "4px",
                          fontFamily: mono,
                        }}
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="pt-1">
            <p className="text-[10.5px] uppercase tracking-[0.12em]" style={{ color: "var(--nd-muted)", fontFamily: mono }}>
              Preview state
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                {
                  id: "clean",
                  label: "First visit",
                  run: () => { setBanner(null); setApi({ state: "online", latency: 21, at: "18:53:40" }); setAttempts(0); setErrors({}); },
                },
                {
                  id: "expired",
                  label: "Session expired",
                  run: () => {
                    setApi({ state: "online", latency: 23, at: "18:51:04" });
                    setBanner({ tone: "notice", icon: "Clock", title: "Your session expired.", body: "Tokens last 24 hours. Sign in again to pick up the chat you left open." });
                  },
                },
                {
                  id: "offline",
                  label: "API offline",
                  run: () => {
                    setApi({ state: "offline", latency: 0, at: "18:54:12" });
                    setBanner({ tone: "error", icon: "AlertCircle", title: "Can't reach the API on 127.0.0.1:8000.", body: "Start the backend with  uvicorn app.main:app --reload  and try again. Nothing you typed was lost." });
                  },
                },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={s.run}
                  className="nd-focus px-2 py-1 text-[11px] transition-colors hover:bg-white/5"
                  style={{
                    color: "var(--nd-muted)",
                    border: "1px dashed var(--nd-line-strong)",
                    borderRadius: brand.radius,
                    fontFamily: mono,
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10.5px]" style={{ color: "var(--nd-muted)" }}>
              Prototype switches — not part of the shipped screen.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
