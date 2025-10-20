/* global WebImporter */
export default function parse(element, { document }) {
  // --- Hero (hero27) block parsing ---
  // Header row
  const headerRow = ['Hero (hero27)'];

  // --- Extract image (background image) ---
  let imageEl = null;
  // Find image inside .cmp-teaser__image
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }
  // 2nd row: image (can be null)
  const imageRow = [imageEl ? imageEl : ''];

  // --- Extract content: heading, description, CTA ---
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (contentContainer) {
    // Heading
    const heading = contentContainer.querySelector('.cmp-teaser__title');
    if (heading) contentParts.push(heading);
    // Description
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    // CTA
    const ctaContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentParts.push(ctaLink);
    }
  }
  // 3rd row: all content parts in one cell
  const contentRow = [contentParts];

  // --- Build table ---
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
