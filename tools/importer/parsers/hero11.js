/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero teaser block
  const teaser = element.querySelector('.cmp-teaser--hero') || element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Find the image element inside the teaser
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Find the content (title, subtitle, cta, etc.)
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  let contentEls = [];
  if (contentContainer) {
    // Collect all direct children (usually headings, paragraphs, etc.)
    contentEls = Array.from(contentContainer.children);
  }

  // Table header row
  const headerRow = ['Hero (hero11)'];
  // Second row: image (if present)
  const imageRow = [imageEl ? imageEl : ''];
  // Third row: all content (title, subheading, CTA) in a single cell as an array (even if empty)
  const thirdRow = [contentEls.length ? contentEls : ''];

  // Compose table cells
  const cells = [
    headerRow,
    imageRow,
    thirdRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
