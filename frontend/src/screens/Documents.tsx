// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const { Search, Check, X, ChevronRight, FileText, Trash, Filter, Upload, ArrowRight, AlertCircle, CheckCircle } = Icons;

const INITIAL_DOCS = [
  {
    id: 'doc_8f21c4',
    filename: 'Q3-board-pack-2026.pdf',
    ext: 'pdf',
    chunk_count: 287,
    pages: 42,
    chats: 3,
    size: 1_842_000,
    created_at: '2026-10-12T21:14:00',
  },
  {
    id: 'doc_7c0a91',
    filename: 'vendor-msa-acme-signed.pdf',
    ext: 'pdf',
    chunk_count: 154,
    pages: 23,
    chats: 1,
    size: 962_000,
    created_at: '2026-10-12T09:02:00',
  },
  {
    id: 'doc_6b5503',
    filename: 'incident-postmortem-2026-10-07.docx',
    ext: 'docx',
    chunk_count: 63,
    pages: null,
    chats: 2,
    size: 118_400,
    created_at: '2026-10-09T17:48:00',
  },
  {
    id: 'doc_5a19ef',
    filename: 'gemini-rate-limit-notes.txt',
    ext: 'txt',
    chunk_count: 9,
    pages: null,
    chats: 0,
    size: 6_200,
    created_at: '2026-10-08T11:35:00',
  },
  {
    id: 'doc_4d7730',
    filename: 'employee-handbook-v4.pdf',
    ext: 'pdf',
    chunk_count: 300,
    pages: 58,
    chats: 5,
    size: 1_990_000,
    created_at: '2026-10-06T08:21:00',
    // This one was removed on the server by an earlier session: DELETE returns 404.
    gone: true,
  },
  {
    id: 'doc_3e0218',
    filename: 'soc2-evidence-index.docx',
    ext: 'docx',
    chunk_count: 41,
    pages: null,
    chats: 0,
    size: 74_800,
    created_at: '2026-10-05T19:10:00',
  },
];

const ACCEPTED = ['pdf', 'docx', 'txt'];
const MAX_BYTES = 2 * 1024 * 1024;
const MAX_CHUNKS = 300;
const EMBED_MODEL = 'gemini-embedding-001';
const BYTES_PER_CHUNK = { pdf: 1850, docx: 1100, txt: 700 };

const MSG = {
  noKey: 'Add a Gemini API key to process documents and ask questions.',
  tooManyChunks: 'Document too large for the free tier.',
  rateLimit: 'Gemini free-tier limit reached. Wait a minute and try again.',
  geminiFailed: 'The AI service failed. Try again.',
};

export default function Screen() {
  const navigate = useNavigate();
  const hexA = (hex, a) => {
    const h = String(hex || '#000').replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const n = parseInt(full, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  };

  const primary = brand.primaryColor;
  const accent = brand.accentColor;
  const muted = brand.neutralColor;
  const radius = brand.radius;

  const panel = {
    backgroundColor: 'rgba(255,255,255,0.032)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: radius,
  };

  const I = ({ name, className = 'h-4 w-4', label }) => {
    const C = typeof Icons !== 'undefined' ? Icons[name] : null;
    if (!C) return null;
    return label
      ? <C className={className} role="img" aria-label={label} />
      : <C className={className} aria-hidden="true" />;
  };

  const [docs, setDocs] = React.useState(INITIAL_DOCS);
  const [listState, setListState] = React.useState('loading'); // loading | ready
  const [query, setQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [hasKey, setHasKey] = React.useState(false);
  const [keyDraft, setKeyDraft] = React.useState('');
  const [keyError, setKeyError] = React.useState('');
  const [upload, setUpload] = React.useState({ status: 'idle' });
  const [confirmId, setConfirmId] = React.useState(null);
  const [notice, setNotice] = React.useState(null); // {tone, title, body}
  const [freshIds, setFreshIds] = React.useState([]);
  const [syncedAt, setSyncedAt] = React.useState(() => new Date());

  const fileRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const keyRef = React.useRef(null);
  const confirmRef = React.useRef(null);
  const timers = React.useRef([]);
  const lastFile = React.useRef(null);
  const attempt = React.useRef(0);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };
  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));

  React.useEffect(() => {
    at(520, () => setListState('ready'));
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (confirmId && confirmRef.current) confirmRef.current.focus();
  }, [confirmId]);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (confirmId) {
          setConfirmId(null);
          return;
        }
      }
      const el = e.target;
      const tag = (el && el.tagName ? el.tagName : '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (el && el.isContentEditable)) return;
      if (e.key === '/') {
        e.preventDefault();
        if (searchRef.current) searchRef.current.focus();
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        openPicker();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmId, hasKey]);

  const openPicker = () => {
    if (upload.status === 'processing') return;
    if (!hasKey && keyRef.current) {
      keyRef.current.focus();
    }
    if (fileRef.current) fileRef.current.click();
  };

  const fmtBytes = (b) => {
    if (b == null) return '—';
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(0) + ' KB';
    return (b / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const fmtWhen = (iso) => {
    const d = new Date(iso);
    const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return date + ' · ' + time;
  };

  const relWhen = (iso) => {
    const d = new Date(iso);
    const days = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    return days + ' days ago';
  };

  const fmtClock = (d) =>
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  // ---- upload pipeline -------------------------------------------------
  const fail = (payload) => {
    clearTimers();
    setUpload({ status: 'error', ...payload });
  };

  const process = (file) => {
    clearTimers();
    lastFile.current = file;
    const name = file.name || 'untitled';
    const ext = (name.split('.').pop() || '').toLowerCase();
    const base = { name, ext, size: file.size };

    if (!ACCEPTED.includes(ext)) {
      return fail({
        ...base,
        heading: 'That file type is not supported',
        message: 'Upload a PDF, DOCX or TXT file. Nothing was sent to Gemini.',
      });
    }
    if (file.size === 0) {
      return fail({
        ...base,
        heading: 'That file is empty or unreadable',
        message: 'No text could be extracted, so no document record was kept.',
      });
    }
    if (file.size > MAX_BYTES) {
      return fail({
        ...base,
        heading: 'That file exceeds the 2 MB limit',
        message: `${name} is ${fmtBytes(file.size)}. Split it or upload a smaller export.`,
      });
    }
    if (!hasKey) {
      if (keyRef.current) keyRef.current.focus();
      return fail({
        ...base,
        heading: 'No Gemini key available',
        message: MSG.noKey,
        showKey: true,
      });
    }

    const chunks = Math.max(1, Math.ceil(file.size / (BYTES_PER_CHUNK[ext] || 700)));
    if (chunks > MAX_CHUNKS) {
      return fail({
        ...base,
        heading: MSG.tooManyChunks,
        message: `Roughly ${chunks.toLocaleString()} chunks at 800 characters — the cap is ${MAX_CHUNKS}. No embeddings were requested.`,
      });
    }

    const pages = ext === 'pdf' ? Math.max(1, Math.round(chunks / 6.8)) : null;
    const batches = Math.ceil(chunks / 50);
    attempt.current += 1;
    const willRateLimit = chunks > 200 && attempt.current === 1;

    setUpload({
      status: 'processing',
      ...base,
      chunks,
      pages,
      batches,
      batch: 0,
      stage: 'extract',
    });

    at(480, () => setUpload((u) => (u.status === 'processing' ? { ...u, stage: 'chunk' } : u)));
    at(960, () => setUpload((u) => (u.status === 'processing' ? { ...u, stage: 'embed', batch: 1 } : u)));
    for (let i = 2; i <= batches; i++) {
      at(960 + (i - 1) * 380, () =>
        setUpload((u) => (u.status === 'processing' ? { ...u, batch: i } : u))
      );
    }
    const end = 1100 + batches * 380;

    if (willRateLimit) {
      at(end, () =>
        fail({
          ...base,
          heading: MSG.rateLimit,
          message: `Embedding stopped at batch ${Math.max(1, batches - 1)} of ${batches}. Nothing was saved — retry and it starts again from chunk 0.`,
          retry: true,
        })
      );
      return;
    }

    at(end, () => {
      const doc = {
        id: 'doc_' + Math.random().toString(16).slice(2, 8),
        filename: name,
        ext,
        chunk_count: chunks,
        pages,
        chats: 0,
        size: file.size,
        created_at: new Date().toISOString(),
      };
      setDocs((prev) => [doc, ...prev]);
      setFreshIds((prev) => [...prev, doc.id]);
      setSyncedAt(new Date());
      setUpload({ status: 'done', ...base, chunks, pages, batches, doc });
      attempt.current = 0;
    });
  };

  const onPick = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (file) {
      setNotice(null);
      process(file);
    }
  };

  const submitKey = (e) => {
    e.preventDefault();
    const v = keyDraft.trim();
    if (v.length < 20) {
      setKeyError('That does not look like a Gemini API key — they are longer than 20 characters.');
      return;
    }
    setKeyError('');
    setKeyDraft('');
    setHasKey(true);
    setUpload((u) => (u.status === 'error' && u.showKey ? { status: 'idle' } : u));
    setNotice({
      tone: 'ok',
      title: 'Key accepted for this session',
      body: 'Held in the server process for your account only. It is never written to the database, the logs or any response. A restart clears it.',
    });
  };

  const clearKey = () => {
    setHasKey(false);
    setNotice({
      tone: 'warn',
      title: 'Key cleared from server memory',
      body: 'Uploads and questions are blocked until you paste a key again.',
    });
  };

  const doDelete = (doc) => {
    setConfirmId(null);
    if (doc.gone) {
      setDocs((prev) => prev.filter((d) => d.id !== doc.id));
      setSyncedAt(new Date());
      setNotice({
        tone: 'warn',
        title: `DELETE /api/v1/documents/${doc.id} → 404`,
        body: 'That document is not available to this account any more. The list has been refreshed from the server.',
      });
      return;
    }
    setDocs((prev) => prev.filter((d) => d.id !== doc.id));
    setSyncedAt(new Date());
    setNotice({
      tone: 'ok',
      title: `Deleted ${doc.filename}`,
      body: `${doc.chunk_count.toLocaleString()} chunks and ${doc.chats} ${doc.chats === 1 ? 'chat' : 'chats'} removed with it. Chunks and messages cascade; nothing is recoverable.`,
    });
  };

  const refresh = () => {
    clearTimers();
    setListState('loading');
    at(480, () => {
      setListState('ready');
      setSyncedAt(new Date());
    });
  };

  const counts = React.useMemo(() => {
    const c = { all: docs.length, pdf: 0, docx: 0, txt: 0 };
    docs.forEach((d) => { c[d.ext] = (c[d.ext] || 0) + 1; });
    return c;
  }, [docs]);

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return docs
      .filter((d) => (typeFilter === 'all' ? true : d.ext === typeFilter))
      .filter((d) => (q ? d.filename.toLowerCase().includes(q) : true))
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [docs, query, typeFilter]);

  const totalChunks = docs.reduce((s, d) => s + d.chunk_count, 0);
  const totalChats = docs.reduce((s, d) => s + d.chats, 0);

  const progress =
    upload.status !== 'processing'
      ? 0
      : upload.stage === 'extract'
      ? 10
      : upload.stage === 'chunk'
      ? 26
      : 26 + (70 * upload.batch) / Math.max(1, upload.batches);

  const stageLine = (key, label, done, active, detail) => (
    <div className="flex items-baseline gap-2 font-mono text-[12px] leading-5" key={key}>
      <span
        className="w-3 shrink-0"
        style={{ color: done ? primary : active ? accent : 'rgba(255,255,255,0.25)' }}
        aria-hidden="true"
      >
        {done ? '✓' : active ? '›' : '·'}
      </span>
      <span
        className="w-16 shrink-0"
        style={{ color: active ? accent : done ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.3)' }}
      >
        {label}
      </span>
      <span style={{ color: done || active ? muted : 'rgba(255,255,255,0.22)', fontVariantNumeric: 'tabular-nums' }}>
        {detail}
      </span>
    </div>
  );

  const typeBadge = (ext) => (
    <span
      className="inline-flex items-center rounded px-1.5 py-[1px] font-mono text-[10px] uppercase tracking-wider"
      style={{
        color: muted,
        border: '1px solid rgba(255,255,255,0.14)',
        backgroundColor: 'rgba(255,255,255,0.04)',
      }}
    >
      {ext}
    </span>
  );

  const ghostBtn =
    'nd-focus inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[12px] font-medium transition-colors';

  return (
    <div
      className="min-h-full px-6 py-6 lg:px-8"
      style={{
        fontFamily: brand.fontBody,
        color: 'rgba(255,255,255,0.92)',
        backgroundColor: brand.backgroundColor,
        ['--nd-primary']: primary,
        ['--nd-accent']: accent,
      }}
    >
      <style>{`
        .nd-focus:focus-visible { outline: 2px solid var(--nd-primary); outline-offset: 2px; }
        .nd-row-in { animation: ndRowIn 260ms ease-out both; }
        @keyframes ndRowIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        .nd-panel-in { animation: ndPanelIn 200ms ease-out both; }
        @keyframes ndPanelIn { from { opacity: 0; transform: translateY(-3px); } to { opacity: 1; transform: none; } }
        .nd-pulse { animation: ndPulse 1.1s ease-in-out infinite; }
        @keyframes ndPulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
        .nd-shimmer { background-size: 400% 100%; animation: ndShimmer 1.4s linear infinite; }
        @keyframes ndShimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }
        .nd-row:hover .nd-row-actions { opacity: 1; }
        .nd-row-actions:focus-within { opacity: 1; }
        @media (prefers-reduced-motion: reduce) {
          .nd-row-in, .nd-panel-in, .nd-pulse, .nd-shimmer { animation: none !important; }
        }
      `}</style>

      {/* Header ------------------------------------------------------- */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            className="text-[26px] font-semibold leading-tight tracking-[-0.01em]"
            style={{ fontFamily: brand.fontHeading }}
          >
            Documents
          </h1>
          <p
            className="mt-1.5 text-[13px]"
            style={{ color: muted, fontVariantNumeric: 'tabular-nums' }}
          >
            {docs.length} indexed · {totalChunks.toLocaleString()} chunks embedded ·{' '}
            {totalChats} {totalChats === 1 ? 'chat' : 'chats'} bound · 800-char chunks, 100 overlap
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-2 rounded px-2 py-1 text-[11px]"
            style={{ color: muted, border: '1px solid rgba(255,255,255,0.08)', fontVariantNumeric: 'tabular-nums' }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: listState === 'loading' ? accent : primary }}
              aria-hidden="true"
            />
            {listState === 'loading' ? 'Syncing…' : `Synced ${fmtClock(syncedAt)}`}
          </span>
          <button
            type="button"
            onClick={refresh}
            className={ghostBtn}
            style={{ color: muted, border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <I name="ArrowRight" className="h-3.5 w-3.5" />
            Refresh
          </button>
          <div className="hidden items-center gap-2 text-[11px] md:flex" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <kbd className="rounded border px-1.5 py-0.5 font-mono" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>U</kbd>
            upload
            <kbd className="rounded border px-1.5 py-0.5 font-mono" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>/</kbd>
            search
          </div>
        </div>
      </div>

      {/* Key strip ----------------------------------------------------- */}
      {!hasKey ? (
        <section
          className="nd-panel-in mt-5 p-4"
          style={{
            borderRadius: radius,
            border: `1px solid ${hexA(accent, 0.38)}`,
            backgroundColor: hexA(accent, 0.07),
          }}
          aria-labelledby="key-heading"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl">
              <h2 id="key-heading" className="flex items-center gap-2 text-[14px] font-semibold" style={{ color: accent }}>
                <I name="AlertCircle" className="h-4 w-4" />
                This server holds no Gemini key
              </h2>
              <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: muted }}>
                GEMINI_API_KEY is not set, so bring your own. It is kept in the server process for your account only —
                never stored, never logged, never returned. A restart clears it.
              </p>
            </div>
            <form onSubmit={submitKey} className="flex flex-wrap items-end gap-2">
              <div>
                <label htmlFor="gemini-key" className="block text-[11px] font-medium uppercase tracking-wider" style={{ color: muted }}>
                  Gemini API key
                </label>
                <input
                  id="gemini-key"
                  ref={keyRef}
                  type="password"
                  autoComplete="off"
                  value={keyDraft}
                  onChange={(e) => setKeyDraft(e.target.value)}
                  placeholder="AIza…"
                  aria-describedby={keyError ? 'gemini-key-error' : undefined}
                  aria-invalid={keyError ? 'true' : undefined}
                  className="nd-focus mt-1 w-72 rounded px-2.5 py-1.5 font-mono text-[12.5px] outline-none"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.35)',
                    border: `1px solid ${keyError ? accent : 'rgba(255,255,255,0.14)'}`,
                    borderRadius: radius,
                    color: 'rgba(255,255,255,0.92)',
                  }}
                />
              </div>
              <button
                type="submit"
                className="nd-focus rounded px-3 py-[9px] text-[12.5px] font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: primary, color: '#0A0F15', borderRadius: radius }}
              >
                Use this key
              </button>
            </form>
          </div>
          {keyError ? (
            <p id="gemini-key-error" className="mt-2 text-[12px]" style={{ color: accent }}>
              {keyError}
            </p>
          ) : null}
        </section>
      ) : (
        <p className="mt-4 flex items-center gap-2 text-[12px]" style={{ color: muted }}>
          <I name="CheckCircle" className="h-3.5 w-3.5" />
          Gemini key active for this session · {EMBED_MODEL}
          <button
            type="button"
            onClick={clearKey}
            className="nd-focus rounded px-1.5 py-0.5 underline underline-offset-2 transition-colors hover:opacity-80"
            style={{ color: muted }}
          >
            Clear key
          </button>
        </p>
      )}

      {/* Upload: the focal point --------------------------------------- */}
      <section className="mt-5" aria-labelledby="upload-heading">
        <div
          className="p-5 lg:p-6"
          style={{
            borderRadius: radius,
            border:
              upload.status === 'processing'
                ? `1px solid ${hexA(accent, 0.45)}`
                : upload.status === 'error'
                ? `1px solid ${hexA(accent, 0.35)}`
                : `1px solid ${hexA(primary, 0.32)}`,
            backgroundColor:
              upload.status === 'processing' ? hexA(accent, 0.05) : hexA(primary, 0.05),
            transition: 'border-color 200ms ease, background-color 200ms ease',
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-lg">
              <h2 id="upload-heading" className="text-[17px] font-semibold tracking-[-0.01em]" style={{ fontFamily: brand.fontHeading }}>
                Upload a document
              </h2>
              <p id="upload-constraints" className="mt-1.5 text-[12.5px] leading-relaxed" style={{ color: muted }}>
                One PDF, DOCX or TXT at a time, up to 2 MB and 300 chunks. Extraction, chunking and embedding all run
                inside the request. The original file is discarded once chunked — only chunks and embeddings are kept.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                ref={fileRef}
                id="file-input"
                type="file"
                accept=".pdf,.docx,.txt"
                className="sr-only"
                onChange={onPick}
                aria-label="Choose a PDF, DOCX or TXT file to upload"
              />
              <button
                type="button"
                onClick={openPicker}
                disabled={upload.status === 'processing'}
                aria-describedby="upload-constraints"
                className="nd-focus inline-flex items-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: primary, color: '#0A0F15', borderRadius: radius }}
              >
                <I name="Upload" className="h-4 w-4" />
                {upload.status === 'processing' ? 'Processing…' : 'Choose file'}
              </button>
            </div>
          </div>

          {/* in-flight */}
          <div role="status" aria-live="polite">
            {upload.status === 'processing' ? (
              <div className="nd-panel-in mt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate font-mono text-[12.5px]" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {upload.name}
                  </p>
                  <span className="text-[12px]" style={{ color: accent, fontVariantNumeric: 'tabular-nums' }}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-full rounded"
                    style={{ width: progress + '%', backgroundColor: accent, transition: 'width 320ms ease' }}
                  />
                </div>
                <div className="mt-3 space-y-0.5">
                  {stageLine(
                    'extract',
                    'extract',
                    upload.stage !== 'extract',
                    upload.stage === 'extract',
                    upload.ext === 'pdf'
                      ? `${upload.ext} · ${upload.pages} pages · page numbers kept`
                      : `${upload.ext} · page = null`
                  )}
                  {stageLine(
                    'chunk',
                    'chunk',
                    upload.stage === 'embed',
                    upload.stage === 'chunk',
                    `${upload.chunks} chunks · 800 chars · 100 overlap`
                  )}
                  {stageLine(
                    'embed',
                    'embed',
                    false,
                    upload.stage === 'embed',
                    `batch ${Math.max(1, upload.batch)}/${upload.batches} · RETRIEVAL_DOCUMENT · ${EMBED_MODEL}`
                  )}
                </div>
              </div>
            ) : null}

            {/* error */}
            {upload.status === 'error' ? (
              <div
                className="nd-panel-in mt-5 p-3.5"
                style={{
                  borderRadius: radius,
                  border: `1px solid ${hexA(accent, 0.4)}`,
                  backgroundColor: hexA(accent, 0.08),
                }}
              >
                <div className="flex items-start gap-2.5">
                  <span style={{ color: accent }}>
                    <I name="AlertCircle" className="mt-[1px] h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold" style={{ color: accent }}>
                      {upload.heading}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>
                      {upload.message}
                    </p>
                    <p className="mt-1.5 truncate font-mono text-[11.5px]" style={{ color: muted }}>
                      {upload.name} · {fmtBytes(upload.size)}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {upload.retry ? (
                        <button
                          type="button"
                          onClick={() => lastFile.current && process(lastFile.current)}
                          className="nd-focus rounded px-3 py-1.5 text-[12.5px] font-semibold transition-opacity hover:opacity-90"
                          style={{ backgroundColor: primary, color: '#0A0F15', borderRadius: radius }}
                        >
                          Retry embedding
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={openPicker}
                          className="nd-focus rounded px-3 py-1.5 text-[12.5px] font-semibold transition-opacity hover:opacity-90"
                          style={{ backgroundColor: primary, color: '#0A0F15', borderRadius: radius }}
                        >
                          Choose another file
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setUpload({ status: 'idle' })}
                        className={ghostBtn}
                        style={{ color: muted, border: '1px solid rgba(255,255,255,0.12)' }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* success */}
            {upload.status === 'done' ? (
              <div
                className="nd-panel-in mt-5 flex flex-wrap items-center justify-between gap-3 p-3.5"
                style={{
                  borderRadius: radius,
                  border: `1px solid ${hexA(primary, 0.4)}`,
                  backgroundColor: hexA(primary, 0.08),
                }}
              >
                <p className="flex items-center gap-2.5 text-[12.5px]" style={{ color: 'rgba(255,255,255,0.86)' }}>
                  <span style={{ color: primary }}>
                    <I name="CheckCircle" className="h-4 w-4" />
                  </span>
                  <span className="font-mono">{upload.doc.filename}</span>
                  <span style={{ color: muted, fontVariantNumeric: 'tabular-nums' }}>
                    is Ready · {upload.doc.chunk_count} chunks · {upload.doc.pages ? `${upload.doc.pages} pages` : 'no page numbers'}
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('chat')}
                    className="nd-focus inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-[12.5px] font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: primary, color: '#0A0F15', borderRadius: radius }}
                  >
                    Start a chat
                    <I name="ChevronRight" className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpload({ status: 'idle' })}
                    aria-label="Dismiss upload confirmation"
                    className="nd-focus rounded p-1.5 transition-colors"
                    style={{ color: muted }}
                  >
                    <I name="X" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Notices -------------------------------------------------------- */}
      {notice ? (
        <div
          className="nd-panel-in mt-4 flex items-start justify-between gap-3 p-3"
          role="status"
          style={{
            borderRadius: radius,
            border: `1px solid ${notice.tone === 'warn' ? hexA(accent, 0.32) : 'rgba(255,255,255,0.1)'}`,
            backgroundColor: notice.tone === 'warn' ? hexA(accent, 0.06) : 'rgba(255,255,255,0.03)',
          }}
        >
          <div className="flex items-start gap-2.5">
            <span style={{ color: notice.tone === 'warn' ? accent : primary }}>
              <I name={notice.tone === 'warn' ? 'AlertCircle' : 'Check'} className="mt-[2px] h-4 w-4" />
            </span>
            <div>
              <p className="font-mono text-[12.5px] font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {notice.title}
              </p>
              <p className="mt-0.5 text-[12.5px] leading-relaxed" style={{ color: muted }}>
                {notice.body}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss notice"
            className="nd-focus rounded p-1"
            style={{ color: muted }}
          >
            <I name="X" className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      {/* List ----------------------------------------------------------- */}
      <section className="mt-7" aria-labelledby="list-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="list-heading" className="text-[14px] font-semibold uppercase tracking-[0.08em]" style={{ color: muted }}>
            Indexed documents
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex items-center gap-1 rounded p-0.5"
              style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: radius }}
              role="group"
              aria-label="Filter by file type"
            >
              {[
                { id: 'all', label: 'All' },
                { id: 'pdf', label: 'PDF' },
                { id: 'docx', label: 'DOCX' },
                { id: 'txt', label: 'TXT' },
              ].map((t) => {
                const active = typeFilter === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTypeFilter(t.id)}
                    className="nd-focus rounded px-2.5 py-1 text-[12px] font-medium transition-colors"
                    style={{
                      backgroundColor: active ? hexA(primary, 0.16) : 'transparent',
                      color: active ? primary : muted,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {t.label}{' '}
                    <span style={{ opacity: 0.65 }}>{counts[t.id] || 0}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="doc-search" className="text-[11px] font-medium uppercase tracking-wider" style={{ color: muted }}>
                Search
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2" style={{ color: muted }}>
                  <I name="Search" className="h-3.5 w-3.5" />
                </span>
                <input
                  id="doc-search"
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="filename…"
                  className="nd-focus w-56 rounded py-1.5 pl-7 pr-2 text-[12.5px] outline-none"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: radius,
                    color: 'rgba(255,255,255,0.92)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 overflow-hidden" style={panel}>
          {listState === 'loading' ? (
            <div className="p-4" role="status" aria-live="polite">
              <p className="mb-3 text-[12.5px]" style={{ color: muted }}>
                Loading your documents from /api/v1/documents…
              </p>
              <ul className="space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <li
                    key={i}
                    className="nd-shimmer h-8 rounded"
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)',
                      borderRadius: radius,
                    }}
                  />
                ))}
              </ul>
            </div>
          ) : docs.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <span className="inline-flex" style={{ color: primary }}>
                <I name="FileText" className="h-6 w-6" />
              </span>
              <h3 className="mt-3 text-[15px] font-semibold" style={{ fontFamily: brand.fontHeading }}>
                Nothing indexed yet
              </h3>
              <p className="mx-auto mt-1.5 max-w-md text-[12.5px] leading-relaxed" style={{ color: muted }}>
                Upload a PDF, DOCX or TXT and it lands here with its chunk count, page count and the chats bound to it.
                Every answer you get later comes only from the document you pick.
              </p>
              <button
                type="button"
                onClick={openPicker}
                className="nd-focus mt-4 inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: primary, color: '#0A0F15', borderRadius: radius }}
              >
                <I name="Upload" className="h-4 w-4" />
                Choose file
              </button>
            </div>
          ) : visible.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <span className="inline-flex" style={{ color: muted }}>
                <I name="Search" className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-[14px] font-semibold">
                No document matches {query ? `“${query}”` : `type ${typeFilter.toUpperCase()}`}
              </h3>
              <p className="mt-1.5 text-[12.5px]" style={{ color: muted }}>
                {docs.length} {docs.length === 1 ? 'document is' : 'documents are'} indexed under this account.
              </p>
              <button
                type="button"
                onClick={() => { setQuery(''); setTypeFilter('all'); }}
                className={'mt-4 ' + ghostBtn}
                style={{ color: primary, border: `1px solid ${hexA(primary, 0.35)}` }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <table className="w-full text-left" style={{ fontVariantNumeric: 'tabular-nums' }}>
              <caption className="sr-only">
                Your uploaded documents, newest first, with chunk counts and a delete action.
              </caption>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: muted }}>
                    Document
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider" style={{ color: muted }}>
                    Chunks
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider" style={{ color: muted }}>
                    Pages
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider" style={{ color: muted }}>
                    Chats
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: muted }}>
                    Uploaded
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: muted }}>
                    Status
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider" style={{ color: muted }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {upload.status === 'processing' ? (
                  <tr className="nd-row-in" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: hexA(accent, 0.05) }}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        {typeBadge(upload.ext)}
                        <span className="font-mono text-[12.5px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
                          {upload.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right text-[12.5px]" style={{ color: muted }}>{upload.chunks}</td>
                    <td className="px-3 py-2.5 text-right text-[12.5px]" style={{ color: muted }}>{upload.pages || '—'}</td>
                    <td className="px-3 py-2.5 text-right text-[12.5px]" style={{ color: muted }}>0</td>
                    <td className="px-3 py-2.5 text-[12.5px]" style={{ color: muted }}>now</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium" style={{ color: accent }}>
                        <span className="nd-pulse h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
                        Processing…
                      </span>
                    </td>
                    <td className="px-4 py-2.5" />
                  </tr>
                ) : null}

                {visible.map((d) => (
                  <React.Fragment key={d.id}>
                    <tr
                      className={'nd-row group' + (freshIds.includes(d.id) ? ' nd-row-in' : '')}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          {typeBadge(d.ext)}
                          <span className="font-mono text-[12.5px]" style={{ color: 'rgba(255,255,255,0.92)' }}>
                            {d.filename}
                          </span>
                          <span className="text-[11.5px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            {fmtBytes(d.size)}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right text-[12.5px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        {d.chunk_count.toLocaleString()}
                      </td>
                      <td className="px-3 py-2.5 text-right text-[12.5px]" style={{ color: d.pages ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.28)' }}>
                        {d.pages || '—'}
                      </td>
                      <td className="px-3 py-2.5 text-right text-[12.5px]" style={{ color: d.chats ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.28)' }}>
                        {d.chats}
                      </td>
                      <td className="px-3 py-2.5 text-[12.5px]" style={{ color: muted }}>
                        {fmtWhen(d.created_at)}
                        <span className="ml-1.5 text-[11.5px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                          {relWhen(d.created_at)}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.78)' }}>
                          <span style={{ color: primary }}>
                            <I name="CheckCircle" className="h-3.5 w-3.5" />
                          </span>
                          Ready
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="nd-row-actions flex items-center justify-end gap-1 opacity-70 transition-opacity">
                          <button
                            type="button"
                            onClick={() => navigate('chat')}
                            className={ghostBtn}
                            style={{ color: primary }}
                          >
                            New chat
                            <I name="ChevronRight" className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(confirmId === d.id ? null : d.id)}
                            aria-label={`Delete ${d.filename}`}
                            aria-expanded={confirmId === d.id}
                            className="nd-focus rounded p-1.5 transition-colors hover:opacity-100"
                            style={{ color: confirmId === d.id ? accent : muted }}
                          >
                            <I name="Trash" className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {confirmId === d.id ? (
                      <tr className="nd-row-in" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <td colSpan={7} className="px-4 py-3" style={{ backgroundColor: hexA(accent, 0.06) }}>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-[12.5px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                              Delete <span className="font-mono">{d.filename}</span>? This removes{' '}
                              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{d.chunk_count.toLocaleString()}</span> chunks
                              {d.chats > 0 ? (
                                <>
                                  , {d.chats} bound {d.chats === 1 ? 'chat' : 'chats'} and every message in {d.chats === 1 ? 'it' : 'them'}
                                </>
                              ) : null}
                              . It cannot be undone.
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                ref={confirmRef}
                                onClick={() => doDelete(d)}
                                className="nd-focus rounded px-3 py-1.5 text-[12.5px] font-semibold transition-opacity hover:opacity-90"
                                style={{ backgroundColor: accent, color: '#11161C', borderRadius: radius }}
                              >
                                Delete permanently
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmId(null)}
                                className={ghostBtn}
                                style={{ color: muted, border: '1px solid rgba(255,255,255,0.12)' }}
                              >
                                Cancel
                                <kbd className="ml-1 font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Esc</kbd>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="mt-3 text-[11.5px]" style={{ color: 'rgba(255,255,255,0.32)' }}>
          Full list, no pagination. Documents can be deleted but not renamed, re-processed or downloaded — the uploaded
          file is discarded after chunking.
        </p>
      </section>
    </div>
  );
}
