/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row (must match example exactly)
  const headerRow = ['Hero (hero9)'];

  // 2. Image row: get the <img> if present
  let imageEl = null;
  const teaserImage = element.querySelector('.cmp-teaser__image');
  if (teaserImage) {
    imageEl = teaserImage.querySelector('img');
  }

  // 3. Text row: get the content block (title + description)
  // preserve heading element and paragraph
  let textElements = [];
  const contentBlock = element.querySelector('.cmp-teaser__content');
  if (contentBlock) {
    // Get all direct children for semantic preservation
    Array.from(contentBlock.children).forEach(child => {
      textElements.push(child);
    });
  }

  // Compose cell array for createTable
  const cells = [
    headerRow,
    [imageEl ? imageEl : ''],
    [textElements.length ? textElements : '']
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new table
  element.replaceWith(block);
}
