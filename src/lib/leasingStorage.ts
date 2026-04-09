export type LeasingApplicationStatus =
  | 'IN_PROGRESS'
  | 'AWAITING_TL'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export type LeasingApplicationRecord = {
  applicationId: string;
  inn: string;
  phone: string;
  commentPreview: string;
  createdAt: string;
  status: LeasingApplicationStatus;
  clientFullName: string | null;
  /** Код клиента в Colvir (если известен). */
  colvirCode: string | null;
};

/** Raw shape from localStorage before migration */
type LegacyLeasingApplicationRecord = Omit<
  LeasingApplicationRecord,
  'status' | 'clientFullName' | 'colvirCode'
> &
  Partial<Pick<LeasingApplicationRecord, 'status' | 'clientFullName' | 'colvirCode'>>;

export type LeasingDraft = {
  inn: string;
  phone: string;
  comment: string;
  updatedAt: string;
};

const HISTORY_KEY = 'leasing-applications-history';
const DRAFT_KEY = 'leasing-application-draft';
/** One-time: rewrite stored CANCELLED → IN_PROGRESS («В обработке»). */
const MIGRATION_RESET_CANCELLED_KEY = 'leasing-migration-reset-cancelled-to-in-progress-v1';

/**
 * Permanent showcase rows (all статусы). Merged on the list page; not written to localStorage.
 * Same ids can be overridden by stored records.
 */
export const DEMO_LEASING_APPLICATIONS: LeasingApplicationRecord[] = [
  {
    applicationId: 'TL-DEMO-IN1',
    inn: '7707083893',
    phone: '+7 900 000-00-01',
    commentPreview: 'Запрос на лизинг оборудования',
    createdAt: '2026-04-01T10:00:00.000Z',
    status: 'AWAITING_TL',
    clientFullName: null,
    colvirCode: 'CV-CL-100452',
  },
  {
    applicationId: 'TL-DEMO-IN2',
    inn: '5001007321',
    phone: '+7 900 000-00-05',
    commentPreview: 'Вторая заявка в работе',
    createdAt: '2026-03-31T16:20:00.000Z',
    status: 'IN_PROGRESS',
    clientFullName: null,
    colvirCode: 'CV-CL-200891',
  },
  {
    applicationId: 'TL-DEMO-AP1',
    inn: '7736050003',
    phone: '+7 900 000-00-02',
    commentPreview: 'Полная предоплата, срочно',
    createdAt: '2026-03-28T14:30:00.000Z',
    status: 'APPROVED',
    clientFullName: 'Иванов Иван Иванович',
    colvirCode: 'CV-CL-300014',
  },
  {
    applicationId: 'TL-DEMO-AP2',
    inn: '7701234568',
    phone: '+7 900 000-00-04',
    commentPreview: 'Одобрено без ФИО в данных',
    createdAt: '2026-03-22T11:00:00.000Z',
    status: 'APPROVED',
    clientFullName: null,
    colvirCode: 'CV-CL-400220',
  },
  {
    applicationId: 'TL-DEMO-RE1',
    inn: '7701234567',
    phone: '+7 900 000-00-03',
    commentPreview: 'Не прошли проверку',
    createdAt: '2026-03-20T09:15:00.000Z',
    status: 'REJECTED',
    clientFullName: null,
    colvirCode: null,
  },
];

/** Demos first, then user history; stored row wins over demo with the same `applicationId`. */
export function mergeListWithDemoRows(
  stored: LeasingApplicationRecord[]
): LeasingApplicationRecord[] {
  const demoIds = new Set(DEMO_LEASING_APPLICATIONS.map((r) => r.applicationId));
  const byId = new Map(stored.map((r) => [r.applicationId, r]));
  const resolvedDemos = DEMO_LEASING_APPLICATIONS.map((d) => byId.get(d.applicationId) ?? d);
  const rest = stored.filter((r) => !demoIds.has(r.applicationId));
  return [...resolvedDemos, ...rest];
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function normalizeRecord(raw: LegacyLeasingApplicationRecord): LeasingApplicationRecord {
  return {
    applicationId: raw.applicationId,
    inn: raw.inn,
    phone: raw.phone,
    commentPreview: raw.commentPreview,
    createdAt: raw.createdAt,
    status: raw.status ?? 'IN_PROGRESS',
    clientFullName: raw.clientFullName ?? null,
    colvirCode: raw.colvirCode ?? null,
  };
}

export function loadHistory(): LeasingApplicationRecord[] {
  const raw = readJson<LegacyLeasingApplicationRecord[]>(HISTORY_KEY, []);
  let records = raw.map(normalizeRecord);

  if (typeof localStorage !== 'undefined' && !localStorage.getItem(MIGRATION_RESET_CANCELLED_KEY)) {
    let changed = false;
    records = records.map((r) => {
      if (r.status === 'CANCELLED') {
        changed = true;
        return { ...r, status: 'IN_PROGRESS' as const };
      }
      return r;
    });
    if (changed) {
      saveHistory(records);
    }
    localStorage.setItem(MIGRATION_RESET_CANCELLED_KEY, '1');
  }

  return records;
}

export function saveHistory(records: LeasingApplicationRecord[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
}

export function appendHistory(record: LeasingApplicationRecord): void {
  const prev = loadHistory();
  localStorage.setItem(HISTORY_KEY, JSON.stringify([record, ...prev]));
}

export function getApplicationById(
  applicationId: string
): LeasingApplicationRecord | undefined {
  const fromStorage = loadHistory().find((r) => r.applicationId === applicationId);
  if (fromStorage) return fromStorage;
  return DEMO_LEASING_APPLICATIONS.find((r) => r.applicationId === applicationId);
}

export function updateApplication(
  applicationId: string,
  patch: Partial<
    Pick<
      LeasingApplicationRecord,
      'status' | 'clientFullName' | 'commentPreview' | 'phone'
    >
  >
): LeasingApplicationRecord | undefined {
  const rows = loadHistory();
  const idx = rows.findIndex((r) => r.applicationId === applicationId);
  if (idx === -1) {
    const demo = DEMO_LEASING_APPLICATIONS.find((r) => r.applicationId === applicationId);
    if (!demo) return undefined;
    const next = { ...demo, ...patch };
    saveHistory([next, ...rows]);
    return next;
  }
  const next = { ...rows[idx], ...patch };
  const copy = [...rows];
  copy[idx] = next;
  saveHistory(copy);
  return next;
}

export function loadDraft(): LeasingDraft | null {
  return readJson<LeasingDraft | null>(DRAFT_KEY, null);
}

export function saveDraft(draft: LeasingDraft): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}
