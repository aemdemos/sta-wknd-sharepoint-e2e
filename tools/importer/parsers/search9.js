/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row from example: exactly 'Search'
  const headerRow = ['Search'];

  // 2. Find the actual query-index.json link in the HTML if possible, otherwise fallback to canonical example
  // Check for <a> elements whose href ends with '/query-index.json' (absolute or relative)
  let queryIndexLink = null;
  const links = element.querySelectorAll('a[href$="query-index.json"]');
  if (links.length > 0) {
    // Use the first match
    queryIndexLink = links[0];
    // If the link is relative, make it absolute
    if (!/^https?:\/\//i.test(queryIndexLink.href)) {
      const a = document.createElement('a');
      a.href = queryIndexLink.href;
      queryIndexLink = a;
    }
  }

  // If not found, use canonical URL as in markdown example
  let urlCell;
  if (queryIndexLink) {
    // Reference the actual node from the document if possible
    urlCell = [queryIndexLink];
  } else {
    // fallback to canonical example URL
    const url = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
    const urlLink = document.createElement('a');
    urlLink.href = url;
    urlLink.textContent = url;
    urlCell = [urlLink];
  }

  // 3. Build table structure as in example: 1 column, 2 rows
  const cells = [
    headerRow,
    urlCell
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 4. Replace original element with the new table
  element.replaceWith(table);
}
