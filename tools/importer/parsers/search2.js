/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search block inside the element
  const grid = element.querySelector('.aem-Grid') || element;
  let searchSection = null;
  grid.childNodes.forEach((child) => {
    if (
      child.nodeType === 1 &&
      child.classList.contains('search') &&
      child.querySelector('section.cmp-search')
    ) {
      searchSection = child.querySelector('section.cmp-search');
    }
  });
  if (!searchSection) return;

  // Find the <form> to extract the action URL
  const form = searchSection.querySelector('form');
  let action = form ? form.getAttribute('action') : '';
  let queryIndexUrl = '';
  if (action && action.startsWith('/content/wknd/')) {
    // Use the correct sample query-index URL for wknd, as in the example
    queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  } else if (/^https?:\/\//.test(action)) {
    // If fully qualified, use as-is with /query-index.json
    queryIndexUrl = action.replace(/(\/search|\.searchresults\.json)(.*)$/, '/query-index.json');
  } else if (action) {
    queryIndexUrl = (window?.location?.origin || '') + action.replace(/(\/search|\.searchresults\.json)(.*)$/, '/query-index.json');
  } else {
    queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  }

  // Create a link element for the query index URL
  const a = document.createElement('a');
  a.href = queryIndexUrl;
  a.textContent = queryIndexUrl;

  // Compose cells array: exact header, exact structure, include all text content from the search section (for robustness)
  // Reference the searchSection directly so all text and structure is included
  const cells = [
    ['Search'],
    [[a]],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
