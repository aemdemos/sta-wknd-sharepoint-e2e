/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists
  if (!element) return;

  // --- 1. Header row ---
  const headerRow = ['Hero (hero10)'];

  // --- 2. Background image row ---
  // Find the image element (background image)
  let imageEl = null;
  const imageWrappers = element.querySelectorAll('.cmp-teaser__image, [data-cmp-is="image"]');
  for (const wrapper of imageWrappers) {
    const img = wrapper.querySelector('img');
    if (img) {
      imageEl = img;
      break;
    }
  }
  // If not found, try fallback
  if (!imageEl) {
    imageEl = element.querySelector('img');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // --- 3. Text content row ---
  // Find the teaser content
  let contentEl = null;
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Defensive: clone the content so we don't move it from the DOM
    contentEl = document.createElement('div');
    // Title
    const titleEl = contentWrapper.querySelector('.cmp-teaser__title');
    if (titleEl) {
      contentEl.appendChild(titleEl);
    }
    // Description
    const descEl = contentWrapper.querySelector('.cmp-teaser__description');
    if (descEl) {
      contentEl.appendChild(descEl);
    }
  }
  const contentRow = [contentEl ? contentEl : ''];

  // --- Compose table ---
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // --- Replace element ---
  element.replaceWith(table);
}
