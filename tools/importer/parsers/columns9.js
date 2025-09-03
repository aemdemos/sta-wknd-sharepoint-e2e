/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid containing the actual footer content
  let grid;
  const grids = element.querySelectorAll('.aem-Grid');
  if (grids.length) {
    grid = grids[grids.length - 1];
  } else {
    grid = element;
  }

  // Get all direct children of the grid (these are the columns)
  const columns = Array.from(grid.children);

  // Helper to find the first child with a class
  function findByClass(cls) {
    return columns.find((el) => el.classList && el.classList.contains(cls));
  }

  // Column 1: Logo image (with link)
  let logoCol = findByClass('image') || columns.find((el) => el.querySelector('.cmp-image'));
  let logoBlock = logoCol ? logoCol.querySelector('.cmp-image') : null;

  // Column 2: Navigation (may have nested ul)
  let navCol = findByClass('navigation') || columns.find((el) => el.querySelector('.cmp-navigation'));
  let navBlock = navCol ? navCol.querySelector('.cmp-navigation') : null;

  // Column 3: Title (Follow Us)
  let titleCol = findByClass('title') || columns.find((el) => el.querySelector('.cmp-title'));
  let titleBlock = titleCol ? titleCol.querySelector('.cmp-title') : null;

  // Column 4: Social buttons (buildingblock)
  let btnCol = findByClass('buildingblock') || columns.find((el) => el.querySelector('.cmp-buildingblock--btn-list'));
  let btnBlock = btnCol ? btnCol.querySelector('.aem-Grid') : null;

  // Column 5: Text (copyright and description)
  let textCol = findByClass('text') || columns.find((el) => el.querySelector('.cmp-text'));
  let textBlock = textCol ? textCol.querySelector('.cmp-text') : null;

  // Build the columns array for the second row
  // Only include columns that exist, in order
  const contentRow = [];
  if (logoBlock) contentRow.push(logoBlock.cloneNode(true));
  if (navBlock) contentRow.push(navBlock.cloneNode(true));
  // Compose a fragment for title + buttons (they are visually together)
  if (titleBlock || btnBlock) {
    const rightCol = document.createElement('div');
    if (titleBlock) rightCol.appendChild(titleBlock.cloneNode(true));
    if (btnBlock) rightCol.appendChild(btnBlock.cloneNode(true));
    contentRow.push(rightCol);
  }
  // Always include all text content from .cmp-text as a single cell
  if (textBlock) {
    // Instead of just the .cmp-text element, include all its childNodes (to ensure all text is present)
    const textColDiv = document.createElement('div');
    Array.from(textBlock.childNodes).forEach((node) => {
      textColDiv.appendChild(node.cloneNode(true));
    });
    contentRow.push(textColDiv);
  }

  // Header row
  const headerRow = ['Columns (columns9)'];

  // Compose the table
  // Only create and replace if contentRow is not empty and all cells are non-empty
  if (contentRow.length && contentRow.some(cell => cell.textContent.trim() || cell.querySelector('img,a,div,span'))) {
    const cells = [headerRow, contentRow];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  } else {
    // If no content, still replace with a table with only the header row
    const table = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(table);
  }
}
