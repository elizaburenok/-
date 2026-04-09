/**
 * Главная админки «Финансирование»: секции и ячейки по макету Figma (64982:30265) + «Лизинг».
 * Ассеты: /public/home-assets/
 */

const a = (file: string) => `${import.meta.env.BASE_URL}home-assets/${file}`;

export type HomeFill = 'fill.png' | 'fill-ruble.png';

export type HomeMenuItem = {
  id: string;
  title: string;
  description: string;
  fill: HomeFill;
  overlay: string;
  /** Только для перехода в раздел лизинга */
  to?: '/leasing/applications';
};

export type HomeSection = {
  id: string;
  title: string;
  items: HomeMenuItem[];
};

export const HOME_SECTIONS: HomeSection[] = [
  {
    id: 'clients',
    title: 'Клиенты, заявки и кредиты',
    items: [
      {
        id: 'non-client-forms',
        title: 'Анкеты НЕ клиентов',
        description: 'Без расчётного счёта',
        fill: 'fill.png',
        overlay: a('icon-1.png'),
      },
      {
        id: 'offers',
        title: 'Офферы',
        description: 'Все статусы',
        fill: 'fill.png',
        overlay: a('icon-2.png'),
      },
      {
        id: 'issued-products',
        title: 'Оформленные продукты',
        description: 'Действующие и закрытые',
        fill: 'fill.png',
        overlay: a('icon-3.png'),
      },
      {
        id: 'improper-assets',
        title: 'Ненадлежащие активы',
        description: 'По кредитам на балансе банка',
        fill: 'fill-ruble.png',
        overlay: a('icon-4.png'),
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
        overlay: a('icon-5.png'),
      },
      {
        id: 'business-advance',
        title: 'Бизнес-аванс',
        description: 'Точка',
        fill: 'fill.png',
        overlay: a('icon-5.png'),
      },
      {
        id: 'overdraft',
        title: 'Овердрафт',
        description: 'СимлФинанс, ПапаФинанс',
        fill: 'fill.png',
        overlay: a('icon-6.png'),
      },
      {
        id: 'renewable-line',
        title: 'Возобновляемая линия',
        description: 'Точка',
        fill: 'fill.png',
        overlay: a('icon-7.png'),
      },
      {
        id: 'partner-loans',
        title: 'Партнёрские кредиты',
        description: 'Простая и сложная интеграция',
        fill: 'fill.png',
        overlay: a('icon-8.png'),
      },
      {
        id: 'invest-loans',
        title: 'Инвестиции в бизнес-займы',
        description: 'Инвестплатформа',
        fill: 'fill.png',
        overlay: a('icon-9.png'),
      },
      {
        id: 'archive',
        title: 'Архив',
        description: 'Закрытые кредиты',
        fill: 'fill.png',
        overlay: a('icon-10.png'),
      },
      {
        id: 'leasing',
        title: 'Лизинг',
        description: 'Заявки на лизинг',
        fill: 'fill.png',
        overlay: a('icon-3.png'),
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
        overlay: a('icon-11.png'),
      },
      {
        id: 'docs-sign',
        title: 'Документы на подпись',
        description: 'По клиентам',
        fill: 'fill.png',
        overlay: a('icon-11.png'),
      },
      {
        id: 'docs-generate',
        title: 'Формирование документов',
        description: 'По клиентам',
        fill: 'fill.png',
        overlay: a('icon-11.png'),
      },
      {
        id: 'bki',
        title: 'БКИ',
        description: 'Бюро кредитных историй',
        fill: 'fill.png',
        overlay: a('icon-11.png'),
      },
    ],
  },
];

export function homeAssetPath(fill: HomeFill): string {
  return a(fill);
}
