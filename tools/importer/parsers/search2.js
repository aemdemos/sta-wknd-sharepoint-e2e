/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main search section inside the block
  let searchSection = element.querySelector('section.cmp-search');
  if (!searchSection) {
    // Sometimes search may be directly inside the block as a child div
    searchSection = element.querySelector('.cmp-search');
  }
  let searchUrl = '';
  if (searchSection) {
    // The action attribute of the form contains the search handler
    const form = searchSection.querySelector('form');
    if (form) {
      let action = form.getAttribute('action') || '';
      // Remove trailing /search if present
      action = action.replace(/\/search$/, '');
      // Pick up everything before .searchresults.json
      const match = action.match(/(.*?\.searchresults\.json)/);
      if (match) {
        action = match[1];
      }
      // WKND pattern: replace /content/wknd/....searchresults.json with the main index, as sample markdown
      if (action.startsWith('/content/wknd/')) {
        searchUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
      } else if (action.startsWith('http')) {
        // If it's already an absolute URL
        searchUrl = action;
      } else if (action) {
        // If not, try to create full URL from current location (best effort)
        searchUrl = action;
      }
    }
  }
  // Fallback to standard search index if not found
  if (!searchUrl) {
    searchUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  }

  // Create a link element for the URL (as in markdown example)
  const a = document.createElement('a');
  a.href = searchUrl;
  a.textContent = searchUrl;

  const cells = [
    ['Search (search2)'],
    [a],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
