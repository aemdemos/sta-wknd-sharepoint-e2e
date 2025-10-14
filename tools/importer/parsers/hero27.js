/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero27)'];

  // 2. Find the image (background image)
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // 3. Find hero content: title, description, CTA
  const contentContainer = element.querySelector('.cmp-teaser__content');
  let titleEl = null;
  let descEl = null;
  let ctaEl = null;
  if (contentContainer) {
    titleEl = contentContainer.querySelector('.cmp-teaser__title');
    descEl = contentContainer.querySelector('.cmp-teaser__description');
    const ctaContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      ctaEl = ctaContainer.querySelector('a');
    }
  }

  // 4. Compose the content cell for row 3
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (descEl) contentCell.push(descEl);
  if (ctaEl) contentCell.push(ctaEl);

  // 5. Build table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentCell]
  ];

  // 6. Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
