import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';
import { ApplicationStatusBadge } from '../../components/ApplicationStatusBadge';
import { Button } from '../../components/Button/Button';
import { Cell } from '../../components/Cell';
import { resolvedClientFullNameForDisplay } from '../lib/leasingMockClientName';
import {
  getApplicationById,
  updateApplication,
  type LeasingApplicationRecord,
} from '../lib/leasingStorage';
import styles from './LeasingApplicationDetailPage.module.css';

function LockIcon() {
  return (
    <svg
      className={styles.lockIcon}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M9 11V8C9 5.79086 10.7909 4 13 4C15.2091 4 17 5.79086 17 8V11M7 11H17C18.1046 11 19 11.8954 19 13V18C19 19.1046 18.1046 20 17 20H7C5.89543 20 5 19.1046 5 18V13C5 11.8954 5.89543 11 7 11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M8 7V5C8 3.89543 8.89543 3 10 3H18C19.1046 3 20 3.89543 20 5V13C20 14.1046 19.1046 15 18 15H16M8 7H6C4.89543 7 4 7.89543 4 9V19C4 20.1046 4.89543 21 6 21H14C15.1046 21 16 20.1046 16 19V9C16 7.89543 15.1046 7 14 7H8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyValueButton({
  label,
  value,
  copyDisabled,
}: {
  label: string;
  value: string;
  copyDisabled?: boolean;
}) {
  const onCopy = useCallback(() => {
    if (copyDisabled || !value) return;
    void navigator.clipboard.writeText(value);
  }, [copyDisabled, value]);

  return (
    <button
      type="button"
      className={styles.copyButton}
      onClick={onCopy}
      disabled={copyDisabled}
      aria-label={`Скопировать ${label}`}
    >
      <CopyIcon />
    </button>
  );
}

export const LeasingApplicationDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { applicationId: applicationIdParam } = useParams();
  const applicationId = applicationIdParam ? decodeURIComponent(applicationIdParam) : '';

  const [record, setRecord] = useState<LeasingApplicationRecord | null>(() =>
    applicationId ? getApplicationById(applicationId) ?? null : null
  );

  const refresh = useCallback(() => {
    if (!applicationId) {
      setRecord(null);
      return;
    }
    setRecord(getApplicationById(applicationId) ?? null);
  }, [applicationId]);

  const isTerminal = record?.status === 'REJECTED' || record?.status === 'CANCELLED';
  const canCancel = record && !isTerminal;

  const onCancelApplication = useCallback(() => {
    if (!applicationId || !canCancel) return;
    const next = updateApplication(applicationId, { status: 'CANCELLED' });
    if (next) {
      setRecord(next);
    }
  }, [applicationId, canCancel]);

  useEffect(() => {
    refresh();
  }, [refresh, applicationId]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'leasing-applications-history') refresh();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refresh]);

  useEffect(() => {
    if (!applicationId) {
      navigate('/leasing/applications', { replace: true });
      return;
    }
    const latest = getApplicationById(applicationId);
    if (!latest) {
      navigate('/leasing/applications', { replace: true });
    }
  }, [applicationId, navigate]);

  if (!record) {
    return null;
  }

  const clientDisplayName = resolvedClientFullNameForDisplay(record);
  const colvirDisplay = record.colvirCode ?? '—';

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.navColumn} aria-label="Навигация раздела">
          <NavigationBar
            hasBackButton
            onBackClick={() => navigate('/leasing/applications')}
            hasTextBlock
            hasRootLink
            rootLinkText="Лизинг"
            onRootLinkClick={() => navigate('/')}
            title="Заявка"
            subtitle={record.applicationId}
          />
        </aside>
        <main className={styles.mainColumn}>
          <div className={styles.content}>
            {canCancel ? (
              <div className={styles.actionsRow}>
                <Button type="Secondary" onClick={onCancelApplication}>
                  Отменить
                </Button>
              </div>
            ) : null}
            {isTerminal && (
              <div className={styles.closedStrip} role="status">
                <LockIcon />
                <span>Закрыто — заявка не обрабатывается</span>
              </div>
            )}

            <div
              className={`${styles.clientInfoCard} ${isTerminal ? styles.cardMuted : ''}`}
            >
              <div className={styles.clientInfoHeader}>
                <h1 className={styles.clientInfoName}>{clientDisplayName}</h1>
              </div>
              <div className={styles.clientInfoDetails}>
                <Cell
                  size="M"
                  variant="default"
                  subtitle="ИНН"
                  iconRight={<CopyValueButton label="ИНН" value={record.inn} />}
                >
                  {record.inn}
                </Cell>
                <Cell
                  size="M"
                  variant="default"
                  subtitle="Колвир код"
                  iconRight={
                    record.colvirCode ? (
                      <CopyValueButton label="Колвир код" value={record.colvirCode} />
                    ) : undefined
                  }
                >
                  {colvirDisplay}
                </Cell>
              </div>
            </div>

            <div className={`${styles.card} ${isTerminal ? styles.cardMuted : ''}`}>
              <div className={styles.cardHeader}>
                <ApplicationStatusBadge status={record.status} />
              </div>

              <dl className={styles.fields}>
                <div className={styles.fieldRow}>
                  <dt>Номер заявки</dt>
                  <dd>{record.applicationId}</dd>
                </div>
                <div className={styles.fieldRow}>
                  <dt>Телефон</dt>
                  <dd>{record.phone}</dd>
                </div>
                <div className={styles.fieldRow}>
                  <dt>Комментарий</dt>
                  <dd>{record.commentPreview}</dd>
                </div>
                <div className={styles.fieldRow}>
                  <dt>Создана</dt>
                  <dd>{new Date(record.createdAt).toLocaleString('ru-RU')}</dd>
                </div>
              </dl>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
