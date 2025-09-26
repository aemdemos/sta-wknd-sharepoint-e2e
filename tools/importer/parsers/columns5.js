/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest content container
  let contentRoot = element;
  // Traverse down to the main content grid
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (grid) contentRoot = grid;

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(contentRoot.querySelectorAll(':scope > div'));

  // Helper: find first child with a selector
  function findFirst(selector) {
    return columns.find(col => col.matches(selector));
  }

  // 1. Logo column
  const logoCol = findFirst('.image');
  let logoContent = null;
  if (logoCol) {
    const logoImgWrap = logoCol.querySelector('[data-cmp-is="image"]');
    if (logoImgWrap) logoContent = logoImgWrap;
  }

  // 2. Navigation column
  const navCol = findFirst('.navigation');
  let navContent = null;
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) navContent = nav;
  }

  // 3. Social title column
  const titleCol = findFirst('.title');
  let titleContent = null;
  if (titleCol) {
    const title = titleCol.querySelector('.cmp-title');
    if (title) titleContent = title;
  }

  // 4. Social buttons column
  const btnCol = findFirst('.buildingblock');
  let btnContent = null;
  if (btnCol) {
    const btnGrid = btnCol.querySelector('.aem-Grid');
    if (btnGrid) btnContent = btnGrid;
  }

  // 5. Separator (skip, not visually a column)
  // 6. Footer text columns
  const textCols = columns.filter(col => col.classList.contains('text'));
  let textContent = textCols.map(col => {
    const textDiv = col.querySelector('.cmp-text');
    return textDiv || col;
  });

  // Compose the columns visually:
  // Screenshot shows 5 main columns: Logo | Nav | Social Title | Social Buttons | Footer Text
  // Footer text is visually grouped as one column (combine both text blocks)
  const footerTextCol = document.createElement('div');
  textContent.forEach(tc => footerTextCol.appendChild(tc));

  // Table header
  const headerRow = ['Columns (columns5)'];
  // Table columns
  const contentRow = [logoContent, navContent, titleContent, btnContent, footerTextCol];

  // Table structure
  const cells = [
    headerRow,
    contentRow,
  ];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
