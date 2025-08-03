/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the columns
  let gridEl = element.querySelector('.aem-Grid.aem-Grid--12.aem-Grid--tablet--12.aem-Grid--default--12.aem-Grid--phone--12');
  if (!gridEl) {
    gridEl = Array.from(element.querySelectorAll('.aem-Grid')).find(g => g.children.length >= 3);
  }
  if (!gridEl) return;

  // Get all direct children (potential columns)
  const columns = Array.from(gridEl.children);
  // Identify the actual column blocks in order
  const logoCol = columns.find(col => col.classList.contains('cmp-image--logo'));
  const navCol = columns.find(col => col.classList.contains('cmp-navigation--footer'));
  const titleCol = columns.find(col => col.classList.contains('cmp-title--right'));
  const btnListCol = columns.find(col => col.classList.contains('cmp-buildingblock--btn-list'));
  const textCol = columns.find(col => col.classList.contains('cmp-text--font-xsmall'));

  // Compose columns row in HTML order, as per design
  const contentColumns = [logoCol, navCol, titleCol, btnListCol].filter(Boolean);
  if (contentColumns.length < 2) return;

  // The text/copyright row goes below, spanning all columns
  // To comply with columns block, this row must have same number of cells as the second row
  let textRow = [];
  if (textCol) {
    textRow = [textCol];
    for (let i = 1; i < contentColumns.length; i++) {
      textRow.push('');
    }
  } else {
    textRow = Array(contentColumns.length).fill('');
  }

  // Fix header: it must be a single cell!
  const cells = [
    ['Columns (columns5)'],
    contentColumns,
    textRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
