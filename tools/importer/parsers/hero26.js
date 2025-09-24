/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser') || element;

  // Header row (block name)
  const headerRow = ['Hero (hero26)'];

  // --- Row 2: Background image (optional) ---
  // Find the image element
  let imageCell = '';
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Prefer actual <img> element
    const img = imageWrapper.querySelector('img');
    if (img) imageCell = img;
  }

  // --- Row 3: Title, Description, CTA ---
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  const contentCellChildren = [];
  if (contentWrapper) {
    // Title (Heading)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) contentCellChildren.push(title);
    // Description (subheading/paragraph)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) contentCellChildren.push(desc);
    // CTA (button/link)
    const ctaContainer = contentWrapper.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentCellChildren.push(ctaLink);
    }
  }

  // Compose table rows
  const rows = [
    headerRow,
    [imageCell],
    [contentCellChildren]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with block table
  element.replaceWith(block);
}
