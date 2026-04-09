import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';
import { Button } from '../../components/Button/Button';
import { Chip } from '../../components/Chip/Chip';
import { LeasingCompanyListItem } from '../../components/LeasingCompanyListItem';
import { SearchInput } from '../../components/SearchInput/SearchInput';
import {
  resolvedApprovedClientFullName,
  resolvedClientFullNameForDisplay,
} from '../lib/leasingMockClientName';
import { filterLeasingApplicationsByClientQuery } from '../lib/leasingClientSearch';
import {
  loadHistory,
  mergeListWithDemoRows,
  type LeasingApplicationRecord,
} from '../lib/leasingStorage';
import styles from './LeasingApplicationsPage.module.css';

/** List filter tabs — mapped to `LeasingApplicationRecord.status` */
type ApplicationsListTab = 'all' | 'in_progress' | 'completed';

const LIST_TAB_CONFIG: ReadonlyArray<{
  id: ApplicationsListTab;
  label: string;
}> = [
  { id: 'all', label: 'Все' },
  { id: 'in_progress', label: 'В работе' },
  { id: 'completed', label: 'Завершено' },
];

function filterByListTab(
  rows: LeasingApplicationRecord[],
  tab: ApplicationsListTab
): LeasingApplicationRecord[] {
  switch (tab) {
    case 'all':
      return rows;
    case 'in_progress':
      return rows.filter(
        (r) =>
          r.status === 'IN_PROGRESS' ||
          r.status === 'AWAITING_TL' ||
          r.status === 'APPROVED'
      );
    case 'completed':
      return rows.filter((r) => r.status === 'REJECTED' || r.status === 'CANCELLED');
  }
}

type Flash = { kind: 'success'; applicationId: string };

type ListLocationState = { selectListTab?: ApplicationsListTab };

function listCardTitle(row: LeasingApplicationRecord): string {
  return resolvedClientFullNameForDisplay(row);
}

function listInnLabel(row: LeasingApplicationRecord): string {
  return `ИНН ${row.inn}`;
}

function listAriaLabel(row: LeasingApplicationRecord): string {
  if (row.status === 'CANCELLED') {
    return `Заявка ${row.applicationId}, отменена, ИНН ${row.inn}`;
  }
  if (row.status === 'REJECTED') {
    return `Заявка ${row.applicationId}, отклонена, ИНН ${row.inn}`;
  }
  if (row.status === 'APPROVED') {
    const name = resolvedApprovedClientFullName(row);
    const namePart = name ? `, ${name}` : '';
    return `Заявка ${row.applicationId}, одобрена${namePart}, ИНН ${row.inn}`;
  }
  if (row.status === 'AWAITING_TL') {
    return `Заявка ${row.applicationId}, ожидаем ответ от Т-Лизинг, ИНН ${row.inn}`;
  }
  return `Заявка ${row.applicationId}, в работе, ИНН ${row.inn}`;
}

const FLASH_MS = 3000;

export const LeasingApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const flash = (location.state as { flash?: Flash } | null)?.flash;

  const [storedItems, setStoredItems] = useState<LeasingApplicationRecord[]>(() => loadHistory());
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') ?? '');
  const [listTab, setListTab] = useState<ApplicationsListTab>('all');

  useEffect(() => {
    setSearchQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    const st = location.state as (ListLocationState & Record<string, unknown>) | null;
    const tab = st?.selectListTab;
    if (tab !== 'all' && tab !== 'in_progress' && tab !== 'completed') return;
    setListTab(tab);
    if (!st) return;
    const { selectListTab: _sel, ...rest } = st;
    navigate(
      { pathname: location.pathname, search: location.search },
      { replace: true, state: Object.keys(rest).length > 0 ? rest : null }
    );
  }, [location.key, location.pathname, location.search, navigate, location.state]);

  useEffect(() => {
    setStoredItems(loadHistory());
  }, [location.key, location.pathname]);

  useEffect(() => {
    if (flash?.kind !== 'success') return;
    const id = window.setTimeout(() => {
      navigate(location.pathname, { replace: true, state: {} });
    }, FLASH_MS);
    return () => window.clearTimeout(id);
  }, [flash, navigate, location.pathname]);

  const items = useMemo(
    () => mergeListWithDemoRows(storedItems),
    [storedItems]
  );

  const clientQueryFiltered = useMemo(
    () => filterLeasingApplicationsByClientQuery(items, searchQuery),
    [items, searchQuery]
  );

  const filtered = useMemo(
    () => filterByListTab(clientQueryFiltered, listTab),
    [clientQueryFiltered, listTab]
  );

  const emptyMessage = useMemo(() => {
    if (clientQueryFiltered.length === 0) {
      if (searchQuery.trim()) {
        return 'Ничего не найдено. Измените запрос в поле поиска.';
      }
      return 'Пока нет заявок. Создайте первую заявку по кнопке выше.';
    }
    return 'Нет заявок в выбранной категории. Выберите другую вкладку.';
  }, [clientQueryFiltered.length, searchQuery]);

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.navColumn} aria-label="Навигация раздела">
          <NavigationBar
            hasBackButton
            onBackClick={() => navigate('/')}
            hasTextBlock
            hasRootLink
            rootLinkText="Лизинг"
            onRootLinkClick={() => navigate('/')}
            title="Заявки на лизинг"
          />
        </aside>
        <main className={styles.mainColumn}>
          {flash?.kind === 'success' && (
            <div className={styles.successAlert} role="status" aria-live="polite">
              Заявка <strong>{flash.applicationId}</strong> успешно создана и сохранена в истории.
            </div>
          )}

          <div className={styles.toolbar}>
            <Button type="Primary" onClick={() => navigate('/leasing/applications/new')}>
              Создать заявку
            </Button>
          </div>

          <div className={styles.filtersRow}>
            <div className={styles.search}>
              <SearchInput
                size="s"
                variant="filled"
                placeholder="ИНН, ФИО, колвир код"
                showClearButton
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onValueChange={setSearchQuery}
                aria-label="Поиск заявок по ИНН, ФИО и коду Colvir"
              />
            </div>
            <div
              className={styles.statusTabs}
              role="tablist"
              aria-label="Фильтр списка заявок"
            >
              {LIST_TAB_CONFIG.map(({ id, label }) => (
                <Chip
                  key={id}
                  variant="tab"
                  label={label}
                  selected={listTab === id}
                  onClick={() => setListTab(id)}
                />
              ))}
            </div>
          </div>

          <section className={styles.listSection} aria-label="История заявок">
            {filtered.length === 0 ? (
              <p className={styles.empty}>{emptyMessage}</p>
            ) : (
              <div className={styles.list}>
                {filtered.map((row) => (
                  <LeasingCompanyListItem
                    key={`${row.applicationId}-${row.createdAt}`}
                    to={`/leasing/applications/${encodeURIComponent(row.applicationId)}`}
                    title={listCardTitle(row)}
                    innLabel={listInnLabel(row)}
                    status={row.status}
                    avatarChars={row.inn}
                    rightTitle={new Date(row.createdAt).toLocaleDateString('ru-RU')}
                    rejected={row.status === 'REJECTED' || row.status === 'CANCELLED'}
                    ariaLabel={listAriaLabel(row)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};
