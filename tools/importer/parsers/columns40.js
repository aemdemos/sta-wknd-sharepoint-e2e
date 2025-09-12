/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all direct children
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Find the content and image columns
  let contentCol, imageCol;
  children.forEach((child) => {
    if (child.classList.contains('cmp-teaser__content')) {
      contentCol = child;
    } else if (child.classList.contains('cmp-teaser__image')) {
      imageCol = child;
    } else if (child.classList.contains('cmp-teaser')) {
      // Some markup nests both content and image inside .cmp-teaser
      const innerContent = child.querySelector('.cmp-teaser__content');
      const innerImage = child.querySelector('.cmp-teaser__image');
      if (innerContent) contentCol = innerContent;
      if (innerImage) imageCol = innerImage;
    }
  });

  // Fallback: if not found, try searching inside element
  if (!contentCol) {
    contentCol = element.querySelector('.cmp-teaser__content');
  }
  if (!imageCol) {
    imageCol = element.querySelector('.cmp-teaser__image');
  }

  // Defensive: ensure we have both columns
  if (!contentCol && !imageCol) {
    // If neither found, do nothing
    return;
  }

  // Table header
  const headerRow = ['Columns (columns40)'];

  // Table row: [image, content]
  const row = [imageCol, contentCol];

  // Build table
  const cells = [headerRow, row];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
