/* global WebImporter */
export default function parse(element, { document }) {
  // Find image element (background image)
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Find content: heading, description, CTA
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const contentCell = [];
  if (contentContainer) {
    const heading = contentContainer.querySelector('.cmp-teaser__title');
    if (heading) contentCell.push(heading);
    const description = contentContainer.querySelector('.cmp-teaser__description');
    if (description) contentCell.push(description);
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta) contentCell.push(cta);
  }

  // Compose table rows
  const headerRow = ['Hero (hero27)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
