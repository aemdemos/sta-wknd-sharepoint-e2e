/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Extract image (background image)
  let imageCell = '';
  const imageWrapper = teaser.querySelector('.cmp-teaser__image img');
  if (imageWrapper) {
    imageCell = imageWrapper;
  }

  // Extract content: title, description, CTA
  const content = teaser.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (content) {
    // Title (as heading)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Description (paragraph)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    // CTA (link)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) contentParts.push(cta);
  }

  // Compose table rows
  const headerRow = ['Hero (hero27)'];
  const imageRow = [imageCell];
  const contentRow = [contentParts.length ? contentParts : ''];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
