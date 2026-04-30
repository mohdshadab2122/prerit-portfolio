# Dynamic Professional Portfolio

Reusable professional portfolio website for profile-driven career, education, publication, intellectual property, awards, recognitions, and contact content. The site uses a fast React frontend backed by spreadsheet-managed data, so the displayed profile can change without rebuilding the app.

Live website: configure this with your deployed portfolio domain.

## Overview

This website is built as a modern single-page React application. It uses reusable page components, shared layout/navigation, dynamic SEO metadata, and a centralized data context so portfolio content can be loaded consistently across the site.

The portfolio is designed to highlight:

- Professional leadership and career experience
- Academic background and education history
- Patents, defensive publications, and trade secrets
- Publications across conferences, journals, and preprints
- Awards, honors, and recognitions
- Contact form integration for visitor inquiries

## Tech Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- React Router DOM
- Motion
- Lucide React
- Google Apps Script and Google Sheets for portfolio data

## Pages

| Page                  | Route                    | Purpose                                                                           |
| --------------------- | ------------------------ | --------------------------------------------------------------------------------- |
| Home                  | `/`                      | Landing page with profile summary, domain focus, achievements, and featured links |
| Education             | `/education`             | Academic background, degree details, institutions, and related links              |
| Experience            | `/experience`            | Professional roles, companies, responsibilities, and contributions                |
| Publications          | `/publications`          | Conferences, journals, and preprints with category filtering                      |
| Awards                | `/awards`                | Awards and recognitions with structured presentation                              |
| Intellectual Property | `/intellectual-property` | Patents, defensive publications, and trade secrets                                |
| Contact               | `/contact`               | Contact form and professional profile links                                       |

## Data Flow

Portfolio content is managed outside the React app and served through a Google Apps Script API.

1. Content is stored in Google Sheets.
2. Apps Script reads published rows from each sheet.
3. The frontend fetches the API response through `DataContext`.
4. Data is cached in browser storage to reduce repeat API calls.
5. Each page consumes only the section of data it needs.

This keeps the website content easy to update without changing frontend code for every content edit.

## Important Files

```text
src/
  App.tsx                       Application routes
  main.tsx                      React entry point
  index.css                     Global styles and Tailwind setup

  components/
    Layout.tsx                  Shared navigation, header, and page shell
    Loader.tsx                  Loading state component
    SeoMeta.tsx                 Dynamic page title, metadata, Open Graph, and schema

  Context/
    DataContext.tsx             Central data fetching, formatting, caching, and app data provider

  config/
    portfolioApi.ts             Shared Google Apps Script API configuration

  pages/
    Home.tsx                    Home page
    Education.tsx               Education page
    Experience.tsx              Experience page
    Publications.tsx            Publications page
    Awards.tsx                  Awards and recognitions page
    IntellectualProperty.tsx    Patents, publications, and trade secrets page
    Contact.tsx                 Contact page and contact form handling

public/
  _redirects                    SPA routing fallback for static hosting
```

## Environment Variables

Create a `.env` file in the project root when running locally.

```env
VITE_PORTFOLIO_API_URL=your_portfolio_apps_script_endpoint
VITE_CONTACT_FORM_URL=your_contact_form_endpoint
```

`VITE_PORTFOLIO_API_URL` is required by the shared portfolio API config for all spreadsheet reads. The app does not include a production data fallback because each deployment should point to its own spreadsheet API. `VITE_CONTACT_FORM_URL` is used by the contact page to submit form data.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Available Scripts

| Script            | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Starts the Vite development server                       |
| `npm run build`   | Builds the production application                        |
| `npm run preview` | Serves the production build locally                      |
| `npm run lint`    | Runs ESLint checks                                       |
| `npm run clean`   | Removes generated build artifacts and dependency folders |

## Deployment Notes

The app is a client-side React SPA, so production hosting must route all page requests back to `index.html`.

- `public/_redirects` supports Netlify-style SPA fallback.
- `vercel.json` can be used for Vercel rewrites when deploying to Vercel.
- Make sure all required environment variables are configured in the hosting dashboard.
- After changing Apps Script or spreadsheet schema, clear Apps Script cache and browser local storage if stale content appears.

## Content Maintenance

Most portfolio updates should be made in the connected Google Sheets source. Keep publish flags accurate so only approved rows are shown on the public website.

When adding a new content section:

1. Add the sheet and published columns in Google Sheets.
2. Update the Apps Script page configuration.
3. Extend `DataContext.tsx` types and parsing logic.
4. Create or update the relevant React page component.
5. Build and lint before deployment.

## Validation

Before publishing changes, run:

```bash
npm run lint
npm run build
```

These checks confirm that the TypeScript code compiles and the production bundle can be generated successfully.

## Ownership

This is a private portfolio project. Website content, profile data, images, publications, intellectual property references, and related materials belong to the profile owner or the organization maintaining the connected data source unless otherwise noted.
