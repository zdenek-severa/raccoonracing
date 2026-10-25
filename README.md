# Raccoon Racing

Český prezentační web chovné stanice australského honáckého psa. Astro, Tailwind CSS 4 a interaktivní React islands; TypeScript v přísném režimu. Stránka se sestavuje do statického HTML.

## Spuštění

Vyžaduje aktuální Node.js LTS (v prostředí je k dispozici `D:\WP\WEB\.tools\node-v24.22.1-win-x64`).

```powershell
npm install
npm run dev
```

Vývojový web: `http://127.0.0.1:4321`.

Pokud Node není v PATH, pro aktuální PowerShell relaci:

```powershell
$env:PATH = 'D:\WP\WEB\.tools\node-v24.22.1-win-x64;' + $env:PATH
npm run dev
```

```powershell
npm run check   # TypeScript a Astro
npm run build   # kontrola a statický produkční build do dist/
npm run preview # náhled produkční verze
npm run prepare:images # znovu vytvoří WebP výřezy ze zdrojových PNG
```

## Obsah a úpravy

- `src/pages/index.astro`: kompletní český obsah a struktura stránky.
- `src/data/content.ts`: kontakty, navigace a časté dotazy.
- `src/styles/global.css`: barevnost, typografie, Tailwind a responzivní styly.
- `src/components/`: React menu, profil psa s přístupnými záložkami, dialog galerie a FAQ.
- Galerie používá `yet-another-react-lightbox`: zobrazení přes celou plochu, přepínání šipkami a gesty, náhledy, přiblížení a volitelný fullscreen. Ovládání je česky; původní malý dialog byl odstraněn.
- `public/images/`: lokální obrázky. Portrétní a postojové výřezy jsou z dodaného plakátu, nikoli nové dokumentární fotografie.

Fonty jsou servírované lokálně přes Fontsource. Web nepoužívá analytiku, externí fotografie, cookies ani nefunkční kontaktní formulář. Telefonní a e-mailové odkazy otevírají příslušnou aplikaci návštěvníka.

Údaje o Akim jsou přepsané z dodaného plakátu. Texty o přístupu stanice jsou návrhem k redakčnímu schválení. Před veřejným nasazením ověřte zejména datum narození, výstavní a zdravotní výsledky a oficiální název stanice. Dostupnost štěňat ani termíny vrhů nejsou vymyšlené; návštěvník je odkázán na osobní kontakt. Další psy a skutečné fotografie lze doplnit do stejné struktury.

## SEO a indexace

Produkční doména je `https://raccoonracing.cz/`. Je jednotně použita v canonical odkazu, Open Graph metadatech, JSON-LD i sitemapě. Přepsat ji lze proměnnou `SITE_URL`; příklad konfigurace je v `.env.example`. Proměnné se vyhodnocují při sestavení, takže změna vyžaduje nový build.

- Produkční build má `index, follow`; `npm run dev` má vždy `noindex, follow`.
- Pro neveřejnou testovací kopii nastavte `INDEXING_ENABLED=false` a znovu spusťte build. Sitemap pak neobsahuje URL a robots na ni neodkazuje. Robots umožňuje načtení stránky, aby vyhledávač mohl přečíst `noindex`.
- `src/pages/robots.txt.ts` a `src/pages/sitemap.xml.ts` generují skutečné statické soubory `dist/robots.txt` a `dist/sitemap.xml` při každém sestavení.
- Sitemap obsahuje hlavní stránku. Sekce s `#fragmentem`, obrázky ani chybová stránka nejsou samostatné indexované stránky. Není přidáváno smyšlené datum změny při každém buildu.
- `src/components/Seo.astro` obsahuje title, description, canonical, Open Graph, Twitter Cards a JSON-LD typů Organization, WebSite a WebPage. Neuvádí vymyšlenou adresu, hodnocení ani dostupnost štěňat.
- Náhled pro sdílení je `public/images/social-card.jpg` (1200 × 630).
- Všechny profilové záložky i odpovědi FAQ jsou už v serverem sestaveném HTML, takže jejich načtení nezávisí na spuštění Reactu.
- `404.html` má vlastní `noindex` a nenastavuje canonical na hlavní stránku.

### Kontroly

`npm run build` automaticky spouští kontrolu TypeScriptu/Astra, build a `npm run validate`. Samostatnou kontrolu již sestaveného webu spustíte příkazem `npm run validate`.

Lokální HTML5 validátor prověřuje všechny sestavené HTML stránky, včetně obsahu, vnoření elementů, duplicitních ID a platnosti odkazů ARIA. Zná vlastní elementy Astro islands. Povolené jsou obě platné HTML syntaxe prázdných atributů a zakončení void elementů, protože Astro a React je serializují odlišně. SRI se vyžaduje pro externí zdroje; projekt používá lokální zdroje. Specifický pomocný styl vkládaný Astrem k prvnímu React islandu se při sestavení přesouvá do `<head>`, bez změn hydratačních skriptů.

Report HTML validace: `reports/html-validation.json`. Navazující kontroly ověřují sitemap XML, index/noindex, canonical, konzistenci metadat, strukturovaná data, lokální soubory, kotvy, rozměry obrázků a přítomnost obsahu před spuštěním JavaScriptu. Jde o lokální HTML validaci, nikoliv potvrzení vzdálenou službou W3C.

### Nasazení na raccoonracing.cz

1. Nahrajte celý obsah `dist/` na HTTPS hosting domény. Použijte výchozí produkční indexaci, nikoliv `INDEXING_ENABLED=false`.
2. Nastavte trvalé HTTP 301/308 přesměrování `http://raccoonracing.cz/*` a `https://www.raccoonracing.cz/*` na odpovídající cestu na `https://raccoonracing.cz/*`. Pro www musí být platný TLS certifikát. `/index.html` přesměrujte na `/`.
3. Neexistující cesty musí vracet skutečný stav HTTP 404 a obsah `404.html`. Nepoužívejte přepis všech cest na hlavní stránku se stavem 200.
4. Ověřte veřejné odpovědi HTTP 200 pro `/`, `/robots.txt` a `/sitemap.xml`; HTML nesmí mít serverovou hlavičku `X-Robots-Tag: noindex`, přihlašovací bránu ani ochranu blokující Googlebot.
5. Přidejte doménovou property `raccoonracing.cz` do [Google Search Console](https://search.google.com/search-console), ověřte vlastnictví DNS TXT záznamem a odešlete `https://raccoonracing.cz/sitemap.xml` v nabídce Soubory Sitemap. Alternativní HTML ověření lze přidat do `GOOGLE_SITE_VERIFICATION` a znovu sestavit web.
6. V Kontrole adresy URL prověřte `https://raccoonracing.cz/` a požádejte o indexování. Sledujte stav indexace a případná hlášení vyhledávače.

Nasazení, DNS, přesměrování a odeslání do Search Console se provádějí na příslušném hostingu a účtu. Samotné vytvoření souborů nezaručuje ani nespouští okamžité zařazení do výsledků vyhledávání.
