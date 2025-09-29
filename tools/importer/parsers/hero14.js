/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser block (may be the element itself)
  let teaser = element.querySelector('.cmp-teaser');
  if (!teaser) teaser = element;

  // Get image (background image)
  let imageEl = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image img');
  if (imageWrapper) imageEl = imageWrapper;

  // Get content (title, description, etc)
  const content = teaser.querySelector('.cmp-teaser__content');
  let titleEl = null;
  let descEl = null;
  if (content) {
    titleEl = content.querySelector('.cmp-teaser__title');
    descEl = content.querySelector('.cmp-teaser__description');
  }

  // Compose the table rows
  const headerRow = ['Hero (hero14)'];
  const imageRow = [imageEl ? imageEl : ''];
  // Compose content cell: title + description
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (descEl) contentCell.push(descEl);
  const contentRow = [contentCell.length ? contentCell : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
