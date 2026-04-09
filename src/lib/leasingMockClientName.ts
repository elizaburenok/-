import type { LeasingApplicationRecord } from './leasingStorage';

/** Deterministic mock ФИО for demo when a заявка is approved (no real T-Leasing API). */
const POOL = [
  'Иванов Иван Иванович',
  'Петрова Анна Сергеевна',
  'Сидоров Алексей Дмитриевич',
  'Козлова Мария Павловна',
  'Николаев Денис Олегович',
] as const;

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function mockClientFullNameFromApplicationId(applicationId: string): string {
  return POOL[hashString(applicationId) % POOL.length];
}

/** Полное ФИО для одобренных заявок: из данных или стабильный mock по номеру заявки. */
export function resolvedApprovedClientFullName(record: LeasingApplicationRecord): string | null {
  if (record.status !== 'APPROVED') return null;
  return record.clientFullName ?? mockClientFullNameFromApplicationId(record.applicationId);
}

/** Полное ФИО для списка заявок: из данных или стабильный mock по номеру заявки (любой статус). */
export function resolvedClientFullNameForDisplay(record: LeasingApplicationRecord): string {
  return record.clientFullName ?? mockClientFullNameFromApplicationId(record.applicationId);
}
