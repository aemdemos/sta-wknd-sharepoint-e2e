/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid containing the actual footer content
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Get all immediate children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // Helper to find a child by class name
  function findByClass(cls) {
    return columns.find(col => col.classList.contains(cls));
  }

  // Column 1: Logo (image)
  const logoCol = findByClass('image');
  let logoBlock = null;
  if (logoCol) {
    // The image is inside a link, inside a div
    const logoDiv = logoCol.querySelector('.cmp-image');
    if (logoDiv) {
      logoBlock = logoDiv;
    }
  }

  // Column 2: Navigation
  const navCol = findByClass('navigation');
  let navBlock = null;
  if (navCol) {
    // The nav is inside the column
    const nav = navCol.querySelector('nav');
    if (nav) {
      navBlock = nav;
    }
  }

  // Column 3: Title ("Follow Us")
  const titleCol = findByClass('title');
  let titleBlock = null;
  if (titleCol) {
    // The title is inside a div
    const titleDiv = titleCol.querySelector('.cmp-title');
    if (titleDiv) {
      titleBlock = titleDiv;
    }
  }

  // Column 4: Social buttons
  const btnCol = findByClass('buildingblock');
  let btnBlock = null;
  if (btnCol) {
    // The buttons are inside a grid inside the column
    const btnGrid = btnCol.querySelector('.aem-Grid');
    if (btnGrid) {
      btnBlock = btnGrid;
    }
  }

  // Find all .text blocks (footer text)
  const textBlocks = Array.from(grid.querySelectorAll('.text'));
  // Defensive: only keep those with .cmp-text
  const textEls = textBlocks.map(tb => tb.querySelector('.cmp-text')).filter(Boolean);

  // Compose the columns for the first content row
  const firstRow = [logoBlock, navBlock, titleBlock, btnBlock].filter(Boolean);

  // Compose the columns for the second content row (footer text)
  // Each text block gets its own column
  const secondRow = textEls.length ? textEls : [];

  // Build the table rows
  const headerRow = ['Columns (columns5)'];
  const cells = [headerRow];
  if (firstRow.length) cells.push(firstRow);
  if (secondRow.length) cells.push(secondRow);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
