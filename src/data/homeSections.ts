/**
 * Главная админки «Финансирование» — структура списков по макету Figma (64982:30265)
 * + ячейка «Лизинг» в блоке «Управление продуктами».
 */

const A = (file: string) => `/home-assets/${file}`;

export type HomeFill = 'fill.png' | 'fill-ruble.png';

export type HomeListItem = {
  id: string;
  title: string;
  description: string;
  fill: HomeFill;
  overlay: string;
  /** Только для перехода в лизинг */
  to?: string;
};

export type HomeSection = {
  id: string;
  title: string;
  items: HomeListItem[];
};

export const homeSections: HomeSection[] = [
  {
    id: 'clients',
    title: 'Клиенты, заявки и кредиты',
    items: [
      {
        id: 'non-client-forms',
        title: 'Анкеты НЕ клиентов',
        description: 'Без расчётного счёта',
        fill: 'fill.png',
        overlay: 'icon-1.png',
      },
      {
        id: 'offers',
        title: 'Офферы',
        description: 'Все статусы',
        fill: 'fill.png',
        overlay: 'icon-2.png',
      },
      {
        id: 'issued-products',
        title: 'Оформленные продукты',
        description: 'Действующие и закрытые',
        fill: 'fill.png',
        overlay: 'icon-3.png',
      },
      {
        id: 'improper-assets',
        title: 'Ненадлежащие активы',
        description: 'По кредитам на балансе банка',
        fill: 'fill-ruble.png',
        overlay: 'icon-4.png',
      },
    ],
  },
  {
    id: 'products',
    title: 'Управление продуктами',
    items: [
      {
        id: 'express',
        title: 'Экспресс-кредит',
        description: 'СимлФинанс, ПапаФинанс',
        fill: 'fill.png',
        overlay: 'icon-5.png',
      },
      {
        id: 'business-advance',
        title: 'Бизнес-аванс',
        description: 'Точка',
        fill: 'fill.png',
        overlay: 'icon-5.png',
      },
      {
        id: 'overdraft',
        title: 'Овердрафт',
        description: 'СимлФинанс, ПапаФинанс',
        fill: 'fill.png',
        overlay: 'icon-6.png',
      },
      {
        id: 'renewable-line',
        title: 'Возобновляемая линия',
        description: 'Точка',
        fill: 'fill.png',
        overlay: 'icon-7.png',
      },
      {
        id: 'partner-loans',
        title: 'Партнёрские кредиты',
        description: 'Простая и сложная интеграция',
        fill: 'fill.png',
        overlay: 'icon-8.png',
      },
      {
        id: 'biz-loan-invest',
        title: 'Инвестиции в бизнес-займы',
        description: 'Инвестплатформа',
        fill: 'fill.png',
        overlay: 'icon-9.png',
      },
      {
        id: 'archive',
        title: 'Архив',
        description: 'Закрытые кредиты',
        fill: 'fill.png',
        overlay: 'icon-10.png',
      },
      {
        id: 'leasing',
        title: 'Лизинг',
        description: 'Заявки на лизинг',
        fill: 'fill.png',
        overlay: 'icon-3.png',
        to: '/leasing/applications',
      },
    ],
  },
  {
    id: 'services',
    title: 'Управление сервисами',
    items: [
      {
        id: 'orchestrator',
        title: 'Оркестратор',
        description: 'Проверки',
        fill: 'fill.png',
        overlay: 'icon-11.png',
      },
      {
        id: 'docs-sign',
        title: 'Документы на подпись',
        description: 'По клиентам',
        fill: 'fill.png',
        overlay: 'icon-11.png',
      },
      {
        id: 'docs-generate',
        title: 'Формирование документов',
        description: 'По клиентам',
        fill: 'fill.png',
        overlay: 'icon-11.png',
      },
      {
        id: 'bki',
        title: 'БКИ',
        description: 'Бюро кредитных историй',
        fill: 'fill.png',
        overlay: 'icon-11.png',
      },
    ],
  },
];

export function assetPath(fill: HomeFill): string {
  return A(fill);
}

export function overlayPath(overlay: string): string {
  return A(overlay);
}
