/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Locate the hero teaser block
  const teaser = element.querySelector('.cmp-teaser--hero');
  if (!teaser) return;

  // 2. Extract the image element (reference, not clone)
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // 3. Gather all text elements for the content cell (title, subheading, CTA)
  const contentCell = document.createElement('div');
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Title (h1-h6)
    const headingEl = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
    if (headingEl) contentCell.appendChild(headingEl);
    // Subheading (none in this sample)
    // CTA (none in this sample)
  }

  // If nothing was added, leave cell empty
  const contentRow = [contentCell.childNodes.length ? contentCell : ''];

  // Table header row
  const headerRow = ['Hero (hero12)'];
  // Table image row (row 2)
  const imageRow = [imageEl ? imageEl : ''];

  // Compose table cells
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
