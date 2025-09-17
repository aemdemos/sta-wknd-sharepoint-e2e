/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by class name
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Hero (hero27)'];

  // 2. Image row (background image)
  // Find the image container
  const imageWrapper = getDirectChildByClass(element, 'cmp-teaser');
  let imageRowCell = '';
  if (imageWrapper) {
    const imageDiv = getDirectChildByClass(imageWrapper, 'cmp-teaser__image');
    if (imageDiv) {
      // The actual image is likely inside a nested div
      const cmpImageDiv = imageDiv.querySelector('.cmp-image');
      if (cmpImageDiv) {
        const img = cmpImageDiv.querySelector('img');
        if (img) {
          imageRowCell = img;
        }
      }
    }
  }

  // 3. Content row (title, description, CTA)
  let contentRowCell = '';
  if (imageWrapper) {
    const contentDiv = getDirectChildByClass(imageWrapper, 'cmp-teaser__content');
    if (contentDiv) {
      // We'll collect all relevant children: title, description, cta
      const contentParts = [];
      // Title
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) contentParts.push(title);
      // Description
      const desc = contentDiv.querySelector('.cmp-teaser__description');
      if (desc) contentParts.push(desc);
      // CTA
      const ctaContainer = contentDiv.querySelector('.cmp-teaser__action-container');
      if (ctaContainer) {
        // Only include the link(s) inside
        const ctas = Array.from(ctaContainer.querySelectorAll('a'));
        if (ctas.length > 0) contentParts.push(...ctas);
      }
      if (contentParts.length > 0) {
        contentRowCell = contentParts;
      }
    }
  }

  // Build the table structure
  const cells = [
    headerRow,
    [imageRowCell],
    [contentRowCell],
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
