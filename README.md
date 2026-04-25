# Valentin Passe Portfolio

Static-first portfolio built with Next.js and TypeScript for Valentin Passe, Fullstack .NET engineer. The site is designed as a premium one-page experience with bilingual French and English routes, anchored navigation, editorial content, and section-based storytelling.

## Stack

- Next.js pages router
- React 19
- TypeScript
- Sass Modules
- next/font/google for typography
- Jest for unit tests

## Current Scope

The active product scope includes:
- hero section
- about section
- services section
- skills section
- work experience section
- education section
- projects section
- contact section
- one-page navigation
- bilingual experience with French and English pages
- premium visual redesign with gradients, glass effects, and restrained motion

Removed from the active backlog:
- CV download
- standalone conversion reassurance feature

## Routes

- `/` French version
- `/en` English version

The language switch preserves the current section anchor when possible so visitors keep their browsing context while changing language.

## Content Architecture

Localized content is centralized in `content/portfolioContent.ts`.

This file acts as the source of truth for:
- metadata
- navigation labels
- hero copy and actions
- about content
- services
- experience entries
- education entries
- projects
- contact copy
- footer labels

The shared one-page composition lives in `components/homePage/homePage.tsx`, which renders the same section structure for both locales.

## Project Structure

```text
components/
  homePage/                  Shared one-page composition root
  layout/                    Shell, metadata, header, footer
  heroSection/               Intro section and key actions
  sectionResume/             About section
  sectionServices/           Services section
  sectionSkills/             Skills section and normalization helpers
  sectionWorkExperiences/    Experience section
  sectionEducations/         Education section
  sectionProjects/           Projects section
  sectionContact/            Contact section
content/
  portfolioContent.ts        Localized portfolio content
docs/
  specs/                     Feature specifications still in scope
  user-stories/              Matching user stories
  implementation-overview.md High-level implementation summary
pages/
  index.tsx                  French route
  en.tsx                     English route
  _app.tsx                   Global fonts and app wrapper
  _document.tsx              Locale-aware document lang
styles/
  globals.css                Design tokens and global styles
  Home.module.css            Main page layout spacing
```

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

## Implementation Notes

- The site uses static content instead of a runtime i18n library.
- French is the default locale and English is exposed through a dedicated `/en` page.
- Section anchors are shared across locales to keep navigation and language switching predictable.
- Styling relies on CSS variables in `styles/globals.css` and section-level Sass modules.
- Typography is loaded through `next/font/google` with Manrope for body text and Space Grotesk for display text.

## Documentation

- `docs/specs/` contains the technical specifications for the remaining features in scope.
- `docs/user-stories/` contains the corresponding product intent and acceptance criteria.
- `docs/implementation-overview.md` summarizes the delivered architecture and current scope.

## Quality Checks

Recommended validation flow after changes:

```bash
npm run build
npm run test
```
