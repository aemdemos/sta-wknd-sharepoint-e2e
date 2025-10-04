/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main teaser content and image
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Header row
  const headerRow = ['Hero (hero27)'];

  // Image row (background image)
  let imageRow = [''];
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the actual image element
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageRow = [img];
    }
  }

  // Content row (title, description, CTA)
  const contentRowElements = [];
  const content = teaser.querySelector('.cmp-teaser__content');
  if (content) {
    // Title (h2)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) contentRowElements.push(title);

    // Description (div)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) contentRowElements.push(desc);

    // CTA (link)
    const ctaContainer = content.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('.cmp-teaser__action-link');
      if (ctaLink) contentRowElements.push(ctaLink);
    }
  }
  // Defensive: If nothing found, fallback to empty string
  const contentRow = [contentRowElements.length ? contentRowElements : ''];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
