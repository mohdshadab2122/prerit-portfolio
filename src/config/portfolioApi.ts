/*
 * Shared portfolio API configuration.
 *
 * Both the main data provider and the loader need to call the same Apps Script
 * deployment. Keeping the URL in one place prevents the two fetch paths from
 * drifting when the spreadsheet deployment changes.
 */

const DEFAULT_PORTFOLIO_API_URL =
  "https://script.google.com/macros/s/AKfycbx_4dB3V7MHMCxNWSmFy_oIzHKC9bSsfxQfhdKymk3v-fkudJq_QC7FedHd_bgTsj2R/exec";

export const PORTFOLIO_API_BASE_URL =
  import.meta.env.VITE_PORTFOLIO_API_URL || DEFAULT_PORTFOLIO_API_URL;

export const buildPortfolioPageUrl = (page: string) =>
  `${PORTFOLIO_API_BASE_URL}?page=${encodeURIComponent(page)}`;
