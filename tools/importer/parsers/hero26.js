/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main teaser content and image
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Header row (block name)
  const headerRow = ['Hero (hero26)'];

  // --- Row 2: Background Image (optional) ---
  let imageCell = '';
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the img element inside the image wrapper
    const img = imageWrapper.querySelector('img');
    if (img) imageCell = img;
  }

  // --- Row 3: Content ---
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  let contentCell = '';
  if (contentWrapper) {
    const contentParts = [];
    // Title (styled as heading)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Description
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    // CTA link
    const ctaContainer = contentWrapper.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentParts.push(ctaLink);
    }
    if (contentParts.length) contentCell = contentParts;
  }

  // Compose table rows
  const rows = [
    headerRow,
    [imageCell],
    [contentCell]
  ];

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
