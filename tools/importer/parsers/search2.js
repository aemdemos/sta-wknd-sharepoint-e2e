/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the search column
  const searchCol = Array.from(grid.children).find((div) => div.classList.contains('cmp-search--header'));
  if (!searchCol) return;

  // Find the search section
  const searchSection = searchCol.querySelector('section.cmp-search');
  if (!searchSection) return;

  // Find the form (extract action attribute)
  const form = searchSection.querySelector('form');
  if (!form) return;

  let queryIndex = form.getAttribute('action') || '';
  if (queryIndex && !/^https?:\/\//.test(queryIndex)) {
    // Always use the example domain as in the sample markdown
    let rel = queryIndex;
    if (rel.startsWith('/')) rel = rel.substring(1);
    queryIndex = `https://main--helix-block-collection--adobe.hlx.page/${rel}`;
  }

  // Create a link element for the query index
  const link = document.createElement('a');
  link.href = queryIndex;
  link.textContent = queryIndex;

  // The example shows only the query index link in the table, not the entire form/text
  // So only the link should go in the cell

  const cells = [
    ['Search'],
    [link]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
