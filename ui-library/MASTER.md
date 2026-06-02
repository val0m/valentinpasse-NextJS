# MASTER — Design System (Source de vérité globale)

> Généré avec **ui-ux-pro-max** v2.5.0 pour *Valentin Passe Portfolio*.
> Source de vérité unique ; les fichiers de `pages/` surchargent ces règles page par page.
> Brief : portfolio développeur fullstack — **minimal, professionnel, éditorial**.

## 1. Pattern — Portfolio Grid

- **Focus conversion** : les réalisations d'abord. Filtrage par catégorie. Chargement rapide essentiel.
- **Placement CTA** : hover sur les cartes projet + contact en footer.
- **Stratégie couleur** : fond neutre (laisser le travail respirer). Texte noir/blanc. Accent minimal.
- **Sections** : 1. Hero (Nom/Rôle) · 2. Grille projets (masonry) · 3. À propos / Philosophie · 4. Contact.

## 2. Style — Minimalism & Swiss (base) + micro-interactions

> Le plugin proposait *Motion-Driven* par défaut, mais pour un rendu **minimal/éditorial/professionnel**
> on prend **Minimalism & Swiss Style** comme socle (perf ⚡ excellente, WCAG AAA) et on n'emprunte au
> Motion-Driven que des micro-interactions sobres.

- **Mots-clés** : clean, spacieux, fonctionnel, grille, white space, haut contraste, géométrique, sans-serif.
- **Grille** : 12 colonnes strictes, espacement mathématique (unité de base 8px).
- **Décoration** : minimale. Pas d'ombres/dégradés gratuits. Un seul accent.
- **Mouvement (couche légère)** : reveal au scroll (Intersection Observer), hover 200–300ms,
  transitions douces, page transitions discrètes. **Toujours** sous `prefers-reduced-motion`.

## 3. Couleurs (tokens du plugin — Monochrome + accent bleu)

| Rôle | Hex | Variable CSS |
|------|-----|--------------|
| Primary | `#18181B` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#3F3F46` | `--color-secondary` |
| Accent / CTA | `#2563EB` | `--color-accent` |
| Background | `#FAFAFA` | `--color-background` |
| Foreground | `#09090B` | `--color-foreground` |
| Card | `#FFFFFF` | `--color-card` |
| Muted | `#E8ECF0` | `--color-muted` |
| Muted Foreground | `#64748B` | `--color-muted-foreground` |
| Border | `#E4E4E7` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| Ring (focus) | `#18181B` | `--color-ring` |

**Règle** : un seul accent dominant (`--color-accent`). Tout le reste est monochrome.
Consommer les variables, jamais de hex en dur dans les composants.

> ✅ **Implémenté** : `styles/globals.css` expose ce set de tokens, complété de tokens dérivés pour les
> surfaces sombres (`--color-dark`, `--color-on-dark*`, `--color-accent-on-dark`, `--color-accent-soft`).
> Les 11 SCSS de composants consomment `var(--color-*)` ; les tints/alphas sont obtenus via `color-mix()`.
> L'ancien accent chaud `#c68b59` et les bleus multiples ont été supprimés au profit du seul `--color-accent`.

## 4. Typographie — « Minimalist Portfolio »

- **Titres** : `Archivo` (300–700)
- **Corps** : `Space Grotesk` (300–700)
- **Mood** : minimal, portfolio, créatif, clean, artistique
- **Import CSS** :
```css
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
```
- **Hiérarchie** : poids + taille avant la couleur ; corps `line-height` 1.5–1.75 ; mesure 60–75 car.

> **Alternative éditoriale assumée** (si on veut un caractère plus « magazine ») : pairing
> *Minimalist Monochrome Editorial* — `Playfair Display` (titres) + `Source Serif 4` (corps)
> + `JetBrains Mono` (tags/dates/labels en uppercase tracking-widest). 100% serif/mono, pas de sans UI.

## 5. Espacement & layout

- **Grille** : 12 colonnes, `gap` ~1rem, unité de base **8px** (rythme 4/8).
- **Conteneur** : `max-width` cohérent (~1200px), centré.
- **Rayon** : `--border-radius: 0px` (Swiss) — coins nets ; assouplir uniquement si besoin produit.
- **Responsive** : mobile-first, breakpoints 375 / 768 / 1024 / 1440. Pas de scroll horizontal.

## 6. Effets & micro-interactions

- Reveal au scroll via Intersection Observer (entrée discrète).
- Hover 200–300ms, `ease-out` à l'entrée / `ease-in` à la sortie ; exit ~60–70% de l'entrée.
- `transform`/`opacity` uniquement (pas de width/height/top/left). Pas de CLS.
- Ombres : aucune par défaut ; si nécessaire, une échelle unique et discrète.
- **`prefers-reduced-motion`** respecté partout (déjà géré globalement dans `globals.css`).

## 7. Implémentation (Next.js 16 / React 19)

- **CSS Modules** par composant + tokens globaux dans `styles/globals.css` ; pas de styles inline.
- Pas de Tailwind ni lib UI tierce — composants maison dans `components/`.
- **Tints & opacités** : générées via `color-mix(in srgb, var(--color-x) N%, transparent)` plutôt que des
  rgba codés en dur — un seul token source par teinte.
- Icônes : SVG (Lucide/Heroicons), jamais d'emoji ; stroke et taille cohérents (tokens).
- Focus visible sur tous les interactifs (`--color-ring`) ; contraste AA min (AAA visé en Swiss).

## 8. Anti-patterns à éviter

- Templates corporate génériques, layouts passe-partout.
- Multi-accents qui se disputent l'attention.
- Ombres/dégradés décoratifs, animations gratuites, mouvement sans signification.
- Emoji comme icônes ; hex codés en dur dans les composants.

> **Exception assumée — diagramme de compétences** (`sectionSkills`) : utilise un set catégoriel
> `--cat-1..5` (bleu / violet / cyan / émeraude / ambre) pour distinguer 5 domaines. C'est un usage
> data-viz légitime (la couleur n'est pas le seul porteur d'info : chaque nœud a son libellé). Ces
> couleurs restent **tokenisées** dans `globals.css` et ne doivent pas se propager au reste de l'UI.

## 9. Pre-Delivery Checklist (plugin)

- [ ] Pas d'emoji en guise d'icône (SVG : Heroicons/Lucide)
- [ ] `cursor: pointer` sur tous les éléments cliquables
- [ ] États hover avec transitions douces (150–300ms)
- [ ] Light mode : contraste texte ≥ 4.5:1
- [ ] États focus visibles (navigation clavier)
- [ ] `prefers-reduced-motion` respecté
- [ ] Responsive vérifié : 375 / 768 / 1024 / 1440px
