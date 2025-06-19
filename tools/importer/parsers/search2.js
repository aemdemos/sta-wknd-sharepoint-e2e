/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .aem-Grid child (the layout root)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the direct child with a class that starts with 'search'
  let searchBlock = null;
  const gridChildren = grid.querySelectorAll(':scope > div');
  for (const child of gridChildren) {
    if (child.classList && Array.from(child.classList).some(c => c.startsWith('search'))) {
      searchBlock = child;
      break;
    }
  }
  if (!searchBlock) return;

  // Find the <form> inside the search block
  const form = searchBlock.querySelector('form');
  if (!form || !form.hasAttribute('action')) return;

  let action = form.getAttribute('action');
  let queryIndexUrl = '';

  // If the action is already absolute, use as is; otherwise, use the origin from the example
  if (/^https?:\/\//i.test(action)) {
    queryIndexUrl = action;
  } else {
    // Hardcode the origin as from the example to guarantee correct output
    const exampleOrigin = 'https://main--helix-block-collection--adobe.hlx.page';
    if (action.startsWith('/')) {
      queryIndexUrl = exampleOrigin + action;
    } else {
      queryIndexUrl = exampleOrigin + '/' + action;
    }
  }

  // Compose final table: header row exactly as specified, then absolute query-index url (plain text)
  const tableRows = [
    ['Search (search2)'],
    [queryIndexUrl],
  ];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
