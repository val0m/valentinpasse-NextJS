# UI Library — Design System

Dossier de référence pour le design du portfolio (`ui-library/` à la racine, versionné), utilisé avec le plugin **ui-ux-pro-max**.

## Structure

| Fichier / dossier | Rôle |
|-------------------|------|
| `MASTER.md` | Source de vérité globale : style, couleurs, typographie, effets, règles UX. |
| `pages/` | Overrides par page (ex. `pages/home.md`). Prioritaires sur le MASTER. |

## Workflow avec le plugin

**1. Explorer / générer un design system** (le plugin recherche styles, palettes, typos, UX).
Le script requiert Python 3 (installé sur cette machine : `C:\Users\valen\AppData\Local\Programs\Python\Python312\python.exe`) :

```powershell
$py    = "C:\Users\valen\AppData\Local\Programs\Python\Python312\python.exe"
$skill = "C:\Users\valen\.claude\plugins\cache\ui-ux-pro-max-skill\ui-ux-pro-max\2.5.0\src\ui-ux-pro-max"
& $py "$skill\scripts\search.py" `
  "personal portfolio fullstack developer minimal professional editorial" `
  --design-system -p "Valentin Passe Portfolio" -f markdown
```

**2. Construire une page** — prompt de récupération contextuelle :

```
Je construis la page [Nom]. Lis ui-library/MASTER.md.
Vérifie aussi si ui-library/pages/[nom].md existe.
Si oui, priorise ses règles ; sinon utilise le MASTER seul.
Maintenant, génère le code (Next.js 16 / React 19, CSS Modules).
```

## Stack cible

- **Next.js 16** (Pages Router) · **React 19** · **TypeScript**
- **Styles** : CSS Modules + `styles/globals.css` (CSS custom properties)
- Pas de Tailwind / pas de lib UI tierce — composants maison dans `components/`
