/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find direct children by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Get teaser content and image wrappers
  const teaser = getDirectChildByClass(element, 'cmp-teaser');
  if (!teaser) return;

  const content = getDirectChildByClass(teaser, 'cmp-teaser__content');
  const imageWrapper = getDirectChildByClass(teaser, 'cmp-teaser__image');

  // Defensive: If missing, do nothing
  if (!content || !imageWrapper) return;

  // Find the actual image element
  let imgEl = null;
  const cmpImage = imageWrapper.querySelector('.cmp-image');
  if (cmpImage) {
    imgEl = cmpImage.querySelector('img');
  } else {
    imgEl = imageWrapper.querySelector('img');
  }

  // Defensive: If no image, skip
  if (!imgEl) return;

  // Compose the text column (content)
  // We'll reference the entire content block for resilience
  // But we want the button to stand out, so let's ensure the CTA is included
  const actionContainer = content.querySelector('.cmp-teaser__action-container');
  let textColumn = document.createElement('div');
  // Add all content children except image
  Array.from(content.children).forEach(child => {
    if (child !== actionContainer) {
      textColumn.appendChild(child.cloneNode(true));
    }
  });
  // Add CTA button if present
  if (actionContainer) {
    textColumn.appendChild(actionContainer.cloneNode(true));
  }

  // Compose the columns row
  // Screenshot shows image on left, text on right
  const columnsRow = [imgEl, textColumn];

  // Table header
  const headerRow = ['Columns (columns20)'];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
