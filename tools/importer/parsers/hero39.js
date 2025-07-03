/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row exactly as in the example
  const headerRow = ['Hero (hero39)'];

  // 2. Find background image: first <img> inside the .cmp-teaser__image block (optional)
  let backgroundImg = null;
  const imageBlock = element.querySelector('.cmp-teaser__image');
  if (imageBlock) {
    backgroundImg = imageBlock.querySelector('img') || null;
  }

  // 3. Find the main content (title, subheading, description, cta)
  // Use the entire .cmp-teaser__content element for resilience
  const contentBlock = element.querySelector('.cmp-teaser__content') || null;

  // Edge case: Ensure at least one of imageBlock or contentBlock exists
  // If neither is present, abort replacement
  if (!backgroundImg && !contentBlock) return;

  // 4. Arrange structure as 3 rows, 1 column, as in the markdown example
  const cells = [
    headerRow,
    [backgroundImg],
    [contentBlock],
  ];

  // 5. Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
