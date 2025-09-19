/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid containing the actual footer content
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the logo image block
  const logoBlock = grid.querySelector('.image');
  let logoImg = null;
  if (logoBlock) {
    logoImg = logoBlock.querySelector('img');
    // If the logo is wrapped in a link, include the link
    const logoLink = logoBlock.querySelector('a');
    if (logoLink && logoImg) {
      // Use the link element directly
      logoImg = logoLink;
    }
  }

  // Find the navigation block
  const navBlock = grid.querySelector('.navigation');
  let nav = null;
  if (navBlock) {
    nav = navBlock.querySelector('nav');
  }

  // Find the 'Follow Us' title
  const titleBlock = grid.querySelector('.title');
  let followTitle = null;
  if (titleBlock) {
    followTitle = titleBlock.querySelector('.cmp-title__text');
  }

  // Find the social buttons block
  const btnListBlock = grid.querySelector('.cmp-buildingblock--btn-list');
  let btnList = null;
  if (btnListBlock) {
    btnList = btnListBlock.querySelector('.aem-Grid');
  }

  // Find all text blocks
  const textBlocks = Array.from(grid.querySelectorAll('.cmp-text'));
  // Defensive: flatten all <div class="cmp-text"> children into one array
  const textContent = textBlocks.map(tb => tb);

  // Compose columns visually:
  // Screenshot shows 3 main columns: logo/nav, follow us/social, legal/text
  // We'll use 3 columns in the second row.

  // Column 1: Logo + Navigation
  const col1 = [];
  if (logoImg) col1.push(logoImg);
  if (nav) col1.push(nav);

  // Column 2: Follow Us + Social Buttons
  const col2 = [];
  if (followTitle) col2.push(followTitle);
  if (btnList) col2.push(btnList);

  // Column 3: All text blocks (legal, description)
  const col3 = [];
  if (textContent.length) col3.push(...textContent);

  // Build the table rows
  const headerRow = ['Columns (columns5)'];
  const contentRow = [col1, col2, col3];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
