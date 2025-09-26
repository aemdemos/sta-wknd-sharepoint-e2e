/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the innermost .aem-Grid with the actual footer content
  function findFooterGrid(el) {
    let grids = el.querySelectorAll('.aem-Grid.aem-Grid--12');
    let lastGrid = null;
    grids.forEach((grid) => {
      if (grid.querySelector('.cmp-image--logo, .cmp-navigation--footer, .cmp-title--right, .cmp-buildingblock--btn-list, .cmp-text--font-xsmall')) {
        lastGrid = grid;
      }
    });
    return lastGrid;
  }

  const headerRow = ['Columns (columns10)'];

  // Defensive: Find the grid containing the columns
  const grid = findFooterGrid(element);
  if (!grid) return;

  // Find columns: logo, nav, follow us, social buttons, copyright text
  let logoCol = null;
  let navCol = null;
  let followCol = null;
  let socialCol = null;
  let textCol = null;

  const gridChildren = Array.from(grid.children);
  gridChildren.forEach((child) => {
    if (child.classList.contains('cmp-image--logo')) {
      logoCol = child;
    } else if (child.classList.contains('cmp-navigation--footer')) {
      navCol = child;
    } else if (child.classList.contains('cmp-title--right')) {
      followCol = child;
    } else if (child.classList.contains('cmp-buildingblock--btn-list')) {
      socialCol = child;
    } else if (child.classList.contains('cmp-text--font-xsmall')) {
      textCol = child;
    }
  });

  // Compose the first row: logo | nav | follow | social
  const firstRow = [logoCol, navCol, followCol, socialCol].map(col => col || '');

  // Compose the second row: copyright text (only one column, matching visual layout)
  // If copyright text is present, only one column in the row
  const secondRow = [textCol].filter(cell => cell);

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    firstRow,
    secondRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
