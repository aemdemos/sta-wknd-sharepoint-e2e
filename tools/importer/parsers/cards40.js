/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row
  const headerRow = ['Cards (cards40)'];

  // Find the image (first column)
  const imageEl = element.querySelector('.cmp-teaser__image img');

  // Find the content (second column)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const textContent = [];
  if (contentDiv) {
    // Get pretitle, title, description, and CTA in order
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    const title = contentDiv.querySelector('.cmp-teaser__title');
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (pretitle) textContent.push(pretitle.cloneNode(true));
    if (title) textContent.push(title.cloneNode(true));
    if (desc) textContent.push(desc.cloneNode(true));
    if (cta) textContent.push(cta.cloneNode(true));
  }

  // Build the card row with actual content
  const cardRow = [imageEl ? imageEl.cloneNode(true) : '', textContent.length ? textContent : ''];

  // Build the table
  const rows = [headerRow, cardRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
