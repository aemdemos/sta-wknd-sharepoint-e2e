/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per requirements, must match example
  const headerRow = ['Columns (columns35)'];

  // Find top-level grid: contains two primary columns (sidebar+main)
  // .aem-Grid is the main layout wrapper
  const grids = element.querySelectorAll(':scope > div .aem-Grid, :scope > .aem-Grid');
  let grid = null;
  if (grids.length) {
    grid = grids[0];
  } else {
    // fallback: maybe the main is a direct child
    grid = element;
  }

  // Collect top-level grid columns (direct children of .aem-Grid)
  const gridColumns = grid ? Array.from(grid.children).filter(e => e.nodeType === 1) : [];
  // Most cases, sidebar is the first, main content is second
  let leftCol = gridColumns[0];
  let rightCol = gridColumns[1];

  // If tabs found elsewhere, correct for that
  if (!rightCol || !rightCol.querySelector('.tabs')) {
    // Find .tabs somewhere deeper
    rightCol = element.querySelector('.tabs');
  }
  // If leftCol isn't sidebar details, try to get the sidebar container
  if (!leftCol || !leftCol.querySelector('.cmp-contentfragment')) {
    leftCol = element.querySelector('.cmp-container');
  }

  // Defensive: if columns not found, fallback to div children
  if (!rightCol || !leftCol) {
    const children = Array.from(element.children);
    if (!leftCol && children.length > 0) leftCol = children[0];
    if (!rightCol && children.length > 1) rightCol = children[1];
  }

  // Utility: collect all non-empty nodes (elements or text nodes with data) from a node
  function allContentArray(parent) {
    if (!parent) return [];
    // If parent is a .aem-Grid, flatten its immediate children (to skip extraneous layout divs)
    if (parent.classList && parent.classList.contains('aem-Grid')) {
      return Array.from(parent.children).flatMap(child => allContentArray(child));
    }
    // If parent is a .cmp-container with a .aem-Grid (e.g. sidebar), flatten one level
    if (parent.classList && parent.classList.contains('cmp-container')) {
      const grid = parent.querySelector(':scope > .aem-Grid');
      if (grid) return allContentArray(grid);
    }
    // Otherwise, use all direct children, filtering out empty nodes
    return Array.from(parent.childNodes).filter(n => {
      if (n.nodeType === Node.ELEMENT_NODE) return true;
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) return true;
      return false;
    });
  }

  // Compose arrays for both columns
  const leftContentArray = allContentArray(leftCol);
  const rightContentArray = allContentArray(rightCol);

  const cells = [
    headerRow,
    [leftContentArray, rightContentArray]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
