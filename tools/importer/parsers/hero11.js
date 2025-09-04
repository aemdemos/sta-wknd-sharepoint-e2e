/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero teaser block
  const teaser = element.querySelector('.teaser.cmp-teaser--hero .cmp-teaser');
  if (!teaser) return;

  // Find the image element inside the hero teaser
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image [data-cmp-is="image"]');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Find all possible content for the third row (title, subheading, CTA)
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  const contentCell = [];
  if (contentContainer) {
    // Title (heading)
    const titleEl = contentContainer.querySelector('h2, h1, h3, h4, h5, h6');
    if (titleEl) contentCell.push(titleEl.cloneNode(true));
    // Subheading (if present)
    const subheadingEl = contentContainer.querySelector('p');
    if (subheadingEl) contentCell.push(subheadingEl.cloneNode(true));
    // CTA (if present)
    const ctaEl = contentContainer.querySelector('a');
    if (ctaEl) contentCell.push(ctaEl.cloneNode(true));
  }

  // Compose table rows: header, [image + content in one cell], [empty row]
  const headerRow = ['Hero (hero11)'];
  // The second row must contain the image as background and the third row all text content in one cell
  const imageRow = [imageEl ? imageEl.cloneNode(true) : ''];
  const contentRow = [contentCell.length ? contentCell : ''];
  const cells = [headerRow, imageRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
