/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the deepest grid containing the footer content
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid (these are the main columns visually)
  const columns = Array.from(grid.children);

  // Helper: Find first element by class name in a list
  function findByClass(cls) {
    return columns.find((el) => el.classList.contains(cls));
  }

  // 1. Logo column
  const logoCol = findByClass('image');
  let logoContent = '';
  if (logoCol) {
    const logoImgWrap = logoCol.querySelector('[data-cmp-is="image"]');
    if (logoImgWrap) logoContent = logoImgWrap;
  }

  // 2. Navigation column
  const navCol = findByClass('navigation');
  let navContent = '';
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) navContent = nav;
  }

  // 3. Social column (Follow Us title + buttons)
  const titleCol = findByClass('title');
  let titleContent = '';
  if (titleCol) {
    const title = titleCol.querySelector('.cmp-title');
    if (title) titleContent = title;
  }
  const btnCol = findByClass('buildingblock');
  let btnContent = '';
  if (btnCol) {
    const btnGrid = btnCol.querySelector('.aem-Grid');
    if (btnGrid) btnContent = btnGrid;
  }
  // Compose social column
  let socialContent = '';
  if (titleContent && btnContent) {
    // Wrap in a div for grouping
    const socialDiv = document.createElement('div');
    socialDiv.append(titleContent, btnContent);
    socialContent = socialDiv;
  } else if (titleContent) {
    socialContent = titleContent;
  } else if (btnContent) {
    socialContent = btnContent;
  }

  // 4. Footer text column (text blocks only, NO <hr> separator)
  const textCols = columns.filter((el) => el.classList.contains('text'));
  // Compose text column
  const textDiv = document.createElement('div');
  textCols.forEach((tc) => {
    const inner = tc.querySelector('.cmp-text');
    if (inner) textDiv.append(inner);
  });
  let footerTextContent = textDiv.childNodes.length ? textDiv : '';

  // Compose the table rows
  const headerRow = ['Columns (columns4)'];
  const contentRow = [logoContent, navContent, socialContent, footerTextContent];

  // Build and replace
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);
  element.replaceWith(block);
}
