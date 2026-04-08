# Tool Atlas

A production-ready, responsive data visualization app for exploring JSON tool datasets.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Recharts
- Vitest

## Features

- Overview dashboard with KPI cards and charts
- Global multi-filter sidebar + text search
- Active filter chips + reset all
- Category explorer with collapsible groups and sorting
- Interactive tool map with color coding and hover descriptions
- Tool detail modal + dedicated detail route
- Related tools suggestions
- Custom groups and subgroups (saved in `localStorage`)
- Group analytics and export to JSON/CSV
- Filter presets (saved in `localStorage`)
- Compare two groups side-by-side
- Graceful null handling (`Unknown`)
- Accessible controls (labels, keyboard-friendly inputs, high contrast)

## Data setup

Place your dataset at:

- `data.json` (project root)

The app loader copies this file into `src/data/data.json` and normalizes fields.

Expected fields per tool:

- `Name`
- `Category`
- `Customization`
- `Description`
- `Example Platforms`
- `Layer`
- `Target`
- `Tool Accessibility`
- `Tool Persistence`
- optional: `imageUrl`

If `imageUrl` is missing, the app uses seeded realistic placeholder images.

## Development

```bash
npm install
npm run dev
```

## Testing

```bash
npm run test
```

## Build + Preview

```bash
npm run build
npm run preview
```

## Deploy

Deploy the built `dist/` folder to any static host:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

## Project structure

- `src/pages` page-level routes
- `src/components` reusable UI
- `src/hooks` state/filter hooks
- `src/lib` filtering/grouping/aggregation/storage helpers
- `src/types` TypeScript interfaces
- `src/data` dataset loader
