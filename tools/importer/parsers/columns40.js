/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two columns: image and content
  const imageCol = element.querySelector('.cmp-teaser__image');
  const contentCol = element.querySelector('.cmp-teaser__content');

  // Defensive: handle missing columns
  if (!imageCol && !contentCol) return;

  // --- COLUMN 1: IMAGE ---
  let imageCell = '';
  if (imageCol) {
    // Use the actual <img> element (not a clone)
    const img = imageCol.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // --- COLUMN 2: CONTENT ---
  let contentCell = '';
  if (contentCol) {
    // Compose a fragment with all content children (preserving order and semantics)
    const frag = document.createElement('div');
    Array.from(contentCol.childNodes).forEach((node) => {
      // Reference existing nodes (do not clone)
      frag.appendChild(node);
    });
    contentCell = frag;
  }

  // --- TABLE HEADER ---
  const headerRow = ['Columns (columns40)'];
  // --- TABLE ROW ---
  const row = [imageCell, contentCell];

  // --- CREATE TABLE ---
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row,
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
