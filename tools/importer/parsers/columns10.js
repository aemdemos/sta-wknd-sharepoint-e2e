/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid containing the columns
  let grid;
  const gridCandidates = element.querySelectorAll('.aem-Grid');
  for (const candidate of gridCandidates) {
    if (
      candidate.querySelector('.cmp-image') &&
      candidate.querySelector('.cmp-navigation') &&
      candidate.querySelector('.cmp-title') &&
      candidate.querySelector('.cmp-buildingblock--btn-list') &&
      candidate.querySelector('.cmp-text')
    ) {
      grid = candidate;
      break;
    }
  }
  if (!grid) grid = gridCandidates[0] || element;

  // Get all direct children of the grid
  const columns = Array.from(grid.children);

  // Extract columns: logo, navigation, follow us, social buttons
  const logoCol = columns.find(c => c.querySelector('.cmp-image'));
  const logo = logoCol ? logoCol.querySelector('.cmp-image') : '';

  const navCol = columns.find(c => c.querySelector('.cmp-navigation'));
  const navigation = navCol ? navCol.querySelector('.cmp-navigation') : '';

  const titleCol = columns.find(c => c.querySelector('.cmp-title'));
  const followUsTitle = titleCol ? titleCol.querySelector('.cmp-title') : '';

  const btnListCol = columns.find(c => c.querySelector('.cmp-buildingblock--btn-list'));
  let socialButtons = [];
  if (btnListCol) {
    socialButtons = Array.from(btnListCol.querySelectorAll('.cmp-button'));
  }

  // Compose Follow Us cell (title + buttons)
  let followUsCell = '';
  if (followUsTitle || socialButtons.length) {
    const frag = document.createElement('div');
    if (followUsTitle) frag.appendChild(followUsTitle);
    socialButtons.forEach(btn => frag.appendChild(btn));
    followUsCell = frag;
  }

  // Find text
  const textCol = columns.find(c => c.querySelector('.cmp-text'));
  const textBlock = textCol ? textCol.querySelector('.cmp-text') : '';

  // Build the table
  const headerRow = ['Columns (columns10)'];
  // Only three columns: logo, navigation, followUsCell
  const firstRow = [logo, navigation, followUsCell];
  // Only one cell for the second row: textBlock
  const cells = [headerRow, firstRow];
  if (textBlock) {
    cells.push([textBlock]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
