/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns: the MAIN (main content) and the ASIDE (sidebar)
  const mainEl = element.querySelector('main.container.responsivegrid');
  const asideEl = element.querySelector('aside.container.responsivegrid');
  // Guard: if either is missing, don't attempt to create a broken columns block
  if (!mainEl || !asideEl) return;

  // The Columns block expects:
  // First row: [ 'Columns' ]
  // Second row: [ main content, side content ]
  const cells = [
    ['Columns'],
    [mainEl, asideEl]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
