import React, { useId, useState } from 'react';
import styles from './TextField.module.css';

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  errorMessage?: string;
  /** [custom] — paste helper; maps to Transparent Button / Icon control pattern in Figma TUI */
  accessoryRight?: React.ReactNode;
  /** Figma hub 32px search density */
  compact?: boolean;
}

// [custom] — no Figma source, based on SearchInput

export const TextField: React.FC<TextFieldProps> = ({
  label,
  errorMessage,
  accessoryRight,
  compact = false,
  id: idProp,
  disabled,
  className,
  onFocus,
  onBlur,
  ...inputProps
}) => {
  const uid = useId();
  const id = idProp ?? uid;
  const [focused, setFocused] = useState(false);
  const error = Boolean(errorMessage);

  const controlClass = [
    styles.control,
    compact && styles.controlCompact,
    focused && styles.controlFocused,
    error && styles.controlError,
    disabled && styles.controlDisabled,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${styles.root} ${className ?? ''}`.trim()}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
        {accessoryRight}
      </div>
      <div className={controlClass}>
        <input
          id={id}
          className={`${styles.input} ${compact ? styles.inputCompact : ''}`.trim()}
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
          {...inputProps}
        />
      </div>
      {errorMessage && (
        <span id={`${id}-error`} className={styles.message} role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
