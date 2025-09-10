/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const heroTeaser = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero, .cmp-teaser');
  if (!heroTeaser) return;

  // Find the image element inside the hero teaser
  let imageEl = null;
  const imageContainer = heroTeaser.querySelector('.cmp-teaser__image, [data-cmp-is="image"]');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Find the heading/title element inside the hero teaser
  let headingEl = null;
  const contentContainer = heroTeaser.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    headingEl = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Compose the content cell for row 3 (title, subheading, CTA)
  const contentCell = document.createElement('div');
  if (headingEl) contentCell.appendChild(headingEl.cloneNode(true));
  // No subheading or CTA in this HTML, but if present, add here

  // Build the table rows
  const headerRow = ['Hero (hero12)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentCell.childNodes.length ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
