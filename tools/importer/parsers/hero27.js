/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');

  // Header row: always use block name
  const headerRow = ['Hero (hero27)'];

  // --- Row 2: Background Image ---
  // Find the image container
  let imageCell = '';
  const imageWrapper = teaser && teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the actual image element
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // --- Row 3: Content (title, description, CTA) ---
  let contentCell = document.createElement('div');
  if (teaser) {
    const content = teaser.querySelector('.cmp-teaser__content');
    if (content) {
      // Title (h2)
      const title = content.querySelector('.cmp-teaser__title');
      if (title) {
        contentCell.appendChild(title);
      }
      // Description (div)
      const desc = content.querySelector('.cmp-teaser__description');
      if (desc) {
        contentCell.appendChild(desc);
      }
      // CTA (a)
      const ctaContainer = content.querySelector('.cmp-teaser__action-container');
      if (ctaContainer) {
        const cta = ctaContainer.querySelector('a');
        if (cta) {
          contentCell.appendChild(cta);
        }
      }
    }
  }

  // Compose table rows
  const cells = [
    headerRow,
    [imageCell],
    [contentCell]
  ];

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
