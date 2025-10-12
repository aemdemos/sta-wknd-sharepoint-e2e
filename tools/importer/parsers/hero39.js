/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the cmp-teaser__image (background image)
  const imageContainer = element.querySelector('.cmp-teaser__image');
  let imageEl = null;
  if (imageContainer) {
    // Find the first <img> inside the image container
    imageEl = imageContainer.querySelector('img');
  }

  // Defensive: find the cmp-teaser__content (text overlay)
  const contentContainer = element.querySelector('.cmp-teaser__content');
  let contentEls = [];
  if (contentContainer) {
    // Heading
    const heading = contentContainer.querySelector('.cmp-teaser__title');
    if (heading) contentEls.push(heading);
    // Subheading/paragraph
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) contentEls.push(desc);
  }

  // Table rows
  const headerRow = ['Hero (hero39)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
