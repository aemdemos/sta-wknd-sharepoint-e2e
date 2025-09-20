/* global WebImporter */
export default function parse(element, { document }) {
  // Critical review: Extract image and content columns for a two-column layout
  // Find image column (left)
  const imageCol = element.querySelector('.cmp-teaser__image');
  let imgEl = null;
  if (imageCol) {
    // Reference the actual <img> element, not clone or create new
    imgEl = imageCol.querySelector('img');
  }

  // Find content column (right)
  const contentCol = element.querySelector('.cmp-teaser__content');
  let contentFragment = document.createDocumentFragment();
  if (contentCol) {
    // Append all direct children to preserve semantic structure
    Array.from(contentCol.children).forEach(child => {
      contentFragment.appendChild(child);
    });
  }

  // Table header must match target block name exactly
  const headerRow = ['Columns (columns40)'];
  // Table row: [image, content]
  const row = [imgEl || '', contentFragment.childNodes.length ? contentFragment : ''];

  // Create table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
