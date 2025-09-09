/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getDirectChild(parent, selector) {
    return Array.from(parent.children).find(child => child.matches(selector));
  }

  // Find the left column: details and share
  let leftCol = null;
  // Find the right column: tabs (main content)
  let rightCol = null;

  // Defensive: get all top-level grid columns
  const gridCols = Array.from(element.querySelectorAll(':scope > div > div > main, :scope > div > div > div.tabs'));

  // The left column is the main responsivegrid (with details)
  leftCol = gridCols.find(col => col.classList.contains('container'));
  // The right column is the tabs block
  rightCol = gridCols.find(col => col.classList.contains('tabs'));

  // If not found, fallback to searching by class
  if (!leftCol) {
    leftCol = element.querySelector('main.container.responsivegrid');
  }
  if (!rightCol) {
    rightCol = element.querySelector('div.tabs');
  }

  // Defensive: If not found, try to get by grid columns
  if (!leftCol || !rightCol) {
    const grid = element.querySelector('.aem-Grid');
    if (grid) {
      const cols = Array.from(grid.children);
      leftCol = leftCol || cols.find(c => c.querySelector('.cmp-contentfragment__elements'));
      rightCol = rightCol || cols.find(c => c.querySelector('.cmp-tabs'));
    }
  }

  // Compose left column content: details and share
  let leftContent = [];
  if (leftCol) {
    // Get the cmp-contentfragment (details)
    const details = leftCol.querySelector('.cmp-contentfragment');
    if (details) leftContent.push(details);
    // Get the share title and buttons
    const shareTitle = leftCol.querySelector('.title .cmp-title');
    if (shareTitle) leftContent.push(shareTitle);
    const sharing = leftCol.querySelector('.sharing');
    if (sharing) leftContent.push(sharing);
  }

  // Compose right column content: tabs block
  let rightContent = [];
  if (rightCol) {
    // Get the tabs block
    rightContent.push(rightCol);
  }

  // Build the table
  const headerRow = ['Columns (columns20)'];
  const contentRow = [leftContent, rightContent];
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
