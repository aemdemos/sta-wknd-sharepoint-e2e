/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Get the main content container (teaser block)
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get image element (background image)
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Get content elements
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  let titleEl = null;
  let descEl = null;
  let ctaEl = null;
  if (contentContainer) {
    titleEl = contentContainer.querySelector('.cmp-teaser__title');
    descEl = contentContainer.querySelector('.cmp-teaser__description');
    // CTA link (optional)
    const actionContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      ctaEl = actionContainer.querySelector('a');
    }
  }

  // Compose the content cell for row 3
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (descEl) contentCell.push(descEl);
  if (ctaEl) contentCell.push(ctaEl);

  // Build the table rows
  const headerRow = ['Hero (hero19)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  // Create table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
