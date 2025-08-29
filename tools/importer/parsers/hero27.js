/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero27)'];

  // 2. Background image row (img element)
  // Find the image inside .cmp-teaser__image (use the existing img element)
  let imageRow = [''];
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img) {
      imageRow = [img];
    }
  }

  // 3. Content row: Heading, subheading, CTA link
  // Retain existing elements; reference them directly
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const contentElements = [];
  if (contentContainer) {
    // Title (as heading)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) contentElements.push(title);
    // Subheading/description
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) contentElements.push(desc);
    // CTA link (if any)
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta) contentElements.push(cta);
  }
  const contentRow = [contentElements];

  // Compose final cells array
  const cells = [headerRow, imageRow, contentRow];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
