/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Header row as required
  const headerRow = ['Hero (hero38)'];

  // Find the cmp-teaser element (may be element itself or a child)
  let teaser = element;
  if (!teaser.classList.contains('cmp-teaser')) {
    teaser = element.querySelector('.cmp-teaser');
  }
  if (!teaser) return;

  // Get image row
  let imageRow = [''];
  const imageWrapper = getChildByClass(teaser, 'cmp-teaser__image');
  if (imageWrapper) {
    // Find the actual image element
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageRow = [img];
    }
  }

  // Get content row (title + description)
  let contentRow = [''];
  const contentWrapper = getChildByClass(teaser, 'cmp-teaser__content');
  if (contentWrapper) {
    // We'll collect the heading and description
    const contentEls = [];
    // Title
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) contentEls.push(title);
    // Description
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) contentEls.push(desc);
    if (contentEls.length) {
      contentRow = [contentEls];
    }
  }

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
