/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid with the actual footer layout
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the 4 main columns: logo, navigation, follow us, social buttons
  // Defensive: select all direct children of the grid
  const columns = Array.from(grid.children);

  // 1. Logo (image)
  const logoCol = columns.find(col => col.classList.contains('cmp-image--logo'));
  let logo = null;
  if (logoCol) {
    logo = logoCol.querySelector('[data-cmp-is="image"]');
  }

  // 2. Navigation
  const navCol = columns.find(col => col.classList.contains('cmp-navigation--footer'));
  let nav = null;
  if (navCol) {
    nav = navCol.querySelector('nav');
  }

  // 3. Follow Us title
  const titleCol = columns.find(col => col.classList.contains('cmp-title--right'));
  let followTitle = null;
  if (titleCol) {
    followTitle = titleCol.querySelector('.cmp-title');
  }

  // 4. Social buttons
  const btnCol = columns.find(col => col.classList.contains('cmp-buildingblock--btn-list'));
  let socialBtns = null;
  if (btnCol) {
    // The buttons are inside a nested .aem-Grid
    const btnGrid = btnCol.querySelector('.aem-Grid');
    if (btnGrid) {
      socialBtns = Array.from(btnGrid.querySelectorAll('.cmp-button'));
    }
  }

  // 5. Footer text (copyright, description)
  const textCol = columns.find(col => col.classList.contains('cmp-text--font-xsmall'));
  let footerText = null;
  if (textCol) {
    footerText = textCol.querySelector('.cmp-text');
  }

  // Compose the columns visually as in the screenshot:
  // [Logo] [Navigation] [Follow Us + Social Buttons] [Footer Text]
  // But in the screenshot, visually, the layout is 3 columns:
  //   1. Logo and nav (left),
  //   2. Follow Us + social (right, top),
  //   3. Footer text (bottom, full width)
  // But for columns block, we want all main content side by side, so 3 columns:
  //   [Logo + Nav] [Follow Us + Social] [Footer Text]

  // Compose column 1: logo + nav
  const col1 = [];
  if (logo) col1.push(logo);
  if (nav) col1.push(nav);

  // Compose column 2: follow title + social buttons
  const col2 = [];
  if (followTitle) col2.push(followTitle);
  if (socialBtns && socialBtns.length > 0) col2.push(...socialBtns);

  // Compose column 3: footer text
  const col3 = footerText ? [footerText] : [];

  // Build the table
  const headerRow = ['Columns (columns5)'];
  const contentRow = [col1, col2, col3];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
