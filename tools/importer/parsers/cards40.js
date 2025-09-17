/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Block header row as per spec
  const headerRow = ['Cards (cards40)'];

  // Find the image (mandatory, first cell)
  let imageCell = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    imageCell = img || imageWrapper;
  }

  // Find the text content (mandatory, second cell)
  let textCellContent = [];
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Featured pretitle (optional)
    const pretitle = contentWrapper.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textCellContent.push(pretitle);
    // Title (optional)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) textCellContent.push(title);
    // Description (optional)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) textCellContent.push(desc);
    // CTA (optional)
    const actionLink = contentWrapper.querySelector('.cmp-teaser__action-link');
    if (actionLink) textCellContent.push(actionLink);
  }

  // Defensive: If no image or no text, abort
  if (!imageCell || textCellContent.length === 0) return;

  // Build the table rows
  const rows = [
    headerRow,
    [imageCell, textCellContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
