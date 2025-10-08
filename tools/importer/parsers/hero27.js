/* global WebImporter */
export default function parse(element, { document }) {
  // --- HERO (hero27) block parsing ---

  // 1. Header row: always block name
  const headerRow = ['Hero (hero27)'];

  // 2. Find the image (background)
  let imageEl = null;
  // Look for .cmp-teaser__image > [data-cmp-is="image"] > img
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // 3. Find the content: heading, description, CTA
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  let headingEl = null;
  let descriptionEl = null;
  let ctaEl = null;

  if (contentWrapper) {
    headingEl = contentWrapper.querySelector('.cmp-teaser__title');
    descriptionEl = contentWrapper.querySelector('.cmp-teaser__description');
    // CTA link
    const ctaContainer = contentWrapper.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      ctaEl = ctaContainer.querySelector('a');
    }
  }

  // 4. Build the content cell (third row)
  const contentCell = [];
  if (headingEl) contentCell.push(headingEl);
  if (descriptionEl) contentCell.push(descriptionEl);
  if (ctaEl) contentCell.push(ctaEl);

  // 5. Build the table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentCell]
  ];

  // 6. Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 7. Replace the original element
  element.replaceWith(block);
}
