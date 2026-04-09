import React from 'react';
import { Link } from 'react-router-dom';
import { ApplicationStatusBadge } from '../ApplicationStatusBadge/ApplicationStatusBadge';
import type { ApplicationStatusBadgeVariant } from '../ApplicationStatusBadge/ApplicationStatusBadge';
import styles from './LeasingCompanyListItem.module.css';

function Chevron() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface LeasingCompanyListItemProps {
  to: string;
  title: string;
  innLabel: string;
  status: ApplicationStatusBadgeVariant;
  avatarChars: string;
  rightTitle?: string;
  caption?: string;
  rejected?: boolean;
  ariaLabel: string;
}

export const LeasingCompanyListItem: React.FC<LeasingCompanyListItemProps> = ({
  to,
  title,
  innLabel,
  status,
  avatarChars,
  rightTitle,
  caption,
  rejected,
  ariaLabel,
}) => {
  const rootClass = `${styles.root} ${rejected ? styles.rejected : ''}`;

  return (
    <Link
      to={to}
      className={rootClass}
      aria-label={ariaLabel}
    >
      <span className={styles.inner}>
        <span className={styles.avatarWrap}>
          <span className={styles.avatar} aria-hidden>
            <span className={styles.avatarText}>{avatarChars.slice(0, 2)}</span>
          </span>
        </span>

        <span className={styles.main}>
          <span className={styles.textBlock}>
            <span
              className={`${styles.title} ${status === 'APPROVED' ? styles.titleApproved : ''}`}
            >
              {title}
            </span>
            <span className={styles.description}>{innLabel}</span>
          </span>
          <span className={styles.extra}>
            <ApplicationStatusBadge status={status} />
            {caption ? <span className={styles.caption}>{caption}</span> : null}
          </span>
        </span>

        {rightTitle && (
          <span className={styles.valueCol}>
            <span className={styles.valueTitle}>{rightTitle}</span>
          </span>
        )}

        <span className={styles.chevron}>
          <Chevron />
        </span>
      </span>
    </Link>
  );
}

export default LeasingCompanyListItem;
