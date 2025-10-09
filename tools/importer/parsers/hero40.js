/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero40)'];

  // 2. Find the image (background image)
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // 3. Gather text content: pretitle, title, description, CTA
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const contentElements = [];
  if (contentContainer) {
    // Pretitle (optional)
    const pretitle = contentContainer.querySelector('.cmp-teaser__pretitle');
    if (pretitle) {
      contentElements.push(pretitle);
    }
    // Title (main heading)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) {
      contentElements.push(title);
    }
    // Description (optional)
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) {
      contentElements.push(desc);
    }
    // CTA (optional)
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta) {
      contentElements.push(cta);
    }
  }

  // 4. Build table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentElements]
  ];

  // 5. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
