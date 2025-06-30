/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search section in the provided element
  const searchSection = element.querySelector('.cmp-search');
  if (!searchSection) return;

  // Try to find the form with the action attribute for the search index
  const form = searchSection.querySelector('form[action]');

  let queryIndexUrl = '';
  if (form) {
    const action = form.getAttribute('action');
    // Compose the absolute URL from the action attribute as in the markdown example
    if (action && action.includes('.searchresults.json')) {
      // Remove the .searchresults.json and everything after it
      const basePath = action.split('.searchresults.json')[0];
      // Use the Helix demo prefix as in the example (block markdown)
      queryIndexUrl = `https://main--helix-block-collection--adobe.hlx.page${basePath}/query-index.json`;
    }
  }

  let secondRowContent;
  if (queryIndexUrl) {
    // Create a link element for the query index URL
    const a = document.createElement('a');
    a.href = queryIndexUrl;
    a.textContent = queryIndexUrl;
    a.target = '_blank';
    secondRowContent = a;
  } else {
    // Fallback: include the entire search section (all text and structure preserved)
    secondRowContent = searchSection;
  }

  const cells = [
    ['Search'],
    [secondRowContent],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
