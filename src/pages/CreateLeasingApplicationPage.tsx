import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input';
import {
  appendHistory,
  clearDraft,
  loadDraft,
  saveDraft,
} from '../lib/leasingStorage';
import { mockClientFullNameFromApplicationId } from '../lib/leasingMockClientName';
import { submitLeasingApplication } from '../lib/mockLeasingApi';
import styles from './CreateLeasingApplicationPage.module.css';

type FieldErrors = Partial<Record<'inn' | 'phone' | 'comment', string>>;

function validate(inn: string, phone: string, comment: string): FieldErrors {
  const e: FieldErrors = {};
  if (!inn.trim()) e.inn = 'Заполните ИНН';
  if (!phone.trim()) e.phone = 'Заполните номер телефона';
  if (!comment.trim()) e.comment = 'Заполните комментарий с запросом клиента';
  return e;
}

async function pasteFromClipboard(): Promise<string | null> {
  try {
    const t = await navigator.clipboard.readText();
    return t.trim();
  } catch {
    return null;
  }
}

export const CreateLeasingApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [inn, setInn] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const qInn = searchParams.get('inn') ?? '';
    const qPhone = searchParams.get('phone') ?? '';
    const draft = loadDraft();

    if (qInn || qPhone) {
      setInn(qInn);
      setPhone(qPhone);
      if (draft?.comment) setComment(draft.comment);
    } else if (draft) {
      setInn(draft.inn);
      setPhone(draft.phone);
      setComment(draft.comment);
    }
  }, [searchParams]);

  const persistDraft = useCallback(() => {
    saveDraft({
      inn,
      phone,
      comment,
      updatedAt: new Date().toISOString(),
    });
  }, [inn, phone, comment]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const next = validate(inn, phone, comment);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      const { applicationId } = await submitLeasingApplication({
        inn: inn.trim(),
        phone: phone.trim(),
        comment: comment.trim(),
      });
      clearDraft();
      appendHistory({
        applicationId,
        inn: inn.trim(),
        phone: phone.trim(),
        commentPreview:
          comment.trim().length > 80
            ? `${comment.trim().slice(0, 80)}…`
            : comment.trim(),
        createdAt: new Date().toISOString(),
        status: 'IN_PROGRESS',
        clientFullName: mockClientFullNameFromApplicationId(applicationId),
        colvirCode: null,
      });
      navigate('/leasing/applications', {
        replace: false,
        state: { flash: { kind: 'success', applicationId } },
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Не удалось отправить заявку. Попробуйте ещё раз.';
      setApiError(message);
      persistDraft();
    } finally {
      setLoading(false);
    }
  };

  const pasteInn = async () => {
    const t = await pasteFromClipboard();
    if (t) setInn(t);
  };

  const pastePhone = async () => {
    const t = await pasteFromClipboard();
    if (t) setPhone(t);
  };

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
            onRootLinkClick={() => navigate('/leasing/applications')}
            title="Новая заявка"
            subtitle="Создание заявки в Т-Лизинг от лица клиента"
          />
        </aside>

        <main className={styles.mainColumn}>
          <div className={styles.content}>
            {apiError && (
              <div
                className={`${styles.statusStrip} ${styles.statusStripError}`}
                role="alert"
              >
                {apiError} Черновик сохранён локально в браузере — данные не потеряны.
              </div>
            )}

            <p className={styles.bannerHint}>
              Данные из сообщения в Коннекте можно вставить сюда: кнопки «Вставить из буфера» или
              прямая ссылка с параметрами{' '}
              <span className={styles.hintCode}>?inn=&amp;phone=</span>.
            </p>

            <form className={styles.form} onSubmit={onSubmit} noValidate>
              <Input
                label="ИНН"
                name="inn"
                value={inn}
                onChange={(e) => setInn(e.target.value)}
                autoComplete="off"
                errorMessage={errors.inn}
                accessoryRight={
                  <button
                    type="button"
                    className={styles.pasteButton}
                    onClick={pasteInn}
                    disabled={loading}
                  >
                    Вставить из буфера
                  </button>
                }
              />

              <Input
                label="Номер телефона"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                inputMode="tel"
                errorMessage={errors.phone}
                accessoryRight={
                  <button
                    type="button"
                    className={styles.pasteButton}
                    onClick={pastePhone}
                    disabled={loading}
                  >
                    Вставить из буфера
                  </button>
                }
              />

              <Input
                multiline
                label="Комментарий с запросом клиента"
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                placeholder="Текст из канала: запрос клиента, вопросы квалифицированного лида"
                errorMessage={errors.comment}
              />

              <div className={styles.actions}>
                <Button
                  type="Secondary"
                  disabled={loading}
                  onClick={() => navigate('/leasing/applications')}
                >
                  Отмена
                </Button>
                <Button
                  type="Primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={loading}
                >
                  Отправить заявку
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
