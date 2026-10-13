// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const { Button, Input, Label, Badge, Separator } = UI;
const { Check, X, User, FileText, Clock, Upload, ArrowRight, AlertCircle, CheckCircle } = Icons;

// Accounts already on this instance — drives the duplicate-email path.
const TAKEN_EMAILS = [
  "test@example.com",
  "dana.ortiz@northwind.io",
  "ops@parallax.dev",
  "m.haddad@gridlineanalytics.com",
];

const SERVER_CONFIG = [
  { key: "DATABASE_URL", value: "unset → sqlite:///./ragchat.db" },
  { key: "GEMINI_CHAT_MODEL", value: "gemini-2.5-flash" },
  { key: "GEMINI_EMBED_MODEL", value: "gemini-embedding-001" },
  { key: "GEMINI_API_KEY", value: "unset → bring your own" },
];

const NEXT_STEPS = [
  { icon: Icons.Upload, label: "Upload one file", detail: "PDF, DOCX or TXT, up to 2 MB" },
  { icon: Icons.FileText, label: "It is chunked and embedded", detail: "~800 chars, 100 char overlap, max 300 chunks" },
  { icon: Icons.User, label: "Ask, grounded only in that file", detail: "Every answer cites its page or chunk" },
];

/* ---- colour helpers: every value derives from a brand token ---- */
function toRgb(hex) {
  const h = String(hex).replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)];
}
function lighten(hex, t) {
  const [r, g, b] = toRgb(hex);
  const m = (c) => Math.round(c + (255 - c) * t);
  return `rgb(${m(r)}, ${m(g)}, ${m(b)})`;
}
function darken(hex, t) {
  const [r, g, b] = toRgb(hex);
  const m = (c) => Math.round(c * (1 - t));
  return `rgb(${m(r)}, ${m(g)}, ${m(b)})`;
}
function alpha(hex, a) {
  const [r, g, b] = toRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export default function Screen() {
  const navigate = useNavigate();
  const C = React.useMemo(() => {
    const bg = brand.backgroundColor;
    const neutral = brand.neutralColor;
    return {
      bg,
      panel: lighten(bg, 0.045),
      panelAlt: lighten(bg, 0.025),
      border: alpha(neutral, 0.2),
      borderStrong: alpha(neutral, 0.34),
      textStrong: lighten(neutral, 0.82),
      textBody: lighten(neutral, 0.4),
      textMuted: neutral,
      primary: brand.primaryColor,
      onPrimary: darken(bg, 0.45),
      accent: brand.accentColor,
      accentSoft: alpha(brand.accentColor, 0.12),
      accentBorder: alpha(brand.accentColor, 0.4),
      primarySoft: alpha(brand.primaryColor, 0.12),
    };
  }, []);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [capsLock, setCapsLock] = React.useState(false);
  const [touched, setTouched] = React.useState({});
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [formError, setFormError] = React.useState(null);
  const [status, setStatus] = React.useState("idle"); // idle | submitting | created
  const [apiStatus, setApiStatus] = React.useState("checking"); // checking | online
  const [created, setCreated] = React.useState(null);

  const emailRef = React.useRef(null);
  const busyRef = React.useRef(false);
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    const t = setTimeout(() => setApiStatus("online"), 700);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  const longEnough = password.length >= 8;
  const matches = confirm.length > 0 && confirm === password;
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  function validate() {
    const next = {};
    if (!email.trim()) next.email = "Enter the email address you want to sign in with.";
    else if (!emailLooksValid) next.email = "That is not an email address — try you@domain.com.";
    if (!password) next.password = "Choose a password.";
    else if (!longEnough) next.password = "Password must be at least 8 characters.";
    if (!confirm) next.confirm = "Type the password once more.";
    else if (confirm !== password) next.confirm = "The two passwords do not match.";
    return next;
  }

  function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (busyRef.current || status === "created") return;

    const errs = validate();
    setTouched({ email: true, password: true, confirm: true });
    setFieldErrors(errs);
    setFormError(null);
    if (Object.keys(errs).length > 0) return;

    busyRef.current = true;
    setStatus("submitting");

    timerRef.current = setTimeout(() => {
      const normalized = email.trim().toLowerCase();
      busyRef.current = false;
      if (TAKEN_EMAILS.includes(normalized)) {
        setStatus("idle");
        setFormError({
          title: "An account with this email already exists.",
          hint: "Log in instead — your documents and chats are still there.",
          action: "login",
        });
        if (emailRef.current && emailRef.current.focus) emailRef.current.focus();
        return;
      }
      const now = new Date();
      setCreated({
        email: normalized,
        created_at: now,
        expires_at: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      });
      setStatus("created");
    }, 850);
  }

  function handleFormKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit(e);
  }

  function capsCheck(e) {
    if (e.getModifierState) setCapsLock(e.getModifierState("CapsLock"));
  }

  const submitting = status === "submitting";

  const fmtTime = (d) =>
    d.toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const labelCls = "text-[11px] uppercase tracking-[0.12em]";
  const inputStyle = {
    backgroundColor: C.panelAlt,
    borderColor: C.border,
    color: C.textStrong,
    borderRadius: brand.radius,
    fontFamily: brand.fontBody,
  };

  function FieldError({ id, message }) {
    if (!message) return null;
    return (
      <p id={id} className="nd-enter mt-1.5 flex items-start gap-1.5 text-[12px] leading-snug" style={{ color: C.accent }}>
        <AlertCircle className="mt-[1px] h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{message}</span>
      </p>
    );
  }

  return (
    <div
      className="min-h-full w-full px-5 py-8 sm:px-8"
      style={{ backgroundColor: C.bg, fontFamily: brand.fontBody, color: C.textBody }}
    >
      <style>{`
        @keyframes ndEnter { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        .nd-enter { animation: ndEnter .18s ease-out both; }
        .nd-panel-enter { animation: ndEnter .26s cubic-bezier(.2,.8,.3,1) both; }
        .nd-focus:focus-visible { outline: 2px solid ${C.primary}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          .nd-enter, .nd-panel-enter { animation: none !important; }
          * { transition-duration: .01ms !important; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={labelCls} style={{ color: C.textMuted }}>
              Step 1 of 2 &middot; account
            </p>
            <h1
              className="mt-1.5 text-[26px] font-semibold leading-tight tracking-tight"
              style={{ color: C.textStrong, fontFamily: brand.fontHeading }}
            >
              Create account
            </h1>
            <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed" style={{ color: C.textBody }}>
              One email, one password of eight characters or more. Nothing is emailed to you &mdash; everything
              happens on this screen.
            </p>
          </div>

          <div
            className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] transition-colors"
            style={{
              borderColor: C.border,
              backgroundColor: C.panelAlt,
              color: apiStatus === "online" ? C.textBody : C.textMuted,
              borderRadius: "999px",
              fontVariantNumeric: "tabular-nums",
            }}
            aria-live="polite"
          >
            {apiStatus === "checking" ? (
              <>
                <Clock className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" />
                <span>Checking API&hellip;</span>
              </>
            ) : (
              <>
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: C.primary }}
                  aria-hidden="true"
                />
                <span>API v1 online &middot; SQLite</span>
              </>
            )}
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* ---------------- Primary column ---------------- */}
          <section
            className="rounded-lg border"
            style={{ backgroundColor: C.panel, borderColor: C.border, borderRadius: brand.radius }}
          >
            {status === "created" ? (
              <div className="nd-panel-enter p-6">
                <h2 className="sr-only">Account created</h2>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" style={{ color: C.primary }} aria-hidden="true" />
                  <div>
                    <p className="text-[17px] font-semibold" style={{ color: C.textStrong }}>
                      Account created for {created.email}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed" style={{ color: C.textBody }}>
                      Your password is stored only as a bcrypt hash. You are signed in with a token that expires in
                      24 hours.
                    </p>
                  </div>
                </div>

                <dl
                  className="mt-5 grid gap-px overflow-hidden rounded border sm:grid-cols-3"
                  style={{ borderColor: C.border, backgroundColor: C.border, borderRadius: brand.radius, fontVariantNumeric: "tabular-nums" }}
                >
                  {[
                    { t: "Created at", v: fmtTime(created.created_at) },
                    { t: "Session expires", v: fmtTime(created.expires_at) },
                    { t: "Documents", v: "0 uploaded" },
                  ].map((item) => (
                    <div key={item.t} className="px-3.5 py-3" style={{ backgroundColor: C.panelAlt }}>
                      <dt className={labelCls} style={{ color: C.textMuted }}>
                        {item.t}
                      </dt>
                      <dd className="mt-1 text-[13px]" style={{ color: C.textStrong }}>
                        {item.v}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div
                  className="mt-5 flex items-start gap-2 rounded border px-3.5 py-3 text-[12.5px] leading-relaxed"
                  style={{ borderColor: C.accentBorder, backgroundColor: C.accentSoft, borderRadius: brand.radius, color: C.textStrong }}
                >
                  <AlertCircle className="mt-[2px] h-4 w-4 shrink-0" style={{ color: C.accent }} aria-hidden="true" />
                  <span>
                    This server holds no <code className="font-mono">GEMINI_API_KEY</code>. Paste your own key in the
                    chat view before uploading &mdash; it is kept in server memory for your session only.
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => navigate("chat")}
                    className="nd-focus inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold"
                    style={{ backgroundColor: C.primary, color: C.onPrimary, borderRadius: brand.radius, border: "none" }}
                  >
                    Go to chat
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    onClick={() => navigate("documents")}
                    className="nd-focus px-4 py-2 text-[13px]"
                    style={{
                      backgroundColor: "transparent",
                      color: C.textBody,
                      border: `1px solid ${C.borderStrong}`,
                      borderRadius: brand.radius,
                    }}
                  >
                    Upload first document
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} noValidate className="p-6">
                <h2 className={labelCls + " mb-5"} style={{ color: C.textMuted }}>
                  Account details
                </h2>

                {formError && (
                  <div
                    role="alert"
                    className="nd-enter mb-5 flex items-start gap-2.5 rounded border px-3.5 py-3"
                    style={{ borderColor: C.accentBorder, backgroundColor: C.accentSoft, borderRadius: brand.radius }}
                  >
                    <AlertCircle className="mt-[2px] h-4 w-4 shrink-0" style={{ color: C.accent }} aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold" style={{ color: C.textStrong }}>
                        {formError.title}
                      </p>
                      <p className="mt-0.5 text-[12.5px]" style={{ color: C.textBody }}>
                        {formError.hint}
                      </p>
                      {formError.action === "login" && (
                        <button
                          type="button"
                          onClick={() => navigate("login")}
                          className="nd-focus mt-2 rounded text-[12.5px] font-semibold underline underline-offset-4"
                          style={{ color: C.accent, borderRadius: brand.radius }}
                        >
                          Log in as {email.trim().toLowerCase()}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Email */}
                  <div>
                    <Label htmlFor="reg-email" className={labelCls} style={{ color: C.textMuted }}>
                      Email address
                    </Label>
                    <Input
                      id="reg-email"
                      ref={emailRef}
                      type="email"
                      autoComplete="email"
                      spellCheck="false"
                      value={email}
                      disabled={submitting}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                        if (formError) setFormError(null);
                      }}
                      onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                      aria-invalid={fieldErrors.email ? "true" : "false"}
                      aria-describedby={fieldErrors.email ? "reg-email-error" : undefined}
                      placeholder="you@domain.com"
                      className="nd-focus mt-1.5 w-full border px-3 py-2 text-[13.5px]"
                      style={inputStyle}
                    />
                    <FieldError id="reg-email-error" message={touched.email ? fieldErrors.email : null} />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <Label htmlFor="reg-password" className={labelCls} style={{ color: C.textMuted }}>
                        Password
                      </Label>
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="nd-focus rounded text-[11.5px] uppercase tracking-[0.1em]"
                        style={{ color: C.textMuted, borderRadius: brand.radius }}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      disabled={submitting}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                      }}
                      onKeyUp={capsCheck}
                      onKeyDown={capsCheck}
                      onBlur={() => {
                        setTouched((p) => ({ ...p, password: true }));
                        setCapsLock(false);
                      }}
                      aria-invalid={fieldErrors.password ? "true" : "false"}
                      aria-describedby="reg-password-rules"
                      className="nd-focus mt-1.5 w-full border px-3 py-2 text-[13.5px]"
                      style={{ ...inputStyle, fontFamily: showPassword ? "ui-monospace, monospace" : brand.fontBody }}
                    />
                    <FieldError id="reg-password-error" message={touched.password ? fieldErrors.password : null} />

                    <ul id="reg-password-rules" className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
                      {[
                        { ok: longEnough, label: `At least 8 characters (${password.length})` },
                        { ok: matches, label: "Both entries match" },
                      ].map((rule) => (
                        <li key={rule.label} className="flex items-center gap-1.5 text-[12px]" style={{ fontVariantNumeric: "tabular-nums" }}>
                          {rule.ok ? (
                            <Check className="h-3.5 w-3.5" style={{ color: C.primary }} aria-hidden="true" />
                          ) : (
                            <X className="h-3.5 w-3.5" style={{ color: C.textMuted }} aria-hidden="true" />
                          )}
                          <span style={{ color: rule.ok ? C.textStrong : C.textMuted }}>
                            {rule.label}
                            <span className="sr-only">{rule.ok ? " — met" : " — not met yet"}</span>
                          </span>
                        </li>
                      ))}
                    </ul>

                    {capsLock && (
                      <p className="nd-enter mt-2 flex items-center gap-1.5 text-[12px]" style={{ color: C.accent }}>
                        <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        Caps Lock is on.
                      </p>
                    )}
                  </div>

                  {/* Confirm */}
                  <div>
                    <Label htmlFor="reg-confirm" className={labelCls} style={{ color: C.textMuted }}>
                      Repeat password
                    </Label>
                    <Input
                      id="reg-confirm"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirm}
                      disabled={submitting}
                      onChange={(e) => {
                        setConfirm(e.target.value);
                        if (fieldErrors.confirm) setFieldErrors((p) => ({ ...p, confirm: undefined }));
                      }}
                      onBlur={() => setTouched((p) => ({ ...p, confirm: true }))}
                      aria-invalid={fieldErrors.confirm ? "true" : "false"}
                      aria-describedby={fieldErrors.confirm ? "reg-confirm-error" : undefined}
                      className="nd-focus mt-1.5 w-full border px-3 py-2 text-[13.5px]"
                      style={{ ...inputStyle, fontFamily: showPassword ? "ui-monospace, monospace" : brand.fontBody }}
                    />
                    <FieldError id="reg-confirm-error" message={touched.confirm ? fieldErrors.confirm : null} />
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={submitting}
                    aria-busy={submitting}
                    className="nd-focus inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold transition-opacity sm:w-auto sm:min-w-[220px]"
                    style={{
                      backgroundColor: C.primary,
                      color: C.onPrimary,
                      border: "none",
                      borderRadius: brand.radius,
                      opacity: submitting ? 0.7 : 1,
                      cursor: submitting ? "progress" : "pointer",
                    }}
                  >
                    {submitting ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Creating account&hellip;
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                  <p className="mt-2.5 text-[12px]" style={{ color: C.textMuted }}>
                    <kbd className="font-mono">&#8984;</kbd>/<kbd className="font-mono">Ctrl</kbd> +{" "}
                    <kbd className="font-mono">Enter</kbd> submits from any field.
                  </p>
                </div>

                <Separator className="my-5" style={{ backgroundColor: C.border, height: "1px", border: "none" }} />

                <p className="text-[13px]" style={{ color: C.textBody }}>
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("login")}
                    className="nd-focus rounded font-semibold underline underline-offset-4"
                    style={{ color: C.primary, borderRadius: brand.radius }}
                  >
                    Log in
                  </button>
                </p>
              </form>
            )}
          </section>

          {/* ---------------- Aside ---------------- */}
          <aside className="space-y-5">
            <section
              className="rounded-lg border p-4"
              style={{ backgroundColor: C.panelAlt, borderColor: C.border, borderRadius: brand.radius }}
            >
              <h2 className={labelCls} style={{ color: C.textMuted }}>
                After you register
              </h2>
              <ol className="mt-3 space-y-3">
                {NEXT_STEPS.map((step, i) => {
                  const StepIcon = step.icon;
                  return (
                    <li key={step.label} className="flex gap-2.5">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-semibold"
                        style={{ backgroundColor: C.primarySoft, color: C.primary, borderRadius: "4px", fontVariantNumeric: "tabular-nums" }}
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 text-[13px] font-medium" style={{ color: C.textStrong }}>
                          <StepIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          {step.label}
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-snug" style={{ color: C.textMuted }}>
                          {step.detail}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>

            <section
              className="rounded-lg border p-4"
              style={{ backgroundColor: C.panelAlt, borderColor: C.border, borderRadius: brand.radius }}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className={labelCls} style={{ color: C.textMuted }}>
                  Server config
                </h2>
                <Badge
                  className="px-2 py-0.5 text-[10.5px] uppercase tracking-[0.1em]"
                  style={{
                    backgroundColor: C.accentSoft,
                    color: C.accent,
                    border: `1px solid ${C.accentBorder}`,
                    borderRadius: "999px",
                  }}
                >
                  Bring your own key
                </Badge>
              </div>
              <dl className="mt-3 space-y-2.5" style={{ fontVariantNumeric: "tabular-nums" }}>
                {SERVER_CONFIG.map((row) => (
                  <div key={row.key}>
                    <dt className="font-mono text-[11px]" style={{ color: C.textMuted }}>
                      {row.key}
                    </dt>
                    <dd className="font-mono text-[12px] leading-snug" style={{ color: C.textBody }}>
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3.5 border-t pt-3 text-[12px] leading-snug" style={{ borderColor: C.border, color: C.textMuted }}>
                <code className="font-mono">JWT_SECRET</code> is unset, so this instance generates one at startup &mdash;
                everyone is logged out when it restarts.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
