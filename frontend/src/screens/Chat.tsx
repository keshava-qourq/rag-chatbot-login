// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const { Plus, Search, Check, X, ChevronRight, ChevronDown, Settings, FileText, Package, Clock, Trash, Filter, Upload, ArrowLeft, ArrowRight, AlertCircle, CheckCircle } = Icons;

/* ── Night Desk · Chat ───────────────────────────────────────────────────── */

const WHITE = [255, 255, 255];

const toRgb = (hex) => {
  const s = String(hex).replace('#', '');
  return [
    parseInt(s.slice(0, 2), 16),
    parseInt(s.slice(2, 4), 16),
    parseInt(s.slice(4, 6), 16),
  ];
};
const mix = (a, b, t) => {
  const A = toRgb(a);
  const B = Array.isArray(b) ? b : toRgb(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(' ')})`;
};
const alpha = (hex, a) => `rgba(${toRgb(hex).join(',')},${a})`;

const T = {
  bg: brand.backgroundColor,
  surface: mix(brand.backgroundColor, WHITE, 0.05),
  surfaceHi: mix(brand.backgroundColor, WHITE, 0.09),
  line: alpha(brand.neutralColor, 0.2),
  lineHi: alpha(brand.neutralColor, 0.38),
  textHi: mix(brand.neutralColor, WHITE, 0.82),
  textMid: mix(brand.neutralColor, WHITE, 0.22),
  textLow: mix(brand.neutralColor, brand.backgroundColor, 0.3),
  primary: brand.primaryColor,
  primarySoft: alpha(brand.primaryColor, 0.14),
  accent: brand.accentColor,
  accentSoft: alpha(brand.accentColor, 0.12),
  r: brand.radius,
};

const NOW = new Date('2026-10-13T10:12:00');
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n) => String(n).padStart(2, '0');
const hhmm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const fmtWhen = (iso) => {
  const d = new Date(iso);
  const y = new Date(NOW.getTime() - 86400000);
  if (dayKey(d) === dayKey(NOW)) return hhmm(d);
  if (dayKey(d) === dayKey(y)) return `Yest ${hhmm(d)}`;
  return `${DOW[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`;
};
const fmtDate = (iso) => {
  const d = new Date(iso);
  return `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`;
};

const NOT_FOUND = "I couldn't find that information in the uploaded document.";
const NO_KEY = 'Add a Gemini API key to process documents and ask questions.';
const RATE_LIMIT = 'Gemini free-tier limit reached. Wait a minute and try again.';
const CHAT_MODEL = 'gemini-2.5-flash';
const ABSENT = ['price', 'pricing', 'cost', 'salary', 'invoice', 'discount', 'weather', 'phone number'];

/* ── Documents the signed-in user owns ──────────────────────────────────── */
const DOCUMENTS = [
  {
    id: 'doc_soc2',
    filename: 'SOC2-Type-II-Report-2026.pdf',
    kind: 'pdf',
    chunk_count: 284,
    created_at: '2026-10-09T11:24:00',
    starters: [
      'Which subprocessors handle customer PII?',
      'How long are audit logs retained?',
      'Which controls were flagged as exceptions?',
    ],
    fallback: {
      content:
        'The report scopes the production platform in eu-west-1 for 1 Jan – 30 Jun 2026 against the security and availability criteria, and the auditor issued an unqualified opinion.',
      sources: [
        { page: 8, chunk_index: 12, score: 0.68, text: 'Scope of the examination: the Platform service hosted in AWS eu-west-1, for the period 1 January 2026 through 30 June 2026…' },
        { page: 9, chunk_index: 15, score: 0.61, text: '…in our opinion, the controls were suitably designed and operated effectively throughout the specified period.' },
      ],
    },
    qa: [
      {
        k: ['subprocessor', 'pii', 'personal data', 'vendor', 'third part'],
        content:
          'Three subprocessors touch customer personal data: AWS (hosting, eu-west-1), Twilio SendGrid (transactional email) and Datadog (telemetry). Each has a signed DPA, and Datadog receives only scrubbed request metadata.',
        sources: [
          { page: 61, chunk_index: 142, score: 0.86, text: 'Subprocessors with access to customer personal data are limited to Amazon Web Services (hosting, eu-west-1), Twilio SendGrid (transactional email) and Datadog (telemetry).' },
          { page: 62, chunk_index: 145, score: 0.79, text: 'Datadog receives request metadata and error traces; payload bodies are scrubbed at the agent before egress. Telemetry retention is 15 days.' },
          { page: 63, chunk_index: 149, score: 0.74, text: 'A data processing addendum is executed with each subprocessor prior to production access and reviewed annually by the privacy owner.' },
        ],
      },
      {
        k: ['audit log', 'retention', 'retain', 'logs', '400'],
        content:
          'Audit logs are kept for 400 days in immutable storage. Access is limited to the security engineering on-call rotation, and every read is itself logged.',
        sources: [
          { page: 34, chunk_index: 71, score: 0.88, text: 'Audit logs are retained for 400 days in immutable object storage with versioning and object lock enabled.' },
          { page: 35, chunk_index: 73, score: 0.72, text: 'Read access to the audit log bucket is restricted to the security engineering on-call role; each access event is itself recorded.' },
        ],
      },
      {
        k: ['exception', 'control', 'cc6', 'finding', 'flag'],
        content:
          'Two exceptions were recorded. CC6.7: two of forty sampled offboarding tickets exceeded the 24-hour revocation window in March 2026. CC7.2: one quarterly access review was completed nine days late.',
        sources: [
          { page: 88, chunk_index: 221, score: 0.83, text: 'Control CC6.7 — exceptions: two of forty sampled offboarding tickets exceeded the 24-hour access revocation window in March 2026.' },
          { page: 89, chunk_index: 223, score: 0.77, text: 'Control CC7.2 — exception: the Q1 quarterly access review was evidenced nine days after the control-defined deadline.' },
        ],
      },
    ],
  },
  {
    id: 'doc_msa',
    filename: 'vendor-msa-acme-v4.docx',
    kind: 'docx',
    chunk_count: 96,
    created_at: '2026-10-11T09:02:00',
    starters: [
      'What is the liability cap?',
      'How can either party terminate?',
      'What survives termination?',
    ],
    fallback: {
      content:
        'Order of precedence is the order form, then this agreement, then any SOW — so a conflicting SOW term does not override section 11.',
      sources: [
        { page: null, chunk_index: 7, score: 0.65, text: 'In the event of conflict, the following order of precedence applies: (a) the Order Form, (b) this Agreement, (c) any Statement of Work.' },
      ],
    },
    qa: [
      {
        k: ['liabilit', 'cap', 'damages', 'indemn'],
        content:
          "Acme's aggregate liability is capped at the fees paid in the twelve months before the claim. Confidentiality breaches, indemnities and gross negligence or willful misconduct sit outside the cap.",
        sources: [
          { page: null, chunk_index: 41, score: 0.91, text: "Section 11.2 Limitation of Liability. Each party's aggregate liability arising out of this Agreement shall not exceed the fees paid in the twelve (12) months preceding the claim." },
          { page: null, chunk_index: 42, score: 0.84, text: 'Excluded from the cap: breach of confidentiality, indemnification obligations, and liability arising from gross negligence or willful misconduct.' },
        ],
      },
      {
        k: ['terminat', 'notice', 'cure', 'exit'],
        content:
          "Either party may terminate for convenience on 60 days' written notice. For cause, the breaching party has 30 days to cure a material breach before termination takes effect.",
        sources: [
          { page: null, chunk_index: 55, score: 0.8, text: 'Section 13.1 Either party may terminate this Agreement for convenience upon sixty (60) days prior written notice to the other party.' },
          { page: null, chunk_index: 56, score: 0.71, text: 'Section 13.2 Termination for cause requires written notice of material breach and a thirty (30) day cure period.' },
        ],
      },
    ],
  },
  {
    id: 'doc_pm',
    filename: 'incident-postmortem-2026-09-28.txt',
    kind: 'txt',
    chunk_count: 41,
    created_at: '2026-10-12T18:40:00',
    starters: [
      'What was the root cause?',
      'How long was customer impact?',
      'What are the action items?',
    ],
    fallback: {
      content:
        'Three action items are listed: move env parsing to typed config, add a pool-saturation monitor, and rehearse the rollback path monthly. All are owned by the ingest team.',
      sources: [
        { page: null, chunk_index: 18, score: 0.7, text: 'Action items: (1) typed config parsing with startup validation, owner: ingest; (2) pool saturation monitor at 80%, owner: ingest; (3) monthly rollback drill.' },
      ],
    },
    qa: [
      {
        k: ['root cause', 'cause', 'why', 'pool', 'deploy'],
        content:
          'Connection pool exhaustion in the ingest service. The 18:02 deploy read DB_MAX_OVERFLOW as 0 instead of 10, so every pooled connection was held until timeout.',
        sources: [
          { page: null, chunk_index: 7, score: 0.9, text: 'Root cause: connection pool exhaustion in the ingest service after the 18:02 deploy set max_overflow to 0 from a mis-read environment variable.' },
          { page: null, chunk_index: 9, score: 0.75, text: 'The value was supplied as an empty string by the new deploy template and coerced to 0 rather than falling back to the default of 10.' },
        ],
      },
      {
        k: ['detect', 'monitor', 'impact', 'how long', 'mitigat', 'rollback'],
        content:
          "Detection took 11 minutes via the Datadog monitor 'ingest p99 > 2s'. Rollback landed at 18:41 UTC and customers saw 39 minutes of delayed ingestion, with no data loss.",
        sources: [
          { page: null, chunk_index: 12, score: 0.86, text: "Detection: 11 minutes (Datadog monitor 'ingest p99 > 2s'). Mitigation: rollback at 18:41 UTC. Customer impact: 39 minutes of delayed ingestion, no data loss." },
        ],
      },
    ],
  },
  {
    id: 'doc_k8s',
    filename: 'kubernetes-upgrade-runbook.docx',
    kind: 'docx',
    chunk_count: 63,
    created_at: '2026-10-10T08:15:00',
    starters: [
      'Does the runbook cover etcd backup and restore?',
      'How are node pools drained?',
      'What is the rollback step?',
    ],
    fallback: {
      content:
        'The runbook upgrades one minor version at a time: control plane first, then node pools in batches of three, with a 10-minute soak between batches.',
      sources: [
        { page: null, chunk_index: 5, score: 0.71, text: 'Upgrade one minor version at a time. Control plane first, then node pools in batches of three, with a ten minute soak and SLO check between batches.' },
      ],
    },
    qa: [
      {
        k: ['etcd', 'backup', 'snapshot', 'restore'],
        content:
          'Yes. Step 4 takes an etcd snapshot with `etcdctl snapshot save` before any control-plane node is drained and verifies it with `snapshot status`. Restore is step 19, from the most recent verified snapshot.',
        sources: [
          { page: null, chunk_index: 18, score: 0.89, text: 'Step 4 — before draining control-plane nodes, take an etcd snapshot with `etcdctl snapshot save /backup/etcd-$(date +%s).db` and verify with `snapshot status`.' },
          { page: null, chunk_index: 31, score: 0.76, text: 'Step 19 — restore: stop the API server, restore the most recent verified snapshot into a fresh data directory, then restart static pods one node at a time.' },
        ],
      },
    ],
  },
  {
    id: 'doc_dataroom',
    filename: 'Series-B-data-room-index.pdf',
    kind: 'pdf',
    chunk_count: 157,
    created_at: '2026-10-07T15:48:00',
    starters: ['What is in section 4?', 'Which diligence items are missing?'],
    fallback: {
      content:
        'Section 4 (Financial) lists audited statements for FY2023–FY2025, the monthly MRR cohort file and the current cap table, with two items still marked outstanding.',
      sources: [
        { page: 3, chunk_index: 9, score: 0.73, text: 'Section 4 — Financial: audited statements FY2023–FY2025, monthly MRR cohort file, current cap table (as-converted), outstanding: 409A, FY2025 tax filing.' },
      ],
    },
    qa: [],
  },
];

/* ── Saved chats, newest first ──────────────────────────────────────────── */
const INITIAL_CHATS = [
  {
    id: 'chat_9k2',
    document_id: 'doc_soc2',
    title: 'Which subprocessors handle customer PII?',
    created_at: '2026-10-13T09:41:00',
    messages: [
      { id: 'm1', role: 'user', content: 'Which subprocessors handle customer PII?', sources: [], created_at: '2026-10-13T09:41:00' },
      {
        id: 'm2',
        role: 'assistant',
        content:
          'Three subprocessors touch customer personal data: AWS (hosting, eu-west-1), Twilio SendGrid (transactional email) and Datadog (telemetry). Each has a signed DPA, and Datadog receives only scrubbed request metadata.',
        sources: [
          { page: 61, chunk_index: 142, score: 0.86, text: 'Subprocessors with access to customer personal data are limited to Amazon Web Services (hosting, eu-west-1), Twilio SendGrid (transactional email) and Datadog (telemetry).' },
          { page: 62, chunk_index: 145, score: 0.79, text: 'Datadog receives request metadata and error traces; payload bodies are scrubbed at the agent before egress. Telemetry retention is 15 days.' },
          { page: 63, chunk_index: 149, score: 0.74, text: 'A data processing addendum is executed with each subprocessor prior to production access and reviewed annually by the privacy owner.' },
        ],
        created_at: '2026-10-13T09:41:00',
      },
      { id: 'm3', role: 'user', content: 'And the second one — where does it process data?', sources: [], created_at: '2026-10-13T09:46:00' },
      {
        id: 'm4',
        role: 'assistant',
        content:
          'SendGrid processes in the United States. The DPA incorporates the EU standard contractual clauses, and the transferred fields are limited to email address and message metadata.',
        sources: [
          { page: 62, chunk_index: 146, score: 0.81, text: 'Twilio SendGrid processes in us-east; transfers rely on the EU standard contractual clauses incorporated into the executed DPA.' },
          { page: 63, chunk_index: 150, score: 0.7, text: 'Fields transferred are limited to recipient email address, message identifier and delivery status metadata.' },
        ],
        created_at: '2026-10-13T09:46:00',
      },
      { id: 'm5', role: 'user', content: 'Is there a DPA on file for Cloudflare?', sources: [], created_at: '2026-10-13T09:52:00' },
      { id: 'm6', role: 'assistant', content: NOT_FOUND, sources: [], created_at: '2026-10-13T09:52:00' },
    ],
  },
  {
    id: 'chat_8d1',
    document_id: 'doc_msa',
    title: 'What is the liability cap in the Acme MSA?',
    created_at: '2026-10-13T08:12:00',
    messages: [
      { id: 'm1', role: 'user', content: 'What is the liability cap in the Acme MSA?', sources: [], created_at: '2026-10-13T08:12:00' },
      {
        id: 'm2',
        role: 'assistant',
        content:
          "Acme's aggregate liability is capped at the fees paid in the twelve months before the claim. Confidentiality breaches, indemnities and gross negligence or willful misconduct sit outside the cap.",
        sources: [
          { page: null, chunk_index: 41, score: 0.91, text: "Section 11.2 Limitation of Liability. Each party's aggregate liability arising out of this Agreement shall not exceed the fees paid in the twelve (12) months preceding the claim." },
          { page: null, chunk_index: 42, score: 0.84, text: 'Excluded from the cap: breach of confidentiality, indemnification obligations, and liability arising from gross negligence or willful misconduct.' },
        ],
        created_at: '2026-10-13T08:12:00',
      },
      { id: 'm3', role: 'user', content: 'Does that cap cover a data breach?', sources: [], created_at: '2026-10-13T08:15:00' },
      {
        id: 'm4',
        role: 'assistant',
        content:
          'No. Breach of confidentiality is carved out of the cap, and the security exhibit treats a personal data breach as a confidentiality breach.',
        sources: [
          { page: null, chunk_index: 42, score: 0.87, text: 'Excluded from the cap: breach of confidentiality, indemnification obligations, and liability arising from gross negligence or willful misconduct.' },
          { page: null, chunk_index: 58, score: 0.72, text: 'Exhibit B §3: any unauthorised disclosure of Customer Personal Data constitutes a breach of the confidentiality obligations in Section 9.' },
        ],
        created_at: '2026-10-13T08:15:00',
      },
    ],
  },
  {
    id: 'chat_7b4',
    document_id: 'doc_pm',
    title: 'Summarise the root cause of the 28 September outag',
    created_at: '2026-10-12T19:08:00',
    error: RATE_LIMIT,
    messages: [
      { id: 'm1', role: 'user', content: 'Summarise the root cause of the 28 September outage', sources: [], created_at: '2026-10-12T19:08:00' },
      {
        id: 'm2',
        role: 'assistant',
        content:
          'Connection pool exhaustion in the ingest service. The 18:02 deploy read DB_MAX_OVERFLOW as 0 instead of 10, so every pooled connection was held until timeout.',
        sources: [
          { page: null, chunk_index: 7, score: 0.9, text: 'Root cause: connection pool exhaustion in the ingest service after the 18:02 deploy set max_overflow to 0 from a mis-read environment variable.' },
          { page: null, chunk_index: 9, score: 0.75, text: 'The value was supplied as an empty string by the new deploy template and coerced to 0 rather than falling back to the default of 10.' },
        ],
        created_at: '2026-10-12T19:08:00',
      },
      { id: 'm3', role: 'user', content: 'Which monitor caught it first?', sources: [], created_at: '2026-10-12T19:11:00' },
    ],
  },
  {
    id: 'chat_6a9',
    document_id: 'doc_soc2',
    title: 'How long are audit logs retained?',
    created_at: '2026-10-11T16:22:00',
    messages: [
      { id: 'm1', role: 'user', content: 'How long are audit logs retained?', sources: [], created_at: '2026-10-11T16:22:00' },
      {
        id: 'm2',
        role: 'assistant',
        content:
          'Audit logs are kept for 400 days in immutable storage. Access is limited to the security engineering on-call rotation, and every read is itself logged.',
        sources: [
          { page: 34, chunk_index: 71, score: 0.88, text: 'Audit logs are retained for 400 days in immutable object storage with versioning and object lock enabled.' },
          { page: 35, chunk_index: 73, score: 0.72, text: 'Read access to the audit log bucket is restricted to the security engineering on-call role; each access event is itself recorded.' },
        ],
        created_at: '2026-10-11T16:22:00',
      },
    ],
  },
  {
    id: 'chat_5c3',
    document_id: 'doc_k8s',
    title: 'Does the runbook cover etcd backup and restore?',
    created_at: '2026-10-10T11:05:00',
    messages: [
      { id: 'm1', role: 'user', content: 'Does the runbook cover etcd backup and restore?', sources: [], created_at: '2026-10-10T11:05:00' },
      {
        id: 'm2',
        role: 'assistant',
        content:
          'Yes. Step 4 takes an etcd snapshot with `etcdctl snapshot save` before any control-plane node is drained and verifies it with `snapshot status`. Restore is step 19, from the most recent verified snapshot.',
        sources: [
          { page: null, chunk_index: 18, score: 0.89, text: 'Step 4 — before draining control-plane nodes, take an etcd snapshot with `etcdctl snapshot save /backup/etcd-$(date +%s).db` and verify with `snapshot status`.' },
          { page: null, chunk_index: 31, score: 0.76, text: 'Step 19 — restore: stop the API server, restore the most recent verified snapshot into a fresh data directory, then restart static pods one node at a time.' },
        ],
        created_at: '2026-10-10T11:05:00',
      },
    ],
  },
  {
    id: 'chat_4e7',
    document_id: 'doc_removed',
    title: 'Which controls were flagged in the 2025 report?',
    created_at: '2026-10-09T14:30:00',
    unavailable: true,
    messages: [],
  },
];

const docById = (id) => DOCUMENTS.find((d) => d.id === id) || null;

const answerFor = (question, doc) => {
  const q = question.toLowerCase();
  if (ABSENT.some((w) => q.includes(w))) return { content: NOT_FOUND, sources: [] };
  const hit = (doc.qa || []).find((entry) => entry.k.some((k) => q.includes(k)));
  return hit ? { content: hit.content, sources: hit.sources } : doc.fallback;
};

const srcLabel = (s) => (s.page != null ? `p. ${s.page}` : `chunk ${s.chunk_index}`);

/* ── Rail button ────────────────────────────────────────────────────────── */
const RailButton = ({ icon: Ico, label, shortcut, active, onClick, innerRef, tone }) => (
  <div className="relative group">
    <button
      ref={innerRef}
      type="button"
      onClick={onClick}
      aria-label={shortcut ? `${label} (${shortcut})` : label}
      aria-pressed={active === undefined ? undefined : !!active}
      className="w-9 h-9 grid place-items-center transition-colors"
      style={{
        borderRadius: T.r,
        color: active ? T.primary : tone === 'warn' ? T.accent : T.textMid,
        background: active ? T.primarySoft : 'transparent',
      }}
    >
      <Ico className="w-[17px] h-[17px]" aria-hidden="true" />
    </button>
    <span
      className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-1 text-[11px] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-40"
      style={{ background: T.surfaceHi, border: `1px solid ${T.line}`, borderRadius: T.r, color: T.textHi }}
    >
      {label}
      {shortcut ? <span className="ml-2 font-mono" style={{ color: T.textLow }}>{shortcut}</span> : null}
    </span>
  </div>
);

/* ── Screen ─────────────────────────────────────────────────────────────── */
export default function Screen() {
  const navigate = useNavigate();
  const [chats, setChats] = React.useState(INITIAL_CHATS);
  const [activeId, setActiveId] = React.useState('chat_9k2');
  const [panel, setPanel] = React.useState(null); // 'chats' | 'new' | 'key'
  const [chatQuery, setChatQuery] = React.useState('');
  const [docQuery, setDocQuery] = React.useState('');
  const [draft, setDraft] = React.useState('');
  const [pending, setPending] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState(null);
  const [flash, setFlash] = React.useState(null);
  const [sessionKey, setSessionKey] = React.useState('AIza••••••••••••••••••7Qd2');
  const [keyDraft, setKeyDraft] = React.useState('');
  const [keyError, setKeyError] = React.useState('');
  const [keyNote, setKeyNote] = React.useState('');
  const [collapsed, setCollapsed] = React.useState({});
  const [composerError, setComposerError] = React.useState(null);

  const timers = React.useRef([]);
  const scrollRef = React.useRef(null);
  const composerRef = React.useRef(null);
  const chatSearchRef = React.useRef(null);
  const docSearchRef = React.useRef(null);
  const keyInputRef = React.useRef(null);
  const railRefs = {
    chats: React.useRef(null),
    new: React.useRef(null),
    key: React.useRef(null),
  };

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const after = (ms, fn) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  };

  const activeChat = chats.find((c) => c.id === activeId) || null;
  const activeDoc = activeChat ? docById(activeChat.document_id) : null;
  const hasKey = !!sessionKey;

  /* keyboard shortcuts */
  React.useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (e.key === 'Escape' && panel) {
        e.preventDefault();
        closePanel();
      } else if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openPanel('chats');
      } else if (mod && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        openPanel('new');
      } else if (mod && e.key === '/') {
        e.preventDefault();
        if (composerRef.current) composerRef.current.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeId, chats, pending]);

  const openPanel = (which) => {
    setPanel(which);
    setConfirmId(null);
    after(60, () => {
      if (which === 'chats' && chatSearchRef.current) chatSearchRef.current.focus();
      if (which === 'new' && docSearchRef.current) docSearchRef.current.focus();
      if (which === 'key' && keyInputRef.current) keyInputRef.current.focus();
    });
  };
  const closePanel = () => {
    const ref = panel ? railRefs[panel] : null;
    setPanel(null);
    setConfirmId(null);
    if (ref && ref.current) ref.current.focus();
  };

  const patchChat = (id, patch) =>
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, ...(typeof patch === 'function' ? patch(c) : patch) } : c)));

  /* ── ask ──────────────────────────────────────────────────────────────── */
  const ask = (text) => {
    const q = text.trim();
    if (!q || pending || !activeChat || !activeDoc) return;
    if (!hasKey) {
      setComposerError('key');
      openPanel('key');
      return;
    }
    setComposerError(null);
    const stamp = new Date().toISOString();
    const userMsg = { id: `u${Date.now()}`, role: 'user', content: q, sources: [], created_at: stamp };
    patchChat(activeChat.id, (c) => ({
      messages: [...c.messages, userMsg],
      title: c.title || q.slice(0, 50),
      error: null,
    }));
    setDraft('');
    setPending(true);
    const chatId = activeChat.id;
    const doc = activeDoc;
    after(1150, () => {
      const res = answerFor(q, doc);
      patchChat(chatId, (c) => ({
        messages: [
          ...c.messages,
          { id: `a${Date.now()}`, role: 'assistant', content: res.content, sources: res.sources, created_at: new Date().toISOString() },
        ],
      }));
      setPending(false);
    });
  };

  const retryLast = () => {
    if (!activeChat || !activeDoc || pending) return;
    const last = [...activeChat.messages].reverse().find((m) => m.role === 'user');
    if (!last) return;
    patchChat(activeChat.id, { error: null });
    setPending(true);
    const chatId = activeChat.id;
    const doc = activeDoc;
    after(1100, () => {
      const res = answerFor(last.content, doc);
      patchChat(chatId, (c) => ({
        messages: [
          ...c.messages,
          { id: `a${Date.now()}`, role: 'assistant', content: res.content, sources: res.sources, created_at: new Date().toISOString() },
        ],
      }));
      setPending(false);
    });
  };

  const startChat = (doc) => {
    const chat = {
      id: `chat_${Date.now().toString(36)}`,
      document_id: doc.id,
      title: '',
      created_at: new Date().toISOString(),
      messages: [],
    };
    setChats((prev) => [chat, ...prev]);
    setActiveId(chat.id);
    setDocQuery('');
    setPanel(null);
    setFlash(`New chat bound to ${doc.filename}`);
    after(60, () => composerRef.current && composerRef.current.focus());
    after(4000, () => setFlash(null));
  };

  const deleteChat = (id) => {
    const gone = chats.find((c) => c.id === id);
    const rest = chats.filter((c) => c.id !== id);
    setChats(rest);
    setConfirmId(null);
    if (activeId === id) setActiveId(rest.length ? rest[0].id : null);
    setFlash(`Deleted “${gone && gone.title ? gone.title : 'Untitled chat'}” and its messages`);
    after(4000, () => setFlash(null));
  };

  const saveKey = (e) => {
    e.preventDefault();
    const v = keyDraft.trim();
    if (!v) {
      setKeyError('Paste a key before saving — the field is empty.');
      return;
    }
    setKeyError('');
    setSessionKey(`${v.slice(0, 4)}••••••••••••••••••${v.slice(-4)}`);
    setKeyDraft('');
    setKeyNote('Key held in server memory for this session. Uploads and questions will use it.');
    setComposerError(null);
  };

  const filteredChats = chats.filter((c) =>
    (c.title || 'Untitled chat').toLowerCase().includes(chatQuery.trim().toLowerCase())
  );
  const filteredDocs = DOCUMENTS.filter((d) =>
    d.filename.toLowerCase().includes(docQuery.trim().toLowerCase())
  );

  const label = {
    fontSize: '10px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: T.textLow,
    fontWeight: 600,
  };
  const fieldStyle = {
    background: T.bg,
    border: `1px solid ${T.line}`,
    borderRadius: T.r,
    color: T.textHi,
  };

  /* ── message block ────────────────────────────────────────────────────── */
  const renderMessage = (m, chat) => {
    if (m.role === 'user') {
      return (
        <li key={m.id} className="nd-rise">
          <div className="flex items-baseline gap-2 mb-1">
            <span style={label}>you</span>
            <time className="text-[10px]" style={{ color: T.textLow, fontVariantNumeric: 'tabular-nums' }}>
              {fmtWhen(m.created_at)}
            </time>
          </div>
          <p
            className="text-[13.5px] leading-relaxed px-3 py-2"
            style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: T.r, color: T.textHi }}
          >
            {m.content}
          </p>
        </li>
      );
    }
    const notFound = m.content === NOT_FOUND;
    const open = collapsed[m.id] !== true;
    return (
      <li key={m.id} className="nd-rise">
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span style={label}>assistant</span>
          <span className="text-[10px] font-mono" style={{ color: T.textLow }}>{CHAT_MODEL}</span>
          <time className="text-[10px] ml-auto" style={{ color: T.textLow, fontVariantNumeric: 'tabular-nums' }}>
            {fmtWhen(m.created_at)}
          </time>
        </div>
        <div className="pl-3" style={{ borderLeft: `2px solid ${notFound ? T.accent : T.primary}` }}>
          {notFound ? (
            <p className="flex items-start gap-2 text-[13.5px] leading-relaxed" style={{ color: T.textHi }}>
              <Icons.AlertCircle className="w-4 h-4 mt-[2px] shrink-0" style={{ color: T.accent }} aria-hidden="true" />
              <span>
                {m.content}
                <span className="block mt-1 text-[11.5px]" style={{ color: T.textLow }}>
                  Nothing in {docById(chat.document_id) ? docById(chat.document_id).filename : 'this document'} scored above
                  the grounding threshold — no answer was invented.
                </span>
              </span>
            </p>
          ) : (
            <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap" style={{ color: T.textHi }}>
              {m.content}
            </p>
          )}

          {m.sources.length > 0 && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setCollapsed((c) => ({ ...c, [m.id]: open }))}
                aria-expanded={open}
                className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] py-1"
                style={{ color: T.accent }}
              >
                {open ? <Icons.ChevronDown className="w-3 h-3" aria-hidden="true" /> : <Icons.ChevronRight className="w-3 h-3" aria-hidden="true" />}
                sources · {m.sources.length}
              </button>
              {open && (
                <ol className="mt-1 space-y-1">
                  {m.sources.map((s, i) => (
                    <li
                      key={i}
                      className="px-2.5 py-2 nd-rise"
                      style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: T.r }}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="font-mono text-[11px] px-1.5 py-[1px]"
                          style={{ color: T.accent, background: T.accentSoft, borderRadius: '3px', fontVariantNumeric: 'tabular-nums' }}
                        >
                          {srcLabel(s)}
                        </span>
                        <span className="font-mono text-[10.5px]" style={{ color: T.textLow, fontVariantNumeric: 'tabular-nums' }}>
                          chunk_index {s.chunk_index} · cos {s.score.toFixed(2)}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] leading-snug" style={{ color: T.textMid }}>
                        “{s.text}”
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>
      </li>
    );
  };

  /* ── panels ───────────────────────────────────────────────────────────── */
  const panelShell = (title, hint, body) => (
    <div
      role="dialog"
      aria-label={title}
      className="nd-panel absolute top-0 bottom-0 left-[52px] w-[340px] z-30 flex flex-col"
      style={{ background: T.surface, borderRight: `1px solid ${T.lineHi}`, boxShadow: '18px 0 40px rgba(0,0,0,0.45)' }}
    >
      <div className="flex items-center gap-2 px-3 h-11 shrink-0" style={{ borderBottom: `1px solid ${T.line}` }}>
        <h2 className="text-[12px] font-semibold tracking-wide" style={{ color: T.textHi }}>{title}</h2>
        <span className="text-[10px] font-mono ml-auto" style={{ color: T.textLow }}>{hint}</span>
        <button
          type="button"
          onClick={closePanel}
          aria-label="Close panel"
          className="w-6 h-6 grid place-items-center"
          style={{ color: T.textMid, borderRadius: '4px' }}
        >
          <Icons.X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">{body}</div>
    </div>
  );

  const chatsPanel = panelShell(
    'Chats',
    'esc',
    <div className="p-3">
      <div className="mb-3">
        <label htmlFor="chat-filter" style={label} className="block mb-1">Filter by title</label>
        <div className="relative">
          <Icons.Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: T.textLow }} aria-hidden="true" />
          <input
            id="chat-filter"
            ref={chatSearchRef}
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            placeholder="liability, etcd, logs…"
            className="w-full pl-8 pr-2 py-1.5 text-[12.5px] outline-none"
            style={fieldStyle}
          />
        </div>
      </div>

      <p className="mb-2 text-[10.5px] font-mono" style={{ color: T.textLow, fontVariantNumeric: 'tabular-nums' }}>
        {filteredChats.length} of {chats.length} · newest first
      </p>

      {filteredChats.length === 0 ? (
        <div className="px-3 py-6 text-center" style={{ border: `1px dashed ${T.lineHi}`, borderRadius: T.r }}>
          <p className="text-[12.5px]" style={{ color: T.textHi }}>No chat title matches “{chatQuery}”.</p>
          <button
            type="button"
            onClick={() => { setChatQuery(''); if (chatSearchRef.current) chatSearchRef.current.focus(); }}
            className="mt-2 text-[12px] underline underline-offset-2"
            style={{ color: T.primary }}
          >
            Clear the filter
          </button>
        </div>
      ) : (
        <ul className="space-y-1">
          {filteredChats.map((c) => {
            const d = docById(c.document_id);
            const isActive = c.id === activeId;
            return (
              <li key={c.id}>
                <div
                  className="px-2.5 py-2 transition-colors"
                  style={{
                    background: isActive ? T.primarySoft : 'transparent',
                    border: `1px solid ${isActive ? alpha(brand.primaryColor, 0.4) : 'transparent'}`,
                    borderRadius: T.r,
                  }}
                >
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => { setActiveId(c.id); setPanel(null); }}
                      className="flex-1 text-left"
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span className="block text-[12.5px] leading-snug" style={{ color: c.unavailable ? T.textLow : T.textHi }}>
                        {c.title || 'Untitled chat'}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-[10.5px] font-mono" style={{ color: T.textLow, fontVariantNumeric: 'tabular-nums' }}>
                        {c.unavailable ? (
                          <>
                            <Icons.AlertCircle className="w-3 h-3" style={{ color: T.accent }} aria-hidden="true" />
                            document deleted
                          </>
                        ) : (
                          <>
                            {d ? d.filename : 'unknown'} · {c.messages.length} msg
                          </>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[10.5px]" style={{ color: T.textLow, fontVariantNumeric: 'tabular-nums' }}>
                        {fmtWhen(c.created_at)}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(confirmId === c.id ? null : c.id)}
                      aria-label={`Delete chat ${c.title || 'Untitled chat'}`}
                      className="w-6 h-6 grid place-items-center shrink-0"
                      style={{ color: confirmId === c.id ? T.accent : T.textLow, borderRadius: '4px' }}
                    >
                      <Icons.Trash className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  {confirmId === c.id && (
                    <div className="mt-2 pt-2 nd-rise" style={{ borderTop: `1px solid ${T.line}` }}>
                      <p className="text-[11.5px] leading-snug" style={{ color: T.textMid }}>
                        Delete this chat and its {c.messages.length} messages? The document and its chunks stay.
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => deleteChat(c.id)}
                          className="px-2 py-1 text-[11.5px] font-medium"
                          style={{ background: T.accent, color: T.bg, borderRadius: '4px' }}
                        >
                          Delete chat
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          className="px-2 py-1 text-[11.5px]"
                          style={{ color: T.textMid, border: `1px solid ${T.line}`, borderRadius: '4px' }}
                        >
                          Keep it
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  const newChatPanel = panelShell(
    'New chat · pick a document',
    '⌘J',
    <div className="p-3">
      <p className="mb-3 text-[11.5px] leading-snug" style={{ color: T.textMid }}>
        A chat is bound to one document for its whole life. To ask about a different file, start another chat.
      </p>
      <div className="mb-3">
        <label htmlFor="doc-filter" style={label} className="block mb-1">Filter documents</label>
        <div className="relative">
          <Icons.Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: T.textLow }} aria-hidden="true" />
          <input
            id="doc-filter"
            ref={docSearchRef}
            value={docQuery}
            onChange={(e) => setDocQuery(e.target.value)}
            placeholder="filename…"
            className="w-full pl-8 pr-2 py-1.5 text-[12.5px] outline-none"
            style={fieldStyle}
          />
        </div>
      </div>

      {filteredDocs.length === 0 ? (
        <div className="px-3 py-6 text-center" style={{ border: `1px dashed ${T.lineHi}`, borderRadius: T.r }}>
          <Icons.FileText className="w-5 h-5 mx-auto mb-2" style={{ color: T.textLow }} aria-hidden="true" />
          <p className="text-[12.5px]" style={{ color: T.textHi }}>No document matches “{docQuery}”.</p>
          <button
            type="button"
            onClick={() => navigate('documents')}
            className="mt-2 text-[12px] underline underline-offset-2"
            style={{ color: T.primary }}
          >
            Upload a PDF, DOCX or TXT
          </button>
        </div>
      ) : (
        <ul className="space-y-1">
          {filteredDocs.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => startChat(d)}
                className="w-full text-left px-2.5 py-2 transition-colors"
                style={{ border: `1px solid ${T.line}`, borderRadius: T.r, background: T.bg }}
              >
                <span className="flex items-center gap-2">
                  <Icons.FileText className="w-3.5 h-3.5 shrink-0" style={{ color: T.primary }} aria-hidden="true" />
                  <span className="text-[12.5px] truncate" style={{ color: T.textHi }}>{d.filename}</span>
                </span>
                <span className="mt-1 flex items-center gap-2 text-[10.5px] font-mono" style={{ color: T.textLow, fontVariantNumeric: 'tabular-nums' }}>
                  <span style={{ color: T.primary }}>Ready</span>
                  <span>{d.chunk_count} chunks</span>
                  <span>{fmtDate(d.created_at)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => navigate('documents')}
        className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-[12px]"
        style={{ border: `1px dashed ${T.lineHi}`, borderRadius: T.r, color: T.textMid }}
      >
        <Icons.Upload className="w-3.5 h-3.5" aria-hidden="true" />
        Upload a new document (max 2 MB)
      </button>
    </div>
  );

  const keyPanel = panelShell(
    'Gemini API key',
    'in memory',
    <div className="p-3">
      <dl className="text-[12px]" style={{ border: `1px solid ${T.line}`, borderRadius: T.r }}>
        <div className="flex items-center justify-between px-2.5 py-2" style={{ borderBottom: `1px solid ${T.line}` }}>
          <dt style={{ color: T.textMid }}>Server key (GEMINI_API_KEY)</dt>
          <dd className="font-mono text-[11px]" style={{ color: T.textLow }}>not set</dd>
        </div>
        <div className="flex items-center justify-between px-2.5 py-2">
          <dt style={{ color: T.textMid }}>Your session key</dt>
          <dd className="font-mono text-[11px]" style={{ color: hasKey ? T.primary : T.accent }}>
            {hasKey ? sessionKey : 'none'}
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-[11.5px] leading-snug" style={{ color: T.textMid }}>
        Your key lives in the backend process only. It is never written to the database, never logged and never sent back
        to the browser. A server restart clears it and this field returns.
      </p>

      <form onSubmit={saveKey} className="mt-3">
        <label htmlFor="gemini-key" style={label} className="block mb-1">
          {hasKey ? 'Replace key' : 'Paste your key'}
        </label>
        <input
          id="gemini-key"
          ref={keyInputRef}
          type="password"
          autoComplete="off"
          value={keyDraft}
          onChange={(e) => { setKeyDraft(e.target.value); setKeyError(''); }}
          placeholder="AIza…"
          aria-invalid={keyError ? 'true' : undefined}
          aria-describedby={keyError ? 'gemini-key-error' : undefined}
          className="w-full px-2.5 py-1.5 text-[12.5px] font-mono outline-none"
          style={{ ...fieldStyle, borderColor: keyError ? T.accent : T.line }}
        />
        {keyError && (
          <p id="gemini-key-error" className="mt-1 flex items-center gap-1.5 text-[11.5px]" style={{ color: T.accent }}>
            <Icons.AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
            {keyError}
          </p>
        )}
        {keyNote && (
          <p className="mt-1 flex items-center gap-1.5 text-[11.5px]" style={{ color: T.primary }}>
            <Icons.CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
            {keyNote}
          </p>
        )}
        <div className="mt-2 flex gap-2">
          <button
            type="submit"
            className="px-2.5 py-1.5 text-[12px] font-medium"
            style={{ background: T.primary, color: T.bg, borderRadius: T.r }}
          >
            Hold key for this session
          </button>
          {hasKey && (
            <button
              type="button"
              onClick={() => { setSessionKey(''); setKeyNote(''); setKeyError(''); }}
              className="px-2.5 py-1.5 text-[12px]"
              style={{ color: T.textMid, border: `1px solid ${T.line}`, borderRadius: T.r }}
            >
              Clear key
            </button>
          )}
        </div>
      </form>
    </div>
  );

  /* ── main area ────────────────────────────────────────────────────────── */
  const heading = !activeChat
    ? 'No chat open'
    : activeChat.unavailable
    ? activeChat.title
    : activeChat.title || 'New chat';

  let body;
  if (!activeChat) {
    body = (
      <div className="flex-1 grid place-items-center px-6">
        <div className="max-w-[420px] text-center">
          <Icons.Package className="w-6 h-6 mx-auto mb-3" style={{ color: T.textLow }} aria-hidden="true" />
          <h2 className="text-[15px] font-semibold mb-1" style={{ color: T.textHi }}>Nothing open</h2>
          <p className="text-[13px] leading-relaxed" style={{ color: T.textMid }}>
            Every chat is saved against one document. Pick a document to start a new one — your history is still in the
            chats panel.
          </p>
          <button
            type="button"
            onClick={() => openPanel('new')}
            className="mt-4 inline-flex items-center gap-2 px-3 py-2 text-[13px] font-medium"
            style={{ background: T.primary, color: T.bg, borderRadius: T.r }}
          >
            <Icons.Plus className="w-4 h-4" aria-hidden="true" />
            New chat
          </button>
        </div>
      </div>
    );
  } else if (activeChat.unavailable) {
    body = (
      <div className="flex-1 grid place-items-center px-6">
        <div
          className="max-w-[460px] px-5 py-5 nd-rise"
          style={{ border: `1px solid ${alpha(brand.accentColor, 0.45)}`, borderRadius: T.r, background: T.surface }}
        >
          <p className="flex items-center gap-2 text-[11px] font-mono mb-2" style={{ color: T.accent }}>
            <Icons.AlertCircle className="w-4 h-4" aria-hidden="true" />
            404 · GET /api/v1/chats/{activeChat.id}
          </p>
          <h2 className="text-[15px] font-semibold mb-1" style={{ color: T.textHi }}>This chat is gone</h2>
          <p className="text-[13px] leading-relaxed" style={{ color: T.textMid }}>
            The document it was bound to was deleted, and deletion cascades to chunks, chats and messages. Nothing is
            left to reopen. Upload the file again and start a fresh chat.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => openPanel('new')}
              className="px-3 py-1.5 text-[12.5px] font-medium"
              style={{ background: T.primary, color: T.bg, borderRadius: T.r }}
            >
              Start a new chat
            </button>
            <button
              type="button"
              onClick={() => navigate('documents')}
              className="px-3 py-1.5 text-[12.5px]"
              style={{ color: T.textMid, border: `1px solid ${T.line}`, borderRadius: T.r }}
            >
              Open Documents
            </button>
          </div>
        </div>
      </div>
    );
  } else if (activeChat.messages.length === 0) {
    body = (
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-[760px]">
          <div className="px-4 py-5" style={{ border: `1px dashed ${T.lineHi}`, borderRadius: T.r }}>
            <h2 className="text-[14px] font-semibold mb-1" style={{ color: T.textHi }}>Ask the first question</h2>
            <p className="text-[12.5px] leading-relaxed" style={{ color: T.textMid }}>
              Answers come only from <span style={{ color: T.textHi }}>{activeDoc.filename}</span> —{' '}
              <span className="font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>{activeDoc.chunk_count}</span>{' '}
              embedded chunks, top 4 retrieved per question. The title of this chat will be the first 50 characters of
              what you ask.
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {activeDoc.starters.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => { setDraft(s); if (composerRef.current) composerRef.current.focus(); }}
                    className="px-2.5 py-1.5 text-[12px] text-left"
                    style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: T.r, color: T.textMid }}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  } else {
    body = (
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5">
        <ol className="mx-auto max-w-[760px] space-y-5">
          {activeChat.messages.map((m) => renderMessage(m, activeChat))}

          {pending && (
            <li className="nd-rise">
              <div className="flex items-baseline gap-2 mb-1">
                <span style={label}>assistant</span>
                <span className="text-[10px] font-mono" style={{ color: T.textLow }}>{CHAT_MODEL}</span>
              </div>
              <div className="pl-3" style={{ borderLeft: `2px solid ${T.lineHi}` }}>
                <p className="text-[12.5px] font-mono flex items-center gap-2" style={{ color: T.textMid, fontVariantNumeric: 'tabular-nums' }}>
                  <span className="nd-dot inline-block w-1.5 h-1.5 rounded-full" style={{ background: T.primary }} aria-hidden="true" />
                  embedding question (RETRIEVAL_QUERY) → cosine over {activeDoc.chunk_count} chunks → {CHAT_MODEL}
                </p>
                <p className="mt-1 text-[11.5px]" style={{ color: T.textLow }}>
                  Answers are returned whole, not streamed. Usually 2–5 seconds.
                </p>
              </div>
            </li>
          )}

          {activeChat.error && !pending && (
            <li className="nd-rise">
              <div
                className="px-3 py-2.5"
                style={{ background: T.accentSoft, border: `1px solid ${alpha(brand.accentColor, 0.45)}`, borderRadius: T.r }}
              >
                <p className="flex items-start gap-2 text-[12.5px]" style={{ color: T.textHi }}>
                  <Icons.AlertCircle className="w-4 h-4 mt-[1px] shrink-0" style={{ color: T.accent }} aria-hidden="true" />
                  <span>
                    <span className="font-medium">{activeChat.error}</span>
                    <span className="block mt-0.5 text-[11.5px]" style={{ color: T.textMid }}>
                      Your question was kept and no partial answer was saved.
                    </span>
                  </span>
                </p>
                <button
                  type="button"
                  onClick={retryLast}
                  className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium"
                  style={{ background: T.accent, color: T.bg, borderRadius: '4px' }}
                >
                  <Icons.ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  Retry question
                </button>
              </div>
            </li>
          )}
        </ol>
      </div>
    );
  }

  const canSend = !!activeChat && !activeChat.unavailable;

  return (
    <div
      className="nd-root relative flex h-full min-h-[640px] overflow-hidden"
      style={{ background: T.bg, color: T.textHi, fontFamily: brand.fontBody }}
    >
      <style>{`
        .nd-root button:focus-visible, .nd-root input:focus-visible, .nd-root textarea:focus-visible, .nd-root a:focus-visible {
          outline: 2px solid ${T.primary}; outline-offset: 2px;
        }
        @keyframes nd-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .nd-rise { animation: nd-rise .22s ease-out both; }
        @keyframes nd-pulse { 0%,100% { opacity: .2; } 50% { opacity: 1; } }
        .nd-dot { animation: nd-pulse 1s ease-in-out infinite; }
        .nd-panel { animation: nd-rise .16s ease-out both; }
        .nd-root ::placeholder { color: ${T.textLow}; }
        @media (prefers-reduced-motion: reduce) {
          .nd-rise, .nd-dot, .nd-panel { animation: none !important; }
        }
      `}</style>

      {/* icon rail */}
      <nav
        className="w-[52px] shrink-0 flex flex-col items-center py-3 gap-1 z-40"
        style={{ borderRight: `1px solid ${T.line}`, background: T.bg }}
        aria-label="Workspace"
      >
        <RailButton icon={Icons.Plus} label="New chat" shortcut="⌘J" active={panel === 'new'} innerRef={railRefs.new} onClick={() => (panel === 'new' ? closePanel() : openPanel('new'))} />
        <RailButton icon={Icons.Clock} label="Chats" shortcut="⌘K" active={panel === 'chats'} innerRef={railRefs.chats} onClick={() => (panel === 'chats' ? closePanel() : openPanel('chats'))} />
        <RailButton icon={Icons.FileText} label="Documents" shortcut="" onClick={() => navigate('documents')} />
        <div className="w-6 my-1" style={{ borderTop: `1px solid ${T.line}` }} aria-hidden="true" />
        <RailButton
          icon={hasKey ? Icons.Settings : Icons.AlertCircle}
          label={hasKey ? 'Gemini key · session' : 'Gemini key required'}
          active={panel === 'key'}
          tone={hasKey ? undefined : 'warn'}
          innerRef={railRefs.key}
          onClick={() => (panel === 'key' ? closePanel() : openPanel('key'))}
        />
        <div className="mt-auto flex flex-col items-center gap-1">
          <div
            className="w-7 h-7 grid place-items-center text-[11px] font-semibold"
            style={{ background: T.surfaceHi, color: T.textMid, borderRadius: '50%' }}
            title="r.okafor@northgate.io"
          >
            RO
          </div>
          <RailButton icon={Icons.ArrowLeft} label="Log out" onClick={() => navigate('login')} />
        </div>
      </nav>

      {/* panels */}
      {panel && (
        <>
          <button
            type="button"
            aria-label="Close panel"
            onClick={closePanel}
            className="absolute inset-0 z-20"
            style={{ background: 'rgba(0,0,0,0.42)' }}
            tabIndex={-1}
          />
          {panel === 'chats' && chatsPanel}
          {panel === 'new' && newChatPanel}
          {panel === 'key' && keyPanel}
        </>
      )}

      {/* chat column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-6 pt-4 pb-3 shrink-0" style={{ borderBottom: `1px solid ${T.line}` }}>
          <div className="mx-auto max-w-[760px]">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <h1 className="text-[18px] font-semibold leading-tight truncate" style={{ fontFamily: brand.fontHeading, color: T.textHi }}>
                  {heading}
                </h1>
                <p className="mt-1 flex items-center gap-2 flex-wrap text-[11px] font-mono" style={{ color: T.textLow, fontVariantNumeric: 'tabular-nums' }}>
                  {activeDoc ? (
                    <>
                      <span className="inline-flex items-center gap-1.5" style={{ color: T.textMid }}>
                        <Icons.FileText className="w-3.5 h-3.5" style={{ color: T.primary }} aria-hidden="true" />
                        {activeDoc.filename}
                      </span>
                      <span>· {activeDoc.chunk_count} chunks</span>
                      <span>· bound {fmtDate(activeChat.created_at)}</span>
                    </>
                  ) : activeChat && activeChat.unavailable ? (
                    <span style={{ color: T.accent }}>document deleted · chat unavailable</span>
                  ) : (
                    <span>no document bound</span>
                  )}
                </p>
              </div>
              <span
                className="shrink-0 inline-flex items-center gap-1.5 px-2 py-1 text-[10.5px] font-mono"
                style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: T.r, color: hasKey ? T.textMid : T.accent }}
              >
                {hasKey ? <Icons.Check className="w-3 h-3" style={{ color: T.primary }} aria-hidden="true" /> : <Icons.AlertCircle className="w-3 h-3" aria-hidden="true" />}
                {hasKey ? 'key in memory' : 'no key'}
              </span>
            </div>

            {flash && (
              <p
                className="mt-2 nd-rise inline-flex items-center gap-1.5 px-2 py-1 text-[11.5px]"
                style={{ background: T.primarySoft, color: T.textHi, borderRadius: T.r }}
                role="status"
              >
                <Icons.CheckCircle className="w-3.5 h-3.5" style={{ color: T.primary }} aria-hidden="true" />
                {flash}
              </p>
            )}
          </div>
        </header>

        {body}

        {/* composer */}
        <div className="shrink-0 px-6 py-3" style={{ borderTop: `1px solid ${T.line}`, background: T.bg }}>
          <div className="mx-auto max-w-[760px]">
            {!hasKey && (
              <div
                className="mb-2 px-3 py-2.5 nd-rise"
                style={{ background: T.accentSoft, border: `1px solid ${alpha(brand.accentColor, 0.45)}`, borderRadius: T.r }}
              >
                <p className="flex items-start gap-2 text-[12.5px] font-medium" style={{ color: T.textHi }}>
                  <Icons.AlertCircle className="w-4 h-4 mt-[1px] shrink-0" style={{ color: T.accent }} aria-hidden="true" />
                  {NO_KEY}
                </p>
                <form onSubmit={saveKey} className="mt-2 flex flex-wrap items-end gap-2">
                  <div className="flex-1 min-w-[200px]">
                    <label htmlFor="inline-key" style={label} className="block mb-1">Gemini API key</label>
                    <input
                      id="inline-key"
                      type="password"
                      autoComplete="off"
                      value={keyDraft}
                      onChange={(e) => { setKeyDraft(e.target.value); setKeyError(''); }}
                      placeholder="AIza…"
                      className="w-full px-2.5 py-1.5 text-[12.5px] font-mono outline-none"
                      style={{ ...fieldStyle, borderColor: keyError ? T.accent : T.line }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-[12.5px] font-medium"
                    style={{ background: T.accent, color: T.bg, borderRadius: T.r }}
                  >
                    Save key
                  </button>
                </form>
                {keyError && (
                  <p className="mt-1 text-[11.5px]" style={{ color: T.accent }}>{keyError}</p>
                )}
                <p className="mt-1.5 text-[11px]" style={{ color: T.textMid }}>
                  Held in server memory for your account only. Your draft question below is kept.
                </p>
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); ask(draft); }}
              style={{ opacity: canSend ? 1 : 0.5 }}
            >
              <label htmlFor="question" className="block mb-1" style={label}>
                {activeDoc ? `Ask about ${activeDoc.filename}` : 'Ask a question'}
              </label>
              <div
                className="flex items-end gap-2 px-2.5 py-2"
                style={{ background: T.surface, border: `1px solid ${pending ? alpha(brand.primaryColor, 0.5) : T.lineHi}`, borderRadius: T.r }}
              >
                <textarea
                  id="question"
                  ref={composerRef}
                  rows={2}
                  value={draft}
                  disabled={!canSend}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      ask(draft);
                    }
                  }}
                  placeholder={pending ? 'Waiting for the current answer…' : 'What does section 11 cap liability at?'}
                  className="flex-1 bg-transparent resize-none outline-none text-[13.5px] leading-relaxed"
                  style={{ color: T.textHi }}
                />
                <button
                  type="submit"
                  disabled={pending || !draft.trim() || !canSend}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-semibold transition-opacity"
                  style={{
                    background: pending || !draft.trim() || !canSend ? T.surfaceHi : T.primary,
                    color: pending || !draft.trim() || !canSend ? T.textLow : T.bg,
                    borderRadius: T.r,
                    cursor: pending || !draft.trim() || !canSend ? 'not-allowed' : 'pointer',
                  }}
                >
                  {pending ? 'Waiting…' : 'Ask'}
                  <Icons.ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-mono" style={{ color: T.textLow, fontVariantNumeric: 'tabular-nums' }}>
                <span>Enter sends · Shift+Enter newline · ⌘/ focus</span>
                <span>top 4 chunks + last 4 messages</span>
                <span>grounded in this document only</span>
                {pending && <span style={{ color: T.primary }}>send locked until the answer returns</span>}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
