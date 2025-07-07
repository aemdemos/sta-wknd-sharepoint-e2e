/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing both columns
  const mainGrid = element.querySelector('.aem-Grid');
  if (!mainGrid) return;

  // LEFT COLUMN: main.container responsivegrid that comes first, contains details & sharing
  let leftCol = null;
  let rightCol = null;
  // Get all top-level children of mainGrid
  const children = Array.from(mainGrid.children);
  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    if (el.tagName === 'MAIN' && el.classList.contains('container') && !leftCol) {
      leftCol = el;
    } else if (el.classList.contains('tabs') && !rightCol) {
      rightCol = el;
    }
  }
  // If for some reason the tabs are not direct, attempt fallback for rightCol
  if (!rightCol) {
    rightCol = children.find(ch => ch.tagName === 'MAIN' && ch !== leftCol);
  }

  // Compose leftCol cell: pull direct container > contentfragment (details), share title, and share buttons if present
  let leftColContent = [];
  if (leftCol) {
    const leftContainer = leftCol.querySelector('[id^="container-"]');
    if (leftContainer) {
      // Details (contentfragment)
      const details = leftContainer.querySelector('.cmp-contentfragment');
      if (details) leftColContent.push(details);
      // Share title, if present
      const shareTitle = leftContainer.querySelector('.title, .cmp-title');
      if (shareTitle) leftColContent.push(shareTitle);
      // Share buttons, if present
      const sharingDiv = leftContainer.querySelector('.sharing');
      if (sharingDiv) leftColContent.push(sharingDiv);
    }
  }
  if (leftColContent.length === 0) leftColContent = [''];

  // Compose rightCol cell: should be the tabs block (tabs or main.container > tabs)
  let rightColContent = [];
  if (rightCol) {
    let tabs = rightCol.querySelector('.cmp-tabs');
    if (!tabs && rightCol.classList.contains('cmp-tabs')) {
      tabs = rightCol;
    }
    if (tabs) rightColContent.push(tabs);
  }
  if (rightColContent.length === 0) rightColContent = [''];

  // Build cells: header row is a single cell, then columns row
  const cells = [
    ['Columns (columns22)'],
    [leftColContent, rightColContent],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
