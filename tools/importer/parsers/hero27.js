/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the inner teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // 1. Header row
  const headerRow = ['Hero (hero27)'];

  // 2. Image row (background image)
  let imageRow = [''];
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageRow = [img];
    }
  }

  // 3. Content row (title, description, CTA)
  const contentEls = [];
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Title
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) contentEls.push(title);
    // Description
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) contentEls.push(desc);
    // CTA
    const ctaContainer = contentWrapper.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentEls.push(ctaLink);
    }
  }
  const contentRow = [contentEls];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
