/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name matches example
  const headerRow = ['Hero (hero39)'];

  // 2. Background image row (optional, will be blank if not found)
  let backgroundImg = '';
  // Only use the actual <img> element and reference it directly
  const imgContainer = element.querySelector('.cmp-teaser__image img');
  if (imgContainer) backgroundImg = imgContainer;

  // 3. Content: Title (heading), description (subheading/paragraph), all as existing elements
  const contentElements = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Direct child elements
    // Title
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) contentElements.push(title);
    // Description (div, which may contain markup)
    const description = contentContainer.querySelector('.cmp-teaser__description');
    if (description) contentElements.push(description);
  }

  // Table structure: exactly 3 rows, 1 column each (header, background image, content)
  const cells = [
    headerRow,
    [backgroundImg],
    [contentElements],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
