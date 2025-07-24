/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate children MAIN and ASIDE (for main content and sidebar)
  let main = null, aside = null;
  element.childNodes.forEach((node) => {
    if (node.nodeType === 1 && node.tagName === 'MAIN' && node.className.includes('aem-GridColumn--default--8')) {
      main = node;
    }
    if (node.nodeType === 1 && node.tagName === 'ASIDE' && node.className.includes('aem-GridColumn--default--3')) {
      aside = node;
    }
  });

  // Fallback to using the element's children if MAIN/ASIDE are not found
  let columnsRow;
  if (main && aside) {
    columnsRow = [main, aside];
  } else if (main) {
    columnsRow = [main];
  } else if (aside) {
    columnsRow = [aside];
  } else {
    // If no main or aside, use all top-level DIVs as columns
    const divs = Array.from(element.children).filter(e => e.tagName === 'DIV');
    if (divs.length > 0) {
      columnsRow = divs;
    } else {
      columnsRow = [element];
    }
  }

  const rows = [
    ['Columns (columns16)'],
    columnsRow
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
