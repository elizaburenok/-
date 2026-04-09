import React, { useId, useState } from 'react';
import styles from './TextAreaField.module.css';

export type TextAreaFieldVariant = 'default' | 'raisedCard';

export interface TextAreaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  errorMessage?: string;
  /** Figma 30516 — комментарии в поднятой карточке */
  variant?: TextAreaFieldVariant;
}

// [custom] — no Figma source, based on TextField

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  errorMessage,
  variant = 'default',
  id: idProp,
  disabled,
  className,
  onFocus,
  onBlur,
  ...areaProps
}) => {
  const uid = useId();
  const id = idProp ?? uid;
  const [focused, setFocused] = useState(false);
  const error = Boolean(errorMessage);

  const raised = variant === 'raisedCard';

  const controlClass = [
    raised ? styles.controlEmbedded : styles.control,
    focused && styles.controlFocused,
    error && styles.controlError,
  ]
    .filter(Boolean)
    .join(' ');

  const field = (
    <div className={controlClass}>
      <textarea
        id={id}
        className={styles.textarea}
        disabled={disabled}
        aria-invalid={error}
        aria-describedby={error ? `${id}-error` : undefined}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...areaProps}
      />
    </div>
  );

  return (
    <div className={`${styles.root} ${className ?? ''}`.trim()}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {raised ? (
        <div
          className={`${styles.raisedCard} ${error ? styles.raisedCardError : ''}`.trim()}
        >
          {field}
        </div>
      ) : (
        field
      )}
      {errorMessage && (
        <span id={`${id}-error`} className={styles.message} role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
