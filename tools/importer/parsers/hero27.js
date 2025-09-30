/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Hero (hero27)'];

  // 2. Background image row
  let imageRow = [''];
  const teaser = element.querySelector('.cmp-teaser');
  if (teaser) {
    const imageWrapper = getChildByClass(teaser, 'cmp-teaser__image');
    if (imageWrapper) {
      // Look for <img> inside
      const img = imageWrapper.querySelector('img');
      if (img) {
        imageRow = [img];
      }
    }
  }

  // 3. Content row: title, description, CTA
  let contentRow = [''];
  if (teaser) {
    const contentWrapper = getChildByClass(teaser, 'cmp-teaser__content');
    if (contentWrapper) {
      const contentElements = [];
      // Title
      const title = contentWrapper.querySelector('.cmp-teaser__title');
      if (title) contentElements.push(title);
      // Description
      const desc = contentWrapper.querySelector('.cmp-teaser__description');
      if (desc) contentElements.push(desc);
      // CTA
      const actionContainer = contentWrapper.querySelector('.cmp-teaser__action-container');
      if (actionContainer) {
        const cta = actionContainer.querySelector('a');
        if (cta) contentElements.push(cta);
      }
      if (contentElements.length) {
        contentRow = [contentElements];
      }
    }
  }

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
