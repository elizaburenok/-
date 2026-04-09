# PRD ↔ «Админка Финансирование» — flow matrix

**Figma file:** `v8qQeMoYztlBtlfd7g55a7` — [Админка Финансирование](https://www.figma.com/design/v8qQeMoYztlBtlfd7g55a7/)

| PRD / flow | Figma reference | Implementation |
|------------|-----------------|----------------|
| Раздел «Лизинг / Заявки на лизинг» + история (P0) | Hub canvas **`64982:30253`** — 720px column, Search + **Cell** lists | [LeasingApplicationsPage.tsx](../src/pages/LeasingApplicationsPage.tsx): центрированная колонка, поиск, список **Cell** |
| Быстрый поиск по истории (P1, FR-08 context) | Hub **`30253`** — Search Bar 32px, filled | **SearchInput** `size="s"` `variant="filled"` — фильтр по ИНН / телефону / комментарию / ID локально |
| «Создать заявку» → форма ИНН, телефон, комментарий | Service frame **`64982:30516`** («На скоринге») — **ContentOffer**: gap 15px, padding 30/20/60, фон страницы `#F9F9F9` | [CreateLeasingApplicationPage.tsx](../src/pages/CreateLeasingApplicationPage.tsx): колонка **ContentOffer**, поля с `gap: 15px` |
| Комментарий (многострочный блок) | **`30516`** — `.🛠Комментарии` raised card (белая поверхность, тень, r10) | **TextAreaField** `variant="raisedCard"` — токен `--shadow-surface-card` |
| Ошибка API / сеть + черновик (FR-06) | **`30516`** — **BAStatus** / contextual notification (полоса, r12, stroke) | Блок **statusStrip** над формой — `--rounding-3x`, `--color-border-default` |
| Успех с номером заявки (FR-05) | Нет отдельного full-screen в узлах | **custom:** flash на странице списка + **statusStrip**-подобные токены для успеха (`--rounding-3x`, brand-1 фон) |
| Прямая ссылка `?inn=&phone=` (FR-07) | — | **custom:** `useSearchParams` (уже есть) |

**Gaps (explicit «custom»):** отдельный экран успеха только в списке (flash), не отдельный роут; контент хаба в Figma — чужие названия разделов, не копируются.
