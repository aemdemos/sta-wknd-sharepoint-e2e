/* global WebImporter */
export default function parse(element, { document }) {
  // Table header - matches example exactly
  const headerRow = ['Hero (hero28)'];

  // Get the hero image (background image)
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }
  // First content row: image (if available)
  const imageRow = [imageEl ? imageEl : ''];

  // Second content row: headline, description, CTA (all optional)
  const contentArr = [];
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Title (h2)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) contentArr.push(title);
    // Description (div)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) contentArr.push(desc);
    // CTA - one or more links
    const actions = contentDiv.querySelectorAll('.cmp-teaser__action-link');
    actions.forEach(a => contentArr.push(a));
  }
  const contentRow = [contentArr.length ? contentArr : ''];

  // Build and replace with the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
