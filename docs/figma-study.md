# Phase 3 — Figma study

**File used:** [Bank Patterns](https://www.figma.com/design/CBS0qZz6lqoU2Mh3StNwV7/Patterns) (`fileKey`: `CBS0qZz6lqoU2Mh3StNwV7`) — same file as references in the repo (`Dropdown`, `Cell`, `BarGraph` specs).

**Tools:** `search_design_system` (user-Figma); `get_figma_data` (user-Figma MCP).  
**Limitation:** `get_design_context` / `get_variable_defs` (desktop) returned *“select a layer first”* — no full Styles/Variables dump from the panel; variables below combine **search results** + **layout JSON** + **project `tokens/`** (already aligned with Figma naming in code comments).

---

## 1. Design tokens

### From Figma variable search (libraries linked to file)

| Category | Examples (names) |
|----------|-------------------|
| **Corner radius** | `Form Rounding`, `Form Rounding Weak`, `Button Rounding Weak`, `Button Rounding Strong` (collection **Roundings**, library **TUI 1.9 Size Modes**) |
| **Colors (Bank theme)** | `Bank/Badge/Text Risk Low` … (collection **Bank Theme**, **Bank 01 Foundation**) |
| **Semantic colors** | Text field outline/BG (Miscellaneous) in iOS/macOS collections — secondary libraries |

### From `get_figma_data` — canvas **«Списки»** (`27554:86522`)

| Pattern | Values observed |
|---------|-----------------|
| **Frame padding** | `100px` |
| **Column gap** | `70px` (content blocks), `100px` (sections), `50px` (inner) |
| **Content width** | `720px` (main column), outer frame `920px` |
| **Background** | `#FFFFFF` |
| **Corner radius** | `50px` on outer frames (marketing-style cards; admin content uses smaller radii via tokens — see `css-variables`: `--rounding-2-5x`, etc.) |

### Source of truth for implementation

All colors, typography, spacing, and radii **in code** are taken from **`tokens/css-variables.css`** and **`tokens/*.ts`**, which document alignment with Figma variable structure (primitive, bg, page, container, typography, spacing, rounding).

---

## 2. Component library (search highlights)

Libraries discoverable from this file include:

| Library | Representative components |
|---------|---------------------------|
| **TUI 3.2 Buttons** | `Button`, `Icon Button`, `Outlined Button`, `Transparent Button`, `Outlined Icon Button` |
| **TUI 3.5 Forms** | `Proposal Form Cell` |
| **TUI 3.4 Organisms** | `Navigator` |
| **Bank 02 UI Kit** | `Button`, `Header Button`, `Buttons Bar`, `Navigator Button`, … |
| **Bank 02 UI Kit Web** (file-local instances) | `Text field`, `Input Field`, `Textarea Field`, `Alert`, `Search Field`, … |

*Full enumerated list is large; search is query-based. Names above are sufficient for mapping.*

---

## 3. Layout patterns

- **Vertical stacks:** `layoutMode: column`, **gap** 50–100px between major blocks, **padding** 100px on showcase frames.
- **Content column width:** **720px** for primary content in list patterns.
- **White card** on white page — admin прототип использует фон страницы `page.secondary` и внутренний контейнер без обязательного `border-radius: 50px` (карточка продукта vs админ-форма).

---

## 4. Naming conventions

- **Components:** PascalCase English (`Text field`, `Button`, `Proposal Form Cell`); Bank/TUI prefixes via library name, not always in component name.
- **Variables:** slash notation (`Bank/Badge/...`), collection names (`Roundings`, `Bank Theme`).
- **Layers in Patterns file:** Russian frame titles (`Списки`, `Cписки`), English component instances (`Longrid Info`, `Content`).

---

## 5. Phase 2 inventory → Figma mapping

| Expected (Phase 2) | Figma |
|--------------------|--------|
| Primary / secondary buttons | **Button** (TUI 3.2 / Bank 02), variants outlined/filled/transparent |
| Text input + label + error | **Text field**, **Input Field** |
| Multiline comment | **Textarea Field** |
| List rows | **Cell**-like rows / list patterns (**Списки** canvas); repo has **`Cell`** |
| Nav / title | **Navigator**, **Navigator Button**; repo has **`NavigationBar`** |
| Small paste / icon control | **Icon Button**, **Transparent Icon Button** |

---

## 6. Gaps

| Need | Status |
|------|--------|
| Dedicated **«Leasing application»** screen in Figma | Not found in search — **concept-only in code**. |
| **API error toast** pattern | **Alert** exists in file-local kit; not wired in repo — **custom block** on tokens. |
| **Exact variable values** from Figma UI | Desktop variable export failed — **use repo `tokens/`** as canonical for implementation. |

---

## 7. «Админка Финансирование» (layout reference for leasing UI)

**File:** [Админка Финансирование](https://www.figma.com/design/v8qQeMoYztlBtlfd7g55a7/) · `fileKey`: `v8qQeMoYztlBtlfd7g55a7`

| Node | Name | Use in product |
|------|------|----------------|
| `64982:30253` | Canvas «↳ ✏️ Лизинг» | Hub: **720px** column, **Search** (32px), **Cell** lists, **gap 30px** |
| `64982:30516` | Frame «На скоринге» | Service: **ContentOffer** padding `30px 20px 60px`, **gap 15px**, page bg `#F9F9F9`, **BAStatus** strip, **raised card** for comments |

**PRD mapping:** see [admin-financing-prd-figma-matrix.md](admin-financing-prd-figma-matrix.md).

**New tokens used in code:** `--spacing-2xl`, `--color-border-default`, `--shadow-surface-card` ([css-variables.css](../tokens/css-variables.css)).

---

**Status:** Phase 3 documentation complete (within tool constraints).
