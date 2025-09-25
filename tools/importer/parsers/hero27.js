/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Header row as specified
  const headerRow = ['Hero (hero27)'];

  // --- Row 2: Background Image (optional) ---
  // Find image inside .cmp-teaser__image
  let imageCell = '';
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the actual <img> element
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // --- Row 3: Content ---
  // Title, Description, CTA
  const contentParts = [];
  const content = teaser.querySelector('.cmp-teaser__content');
  if (content) {
    // Title
    const title = content.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    // CTA
    const ctaContainer = content.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentParts.push(ctaLink);
    }
  }

  // Build table rows
  const rows = [
    headerRow,
    [imageCell],
    [contentParts]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
