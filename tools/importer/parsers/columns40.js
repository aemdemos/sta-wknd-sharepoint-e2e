/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get immediate children for columns
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Find the image column
  let imageCol = null;
  let contentCol = null;

  children.forEach((child) => {
    if (child.classList.contains('cmp-teaser__image')) {
      imageCol = child;
    } else if (child.classList.contains('cmp-teaser__content')) {
      contentCol = child;
    }
  });

  // Defensive fallback: if not found, try inside nested divs
  if (!imageCol || !contentCol) {
    const nested = element.querySelectorAll('div');
    nested.forEach((child) => {
      if (!imageCol && child.classList.contains('cmp-teaser__image')) {
        imageCol = child;
      }
      if (!contentCol && child.classList.contains('cmp-teaser__content')) {
        contentCol = child;
      }
    });
  }

  // Compose the table
  const headerRow = ['Columns (columns40)'];
  const contentRow = [imageCol, contentCol];

  const cells = [headerRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
