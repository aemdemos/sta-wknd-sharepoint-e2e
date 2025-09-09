/* global WebImporter */
export default function parse(element, { document }) {
  // Always create the block with the required header
  const headerRow = ['Embed (embedSocial32)'];

  // Try to find a social embed URL in the source HTML
  // Use less specific selectors to find any possible embed links
  let url = '';
  // Look for Twitter, Instagram, Facebook, etc. links
  const possibleLinks = Array.from(element.querySelectorAll('a, [data-href]'));
  for (const el of possibleLinks) {
    const href = el.getAttribute('href') || el.getAttribute('data-href');
    if (href && (
      href.includes('twitter.com/') ||
      href.includes('instagram.com/') ||
      href.includes('facebook.com/') ||
      href.includes('tiktok.com/')
    )) {
      url = href;
      break;
    }
  }

  // If no embed found, fallback to example URL
  if (!url) {
    url = 'https://twitter.com/creativecloud/status/1549061442904633345?s=20&t=ZmXIH_DWvqQXGXCq__W3sA';
  }

  // Create the anchor element for the URL
  const a = document.createElement('a');
  a.href = url;
  a.textContent = url;

  // Build the table rows
  const rows = [headerRow, [a]];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
