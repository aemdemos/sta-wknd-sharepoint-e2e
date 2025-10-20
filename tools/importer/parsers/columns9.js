/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid container (footer content)
  let gridContainer = element.querySelector('.aem-Grid');
  if (!gridContainer) {
    // Fallback: first .cmp-container with .aem-Grid inside
    const cmpContainers = element.querySelectorAll('.cmp-container');
    for (const cmp of cmpContainers) {
      gridContainer = cmp.querySelector('.aem-Grid');
      if (gridContainer) break;
    }
  }
  if (!gridContainer) return;

  // Get all top-level grid columns
  const gridColumns = Array.from(gridContainer.children);

  // Individual columns for left side: logo, navigation, text
  let logoDiv = gridColumns.find(div => div.classList.contains('image'));
  let navDiv = gridColumns.find(div => div.classList.contains('navigation'));
  let textDiv = gridColumns.find(div => div.classList.contains('text'));

  // Individual columns for right side: title, social buttons
  let titleDiv = gridColumns.find(div => div.classList.contains('title'));
  let btnListDiv = gridColumns.find(div => div.classList.contains('cmp-buildingblock--btn-list'));

  // Table header row
  const headerRow = ['Columns (columns9)'];

  // Table content row: each logical block in its own column (logo, nav, text, title+social)
  const contentRow = [
    logoDiv ? [logoDiv] : [],
    navDiv ? [navDiv] : [],
    textDiv ? [textDiv] : [],
    [titleDiv, btnListDiv].filter(Boolean)
  ];

  // Remove any empty columns
  const filteredRow = contentRow.filter(col => col.length > 0);

  // Build table
  const cells = [headerRow, filteredRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
