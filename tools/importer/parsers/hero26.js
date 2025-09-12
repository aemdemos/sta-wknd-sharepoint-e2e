/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main content and image containers
  const content = element.querySelector('.cmp-teaser__content');
  const imageWrapper = element.querySelector('.cmp-teaser__image');

  // Defensive: Find the image element (may be nested)
  let imgEl = null;
  if (imageWrapper) {
    imgEl = imageWrapper.querySelector('img');
  }

  // Defensive: Find heading, description, and CTA link
  let heading = null;
  let description = null;
  let cta = null;
  if (content) {
    heading = content.querySelector('.cmp-teaser__title');
    description = content.querySelector('.cmp-teaser__description');
    cta = content.querySelector('.cmp-teaser__action-link');
  }

  // Compose the content cell: heading, description, CTA (if present)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);

  // Table rows
  const headerRow = ['Hero (hero26)'];
  const imageRow = [imgEl ? imgEl : ''];
  const contentRow = [contentCell];

  // Create the block table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}
