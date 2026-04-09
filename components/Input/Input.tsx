import React, { useId } from 'react';
import styles from './Input.module.css';

type BaseInputProps = {
  label: string;
  errorMessage?: string;
  /** Right side of the label row (e.g. paste action) */
  accessoryRight?: React.ReactNode;
  className?: string;
};

export type InputSingleLineProps = BaseInputProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    multiline?: false;
  };

export type InputMultilineProps = BaseInputProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> & {
    multiline: true;
  };

export type InputProps = InputSingleLineProps | InputMultilineProps;

export const Input: React.FC<InputProps> = (props) => {
  const {
    label,
    errorMessage,
    accessoryRight,
    className,
    id: idProp,
    disabled,
    multiline,
    ...rest
  } = props;

  const uid = useId();
  const id = idProp ?? uid;
  const error = Boolean(errorMessage);

  const shellClass = [styles.shell, disabled && styles.shellDisabled]
    .filter(Boolean)
    .join(' ');

  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className={`${styles.root} ${className ?? ''}`.trim()}>
      <div className={shellClass}>
        <div className={styles.main}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor={id}>
              {label}
            </label>
            {accessoryRight}
          </div>
          {multiline ? (
            <textarea
              id={id}
              className={styles.textarea}
              disabled={disabled}
              aria-invalid={error}
              aria-describedby={describedBy}
              {...(rest as Omit<
                React.TextareaHTMLAttributes<HTMLTextAreaElement>,
                'id'
              >)}
            />
          ) : (
            <input
              id={id}
              className={styles.input}
              disabled={disabled}
              aria-invalid={error}
              aria-describedby={describedBy}
              {...(rest as Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'>)}
            />
          )}
        </div>
        {errorMessage && (
          <div className={styles.errorBlock}>
            <div className={styles.errorDivider} aria-hidden />
            <p id={`${id}-error`} className={styles.errorMessage} role="alert">
              {errorMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
