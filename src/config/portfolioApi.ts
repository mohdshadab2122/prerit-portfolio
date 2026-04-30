/*
 * Shared portfolio API configuration.
 *
 * Both the main data provider and the loader need to call the same Apps Script
 * deployment. The URL is intentionally required through environment config so
 * cloned deployments cannot accidentally point at someone else's spreadsheet.
 */

export const PORTFOLIO_API_BASE_URL =
  import.meta.env.VITE_PORTFOLIO_API_URL?.trim() || "";

export const buildPortfolioPageUrl = (page: string) => {
  if (!PORTFOLIO_API_BASE_URL) {
    throw new Error("Missing required environment variable: VITE_PORTFOLIO_API_URL");
  }

  return `${PORTFOLIO_API_BASE_URL}?page=${encodeURIComponent(page)}`;
};
