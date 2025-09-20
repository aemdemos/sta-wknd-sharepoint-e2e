/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the inner teaser block (may be nested)
  const teaser = element.querySelector('.cmp-teaser') || element;

  // --- 1. HEADER ROW ---
  const headerRow = ['Hero (hero13)'];

  // --- 2. IMAGE ROW ---
  // Find the image element
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    // Look for <img> inside imageContainer
    imageEl = imageContainer.querySelector('img');
  }
  // If not found, leave cell empty
  const imageRow = [imageEl ? imageEl : ''];

  // --- 3. CONTENT ROW ---
  // Find content container
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  let contentEls = [];
  if (contentContainer) {
    // Title
    const titleEl = contentContainer.querySelector('.cmp-teaser__title');
    if (titleEl) contentEls.push(titleEl);
    // Description
    const descEl = contentContainer.querySelector('.cmp-teaser__description');
    if (descEl) contentEls.push(descEl);
    // CTA
    const ctaContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentEls.push(ctaLink);
    }
  }
  const contentRow = [contentEls.length ? contentEls : ''];

  // --- Assemble Table ---
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
