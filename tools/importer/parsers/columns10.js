/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the main grid containing the footer columns
  function findMainGrid(el) {
    // Find the deepest .aem-Grid with 12 columns that contains the key columns
    const grids = el.querySelectorAll('.aem-Grid.aem-Grid--12');
    let lastGrid = null;
    grids.forEach(g => {
      if (
        g.querySelector('.cmp-image--logo, .cmp-navigation--footer, .cmp-title--right, .cmp-buildingblock--btn-list')
      ) {
        lastGrid = g;
      }
    });
    return lastGrid || el;
  }

  // Find the main grid containing the columns
  const mainGrid = findMainGrid(element);
  if (!mainGrid) return;

  // 1. Logo column (with copyright/text appended, but only essential content, not wrappers)
  const logoCol = mainGrid.querySelector('.cmp-image--logo');
  const textCol = mainGrid.querySelector('.cmp-text');
  let leftCol = document.createElement('div');
  if (logoCol) {
    // Only append the image/logo, not the entire wrapper
    const logoImg = logoCol.querySelector('img');
    if (logoImg) leftCol.appendChild(logoImg.cloneNode(true));
  }
  if (textCol) {
    // Append all paragraphs and links from the text block
    Array.from(textCol.children).forEach(child => {
      leftCol.appendChild(child.cloneNode(true));
    });
  }

  // 2. Navigation column (extract only the <ul> with links)
  let navCol = '';
  const navWrap = mainGrid.querySelector('.cmp-navigation--footer');
  if (navWrap) {
    const nav = navWrap.querySelector('ul.cmp-navigation__group');
    if (nav) {
      navCol = nav.cloneNode(true);
    }
  }

  // 3. Social column (Follow Us title + social buttons, only essential content)
  let socialCol = document.createElement('div');
  const socialTitleCol = mainGrid.querySelector('.cmp-title--right');
  if (socialTitleCol) {
    const h4 = socialTitleCol.querySelector('h4');
    if (h4) socialCol.appendChild(h4.cloneNode(true));
  }
  const socialBtnsCol = mainGrid.querySelector('.cmp-buildingblock--btn-list');
  if (socialBtnsCol) {
    // Only append the button links
    Array.from(socialBtnsCol.querySelectorAll('a.cmp-button')).forEach(btn => {
      socialCol.appendChild(btn.cloneNode(true));
    });
  }
  // If socialCol is empty, set to ''
  if (!socialCol.hasChildNodes()) socialCol = '';

  // Build the table rows
  const headerRow = ['Columns (columns10)'];
  const columnsRow = [leftCol, navCol, socialCol];
  const rows = [headerRow, columnsRow];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
