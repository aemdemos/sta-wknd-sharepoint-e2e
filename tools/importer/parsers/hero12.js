/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const teaser = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');
  if (!teaser) return;

  // Find the image element inside the hero teaser
  let imageEl = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image .cmp-image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Find the title (h2) inside the hero teaser
  let titleEl = null;
  const content = teaser.querySelector('.cmp-teaser__content');
  if (content) {
    titleEl = content.querySelector('h2, .cmp-teaser__title');
  }

  // Find subheading and CTA (if present)
  let subheadingEl = null;
  let ctaEl = null;
  // For this HTML, there is no subheading or CTA, but keep logic for future-proofing

  // Build table rows
  const headerRow = ['Hero (hero12)'];
  const imageRow = [imageEl ? imageEl : ''];
  // Third row: combine all text elements (title, subheading, CTA) into a single cell
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (subheadingEl) contentCell.push(subheadingEl);
  if (ctaEl) contentCell.push(ctaEl);
  const contentRow = [contentCell.length ? contentCell : ''];

  // Create the block table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
