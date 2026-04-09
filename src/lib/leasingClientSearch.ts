import { resolvedClientFullNameForDisplay } from './leasingMockClientName';
import type { LeasingApplicationRecord } from './leasingStorage';

/** Поиск по ИНН, ФИО (в т.ч. одобренных), коду Colvir, номеру заявки. */
export function filterLeasingApplicationsByClientQuery(
  rows: LeasingApplicationRecord[],
  query: string
): LeasingApplicationRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) => {
    const fields: string[] = [
      row.inn,
      row.applicationId,
      row.colvirCode ?? '',
      resolvedClientFullNameForDisplay(row),
    ];
    return fields.some((s) => s.toLowerCase().includes(q));
  });
}
