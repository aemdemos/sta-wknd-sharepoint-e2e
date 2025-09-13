/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main teaser block (could be the element itself or a child)
  let teaser = element;
  if (!teaser.classList.contains('cmp-teaser')) {
    teaser = element.querySelector('.cmp-teaser');
  }
  if (!teaser) return;

  // Find image (first cell)
  let imageCell = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Use the image block as-is for resilience
    imageCell = imageWrapper;
  }

  // Compose text content (second cell)
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  let textCellContent = [];
  if (contentWrapper) {
    // Get pretitle, title, description, and action link if present
    const pretitle = contentWrapper.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textCellContent.push(pretitle);
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) textCellContent.push(title);
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) textCellContent.push(desc);
    const action = contentWrapper.querySelector('.cmp-teaser__action-link');
    if (action) textCellContent.push(action);
  }

  // Build the table rows
  const headerRow = ['Carousel (carousel40)'];
  const slideRow = [imageCell, textCellContent];
  const rows = [headerRow, slideRow];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
