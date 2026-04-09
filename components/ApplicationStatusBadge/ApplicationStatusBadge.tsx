import React from 'react';
import styles from './ApplicationStatusBadge.module.css';

export type ApplicationStatusBadgeVariant =
  | 'IN_PROGRESS'
  | 'AWAITING_TL'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

const LABELS: Record<ApplicationStatusBadgeVariant, string> = {
  IN_PROGRESS: 'В работе',
  AWAITING_TL: 'Ожидаем ответ от Т-Лизинг',
  APPROVED: 'Одобрено',
  REJECTED: 'Отклонено',
  CANCELLED: 'Отменена',
};

export interface ApplicationStatusBadgeProps {
  status: ApplicationStatusBadgeVariant;
  className?: string;
}

export const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({
  status,
  className,
}) => {
  const variantClass =
    status === 'IN_PROGRESS' || status === 'AWAITING_TL'
      ? styles.inProgress
      : status === 'APPROVED'
        ? styles.approved
        : styles.rejected;

  return (
    <span className={`${styles.root} ${variantClass} ${className ?? ''}`}>
      {LABELS[status]}
    </span>
  );
};

export default ApplicationStatusBadge;
