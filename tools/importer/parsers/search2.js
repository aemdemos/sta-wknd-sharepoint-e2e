/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get absolute URL for the search index
  function getAbsoluteUrl(url) {
    if (/^https?:\/\//.test(url)) return url;
    if (url.startsWith('/')) {
      // Use the helix proxy domain for absolute paths
      return `https://main--helix-block-collection--adobe.hlx.page${url}`;
    }
    return url;
  }

  // Find the .cmp-search section (search block root)
  const searchSection = element.querySelector('section.cmp-search');
  if (!searchSection) return;

  // Find the search <form> to get the action (query index URL)
  const form = searchSection.querySelector('form');
  if (!form) return;
  const action = form.getAttribute('action') || '';

  // Remove trailing "/_jcr_content/.../search" so we only have up to .searchresults.json
  let queryIndex = action;
  const idx = queryIndex.indexOf('.searchresults.json');
  if (idx !== -1) {
    queryIndex = queryIndex.substring(0, idx + '.searchresults.json'.length);
  }

  // If after extraction, the queryIndex is empty, do not proceed
  if (!queryIndex) return;
  // Now make a full absolute URL
  const queryIndexUrl = getAbsoluteUrl(queryIndex);

  // Include any visible text content from the search input (e.g., placeholder)
  const input = searchSection.querySelector('input');
  let visibleText = '';
  if (input && input.getAttribute('placeholder')) {
    visibleText = input.getAttribute('placeholder');
  }
  // Also try to get any aria-label from the results or section for visible text (for accessibility/UX)
  const resultsDiv = searchSection.querySelector('[data-cmp-hook-search="results"]');
  if (resultsDiv && resultsDiv.getAttribute('aria-label')) {
    visibleText = resultsDiv.getAttribute('aria-label');
  }
  if (searchSection.getAttribute('aria-label')) {
    visibleText = searchSection.getAttribute('aria-label');
  }

  // Build the cell: include visible text (if any) and the link to the query index JSON
  // Use a fragment so both the text and link are referenced in a single cell
  const frag = document.createDocumentFragment();
  if (visibleText) {
    const span = document.createElement('span');
    span.textContent = visibleText;
    frag.appendChild(span);
    frag.appendChild(document.createElement('br'));
  }
  const a = document.createElement('a');
  a.href = queryIndexUrl;
  a.textContent = queryIndexUrl;
  frag.appendChild(a);

  // Build the block table as per the example (header: 'Search')
  const cells = [
    ['Search'],
    [frag],
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
