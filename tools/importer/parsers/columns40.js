/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child with a class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(el => el.classList.contains(className));
  }

  // Get the main cmp-teaser element (could be the same as element or a child)
  const teaser = element.classList.contains('cmp-teaser') ? element : getChildByClass(element, 'cmp-teaser');
  if (!teaser) return;

  // Get image and content columns
  const imageCol = getChildByClass(teaser, 'cmp-teaser__image');
  const contentCol = getChildByClass(teaser, 'cmp-teaser__content');

  // Defensive: If either column is missing, fallback to original element content
  if (!imageCol || !contentCol) return;

  // --- COLUMN 1: IMAGE ---
  // Find the actual image element inside the image column
  const img = imageCol.querySelector('img');
  // Defensive: If no image, use the whole imageCol
  const imageCell = img ? img : imageCol;

  // --- COLUMN 2: TEXT CONTENT ---
  // We'll collect all content in order: pretitle, title, description, CTA
  const pretitle = contentCol.querySelector('.cmp-teaser__pretitle');
  const title = contentCol.querySelector('.cmp-teaser__title');
  const desc = contentCol.querySelector('.cmp-teaser__description');
  const cta = contentCol.querySelector('.cmp-teaser__action-link');

  // Compose the content column as an array of elements (preserving order)
  const contentCell = [];
  if (pretitle) contentCell.push(pretitle);
  if (title) contentCell.push(title);
  if (desc) contentCell.push(desc);
  if (cta) contentCell.push(cta);

  // --- TABLE STRUCTURE ---
  // Header row
  const headerRow = ['Columns (columns40)'];
  // Content row: [image, content]
  const contentRow = [imageCell, contentCell];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
