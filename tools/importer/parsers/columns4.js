/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class name
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList && child.classList.contains(className));
  }
  // Find the inner aem-Grid (the columns container)
  function findInnerGrid(el) {
    if (!el) return null;
    if (el.classList && el.classList.contains('aem-Grid')) return el;
    for (const child of el.children) {
      const found = findInnerGrid(child);
      if (found) return found;
    }
    return null;
  }
  const grid = findInnerGrid(element);
  if (!grid) return;

  // Get reference to columns
  const logoCol = getDirectChildByClass(grid, 'cmp-image--logo');
  const navCol = getDirectChildByClass(grid, 'cmp-navigation--footer');
  const titleCol = getDirectChildByClass(grid, 'cmp-title--right');
  const socialCol = getDirectChildByClass(grid, 'cmp-buildingblock--btn-list');

  function getContentDiv(col) {
    if (!col) return '';
    if (col.children.length === 1) return col.firstElementChild;
    return col;
  }
  const logoContent = getContentDiv(logoCol);
  const navContent = getContentDiv(navCol);
  const titleContent = getContentDiv(titleCol);
  const socialContent = getContentDiv(socialCol);

  // Collect text content for bottom full-width row
  const textBlocks = Array.from(grid.querySelectorAll(':scope > .cmp-text--font-xsmall'));
  const bottomContent = [];
  textBlocks.forEach(tb => {
    Array.from(tb.children).forEach(child => {
      bottomContent.push(child);
    });
  });

  // Build the rows for the table
  // Header row: ALWAYS single cell, as in the example
  const headerRow = ['Columns (columns4)'];
  const columnsRow = [logoContent, navContent, titleContent, socialContent];
  const rows = [headerRow, columnsRow];
  if (bottomContent.length > 0) {
    rows.push([bottomContent]); // single cell spanning all columns
  }

  // Create table using DOMUtils
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Ensure the header row is a single cell that spans all columns
  // (DOMUtils.createTable does NOT set colspan; do it manually here)
  const thRow = block.querySelector('tr');
  if (thRow && thRow.children.length === 1 && columnsRow.length > 1) {
    thRow.children[0].setAttribute('colspan', columnsRow.length);
  }

  // Replace the original element
  element.replaceWith(block);
}
