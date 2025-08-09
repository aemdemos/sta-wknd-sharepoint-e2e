/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row
  const headerRow = ['Carousel (carousel27)'];

  // The block only contains one carousel slide in the provided HTML
  // We want [image, text content] in the row

  // Find the .cmp-teaser__image for the image column
  const imageParent = element.querySelector('.cmp-teaser__image');
  let imageCell = '';
  if (imageParent) {
    // Use the <img> inside .cmp-teaser__image if it exists
    const img = imageParent.querySelector('img');
    if (img) imageCell = img;
    else imageCell = imageParent;
  }

  // The text content cell: contains title, description, and CTA if present
  const contentParent = element.querySelector('.cmp-teaser__content');
  let textCell = '';
  if (contentParent) {
    // We'll reference child nodes in order
    const cellContent = [];
    // Title (e.g., h2)
    const title = contentParent.querySelector('.cmp-teaser__title');
    if (title) cellContent.push(title);
    // Description
    const desc = contentParent.querySelector('.cmp-teaser__description');
    if (desc) cellContent.push(desc);
    // CTA link if present
    const cta = contentParent.querySelector('.cmp-teaser__action-link');
    if (cta) cellContent.push(cta);
    // Only add if there is text content
    if (cellContent.length) textCell = cellContent;
  }

  // Always create the table with 2 columns
  const rows = [headerRow, [imageCell, textCell]];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
