/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container that holds the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  // Get direct children (columns) of the grid
  const gridChildren = Array.from(grid.children);
  // For each column, extract the main content (first child element or fragment)
  const columns = gridChildren.map(colDiv => {
    if (colDiv.children.length === 1) {
      return colDiv.firstElementChild;
    } else if (colDiv.children.length > 1) {
      const frag = document.createDocumentFragment();
      Array.from(colDiv.children).forEach(child => frag.appendChild(child));
      return frag;
    } else {
      return document.createTextNode('');
    }
  });

  // Build table rows as per the example: header is one cell, then one row with N columns
  const tableData = [
    ['Columns (columns2)'],
    columns
  ];

  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
