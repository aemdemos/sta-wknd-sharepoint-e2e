/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main content and image containers
  const content = element.querySelector('.cmp-teaser__content');
  const imageContainer = element.querySelector('.cmp-teaser__image');

  // Defensive: find the image element (background image)
  let imgEl = null;
  if (imageContainer) {
    imgEl = imageContainer.querySelector('img');
  }

  // Defensive: find title, description, and CTA
  let titleEl = null;
  let descEl = null;
  let ctaEl = null;
  if (content) {
    titleEl = content.querySelector('.cmp-teaser__title');
    descEl = content.querySelector('.cmp-teaser__description');
    ctaEl = content.querySelector('.cmp-teaser__action-link');
  }

  // Compose the content cell for row 3
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (descEl) contentCell.push(descEl);
  if (ctaEl) contentCell.push(ctaEl);

  // Build the table rows
  const headerRow = ['Hero (hero27)'];
  const imageRow = [imgEl ? imgEl : ''];
  const contentRow = [contentCell];

  // Create the block table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
