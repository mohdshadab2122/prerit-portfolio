# Prerit Pramod Portfolio Website - Complete Overview Document

Live website: https://prerit-portfolio-nu.vercel.app/  
Project folder: `D:\prerit-pramod---engineering-leader`  
Review date: April 28, 2026

## 1. Purpose of the website

This website is the professional portfolio for Prerit Pramod. It presents his profile as an engineering leader, inventor, researcher, and founder. The website includes his background, education, professional experience, publications, intellectual property, awards, recognitions, and a contact form for professional inquiries.

The website is published as a React/Vite frontend on Vercel. The frontend code is deployed as a static single-page application, but most portfolio content is not hard-coded in React. The major content comes from Google Sheets through a Google Apps Script JSON API. This allows content to be updated from the Sheet without changing or redeploying the React code, as long as the existing data fields and structure remain the same.

## 2. Technology stack

- Frontend: React 19 with TypeScript
- Build tool: Vite
- Styling: Tailwind CSS v4
- Routing: React Router DOM
- Animations: Motion
- Icons: Lucide React
- Hosting: Vercel
- Content source: Google Sheets
- Data API: Google Apps Script Web App
- Server-side cache: Google Apps Script `CacheService`
- Browser-side cache: `localStorage`

## 3. Important project files

| File | Purpose |
| --- | --- |
| `src/main.tsx` | Starts the React app and wraps it with `DataProvider`. |
| `src/App.tsx` | Defines all website routes. |
| `src/Context/DataContext.tsx` | Fetches data from Google Apps Script, formats it, and stores it in browser cache. |
| `src/components/Layout.tsx` | Shared header, navigation, mobile menu, footer, and social links. |
| `src/components/Loader.tsx` | Loading screen shown while data is being loaded. |
| `src/pages/Home.tsx` | Home page hero, profile photo, summary cards, and preview sections. |
| `src/pages/Experience.tsx` | Professional experience timeline and expandable role details. |
| `src/pages/Education.tsx` | Education timeline and expandable degree details. |
| `src/pages/Publications.tsx` | Publications archive with tabs, search, and sorting. |
| `src/pages/IntellectualProperty.tsx` | Patents, defensive publications, trade secrets, filters, and pagination. |
| `src/pages/Awards.tsx` | Awards and recognitions tabs with expandable cards. |
| `src/pages/Contact.tsx` | Contact form and submit logic. |
| `src/index.css` | Global colors, fonts, base styles, and marquee animation. |
| `vercel.json` | Vercel rewrite configuration for React Router. |
| `.env.local` | Contact form Apps Script endpoint. |

Note: `src/pages/Skills.tsx` exists in the project, but it is not currently connected to any route in `src/App.tsx`.

## 4. Website routes and sections

### 4.1 Shared layout

All main pages render inside the shared `Layout` component.

Header:
- Sticky navigation bar at the top.
- Desktop navigation shows all route links.
- Mobile and tablet navigation uses a hamburger menu below the `lg` breakpoint.
- Business site button links to `https://inspiredinnovation.in/`.

Footer:
- Shows the Prerit Pramod name.
- Shows the quote: "Think deeper. Build bolder. Learn without limits."
- Social icons link to LinkedIn, Google Scholar, and Google Patents.
- Social links come from the Home sheet.
- The mail icon routes to the Contact page.

### 4.2 Home page - `/`

The Home page is the main portfolio summary page.

Data comes from the `Home` sheet. Main fields used:
- Name
- Tags
- Domain
- Short bio
- Achievements
- LinkedIn link
- Google Scholar link
- Google Patents link
- Profile photo
- Card 1, Card 2, Card 3

Main sections:
- Hero section with name, tags, professional domain, short bio, profile photo, and external links.
- Achievement row generated from comma-separated achievement text.
- Executive summary cards generated from `card1`, `card2`, and `card3`.
- Professional Experience preview showing the latest 3 experience items.
- Selected Publications preview showing the latest conference, journal, and preprint items.
- Education preview showing the latest 2 education items.
- Featured Awards preview showing the latest 3 award items.

Profile image logic:
- If the Sheet stores a Google Drive link containing `/d/<fileId>/`, the frontend converts it to:

```text
https://lh3.googleusercontent.com/d/<fileId>
```

This allows Google Drive images to render directly in the website.

### 4.3 Experience page - `/experience`

The Experience page shows a two-level professional timeline.

Main logic:
- Rows from the Experience sheet are grouped by company.
- Each company can contain multiple roles.
- Roles are sorted by latest start date.
- Company summaries are expandable.
- Individual role details are expandable.
- Company logo comes from `mediaLinks[0]`.
- Company website comes from `externalLinks[0]`.

Stats logic:
- Total roles: total number of experience rows.
- Organizations: unique company count.
- Leadership roles: roles containing words such as `manager`, `director`, `lead`, `ceo`, or `founder`.
- Total experience years: calculated from the earliest start date to the latest end date or present.

Expected Sheet format:
- `period` should be parseable, for example:

```text
Jan 2020 - Mar 2022
Jan 2020 - Present
```

- `roleDesc` can contain newline-separated points. The frontend converts each line into a bullet-style item.

### 4.4 Education page - `/education`

The Education page shows an academic timeline.

Main logic:
- Each row becomes a university/degree timeline card.
- University summary is expandable.
- Degree details are expandable.
- Logo comes from `mediaLinks[0]`.
- Website comes from `externalLinks[0]`.
- If GPA is numeric and less than or equal to 1, it is shown as a percentage. Example: `0.92` becomes `92.00%`.

Data fields:
- University
- College
- Degree
- Specialization
- Year/date
- Location
- GPA
- University description
- Prerit description
- Degree description
- Media links
- External links

### 4.5 Publications page - `/publications`

The Publications page presents a searchable archive in three categories:
- Conferences
- Journals
- Preprints

Main logic:
- Tabs switch between the three categories.
- Search checks title, organization, event, venue, division, and available tags.
- Conferences and journals are sorted by year in descending order.
- Preprints are sorted by date in descending order.
- The Open button uses the first external link from the Sheet data.

Stats displayed:
- Conference count
- Journal count
- Preprint count

### 4.6 Intellectual Property page - `/intellectual-property`

This page presents patents, defensive publications, and formal trade secrets.

Tabs:
- Patents
- Defensive Publications
- Formal Trade Secrets

Patent logic:
- One row in the Patent sheet represents one patent family.
- The same row can contain members for US, Germany, China, and Europe/World.
- The frontend converts each patent row into a family object with a `familyTitle` and a `members` array.
- Each member contains jurisdiction, number, date, title, status, and PDF link.
- Inventor columns are combined into a list of inventors.

Patent filters:
- Country filter: ALL, US, DE, CN, EP and WO.
- Search checks patent title and inventor names.
- Pagination shows 10 items per page.

Stats displayed:
- Patent Families: total patent family rows.
- Total Filings: count of all jurisdiction members across all families.
- Granted Patents: count of members where status is `Grant`.
- Jurisdictions: number of unique jurisdictions.

Responsive behavior:
- Desktop view uses a full patent table.
- Mobile and tablet views use expandable patent cards because wide tables are difficult to read on small screens.

Defensive Publications:
- Shows title, number, date, status, and inventors.
- Search works on title.
- Mobile view uses cards.
- Tablet and desktop view use a table.

Formal Trade Secrets:
- Shows title, date, and inventors.
- Search works on title.
- Mobile view uses cards.
- Tablet and desktop view use a table.

### 4.7 Awards page - `/awards`

The Awards page has two categories:
- Awards
- Recognitions

Main logic:
- Awards and recognitions are loaded from separate Sheets.
- A moving marquee at the top displays all award and recognition titles.
- Tabs switch between Awards and Recognitions.
- Cards are expandable.
- Summary is visible by default.
- Full description appears after expansion.
- Data is reversed so newer items appear first.

### 4.8 Contact page - `/contact`

The Contact page contains a professional inquiry form.

Fields:
- Full name
- Email address
- Phone number
- Company / organization
- Subject
- Message

Submit logic:
- The form sends a POST request to `VITE_CONTACT_FORM_URL`.
- The current `.env.local` file contains a separate Apps Script endpoint for contact form submissions.
- Payload format is `application/x-www-form-urlencoded`.
- If the response contains `success: true`, a success message is shown and the form is reset.
- If submission fails, an error message is shown.

## 5. Google Sheets to Apps Script connection

The portfolio data API uses one Google Apps Script deployment URL. The frontend passes a `page` query parameter to request the correct Sheet data.

Current data API endpoint pattern:

```text
https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec?page=<page_key>
```

Examples:

```text
...?page=home
...?page=experience
...?page=patents
```

The React frontend currently does not depend on `page=all`. It fetches each required page endpoint individually and in parallel.

Live endpoint counts observed during review:

| Page key | JSON data key | Live count |
| --- | --- | ---: |
| `home` | `home` | 1 |
| `experience` | `experiences` | 10 |
| `education` | `education` | 2 |
| `publication_conferences` | `publicationConferences` | 32 |
| `publication_journals` | `publicationJournals` | 4 |
| `publication_preprints` | `publicationPreprints` | 6 |
| `patents` | `patents` | 81 |
| `defensive_publications` | `defensivePublications` | 4 |
| `trade_secrets` | `tradeSecrets` | 2 |
| `awards` | `awards` | 3 |
| `recognitions` | `recognitions` | 9 |

Important note:
- The live `?page=all` endpoint currently returns `Exception: Argument too large: value`.
- This is likely because the combined payload is too large for Apps Script cache limits.
- The website still works because the frontend uses individual page endpoints.

## 6. Sheet configuration mapping

The Apps Script uses a `PAGE_CONFIG` object. This object defines which Sheet tab belongs to each page key, which columns should be read, what the publish flag column is, and which fields should be parsed as links.

| Page key | Sheet tab | JSON key | Publish flag index / column | Notes |
| --- | --- | --- | --- | --- |
| `home` | Home | `home` | 16 / Q | Profile, links, hero cards, and photo. |
| `education` | Education | `education` | 16 / Q | Academic timeline data. |
| `experience` | Experience | `experiences` | 16 / Q | Company and role timeline data. |
| `patents` | Patent | `patents` | 32 / AG | Uses index-based mapping because the sheet has repeated column names. |
| `defensive_publications` | Defensive Publication | `defensivePublications` | 12 / M | Inventors are read from columns F to I. |
| `trade_secrets` | Formal Trade Secret | `tradeSecrets` | 10 / K in code | Code and comment should be verified because the comment mentions M. |
| `publication_conferences` | Publication Conferences | `publicationConferences` | 9 / J | External links are parsed. |
| `publication_journals` | Publication Journals | `publicationJournals` | 9 / J | External links are parsed. |
| `publication_preprints` | Publication Preprints | `publicationPreprints` | 8 / I | External links are parsed. |
| `awards` | Awards | `awards` | 9 / J | Awards list. |
| `recognitions` | Recognitions | `recognitions` | 8 / I | Recognition list. |

Important Sheet rules:
- `Reference ID` must not be blank.
- The publish flag must be TRUE.
- A checkbox TRUE value or text value `"true"` is accepted.
- Completely blank rows are skipped.
- Rows with a missing primary key are skipped.
- Link fields must start with `http` or `https`.
- Multiple links can be separated by new lines, commas, or semicolons.

## 7. Apps Script API logic

### 7.1 `doGet(e)`

`doGet` is the main entry point for the data API.

Flow:
1. Read the `page` query parameter.
2. If `page` is missing, return an error with the list of available page keys.
3. If `page=all`, call `fetchAllPages()`.
4. If the page key is invalid, return an error.
5. Pick the matching config from `PAGE_CONFIG`.
6. Read optional `etag` query parameter.
7. Call `fetchPage(config, etag)`.

### 7.2 `doPost()`

The portfolio data API is read-only. POST requests are rejected.

```text
This endpoint is read-only. POST requests are not accepted.
```

The Contact form uses a separate Apps Script endpoint.

### 7.3 `fetchPage(config, clientEtag)`

This function handles Sheet reading, JSON formatting, and Apps Script cache usage.

Flow:
1. Create a cache key:

```text
portfolio_v1_<dataKey>
```

2. Check Apps Script `CacheService`.
3. If cache exists:
   - If the client ETag matches, return `{ unchanged: true, etag }`.
   - Otherwise return the cached object.
4. If cache is missing:
   - Open the active spreadsheet.
   - Find the configured Sheet tab.
   - Read rows using `getDataRange().getValues()`.
   - Start reading after the configured header row.
   - Skip rows where publish flag is not TRUE.
   - Skip completely blank rows.
   - Skip rows where the primary key is missing.
   - Build a record object from `columnsByIndex`.
   - Parse link fields using `parseLinks()`.
   - Combine inventor columns for patents, defensive publications, and trade secrets.
5. Create the response object using the configured JSON data key.
6. Calculate an MD5-based ETag.
7. Store the payload in Apps Script cache if it is below the 90 KB size limit.
8. Return JSON response.

### 7.4 Publish flag logic

A row is shown on the website only when the publish flag passes this check:

```javascript
publishFlag === true || String(publishFlag).toLowerCase() === "true"
```

This means both a Google Sheet checkbox TRUE value and text `"true"` are valid.

### 7.5 Link parsing logic

`parseLinks(value)` converts link cells into arrays.

Supported separators:
- New line
- Comma
- Semicolon

Only values starting with `http` are kept.

### 7.6 Date formatting

If Apps Script receives a real Date object from the Sheet, it formats it like this:

```text
Apr 28, 2026
```

Some frontend pages may format dates again for display.

### 7.7 ETag logic

`computeDataEtag()` creates an MD5 hash from the JSON string and returns the first 16 hexadecimal characters.

Purpose:
- Detect whether the data has changed.
- Support conditional responses such as `{ unchanged: true }`.

Current frontend status:
- The API returns ETags.
- The React frontend currently does not send the `etag` query parameter.
- The frontend mainly relies on browser `localStorage` timestamp caching.

## 8. React data loading and formatting logic

`DataContext.tsx` is the central data loader for the entire website.

Flow:
1. The app starts.
2. `DataProvider` checks `localStorage` for the `appData` key.
3. If cached data exists and is less than 1 hour old:
   - The cached data is used.
   - No API call is made.
4. If cache is missing, invalid, or expired:
   - `fetchAllData()` runs.
   - 11 Apps Script page endpoints are fetched in parallel.
   - JSON responses are mapped into frontend-friendly structures.
   - Final data is saved to `localStorage`.
   - The website renders using the final data object.

Current `localStorage` key:

```javascript
appData
```

Current cached shape:

```json
{
  "data": {
    "home": [],
    "experiences": [],
    "education": [],
    "publicationConferences": [],
    "publicationJournals": [],
    "publicationPreprints": [],
    "patents": [],
    "defensivePublications": [],
    "tradeSecrets": [],
    "awards": [],
    "recognitions": []
  },
  "timestamp": 1710000000000
}
```

## 9. Caching explanation

The website uses multiple cache layers. Understanding these layers is important when checking live Sheet changes.

### 9.1 Vercel static asset cache

The React code is built and served as hashed JS/CSS assets.

Examples:

```text
/assets/index-xxxx.js
/assets/index-xxxx.css
```

This cache matters for code/design changes. It normally does not block Google Sheet content updates.

### 9.2 Apps Script server-side cache

The Apps Script uses `CacheService`.

Settings:

```javascript
var CACHE_TTL_SECONDS = 21600; // 6 hours
var CACHE_SIZE_LIMIT = 90000;  // 90 KB
```

Meaning:
- Apps Script does not read the Sheet on every request.
- On the first request after a cache miss, Apps Script reads the Sheet.
- After that, the same page data can be served from cache for up to 6 hours.
- After changing the Sheet, old data may still appear until the server cache is cleared or expires.

Per-page cache keys:

```text
portfolio_v1_home
portfolio_v1_education
portfolio_v1_experiences
portfolio_v1_patents
portfolio_v1_defensivePublications
portfolio_v1_tradeSecrets
portfolio_v1_publicationConferences
portfolio_v1_publicationJournals
portfolio_v1_publicationPreprints
portfolio_v1_awards
portfolio_v1_recognitions
```

All-pages cache key:

```text
portfolio_all_pages
```

Important:
- The provided Apps Script defines `clearAllCache()` twice.
- In JavaScript, the last function definition wins.
- The final version is the correct one because it also clears `portfolio_all_pages`.

### 9.3 Browser localStorage cache

The frontend saves formatted website data in the browser under `appData`.

Expiry:

```javascript
1 * 60 * 60 * 1000 // 1 hour
```

Meaning:
- If a user already opened the website, that browser can keep showing cached data for up to 1 hour.
- Even if the Sheet and API are updated, the local browser cache can still show old data.

### 9.4 Cache priority

Actual loading order:
1. Browser checks `localStorage.appData`.
2. If valid cached data exists, the website uses it directly.
3. If browser cache is missing or expired, the frontend calls Apps Script endpoints.
4. Apps Script checks its own server cache.
5. If Apps Script cache is warm, it returns cached JSON.
6. If Apps Script cache is missing, it reads the Google Sheet and returns fresh JSON.

## 10. How to see live Sheet changes on the website

Follow these steps when a Sheet change must appear immediately on the live website.

### Step 1: Update the Google Sheet

- Open the correct Sheet tab.
- Edit an existing row or add a new row.
- Fill the `Reference ID`.
- Fill all required fields.
- Set the publish flag to TRUE.
- Keep links in valid `http` or `https` format.

### Step 2: Clear Apps Script server cache

Open the Google Apps Script editor.

Select this function from the function dropdown:

```javascript
clearAllCache
```

Click Run.

Expected result:
- All per-page cache keys are removed.
- `portfolio_all_pages` is also removed.
- Logs should show the cleared cache keys.

### Step 3: Clear browser localStorage cache

Open the live website in the browser.

Open DevTools Console.

Run this command:

```javascript
localStorage.removeItem("appData");
```

### Step 4: Refresh the website

Refresh the browser page.

Now the flow will be:
- Browser does not find local `appData`.
- React calls the Apps Script endpoints.
- Apps Script cache is empty, so it reads fresh data from the Sheet.
- The website displays the latest data.

### Quick browser command

After running `clearAllCache()` in Apps Script, this browser console command can clear local cache and reload in one step:

```javascript
localStorage.removeItem("appData");
location.reload();
```

Important:
- Run `clearAllCache()` first.
- If only browser localStorage is cleared but Apps Script cache is still old, the browser may fetch old cached API data again.

## 11. When will public users see updates?

Scenario 1: Apps Script cache is not cleared.
- Old API data can remain visible for up to 6 hours.

Scenario 2: Apps Script cache is cleared, but the user already has browser cache.
- That user may still see old data for up to 1 hour.

Scenario 3: Apps Script cache is cleared and the user opens the site in a new browser or incognito window.
- The latest data should usually appear immediately.

Scenario 4: An existing user needs to see the latest data immediately.
- In that user's browser console, run:

```javascript
localStorage.removeItem("appData");
location.reload();
```

## 12. Checklist for adding a new Sheet row

Before expecting a new row to appear on the website:

- Reference ID is filled.
- Publish flag is TRUE.
- Required display fields are not blank.
- Links start with `https://` or `http://`.
- Multiple links are separated by new lines, commas, or semicolons.
- Google Drive images are publicly accessible or shareable.
- Google Drive image links contain `/d/<fileId>/`.
- Role, degree, or description bullet points are separated by new lines.
- Date and period values follow the expected display format.

Recommended Experience period formats:

```text
Jan 2020 - Mar 2022
Jan 2020 - Present
```

Recommended publication year format:

```text
2024
2025
```

Recommended date format:

```text
Apr 28, 2026
```

## 13. Responsive compatibility

The website is designed to work on mobile, tablet/iPad, laptop, and desktop screens.

Tailwind breakpoints used:
- Default styles: mobile
- `sm:` small screens
- `md:` tablet and iPad-style layouts
- `lg:` desktop layouts
- `xl:` wider desktop spacing

Responsive examples:

Header:
- Desktop shows full navigation.
- Mobile and tablet show a hamburger menu.

Home:
- Desktop shows hero text on the left and profile photo on the right.
- Mobile and tablet show the profile photo below the name.
- Cards switch from one column to two or three columns depending on screen width.

Experience:
- Mobile role cards use a compact layout.
- Desktop role rows show more metadata in one line.
- Timeline spacing changes by breakpoint.

Education:
- Mobile uses stacked layout.
- Tablet and desktop use larger timeline cards with logos.

Publications:
- Tabs wrap on small screens.
- Search is full width on mobile and fixed width on larger screens.
- Publication cards stack on mobile and use row layout on larger screens.

Intellectual Property:
- Patent table is desktop-only.
- Mobile and tablet use expandable patent cards.
- Defensive publications and trade secrets use cards on mobile and tables on larger screens.

Contact:
- Mobile shows the form only.
- Tablet and desktop show the form plus right-side information cards.

## 14. Deployment notes

The website is deployed on Vercel.

`vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

Purpose:
- Ensures React Router routes do not show 404 errors on direct page load.
- Example: `/experience` can be opened directly and Vercel still serves `index.html`.

For code or design changes:
1. Update the React code.
2. Build and verify:

```bash
npm run build
```

3. Deploy to Vercel.

For content-only changes:
- Update the Google Sheet.
- Run `clearAllCache()` in Apps Script.
- Clear browser `localStorage.appData` if immediate browser verification is needed.
- React redeployment is not required unless the data structure or UI logic changes.

## 15. Known observations and cautions

1. The live `?page=all` endpoint currently returns an error because the combined payload appears too large. The website still works because it uses individual endpoints.

2. The `trade_secrets` config has a mismatch between code and comment:
   - Code uses `publishFlagIndex: 10`, which is column K.
   - Comment mentions column M.
   - The actual Sheet column should be verified.

3. `clearAllCache()` appears twice in the provided Apps Script. The final definition is the effective one and it correctly clears `portfolio_all_pages`.

4. The API supports ETags, but the current React frontend does not use the `etag` query parameter.

5. Some Home preview labels may be blank if mapped field names do not match:
   - Education preview references `edu.major` and `edu.institution`, while formatted data uses fields such as `specialization`, `college`, and `university`.
   - Awards preview references `award.institution`, while formatted data uses `organization`.
   - If these preview fields appear blank, the frontend mapping should be adjusted.

## 16. Simple data flow diagram

```text
Google Sheets
   |
   | Apps Script reads rows using PAGE_CONFIG
   v
Google Apps Script JSON API
   |
   | Server cache: CacheService, up to 6 hours
   v
React DataContext
   |
   | Browser cache: localStorage appData, up to 1 hour
   v
React pages
   |
   v
Vercel live website
```

## 17. Troubleshooting guide

Problem: Sheet changes are not visible on the website.

Fix:

```text
1. Run clearAllCache() in the Apps Script editor.
2. Open the live website browser console.
3. Run localStorage.removeItem("appData");
4. Refresh the page.
```

Problem: A row is not visible on the website.

Check:

```text
1. Is Reference ID filled?
2. Is publish flag TRUE?
3. Is the row in the correct Sheet tab?
4. Are required visible fields filled?
5. Was clearAllCache() run in Apps Script?
6. Was browser localStorage cleared?
```

Problem: Image is not visible.

Check:

```text
1. Is the Google Drive link shareable?
2. Does the link contain /d/<fileId>/?
3. Does the link start with http or https?
4. Does the Sheet cell contain only the valid link?
```

Problem: PDF or external link does not open.

Check:

```text
1. Does the link start with http or https?
2. Are multiple links separated by new lines, commas, or semicolons?
3. Is the PDF publicly accessible or shareable?
```

Problem: Contact form is not submitting.

Check:

```text
1. Is VITE_CONTACT_FORM_URL correct in .env.local?
2. Is the Contact Apps Script deployment accessible to Anyone?
3. Does the Contact Apps Script return { success: true }?
```
