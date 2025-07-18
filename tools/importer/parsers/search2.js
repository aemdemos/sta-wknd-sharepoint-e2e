/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search block (section with class containing 'cmp-search')
  const searchSection = element.querySelector('section.cmp-search');
  if (!searchSection) return;

  // Try to find the <form> that provides the search endpoint
  const form = searchSection.querySelector('form');
  let absUrl = '';
  if (form) {
    const action = form.getAttribute('action');
    if (action) {
      // Compose absolute URL if needed
      if (/^https?:\//.test(action)) {
        absUrl = action;
      } else if (typeof window !== 'undefined' && window.location && window.location.origin) {
        absUrl = window.location.origin.replace(/\/$/, '') + (action.startsWith('/') ? '' : '/') + action;
      } else {
        absUrl = action;
      }
    }
  }

  // If we have an endpoint, create a <a> for it, else fallback to referencing the searchSection
  let contentCell;
  if (absUrl) {
    const link = document.createElement('a');
    link.href = absUrl;
    link.textContent = absUrl;
    contentCell = link;
  } else {
    // Reference the full search section if endpoint is not found
    contentCell = searchSection;
  }

  // Table format: header row, then one row with search endpoint link (or section as fallback)
  const cells = [
    ['Search'],
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
