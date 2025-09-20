/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the deepest grid that contains the actual footer layout
  let grid = element.querySelector('.aem-Grid');
  if (!grid) {
    // fallback: search for any .aem-Grid inside element
    grid = element.querySelector('[class*="aem-Grid"]');
  }
  if (!grid) {
    // fallback: use the element itself
    grid = element;
  }

  // Get all direct children of the grid (these are the main columns visually)
  const gridChildren = Array.from(grid.querySelectorAll(':scope > div'));

  // Helper: find by class substring
  function findByClass(substr) {
    return gridChildren.find(div => div.className && div.className.indexOf(substr) !== -1);
  }

  // Get logo image block
  const imageBlock = findByClass('cmp-image--logo');
  let logo = null;
  if (imageBlock) {
    // Defensive: find the actual image link
    logo = imageBlock.querySelector('[data-cmp-is="image"]') || imageBlock;
  }

  // Get navigation block
  const navBlock = findByClass('cmp-navigation--footer');
  let nav = null;
  if (navBlock) {
    nav = navBlock.querySelector('nav') || navBlock;
  }

  // Get follow us title
  const titleBlock = findByClass('cmp-title--right');
  let followTitle = null;
  if (titleBlock) {
    followTitle = titleBlock.querySelector('.cmp-title') || titleBlock;
  }

  // Get social buttons block
  const btnListBlock = findByClass('cmp-buildingblock--btn-list');
  let btnList = null;
  if (btnListBlock) {
    // Defensive: get the grid inside
    btnList = btnListBlock.querySelector('.aem-Grid') || btnListBlock;
  }

  // Get copyright text block
  const textBlock = findByClass('cmp-text--font-xsmall');
  let copyrightText = null;
  if (textBlock) {
    copyrightText = textBlock.querySelector('.cmp-text') || textBlock;
  }

  // Compose columns visually: logo, navigation, follow us + buttons
  // Screenshot shows: logo left, nav center, follow us right (with buttons)
  // Second row: copyright text spans all columns

  // Compose first content row (3 columns)
  const firstRow = [
    logo,
    nav,
    [followTitle, btnList].filter(Boolean), // combine title and buttons
  ];

  // Compose second row (copyright text, spanning all columns)
  const secondRow = [copyrightText];

  // Table header
  const headerRow = ['Columns (columns10)'];

  // Compose table
  const cells = [
    headerRow,
    firstRow,
    secondRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
