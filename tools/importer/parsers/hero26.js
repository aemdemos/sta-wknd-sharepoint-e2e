/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser block
  const teaser = element.querySelector('.cmp-teaser') || element;

  // 1. Header row
  const headerRow = ['Hero (hero26)'];

  // 2. Image row (background image)
  let imageRowCell = '';
  const imageDiv = teaser.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    // Find the image element inside
    const img = imageDiv.querySelector('img');
    if (img) {
      imageRowCell = img;
    }
  }

  // 3. Content row (title, description, CTA)
  const contentParts = [];
  const contentDiv = teaser.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Title
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) {
      contentParts.push(title);
    }
    // Description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      contentParts.push(desc);
    }
    // CTA
    const ctaContainer = contentDiv.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) {
        contentParts.push(ctaLink);
      }
    }
  }

  // Compose the table rows
  const rows = [
    headerRow,
    [imageRowCell],
    [contentParts]
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
