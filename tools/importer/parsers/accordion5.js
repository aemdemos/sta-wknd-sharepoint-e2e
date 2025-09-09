/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid containing the footer content
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Find logo image block
  const logoBlock = grid.querySelector('.image.cmp-image--logo');
  let logoImg = null;
  if (logoBlock) {
    logoImg = logoBlock.querySelector('img');
    // If logo is wrapped in a link, use the link
    const logoLink = logoBlock.querySelector('a');
    if (logoLink && logoImg) {
      logoImg = logoLink;
    }
  }

  // Find navigation block
  const navBlock = grid.querySelector('.navigation.cmp-navigation--footer');
  let nav = null;
  if (navBlock) {
    nav = navBlock.querySelector('nav');
  }

  // Find "Follow Us" title
  const titleBlock = grid.querySelector('.title.cmp-title--right');
  let followTitle = null;
  if (titleBlock) {
    followTitle = titleBlock.querySelector('.cmp-title__text');
  }

  // Find social buttons
  const btnListBlock = grid.querySelector('.buildingblock.cmp-buildingblock--btn-list');
  let socialBtns = [];
  if (btnListBlock) {
    const btnGrid = btnListBlock.querySelector('.aem-Grid');
    if (btnGrid) {
      socialBtns = Array.from(btnGrid.querySelectorAll('.button .cmp-button'));
    }
  }

  // Find separator (hr)
  const separatorBlock = grid.querySelector('.separator.cmp-separator--hidden');
  let hr = null;
  if (separatorBlock) {
    hr = separatorBlock.querySelector('hr');
  }

  // Find text blocks
  const textBlocks = Array.from(grid.querySelectorAll('.text.cmp-text--font-xsmall'));
  let text1 = null;
  let text2 = null;
  if (textBlocks.length > 0) {
    text1 = textBlocks[0].querySelector('div');
    if (textBlocks.length > 1) {
      text2 = textBlocks[1].querySelector('div');
    }
  }

  // Build accordion rows
  const headerRow = ['Accordion (accordion5)'];
  const rows = [headerRow];

  // Row 1: Logo and Navigation
  const logoNavCell = [];
  if (logoImg) logoNavCell.push(logoImg);
  if (nav) logoNavCell.push(nav);
  rows.push([
    'Logo & Navigation',
    logoNavCell
  ]);

  // Row 2: Follow Us & Social Buttons
  const followCell = [];
  if (followTitle) followCell.push(followTitle);
  if (socialBtns.length) followCell.push(...socialBtns);
  rows.push([
    'Follow Us',
    followCell
  ]);

  // Row 3: Separator (if present)
  if (hr) {
    rows.push([
      'Separator',
      hr
    ]);
  }

  // Row 4: Canadian specific footer text
  if (text1) {
    rows.push([
      'Footer Note',
      text1
    ]);
  }

  // Row 5: Copyright and description
  if (text2) {
    rows.push([
      'Copyright & Description',
      text2
    ]);
  }

  // Create block table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
