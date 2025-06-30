/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children by class pattern
  function getDirectChildByClass(parent, classPattern) {
    return Array.from(parent.children).find(child => child.className && child.className.includes(classPattern));
  }

  // Get the top-level aem-Grid (two main columns: left info, right tabs)
  const mainCmpContainer = element.querySelector(':scope > div.cmp-container');
  if (!mainCmpContainer) return;
  const mainGrid = mainCmpContainer.querySelector(':scope > .aem-Grid');
  if (!mainGrid) return;

  // Get left (info) and right (tabs) columns
  // The left column: contains the contentfragment + maybe the share title + sharing, in a nested <main>
  // The right column: tabs

  // Get the two column containers
  let leftColumn, rightColumn;
  // Find all <main> children (the left column is first such <main>)
  leftColumn = getDirectChildByClass(mainGrid, 'responsivegrid');
  rightColumn = getDirectChildByClass(mainGrid, 'tabs');

  // In leftColumn: get the aem-Grid with info and share blocks
  let leftCellContent = [];
  if (leftColumn) {
    const leftCmpContainer = leftColumn.querySelector(':scope > div.cmp-container');
    if (leftCmpContainer) {
      const leftGrid = leftCmpContainer.querySelector(':scope > .aem-Grid');
      if (leftGrid) {
        // Get all info and sharing blocks in leftGrid
        const info = Array.from(leftGrid.children).find(child => child.className && child.className.includes('contentfragment'));
        const shareTitle = Array.from(leftGrid.children).find(child => child.className && child.className.includes('title') && child.textContent.toLowerCase().includes('share'));
        const sharing = Array.from(leftGrid.children).find(child => child.className && child.className.includes('sharing'));
        if (info) leftCellContent.push(info);
        // shareTitle and sharing are visually grouped, so combine
        if (shareTitle || sharing) {
          const group = [];
          if (shareTitle) group.push(shareTitle);
          if (sharing) group.push(sharing);
          if (group.length) leftCellContent.push(group);
        }
      }
    }
  }
  // The left column cell: info and (optionally) share section
  let leftCell;
  if (leftCellContent.length === 1) {
    leftCell = leftCellContent[0];
  } else if (leftCellContent.length > 1) {
    // Wrap in fragment
    leftCell = document.createDocumentFragment();
    leftCellContent.forEach(part => {
      if (Array.isArray(part)) {
        part.forEach(el => el && leftCell.appendChild(el));
      } else if (part) {
        leftCell.appendChild(part);
      }
    });
  } else {
    leftCell = '';
  }

  // The right column cell is the tabs (and their content)
  let rightCell = '';
  if (rightColumn) rightCell = rightColumn;

  // Compose the table
  const cells = [
    ['Columns (columns32)'],
    [leftCell, rightCell]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
