---
applyTo: "**/*.html,**/*.css,**/*.scss,**/*.tsx,**/*.jsx,**/*.vue,**/*.svelte"
---
# UI/UX Design Instructions

- Minimum 4.5:1 color contrast ratio for normal text (WCAG AA)
- Touch targets minimum 44x44px on mobile
- Use SVG icons (Heroicons, Lucide) — never emojis as UI icons
- All clickable elements must have `cursor-pointer`
- Hover transitions 150-300ms using transform/opacity, not width/height
- Minimum 16px body text on mobile
- Line height 1.5-1.75 for body text, 65-75 characters per line
- All images must have descriptive alt text
- Form inputs must have associated labels
- Respect `prefers-reduced-motion` for animations
- Responsive at 375px, 768px, 1024px, 1440px breakpoints
- No horizontal scroll on mobile — ensure content fits viewport
- Focus states visible on all interactive elements
- Z-index scale: 10, 20, 30, 50 — avoid arbitrary values
- Use design tokens (CSS variables) — never hardcode hex colors
- Light/dark mode: test both before delivery
- Glass/transparent elements must be visible in light mode
- Use consistent icon sizing (24x24 viewBox, w-6 h-6)
- Reserve space for async content to prevent layout shift
