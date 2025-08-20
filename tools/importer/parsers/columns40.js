/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row: must be a single cell array
  const headerRow = ['Columns (columns40)'];

  // Prepare left column (image) and right column (content)
  let leftCell = null;
  let rightCell = null;

  // Find the image element (reference the entire .cmp-teaser__image block)
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Use the actual cmp-image div inside, if present
    const cmpImage = imageWrapper.querySelector('div[data-cmp-is="image"]');
    leftCell = cmpImage || imageWrapper;
  }

  // Find the right content block (reference the entire .cmp-teaser__content block)
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  if (contentWrapper) rightCell = contentWrapper;

  // Second row is the content, exactly two columns (image, text)
  const contentRow = [leftCell, rightCell];

  // Produce the final block table structure
  const cells = [headerRow, contentRow];

  // Replace the element with our constructed table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
