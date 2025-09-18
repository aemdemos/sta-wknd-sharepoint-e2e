/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero teaser block
  const teaser = element.querySelector('.teaser.cmp-teaser--hero .cmp-teaser');
  let imgEl = null;
  let contentEls = [];

  if (teaser) {
    // Find image element inside teaser
    const imageWrapper = teaser.querySelector('.cmp-teaser__image');
    if (imageWrapper) {
      imgEl = imageWrapper.querySelector('img');
    }
    // Find content elements (title, subheading, call-to-action)
    const contentWrapper = teaser.querySelector('.cmp-teaser__content');
    if (contentWrapper) {
      // Collect all children (title, subheading, call-to-action)
      contentEls = Array.from(contentWrapper.children);
    }
  }

  // Table rows
  const headerRow = ['Hero (hero6)'];
  const imageRow = [imgEl ? imgEl : ''];
  // Always ensure there are 3 rows: header, image, content (even if content is empty)
  const contentRow = [contentEls.length ? contentEls : ''];

  const cells = [headerRow, imageRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
