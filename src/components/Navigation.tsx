import { useState } from 'react';
import { navigation } from '../data/content';

export default function Navigation() {
  const [open, setOpen] = useState(false);
  return <>
    <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)} aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}><span>{open ? '✕' : '☰'}</span></button>
    <nav id="main-navigation" className={`navigation ${open ? 'is-open' : ''}`} aria-label="Hlavní navigace">
      {navigation.map(item => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
      <a className="nav-contact" href="#kontakt" onClick={() => setOpen(false)}>Poznejme se <span aria-hidden="true">↗</span></a>
    </nav>
  </>;
}
