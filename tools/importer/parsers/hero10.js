/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero teaser block
  const heroTeaser = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');
  if (!heroTeaser) return;

  // Extract image (background)
  let imageEl = null;
  const imageWrapper = heroTeaser.querySelector('.cmp-teaser__image .cmp-image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Extract headline/title
  let titleEl = null;
  const contentEl = heroTeaser.querySelector('.cmp-teaser__content');
  if (contentEl) {
    titleEl = contentEl.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Compose the third row: title, subheading, CTA (all in one cell)
  const contentCell = document.createElement('div');
  if (titleEl) contentCell.appendChild(titleEl.cloneNode(true));
  // No subheading or CTA in this sample, but could be added here if present

  // Table header row
  const headerRow = ['Hero (hero10)'];
  // Second row: background image (optional)
  const imageRow = [imageEl ? imageEl.cloneNode(true) : ''];
  // Third row: headline/subheading/cta (all in one cell)
  const contentRow = [contentCell.childNodes.length ? contentCell : ''];

  // Compose table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
