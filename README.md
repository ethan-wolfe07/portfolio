# Ethan Wolfe — Portfolio

A modern, high-performance personal website showcasing my work, experience, and skills. Built with semantic HTML, handcrafted CSS, and vanilla JavaScript — fast, responsive, and packed with subtle polish.

> Live site: (add your GitHub Pages URL here once deployed)

## Highlights
- Sleek, responsive layout with glassmorphism accents
- Animated experience timeline with clear career progression
- Interactive hero with typing effect and smooth scrolling
- Theme switcher (light/dark) with persisted preference
- Particle background and tasteful motion (optimized for performance)
- Reading progress bar and section reveal animations
- Accessibility-focused (keyboard navigation, reduced motion)
- Fun easter eggs: `showMeTheCode()`, Konami code secret mode

## Sections
- Hero + Call to Action
- About
- Experience Timeline (GatorHall COO, BioVision Research, Omniangle Technologies DS Intern, Alan Levan Center Intern, UF Data Science)
- Projects
- Skills
- Contact

## Tech Stack
- HTML5 (semantic structure)
- CSS3 (custom properties, responsive layout, animations)
- Vanilla JavaScript (modules for animations, theme, navigation, contact form)
- Icons: Font Awesome
- Fonts: Google Fonts

## Project Structure
```
Portfolio/
├─ index.html        # Main page
├─ styles.css        # Global styles
├─ script.js         # Interactivity & animations
└─ assets/
   ├─ headshot.jpg
   ├─ resume.pdf
   └─ additionalMentions.txt
```

## [Link to Website](https://ethanwolfe.vercel.app/)

## Customization
- Content: edit `index.html` (text, sections, links)
- Styles: tweak `styles.css` (colors, spacing, animations)
- Scripts: update `script.js` (typing words, thresholds, timings)
  - Change typing words by updating the `data-words` attribute on the `.typing-text` element in HTML
  - Toggle particles in `script.js` by including/removing the particle canvas
  - Theme defaults are persisted via `localStorage`

## Accessibility & Performance
- IntersectionObserver-driven reveal animations (no layout thrash)
- Reduced motion support: respects `prefers-reduced-motion`
- Keyboard navigation with focus management on mobile nav
- Lazy-loaded imagery hooks and throttled/optimized scroll handlers

## Easter Eggs
- In the browser console, run:
  - `showMeTheCode()` — prints build info and returns a message
  - `changeTheme('light')` or `changeTheme('dark')`
- Enter the Konami code on the page to unlock a rainbow secret mode

## Deploy to GitHub Pages
1. Commit and push to GitHub (main branch)
2. In the repo on GitHub: Settings → Pages
3. Source: "Deploy from a branch" → Branch: `main` → Folder: `/root`
4. Save — your site will build and a URL will appear
5. Update the "Live site" link at the top of this README

## License
- Code: MIT License (feel free to reuse and adapt with attribution)
- Content & media (text, images, resume): © Ethan Wolfe. Please do not reuse without permission.

## 📬 Contact
Use the Contact section on the site, or connect via LinkedIn/GitHub.

---
Made with care and plenty of polish. If you spot an issue or have an idea, open an issue or PR.
