/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image and content columns
  // The structure is: .cmp-teaser__image (left), .cmp-teaser__content (right)
  const imageCol = element.querySelector('.cmp-teaser__image img');
  const contentCol = element.querySelector('.cmp-teaser__content');

  // Prepare left column: reference the actual <img> element if present
  let leftCell = null;
  if (imageCol) {
    leftCell = imageCol;
  }

  // Prepare right column: stack pretitle, title, description, CTA (in order, as separate elements)
  let rightCell = null;
  if (contentCol) {
    const parts = [];
    const pretitle = contentCol.querySelector('.cmp-teaser__pretitle');
    if (pretitle) parts.push(pretitle);
    const title = contentCol.querySelector('.cmp-teaser__title');
    if (title) parts.push(title);
    const desc = contentCol.querySelector('.cmp-teaser__description');
    if (desc) parts.push(desc);
    const cta = contentCol.querySelector('.cmp-teaser__action-link');
    if (cta) {
      // Ensure button text matches screenshot: ALL CAPS
      cta.textContent = cta.textContent.trim().toUpperCase();
      parts.push(cta);
    }
    // Defensive: if nothing found, use the contentCol itself
    rightCell = parts.length ? parts : contentCol;
  }

  // Compose table rows
  const headerRow = ['Columns (columns40)'];
  const contentRow = [leftCell, rightCell];
  const rows = [headerRow, contentRow];

  // Create the columns block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(table);
}
