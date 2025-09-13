/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the inner teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get image element (background image)
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    // Find the actual <img> element
    imageEl = imageContainer.querySelector('img');
  }

  // Get content elements
  const content = teaser.querySelector('.cmp-teaser__content');
  let contentEls = [];
  if (content) {
    // Title (h2)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) contentEls.push(title);
    // Description (div)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) contentEls.push(desc);
    // CTA (link)
    const ctaContainer = content.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentEls.push(ctaLink);
    }
  }

  // Build table rows
  const headerRow = ['Hero (hero27)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
