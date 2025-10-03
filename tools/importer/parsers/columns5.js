/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest container with the main footer grid
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the main columns visually grouped in the screenshots:
  // 1. Logo (image)
  // 2. Navigation (nav)
  // 3. Follow Us (title + social buttons)

  // Find logo image block
  const logoCol = grid.querySelector('.image');
  let logoBlock = null;
  if (logoCol) {
    logoBlock = logoCol.querySelector('[data-cmp-is="image"]');
    if (!logoBlock) logoBlock = logoCol;
  }

  // Find navigation block
  const navCol = grid.querySelector('.navigation');
  let navBlock = null;
  if (navCol) {
    navBlock = navCol.querySelector('nav');
    if (!navBlock) navBlock = navCol;
  }

  // Find "Follow Us" title and social buttons
  const titleCol = grid.querySelector('.title');
  let titleBlock = null;
  if (titleCol) {
    titleBlock = titleCol.querySelector('.cmp-title');
    if (!titleBlock) titleBlock = titleCol;
  }

  const buildingBlockCol = grid.querySelector('.buildingblock');
  let socialBlock = null;
  if (buildingBlockCol) {
    // Social buttons are inside .aem-Grid (usually 3 .button)
    const socialGrid = buildingBlockCol.querySelector('.aem-Grid');
    if (socialGrid) {
      // Collect all .button elements
      const buttons = Array.from(socialGrid.querySelectorAll('.button'));
      socialBlock = buttons;
    }
  }

  // Compose the "Follow Us" column: title + social buttons
  let followUsCol = [];
  if (titleBlock) followUsCol.push(titleBlock);
  if (socialBlock && socialBlock.length) followUsCol = followUsCol.concat(socialBlock);

  // Compose the first row: Logo | Navigation | Follow Us
  const firstContentRow = [
    logoBlock || '',
    navBlock || '',
    followUsCol.length ? followUsCol : '',
  ];

  // Find copyright text (text block)
  const textCol = grid.querySelector('.text');
  let textBlock = null;
  if (textCol) {
    textBlock = textCol.querySelector('.cmp-text');
    if (!textBlock) textBlock = textCol;
  }

  // Compose the second row: copyright text only (no <hr> unless Section Metadata is present)
  const secondContentRow = [
    textBlock || ''
  ];

  // Table header
  const headerRow = ['Columns (columns5)'];

  // Build table: header, first content row (3 columns), second row (1 column)
  const cells = [
    headerRow,
    firstContentRow,
    secondContentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
