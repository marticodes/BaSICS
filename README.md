# BASICS tool page

Best way to visualize basics tools 

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Recharts
- Vitest

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
