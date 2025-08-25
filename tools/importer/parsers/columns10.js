/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid of content (aem-Grid--12)
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!mainGrid) return;

  // Find the key blocks in the grid
  // Logo image block
  const logoCol = mainGrid.querySelector('.cmp-image--logo');
  // Navigation block
  const navCol = mainGrid.querySelector('.cmp-navigation--footer');
  // Follow Us title
  const titleCol = mainGrid.querySelector('.cmp-title--right');
  // Social buttons (Facebook, Twitter, Instagram)
  const socialCol = mainGrid.querySelector('.cmp-buildingblock--btn-list');

  // Combine Follow Us title and social buttons into one cell
  let followUsCell;
  if (titleCol && socialCol) {
    followUsCell = [titleCol, socialCol];
  } else if (titleCol) {
    followUsCell = titleCol;
  } else if (socialCol) {
    followUsCell = socialCol;
  } else {
    followUsCell = '';
  }

  // The first row contains the logo, navigation, follow us/social
  const firstContentRow = [logoCol, navCol, followUsCell];

  // Find the two text blocks at the bottom of the footer
  const textBlocks = Array.from(mainGrid.querySelectorAll('.cmp-text--font-xsmall'));
  let secondContentRow;
  if (textBlocks.length === 2) {
    secondContentRow = [textBlocks[0], textBlocks[1], '']; // pad to 3 columns
  } else if (textBlocks.length === 1) {
    secondContentRow = [textBlocks[0], '', ''];
  } else {
    secondContentRow = ['', '', ''];
  }

  // Compose the cells array with header row as a single column (as per example)
  const cells = [
    ['Columns (columns10)'],
    firstContentRow,
    secondContentRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
