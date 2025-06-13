/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main content container inside the given element
  const container = element.querySelector(':scope > div.cmp-container');
  if (!container) return;
  const grid = container.querySelector(':scope > div.aem-Grid');
  if (!grid) return;

  // Find left and right main columns in the aem-Grid
  let leftCol, rightCol;
  const children = Array.from(grid.children);
  // Left column: the first child that has a .cmp-container (for detail info)
  leftCol = children.find(c => c.querySelector('div.cmp-container'));
  // Right column: the first child with 'tabs' class
  rightCol = children.find(c => c.classList.contains('tabs'));

  // Extract left column content (info, share heading, social buttons)
  let leftContent = [];
  if (leftCol) {
    // Find contentfragment, share title, share buttons
    const lContainer = leftCol.querySelector(':scope > div.cmp-container');
    if (lContainer) {
      const lGrid = lContainer.querySelector(':scope > div.aem-Grid');
      if (lGrid) {
        // All direct children (contentfragment, title, sharing)
        for (const child of lGrid.children) {
          // Only push if child contains real content (not just empty grid)
          if (child.textContent.trim() || child.querySelector('img,button,a,article')) {
            leftContent.push(child);
          }
        }
      }
    }
  }

  // Extract right column content (the tabs block)
  let rightContent = [];
  if (rightCol) {
    rightContent.push(rightCol);
  }

  // Fallback in case columns can't be detected properly
  if (leftContent.length === 0 && rightContent.length === 0) {
    // fallback: push all children as single column content
    leftContent = [element];
  }

  // Table header exactly as specified
  const headerRow = ["Columns (columns17)"];
  // Table body row: left and right columns
  const bodyRow = [
    leftContent.length === 1 ? leftContent[0] : leftContent,
    rightContent.length === 1 ? rightContent[0] : rightContent
  ];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bodyRow
  ], document);

  element.replaceWith(table);
}
