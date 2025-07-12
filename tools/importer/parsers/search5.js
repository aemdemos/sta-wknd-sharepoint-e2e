/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main grid containing all columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Locate the search block column (with .cmp-search)
  const searchCol = Array.from(grid.children).find(child => child.querySelector('section.cmp-search'));
  if (!searchCol) return;
  const searchSection = searchCol.querySelector('section.cmp-search');

  // Find the form and its action attribute
  const searchForm = searchSection.querySelector('form.cmp-search__form');
  if (!searchForm) return;
  const action = searchForm.getAttribute('action');
  if (!action) return;

  // Compute an absolute URL for the query index
  let jsonUrl = '';
  try {
    const absAction = new URL(action, document.baseURI);
    // Example: /content/wknd/de/de.searchresults.json/_jcr_content/root/container/container_1195249223/search
    // Should become: /content/wknd/de/de.searchresults.json/query-index.json
    // So: find the part ending in .searchresults.json and build up to that, then append 'query-index.json'
    const parts = absAction.pathname.split('/');
    const idx = parts.findIndex(p => p.endsWith('.searchresults.json'));
    if (idx >= 0) {
      const upto = parts.slice(0, idx + 1).join('/');
      jsonUrl = absAction.origin + upto + '/query-index.json';
    } else {
      // fallback: drop last part (could be /search) and append query-index.json
      jsonUrl = absAction.origin + absAction.pathname.replace(/\/[^/]*$/, '') + '/query-index.json';
    }
  } catch(e) {
    // If invalid URL, abort
    return;
  }

  // Create a link element for the table cell
  const link = document.createElement('a');
  link.href = jsonUrl;
  link.textContent = jsonUrl;

  // Table as per spec: header row is block name, second row contains the link
  const cells = [
    ['Search'],
    [link]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
