/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing columns
  const grid = element.querySelector('.cmp-container > .aem-Grid');
  let leftCol, rightCol;

  if (grid) {
    // Left column: everything up to (not including) the .tabs
    const children = Array.from(grid.children);
    const leftNodes = [];
    let foundTabs = false;
    for (const child of children) {
      if (child.classList.contains('tabs')) {
        foundTabs = true;
        break;
      }
      leftNodes.push(child);
    }
    leftCol = document.createElement('div');
    leftNodes.forEach((node) => leftCol.appendChild(node));
    // Right column: the .tabs block only, as is
    rightCol = grid.querySelector('.tabs');
  }
  // Fallback: if grid or columns are missing, put all content in one column
  if (!leftCol && !rightCol) {
    leftCol = element;
    rightCol = document.createElement('div');
  }

  // Create header row - per instructions, only a single cell
  const cells = [
    ['Columns'],
    [leftCol, rightCol]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
