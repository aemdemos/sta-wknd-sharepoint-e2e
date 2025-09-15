/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const teaser = element.querySelector('.teaser.cmp-teaser--hero .cmp-teaser');
  if (!teaser) return;

  // Find the image element (background image)
  let imageEl = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image [data-cmp-is="image"]');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Find the headline/title
  let titleEl = null;
  const content = teaser.querySelector('.cmp-teaser__content');
  if (content) {
    titleEl = content.querySelector('.cmp-teaser__title');
  }

  // Table header row
  const headerRow = ['Hero (hero24)'];

  // Second row: background image (optional)
  const imageRow = [imageEl ? imageEl : ''];

  // Third row: title/subheading/CTA (all in one cell, even if only title is present)
  const contentRow = [];
  if (titleEl) contentRow.push(titleEl);
  // If there were subheading or CTA, they'd be added here
  // Always create the third row, even if empty
  const thirdRow = contentRow.length ? [contentRow] : [''];

  // Compose table: header, image, content
  const cells = [
    headerRow,
    imageRow,
    thirdRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
