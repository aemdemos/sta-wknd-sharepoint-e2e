/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get immediate children for columns
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Find the image column (usually visually left)
  let imageColumn = null;
  let contentColumn = null;

  // Find cmp-teaser__image and cmp-teaser__content blocks
  children.forEach((child) => {
    if (child.classList.contains('cmp-teaser__image')) {
      imageColumn = child;
    } else if (child.classList.contains('cmp-teaser__content')) {
      contentColumn = child;
    }
  });

  // Fallback if not found
  if (!imageColumn) {
    imageColumn = element.querySelector('.cmp-teaser__image');
  }
  if (!contentColumn) {
    contentColumn = element.querySelector('.cmp-teaser__content');
  }

  // Header row
  const headerRow = ['Columns (columns40)'];

  // Content row: two columns
  const contentRow = [imageColumn, contentColumn];

  // Table cells
  const cells = [headerRow, contentRow];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element with block
  element.replaceWith(block);
}
