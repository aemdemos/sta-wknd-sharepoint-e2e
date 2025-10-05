/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image column
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  let imageCol = null;
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCol = img;
    } else {
      imageCol = imageWrapper;
    }
  }

  // Find the content column
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  let contentCol = null;
  if (contentWrapper) {
    const parts = [];
    const pretitle = contentWrapper.querySelector('.cmp-teaser__pretitle');
    if (pretitle) parts.push(pretitle);
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) parts.push(title);
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) parts.push(desc);
    const cta = contentWrapper.querySelector('.cmp-teaser__action-link');
    if (cta) parts.push(cta);
    // Defensive: only add non-empty
    contentCol = parts.length ? parts : contentWrapper;
  }

  // Build the table rows
  const headerRow = ['Columns (columns40)'];
  const secondRow = [imageCol, contentCol];

  // Compose the table
  const cells = [headerRow, secondRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
