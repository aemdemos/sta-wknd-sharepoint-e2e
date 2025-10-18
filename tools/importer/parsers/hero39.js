/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: always the block name
  const headerRow = ['Hero (hero39)'];

  // Defensive selectors for hero structure
  // Find the image (background)
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    // Find the first <img> inside the image container
    imageEl = imageContainer.querySelector('img');
  }

  // 2. Second row: image (background)
  const imageRow = [imageEl ? imageEl : ''];

  // 3. Third row: content (heading, subheading, CTA)
  const contentParts = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Heading
    const heading = contentContainer.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
    if (heading) contentParts.push(heading);
    // Subheading/description
    const description = contentContainer.querySelector('.cmp-teaser__description');
    if (description) contentParts.push(description);
    // CTA
    const cta = contentContainer.querySelector('.cmp-teaser__action-link, a');
    if (cta) contentParts.push(cta);
  }
  const contentRow = [contentParts.length ? contentParts : ''];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
