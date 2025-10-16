/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero26)'];

  // 2. Find the image (background)
  let imageEl = null;
  // Search for the first <img> inside the block
  imageEl = element.querySelector('img');

  // 3. Find the content area: heading, description, CTA
  let headingEl = null;
  let descEl = null;
  let ctaEl = null;

  // The content is inside .cmp-teaser__content
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    headingEl = content.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
    descEl = content.querySelector('.cmp-teaser__description, p');
    // CTA is usually a link in .cmp-teaser__action-link
    ctaEl = content.querySelector('.cmp-teaser__action-link, a');
  }

  // 4. Build the content cell for row 3
  const contentCell = [];
  if (headingEl) contentCell.push(headingEl);
  if (descEl) contentCell.push(descEl);
  if (ctaEl) contentCell.push(ctaEl);

  // 5. Compose the table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentCell]
  ];

  // 6. Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
