/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .search block within the element
  let searchBlock = null;
  // Search for .search anywhere within the element
  searchBlock = element.querySelector('.search');
  if (!searchBlock) return;

  // Try to find the <form> for extracting the query-index URL
  const form = searchBlock.querySelector('form');
  let queryIndexUrl = '';
  if (form) {
    let action = form.getAttribute('action');
    if (action && action.includes('.searchresults.json')) {
      let searchResultsIndex = action.indexOf('.searchresults.json');
      let basePath = action.substring(0, searchResultsIndex);
      let cleanPath = basePath.startsWith('/content') ? basePath.substring('/content'.length) : basePath;
      cleanPath = cleanPath.replace(/\/$/, '');
      queryIndexUrl = `https://main--helix-block-collection--adobe.hlx.page${cleanPath}/query-index.json`;
    }
  }

  // Compose the content cell: include all content of the search block for resiliency
  const cellContent = [];
  // Reference the entire search block (all DOM under search)
  Array.from(searchBlock.childNodes).forEach((child) => {
    cellContent.push(child);
  });
  // Add the query index URL as a link if found
  if (queryIndexUrl) {
    const a = document.createElement('a');
    a.href = queryIndexUrl;
    a.textContent = queryIndexUrl;
    cellContent.push(document.createElement('br'));
    cellContent.push(a);
  }

  // Create table: header exactly as in the example
  const cells = [
    ['Search'],
    [cellContent]
  ];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
