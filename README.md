# Prerit Pramod — Portfolio Website

Personal portfolio website for **Prerit Pramod** — Founder & CEO of Inspired Innovation LLC, engineering executive, and inventor with 225+ patents across power electronics, autonomous systems, and deep technology.

🌐 **Live Site:** [preritpramod.com](https://www.preritpramod.com)

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** — build tool & dev server
- **Tailwind CSS v4** — utility-first styling
- **React Router DOM v6** — client-side routing
- **Motion v12** — animations (Framer Motion successor)
- **Lucide React** — icons

---

## Pages

| Route                    | Page                                                    |
| ------------------------ | ------------------------------------------------------- |
| `/`                      | Home — hero, stats, and section previews                |
| `/experience`            | Interactive two-level career timeline                   |
| `/education`             | Academic background timeline                            |
| `/publications`          | Searchable publications archive                         |
| `/intellectual-property` | Patent families, defensive publications & trade secrets |
| `/awards`                | Awards & recognitions                                   |
| `/contact`               | Contact form                                            |

---

## Getting Started

**Prerequisites:** Node.js v18+, Git

```bash
# Clone the repo
git clone https://github.com/mohdshadab2122/prerit-portfolio.git
cd prerit-portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your VITE_CONTACT_FORM_URL in .env

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_CONTACT_FORM_URL=your_google_apps_script_url_here
```

| Variable                | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `VITE_CONTACT_FORM_URL` | Google Apps Script endpoint for the contact form |

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # TypeScript type check
npm run clean    # Remove /dist folder
```

---

## Deployment

This project is deployed on **Netlify** via continuous deployment from this GitHub repository.

- Every push to `main` triggers an automatic build and deploy
- Build command: `npm run build`
- Publish directory: `dist`
- The `public/_redirects` file ensures all routes are handled correctly by React Router on Netlify

---

## Project Structure

```
prerit-portfolio/
├── public/
│   ├── _redirects          # Netlify routing rule
│   ├── prerit.jpg          # Profile photo
│   └── logos/              # Company & university logos
└── src/
    ├── components/
    │   └── Layout.tsx       # Shared navbar + footer
    ├── pages/
    │   ├── Home.tsx
    │   ├── Experience.tsx
    │   ├── Education.tsx
    │   ├── Publications.tsx
    │   ├── IntellectualProperty.tsx
    │   ├── Awards.tsx
    │   └── Contact.tsx
    └── data/
        └── intellectualProperty.ts  # Patent & IP data
```

---

## License

This project is private. All content, design, and intellectual property belong to Prerit Pramod.
