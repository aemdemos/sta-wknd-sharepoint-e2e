/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser') || element;

  // Get the image element (background image)
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Get the content container
  const contentContainer = teaser.querySelector('.cmp-teaser__content');

  // Get the title (Heading)
  let titleEl = null;
  if (contentContainer) {
    titleEl = contentContainer.querySelector('.cmp-teaser__title');
  }

  // Get the description (Subheading)
  let descEl = null;
  if (contentContainer) {
    descEl = contentContainer.querySelector('.cmp-teaser__description');
  }

  // Get the CTA link
  let ctaEl = null;
  if (contentContainer) {
    const actionContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      ctaEl = actionContainer.querySelector('.cmp-teaser__action-link');
    }
  }

  // Compose the content cell for row 3
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (descEl) contentCell.push(descEl);
  if (ctaEl) contentCell.push(ctaEl);

  // Table rows
  const headerRow = ['Hero (hero8)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
