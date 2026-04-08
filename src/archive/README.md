# Archived features

These files are **not** wired into the app. They were removed from the main UI to keep the site focused on tool visualization.

- `pages/GroupsPage.tsx` — custom groups and subgroups (localStorage)
- `pages/ComparePage.tsx` — compare two groups
- `hooks/useGroups.ts` — group state hook

To restore: copy files back under `src/pages` and `src/hooks`, re-add routes in `App.tsx` and nav links in `TopNav.tsx`, and pass `groups` / `addToGroup` props where `ToolDetailModal` and related pages expect them.
