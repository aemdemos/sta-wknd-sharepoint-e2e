/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid containing the footer layout
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Helper to get direct children by class
  function getChildByClass(cls) {
    return Array.from(grid.children).find((el) => el.classList.contains(cls));
  }

  // 1. Logo (image)
  const logoCol = getChildByClass('image');
  let logoImg = null;
  if (logoCol) {
    logoImg = logoCol.querySelector('[data-cmp-is="image"]');
  }

  // 2. Navigation
  const navCol = getChildByClass('navigation');
  let nav = null;
  if (navCol) {
    nav = navCol.querySelector('nav');
  }

  // 3. Title (Follow Us)
  const titleCol = getChildByClass('title');
  let title = null;
  if (titleCol) {
    title = titleCol.querySelector('.cmp-title');
  }

  // 4. Social Buttons
  const btnListCol = getChildByClass('buildingblock');
  let btnList = null;
  if (btnListCol) {
    btnList = btnListCol.querySelector('.aem-Grid');
  }

  // 5. Separator (optional, usually just a <hr>)
  const sepCol = getChildByClass('separator');
  let separator = null;
  if (sepCol) {
    separator = sepCol.querySelector('hr');
  }

  // 6. Text blocks (two text columns)
  const textCols = Array.from(grid.querySelectorAll('.text'));
  let text1 = null;
  let text2 = null;
  if (textCols.length > 0) text1 = textCols[0].querySelector('.cmp-text');
  if (textCols.length > 1) text2 = textCols[1].querySelector('.cmp-text');

  // Compose columns visually: logo | nav | follow us + buttons | text blocks
  // Screenshot shows 5 visual columns: logo, nav, follow us, social buttons, text
  // But the text is two blocks stacked, so combine them in one cell

  // Header row
  const headerRow = ['Columns (columns5)'];

  // Second row: 5 columns
  const row1 = [
    logoImg || '',
    nav || '',
    title || '',
    btnList || '',
    [text1, text2].filter(Boolean) // combine both text blocks in one cell
  ];

  // Build table
  const cells = [headerRow, row1];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
