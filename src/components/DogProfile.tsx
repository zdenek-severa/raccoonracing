import { useState } from 'react';

const tabs = [
  { title: 'Představení', content: <><p>Uhrančivý pohled, červeně tečkovaná srst a pozornost, které nic neunikne. Seznamte se s Akim, australským honáckým psem jménem Akarni Flameborn Linden Algona.</p><dl className="profile-facts"><div><dt>Narozen</dt><dd>19. 11. 2025</dd></div><div><dt>Otec</dt><dd>Tablerock Heezfrom Downunder</dd></div><div><dt>Matka</dt><dd>Haruka Red Heeler Ara</dd></div></dl></> },
  { title: 'Zdraví', content: <><p>Zdravotní údaje podle dodaného prezentačního plakátu. Podrobnosti a příslušné výsledky s vámi rádi projdeme osobně.</p><dl className="profile-facts health-facts"><div><dt>PRA</dt><dd>N/P</dd></div><div><dt>PRA rcd4 · PLL</dt><dd>N/N · N/N</dd></div><div><dt>NCL5 · NCL12 · DM</dt><dd>N/N · N/N · N/N</dd></div><div><dt>MC · Cyst.</dt><dd>N/N · N/N</dd></div><div><dt>Sluch</dt><dd>BAER OK</dd></div></dl></> },
  { title: 'Výstavy a zkoušky', content: <><p>Práce, společné zážitky i zkušenosti z výstavního kruhu. Údaje vycházejí z Akiho prezentačního plakátu.</p><dl className="profile-facts"><div><dt>Výstavy</dt><dd>3× BOMP, BOP</dd></div><div><dt>World Dog Show Bologna</dt><dd>Very promising</dd></div><div><dt>Zkoušky</dt><dd>NHAT</dd></div></dl></> },
];

export default function DogProfile() {
  const [active, setActive] = useState(0);
  return <div className="dog-profile">
    <div className="profile-tabs" role="tablist" aria-label="Informace o Akim">{tabs.map((tab, i) => <button key={tab.title} id={`dog-tab-${i}`} role="tab" type="button" aria-selected={active === i} aria-controls={`dog-panel-${i}`} tabIndex={active === i ? 0 : -1} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length; setActive(next); document.getElementById(`dog-tab-${next}`)?.focus(); } }} onClick={() => setActive(i)}>{tab.title}</button>)}</div>
    {tabs.map((tab, i) => <div key={tab.title} className="tab-panel" id={`dog-panel-${i}`} role="tabpanel" aria-labelledby={`dog-tab-${i}`} tabIndex={0} hidden={active !== i}>{tab.content}</div>)}
  </div>;
}
