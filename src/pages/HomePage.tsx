import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cell } from '../../components/Cell/Cell';
import { SearchInput } from '../../components/SearchInput/SearchInput';
import { HOME_SECTIONS, homeAssetPath, type HomeMenuItem } from '../lib/homeSections';
import { publicAsset } from '../lib/publicAsset';
import styles from './HomePage.module.css';

function RowIcon({ item }: { item: HomeMenuItem }) {
  return (
    <span className={styles.iconWrap}>
      <img src={homeAssetPath(item.fill)} alt="" className={styles.iconFill} />
      <img src={item.overlay} alt="" className={styles.iconOverlay} />
    </span>
  );
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const onItemClick = (item: HomeMenuItem) => {
    if (item.to) {
      navigate(item.to);
    }
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/leasing/applications?q=${encodeURIComponent(q)}` : '/leasing/applications');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <img src={publicAsset('home-assets/logo.png')} alt="Точка" className={styles.logo} />
            <span className={styles.brandDivider} aria-hidden="true" />
            <p className={styles.brandTitle}>Финансирование</p>
          </div>
          <div className={styles.userBlock}>
            <div className={styles.userLeft}>
              <img
                src={publicAsset('home-assets/avatar.png')}
                alt=""
                className={styles.avatar}
                width={34}
                height={34}
              />
              <p className={styles.userName}>Полуэктова Ю.</p>
            </div>
            <div className={styles.headerActions}>
              <button type="button" className={styles.iconButton} aria-label="Настройки">
                <img src={publicAsset('home-assets/icon-12.png')} alt="" width={24} height={24} />
              </button>
              <button type="button" className={styles.iconButton} aria-label="Выйти">
                <img src={publicAsset('home-assets/icon-13.png')} alt="" width={24} height={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <form className={styles.search} onSubmit={onSearchSubmit}>
            <SearchInput
              size="s"
              variant="filled"
              placeholder="ИНН, ФИО, колвир код"
              showClearButton
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onValueChange={setSearchQuery}
              aria-label="Поиск по ИНН, ФИО и коду Colvir"
            />
          </form>

          {HOME_SECTIONS.map((section) => (
            <section key={section.id} className={styles.section} aria-labelledby={`home-section-${section.id}`}>
              <h2 id={`home-section-${section.id}`} className={styles.sectionTitle}>
                {section.title}
              </h2>
              {section.items.map((item) => (
                <Cell
                  key={item.id}
                  size="L"
                  variant="default"
                  icon={<RowIcon item={item} />}
                  onClick={item.to ? () => onItemClick(item) : undefined}
                >
                  <span className={styles.cellText}>
                    <span className={styles.cellTitle}>{item.title}</span>
                    <span className={styles.cellDesc}>{item.description}</span>
                  </span>
                </Cell>
              ))}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};
